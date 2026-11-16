import audioService from "../services/audio.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class AudioController {
  async getCatalog(req, res, next) {
    try {
      const { available } = req.query;
      const data = await audioService.getCatalog({ onlyAvailable: available });
      return sendSuccess(res, {
        statusCode: 200,
        message: "Audio Paath catalogue retrieved successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  async getBySlug(req, res, next) {
    try {
      const { baniSlug } = req.params;
      const bani = await audioService.getBySlug(baniSlug);
      return sendSuccess(res, {
        statusCode: 200,
        message: `Audio recording for ${bani.english_name || baniSlug} retrieved successfully`,
        data: { bani },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AudioController();
