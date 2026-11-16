import igranthService from "./igranth.service.js";
import progressRepository from "../repositories/progress.repository.js";
import AppError from "../utils/app-error.js";
import logger from "../utils/logger.js";

const SOURCE_CODE_TO_ID = {
  G: 1,
  D: 2,
  B: 3,
  N: 4,
  A: 5,
  U: 6,
};

export class GurbaniService {
  async getAng(page, source = "G", userId = null) {
    let data = null;

    try {
      data = await igranthService.getAng(page, source);
    } catch (err) {
      if (err.statusCode === 429) {
        logger.warn(`iGranth rate limited (429) on Ang ${page}. Using emergency scripture fallback.`);
        try {
          const sId = SOURCE_CODE_TO_ID[String(source).toUpperCase()] || 1;
          const res = await fetch(`https://api.gurbaninow.com/v2/ang/${encodeURIComponent(page)}/${sId}`);
          if (res.ok) {
            const raw = await res.json();
            if (raw && Array.isArray(raw.page)) {
              raw.page = raw.page.map((item) => {
                const line = item.line || item;
                if (line.translation?.english?.default && !line.translation.english.source_1) {
                  line.translation.english.source_1 = line.translation.english.default;
                }
                return { line };
              });
            }
            data = raw;
          }
        } catch (fallbackErr) {
          logger.error(`Fallback failed: ${fallbackErr.message}`);
        }
      }

      if (!data) throw err;
    }

    if (userId && data) {
      try {
        await progressRepository.addReadingHistory(userId, {
          source,
          pageNumber: parseInt(page, 10),
        });
        await progressRepository.upsertProgress(userId, {
          source,
          currentPage: parseInt(page, 10),
        });
      } catch (err) {
        logger.debug("Background reading history tracking failed", err.message);
      }
    }

    return data;
  }

  async getShabad(id, userId = null) {
    let data = null;

    try {
      data = await igranthService.getShabad(id);
    } catch (err) {
      if (err.statusCode === 429) {
        logger.warn(`iGranth rate limited (429) on Shabad ${id}. Using emergency scripture fallback.`);
        try {
          const res = await fetch(`https://api.gurbaninow.com/v2/shabad/${encodeURIComponent(id)}`);
          if (res.ok) {
            const raw = await res.json();
            if (raw && Array.isArray(raw.shabad)) {
              raw.shabad = raw.shabad.map((item) => {
                const line = item.line || item;
                if (!line.shabadid && raw.shabadinfo?.shabadid) {
                  line.shabadid = raw.shabadinfo.shabadid;
                }
                if (!line.pageno && raw.shabadinfo?.pageno) {
                  line.pageno = raw.shabadinfo.pageno;
                }
                if (line.translation?.english?.default && !line.translation.english.source_1) {
                  line.translation.english.source_1 = line.translation.english.default;
                }
                return { line };
              });
            } else if (raw && Array.isArray(raw.verses)) {
              raw.shabad = raw.verses.map((item) => {
                const line = item.line || item;
                if (!line.shabadid) line.shabadid = id;
                return { line };
              });
            }
            data = raw;
          }
        } catch (fallbackErr) {
          logger.error(`Fallback failed: ${fallbackErr.message}`);
        }
      }

      if (!data) throw err;
    }

    if (userId && data) {
      try {
        const pageNumber = data.page_no || data.shabadinfo?.pageno || null;
        const source = data.source || "G";
        if (pageNumber) {
          await progressRepository.addReadingHistory(userId, {
            source,
            pageNumber: parseInt(pageNumber, 10),
            shabadId: parseInt(id, 10),
          });
        }
      } catch (err) {
        logger.debug("Background shabad history tracking failed", err.message);
      }
    }

    return data;
  }

  async getLine(id) {
    try {
      return await igranthService.getLine(id);
    } catch (err) {
      if (err.statusCode === 429) {
        logger.warn(`iGranth rate limited (429) on Line ${id}. Using emergency scripture fallback.`);
        try {
          const res = await fetch(`https://api.gurbaninow.com/v2/line/${encodeURIComponent(id)}`);
          if (res.ok) {
            const raw = await res.json();
            if (raw && raw.line) {
              if (raw.line.translation?.english?.default && !raw.line.translation.english.source_1) {
                raw.line.translation.english.source_1 = raw.line.translation.english.default;
              }
            }
            return raw;
          }
        } catch {
          // ignore and throw original error
        }
      }
      throw err;
    }
  }

  async getHukamnamaToday() {
    if (typeof igranthService.getHukamnamaToday === "function") {
      try {
        return await igranthService.getHukamnamaToday();
      } catch {
        // Fallback
      }
    }
    // Public fallback for Hukamnama if unavailable
    try {
      const res = await fetch("https://api.gurbaninow.com/v2/hukamnama/today");
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    throw new AppError("Hukamnama endpoint is not supported by the iGranth API", 501);
  }

  async getHukamnamaByDate(year, month, day) {
    if (typeof igranthService.getHukamnamaByDate === "function") {
      try {
        return await igranthService.getHukamnamaByDate(year, month, day);
      } catch {
        // Fallback
      }
    }
    try {
      const res = await fetch(`https://api.gurbaninow.com/v2/hukamnama/${year}/${month}/${day}`);
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    throw new AppError("Historical Hukamnama endpoint is not supported by the iGranth API", 501);
  }
}

export default new GurbaniService();
