import igranthService from "./igranth.service.js";
import logger from "../utils/logger.js";

const SOURCE_CODE_TO_ID = {
  G: 1,
  D: 2,
  B: 3,
  N: 4,
  A: 5,
  U: 6,
};

export class SearchService {
  async search(query, options = {}) {
    try {
      return await igranthService.search(query, options);
    } catch (err) {
      if (err.statusCode === 429) {
        logger.warn(`iGranth rate limited (429) on search "${query}". Using emergency fallback.`);
        try {
          const params = new URLSearchParams();
          if (options.type !== undefined) params.set("searchtype", String(options.type));
          if (options.source) {
            const sId = SOURCE_CODE_TO_ID[String(options.source).toUpperCase()] || options.source;
            params.set("source", String(sId));
          }
          if (options.results) params.set("results", String(options.results));
          if (options.skip) params.set("skip", String(options.skip));
          if (options.ang) params.set("ang", String(options.ang));

          const res = await fetch(`https://api.gurbaninow.com/v2/search/${encodeURIComponent(query)}?${params.toString()}`);
          if (res.ok) {
            const raw = await res.json();
            const rawList = Array.isArray(raw?.shabads) ? raw.shabads : Array.isArray(raw?.results) ? raw.results : [];
            const results = rawList.map((item) => {
              const v = item.shabad || item.line || item;
              if (v.translation?.english?.default && !v.translation.english.source_1) {
                v.translation.english.source_1 = v.translation.english.default;
              }
              return { ...v, line: v };
            });
            return {
              count: raw?.count || results.length,
              total: raw?.count || results.length,
              results,
            };
          }
        } catch (fallbackErr) {
          logger.error(`Search fallback failed: ${fallbackErr.message}`);
        }
      }
      throw err;
    }
  }
}

export default new SearchService();
