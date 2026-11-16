const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{6}$/;

export const validateRegister = (body) => {
  const errors = [];
  const { name, email, password } = body;

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
  }

  return errors;
};

export const validateVerifyEmail = (body) => {
  const errors = [];
  const { email, otp } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  if (!otp || typeof otp !== "string" || !OTP_REGEX.test(otp.trim())) {
    errors.push("A valid 6-digit verification code is required");
  }

  return errors;
};

export const validateResendOtp = (body) => {
  const errors = [];
  const { email } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  return errors;
};

export const validateLogin = (body) => {
  const errors = [];
  const { email, password } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    errors.push("Password is required");
  }

  return errors;
};

export const validateForgotPassword = (body) => {
  const errors = [];
  const { email } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  return errors;
};

export const validateResetPassword = (body) => {
  const errors = [];
  const { email, otp, newPassword } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push("A valid email address is required");
  }

  if (!otp || typeof otp !== "string" || !OTP_REGEX.test(otp.trim())) {
    errors.push("A valid 6-digit verification code is required");
  }

  if (!newPassword || typeof newPassword !== "string") {
    errors.push("New password is required");
  } else {
    if (newPassword.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(newPassword)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push("Password must contain at least one digit");
    }
  }

  return errors;
};

export default {
  validateRegister,
  validateVerifyEmail,
  validateResendOtp,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
};
