import igranthService from "./igranth.service.js";
import logger from "../utils/logger.js";

/**
 * Returns the configured primary Gurbani data provider (iGranth).
 */
export const getGurbaniProvider = () => {
  return igranthService;
};

export const getActiveProviderName = () => {
  return "igranth";
};

logger.info(`Initialized Gurbani provider: igranth`);

export default getGurbaniProvider;
