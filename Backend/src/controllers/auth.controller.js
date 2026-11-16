import authService from "../services/auth.service.js";
import tokenService from "../services/token.service.js";
import { sendSuccess } from "../utils/api-response.js";

export class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.register({ name, email, password });
      return sendSuccess(res, {
        statusCode: 200,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { email, otp } = req.body;
      const deviceInfo = req.headers["user-agent"] || null;
      const ipAddress = req.ip || null;

      const result = await authService.verifyEmail({
        email,
        otp,
        deviceInfo,
        ipAddress
      });

      tokenService.attachRefreshCookie(res, result.refreshToken);

      return sendSuccess(res, {
        statusCode: 201,
        message: "Email verified successfully and account activated.",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.resendOtp({ email });
      return sendSuccess(res, {
        statusCode: 200,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const deviceInfo = req.headers["user-agent"] || null;
      const ipAddress = req.ip || null;

      const result = await authService.login({
        email,
        password,
        deviceInfo,
        ipAddress
      });

      tokenService.attachRefreshCookie(res, result.refreshToken);

      return sendSuccess(res, {
        statusCode: 200,
        message: "Logged in successfully.",
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const deviceInfo = req.headers["user-agent"] || null;
      const ipAddress = req.ip || null;

      const result = await authService.refresh({
        refreshToken,
        deviceInfo,
        ipAddress
      });

      tokenService.attachRefreshCookie(res, result.refreshToken);

      return sendSuccess(res, {
        statusCode: 200,
        message: "Session token refreshed successfully.",
        data: {
          accessToken: result.accessToken,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const accessToken = req.accessToken || null;

      await authService.logout({ refreshToken, accessToken });
      tokenService.clearRefreshCookie(res);

      return sendSuccess(res, {
        statusCode: 200,
        message: "Logged out successfully."
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      return sendSuccess(res, {
        statusCode: 200,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword({ email });
      return sendSuccess(res, {
        statusCode: 200,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword({ email, otp, newPassword });
      tokenService.clearRefreshCookie(res);
      return sendSuccess(res, {
        statusCode: 200,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
