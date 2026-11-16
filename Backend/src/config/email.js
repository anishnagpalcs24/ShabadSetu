import { google } from "googleapis";
import env from "./env.js";
import logger from "../utils/logger.js";

let oauth2Client = null;

export const isGmailConfigured = () => {
  return Boolean(
    env.GMAIL_CLIENT_ID &&
    env.GMAIL_CLIENT_SECRET &&
    env.GMAIL_REDIRECT_URI &&
    env.GMAIL_REFRESH_TOKEN &&
    env.GMAIL_SENDER_EMAIL
  );
};

export const getGmailClient = () => {
  if (!isGmailConfigured()) {
    return null;
  }

  if (!oauth2Client) {
    try {
      oauth2Client = new google.auth.OAuth2(
        env.GMAIL_CLIENT_ID,
        env.GMAIL_CLIENT_SECRET,
        env.GMAIL_REDIRECT_URI
      );
      oauth2Client.setCredentials({
        refresh_token: env.GMAIL_REFRESH_TOKEN
      });
    } catch (err) {
      logger.error("Failed to initialize Gmail OAuth2 client", err.message);
      return null;
    }
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
};

export default {
  isGmailConfigured,
  getGmailClient
};
