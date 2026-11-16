import gurbaniService from "../services/gurbani.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class GurbaniController {
  async getAng(req, res, next) {
    try {
      const { page, source = "G" } = req.params;
      const userId = req.user?.id || null;

      const data = await gurbaniService.getAng(page, source, userId);
      return sendSuccess(res, {
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getShabad(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || null;

      const data = await gurbaniService.getShabad(id, userId);
      return sendSuccess(res, {
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLine(req, res, next) {
    try {
      const { id } = req.params;
      const data = await gurbaniService.getLine(id);
      return sendSuccess(res, {
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHukamnamaToday(req, res, next) {
    try {
      const data = await gurbaniService.getHukamnamaToday();
      return sendSuccess(res, {
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHukamnamaByDate(req, res, next) {
    try {
      const { year, month, day } = req.params;
      const data = await gurbaniService.getHukamnamaByDate(year, month, day);
      return sendSuccess(res, {
        statusCode: 200,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GurbaniController();
