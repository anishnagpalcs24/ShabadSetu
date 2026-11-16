import audioRepository from "../repositories/audio.repository.js";
import AppError from "../utils/app-error.js";

export class AudioService {
  async getCatalog(options = {}) {
    const onlyAvailable = options.onlyAvailable === true || options.onlyAvailable === "true";
    const banis = await audioRepository.getAll(onlyAvailable);
    return {
      total: banis.length,
      available_count: banis.filter((b) => b.is_available).length,
      banis,
    };
  }

  async getBySlug(slug) {
    if (!slug || typeof slug !== "string") {
      throw new AppError("Invalid or missing Bani slug parameter", 400);
    }

    const bani = await audioRepository.getBySlug(slug);
    if (!bani) {
      throw new AppError(`Audio recording for Bani '${slug}' not found`, 404);
    }

    return bani;
  }
}

export default new AudioService();
