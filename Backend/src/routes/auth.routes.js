import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";
import { authLimiter, otpLimiter } from "../middleware/rate-limiter.js";
import {
  validateRegister,
  validateVerifyEmail,
  validateResendOtp,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} from "../validators/auth.validator.js";

const router = Router();

// Registration
router.post(
  "/register",
  authLimiter,
  validate({ body: validateRegister }),
  authController.register
);

// Verify OTP
router.post(
  "/verify-email",
  otpLimiter,
  validate({ body: validateVerifyEmail }),
  authController.verifyEmail
);

// Resend OTP
router.post(
  "/resend-otp",
  otpLimiter,
  validate({ body: validateResendOtp }),
  authController.resendOtp
);

// Login
router.post(
  "/login",
  authLimiter,
  validate({ body: validateLogin }),
  authController.login
);

// Token Refresh
router.post(
  "/refresh",
  authController.refresh
);

// Logout
router.post(
  "/logout",
  authController.logout
);

// Current User profile
router.get(
  "/me",
  authenticate,
  authController.me
);

// Forgot Password
router.post(
  "/forgot-password",
  otpLimiter,
  validate({ body: validateForgotPassword }),
  authController.forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  otpLimiter,
  validate({ body: validateResetPassword }),
  authController.resetPassword
);

export default router;
