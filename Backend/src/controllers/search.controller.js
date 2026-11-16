import searchService from "../services/search.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class SearchController {
  async search(req, res, next) {
    try {
      const { query } = req.params;
      const { type, source, ang, writer, raag, results, skip } = req.query;

      const data = await searchService.search(query, {
        type,
        source,
        ang,
        writer,
        raag,
        results,
        skip
      });

      return sendSuccess(res, {
        statusCode: 200,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SearchController();
