import env from "../config/env.js";
import { getGmailClient, isGmailConfigured } from "../config/email.js";
import logger from "../utils/logger.js";
import AppError from "../utils/app-error.js";

export class EmailService {
  async sendOtpEmail({ to, otp, type = "registration" }) {
    const isDevelopment = env.NODE_ENV === "development";
    const deliveryMode = env.OTP_DELIVERY_MODE;

    if (isDevelopment && deliveryMode === "console") {
      // Development mode terminal logging: strictly recipient email and OTP only
      console.log("=================================================");
      console.log(`[DEV OTP DELIVERY]`);
      console.log(`Purpose   : ${type}`);
      console.log(`Recipient : ${to}`);
      console.log(`OTP Code  : ${otp}`);
      console.log(`Expires In: 5 minutes`);
      console.log("=================================================");
      return { delivered: true, mode: "console" };
    }

    if (env.NODE_ENV === "production" && deliveryMode === "console") {
      logger.error("Security violation: Console OTP delivery is strictly forbidden in production mode.");
      throw new AppError("Email service configuration error", 500);
    }

    // Production / OAuth2 Gmail delivery mode
    if (!isGmailConfigured()) {
      logger.error("Gmail credentials are not configured.");
      throw new AppError("Email delivery service is currently unavailable", 503);
    }

    const gmail = getGmailClient();
    if (!gmail) {
      throw new AppError("Failed to initialize Gmail client", 503);
    }

    const subjectMap = {
      registration: "ShabadSetu - Verify Your Email",
      password_reset: "ShabadSetu - Password Reset Code",
      account_security: "ShabadSetu - Security Alert"
    };

    const subject = subjectMap[type] || "ShabadSetu - Verification Code";
    const bodyText = `Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh.\n\nYour ShabadSetu verification code is: ${otp}\n\nThis code will expire in 5 minutes. If you did not request this code, please ignore this email.`;

    const rawMessage = [
      `From: ShabadSetu <${env.GMAIL_SENDER_EMAIL}>`,
      `To: ${to}`,
      `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      bodyText
    ].join("\r\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage
        }
      });
      logger.info(`Email successfully dispatched via Gmail API to ${to}`);
      return { delivered: true, mode: "gmail" };
    } catch (error) {
      logger.error("Failed to send email via Gmail API", error.message);
      throw new AppError("Failed to deliver verification email", 502);
    }
  }

  async sendSecurityAlert({ to, subject, message }) {
    if (env.NODE_ENV === "development" && env.OTP_DELIVERY_MODE === "console") {
      console.log(`[DEV SECURITY ALERT] To: ${to} | Subject: ${subject} | Message: ${message}`);
      return { delivered: true, mode: "console" };
    }

    if (!isGmailConfigured()) {
      logger.warn("Gmail not configured; security alert not dispatched via email.");
      return { delivered: false };
    }

    const gmail = getGmailClient();
    if (!gmail) return { delivered: false };

    const rawMessage = [
      `From: ShabadSetu <${env.GMAIL_SENDER_EMAIL}>`,
      `To: ${to}`,
      `Subject: =?utf-8?B?${Buffer.from(subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "",
      message
    ].join("\r\n");

    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      await gmail.users.messages.send({
        userId: "me",
        requestBody: { raw: encodedMessage }
      });
      return { delivered: true, mode: "gmail" };
    } catch (err) {
      logger.error("Failed to send security alert", err.message);
      return { delivered: false };
    }
  }
}

export default new EmailService();
