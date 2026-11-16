import nitnemService from "../services/nitnem.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class NitnemController {
  async getSunderGutka(req, res, next) {
    try {
      const data = await nitnemService.getSunderGutka();
      return sendSuccess(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  async getSunderGutkaById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await nitnemService.getSunderGutkaById(id);
      return sendSuccess(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  async getBani(req, res, next) {
    try {
      const data = await nitnemService.getBani();
      return sendSuccess(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  async getBaniById(req, res, next) {
    try {
      const { id } = req.params;
      const { maryada } = req.query;
      const data = await nitnemService.getBaniById(id, { maryada });
      return sendSuccess(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }

  async getSunderGutkaBani(req, res, next) {
    try {
      const { sg_id, bani_id } = req.params;
      const data = await nitnemService.getSunderGutkaBani(sg_id, bani_id);
      return sendSuccess(res, { statusCode: 200, data });
    } catch (error) {
      next(error);
    }
  }
}

export default new NitnemController();
