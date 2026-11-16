import env from "../config/env.js";
import AppError from "../utils/app-error.js";
import logger from "../utils/logger.js";

class SimpleCache {
  constructor(defaultTtlMs = 15 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTtlMs = defaultTtlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }

  set(key, data, ttlMs = this.defaultTtlMs) {
    if (this.cache.size > 2000) {
      // Evict oldest entries
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }
}

export class IgranthService {
  constructor() {
    this.baseUrl = (env.IGRANTH_BASE_URL || "https://api.igranth.net").replace(/\/+$/, "");
    this.apiKey = env.IGRANTH_API_KEY || "";
    this.cache = new SimpleCache();
    this.providerName = "igranth";
  }

  async request(endpoint, queryParams = {}, options = {}) {
    const { useCache = false, cacheTtlMs, timeoutMs = 10000 } = options;

    const url = new URL(`${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`);
    
    // Attach API key
    if (this.apiKey) {
      url.searchParams.set("apikey", this.apiKey);
    }

    // Attach additional query parameters
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }

    const cacheKey = url.toString();
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 401) {
          logger.error("iGranth API authentication failed: Invalid API key");
          throw new AppError("Gurbani data provider authentication failed", 502);
        }
        if (response.status === 429) {
          logger.warn("iGranth rate limit reached");
          throw new AppError("Gurbani data service is busy. Please try again shortly.", 429);
        }
        if (response.status === 404) {
          throw new AppError("The requested Gurbani resource was not found", 404);
        }
        throw new AppError(`Upstream provider error (${response.status})`, 502);
      }

      const data = await response.json();

      if (useCache) {
        this.cache.set(cacheKey, data, cacheTtlMs);
      }

      return data;
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof AppError) throw err;
      if (err.name === "AbortError") {
        logger.error(`iGranth request timed out for endpoint ${endpoint}`);
        throw new AppError("Upstream Gurbani service timed out", 504);
      }
      logger.error(`iGranth request failed: ${err.message}`);
      throw new AppError("Unable to communicate with Gurbani data provider", 502);
    }
  }

  // --- Gurbani Reader ---
  async getAng(page, source = "G") {
    const safePage = encodeURIComponent(page);
    const safeSource = encodeURIComponent(source);
    return this.request(`/ang/${safePage}/g/${safeSource}`, {}, { useCache: true });
  }

  async getShabad(id) {
    const safeId = encodeURIComponent(id);
    return this.request(`/shabad/${safeId}`, {}, { useCache: true });
  }

  async getLine(id) {
    const safeId = encodeURIComponent(id);
    return this.request(`/line/${safeId}`, {}, { useCache: true });
  }

  // --- Search ---
  async search(query, params = {}) {
    const safeQuery = encodeURIComponent(query);
    const allowedParams = {};

    const searchType = params.type !== undefined ? params.type : params.searchtype;
    if (searchType !== undefined) allowedParams.type = searchType;

    if (params.source !== undefined && params.source !== "") {
      const sourceMap = { 1: "G", 2: "D", 3: "B", 4: "N", 5: "A", 6: "U" };
      allowedParams.source = sourceMap[params.source] || params.source;
    }

    if (params.ang) allowedParams.ang = params.ang;
    if (params.writer) allowedParams.writer = params.writer;
    if (params.raag) allowedParams.raag = params.raag;
    
    // API maximum of 100 results
    const results = params.results ? Math.min(Math.max(parseInt(params.results, 10), 1), 100) : 50;
    allowedParams.results = results;

    if (params.skip !== undefined) {
      allowedParams.skip = Math.max(parseInt(params.skip, 10), 0);
    }

    return this.request(`/search/${safeQuery}`, allowedParams, { useCache: true, cacheTtlMs: 15 * 60 * 1000 });
  }

  // --- Hukamnama ---
  async getHukamnamaToday() {
    return this.request("/hukamnama/today", {}, { useCache: true, cacheTtlMs: 60 * 60 * 1000 });
  }

  async getHukamnamaByDate(year, month, day) {
    const safeYear = encodeURIComponent(year);
    const safeMonth = encodeURIComponent(month);
    const safeDay = encodeURIComponent(day);
    return this.request(`/hukamnama/${safeYear}/${safeMonth}/${safeDay}`, {}, { useCache: true, cacheTtlMs: 24 * 60 * 60 * 1000 });
  }

  // --- Nitnem & SunderGutka ---
  async getSunderGutka() {
    return this.request("/sundergutka", {}, { useCache: true });
  }

  async getSunderGutkaById(id) {
    const safeId = encodeURIComponent(id);
    return this.request(`/sundergutka/${safeId}`, {}, { useCache: true });
  }

  async getBani() {
    return this.request("/bani", {}, { useCache: true });
  }

  async getBaniById(id, params = {}) {
    const safeId = encodeURIComponent(id);
    const queryParams = {};
    if (params.maryada) queryParams.maryada = params.maryada;
    return this.request(`/bani/${safeId}`, queryParams, { useCache: true });
  }

  async getSunderGutkaBani(sgId, baniId) {
    const safeSgId = encodeURIComponent(sgId);
    const safeBaniId = encodeURIComponent(baniId);
    return this.request(`/sundergutka/${safeSgId}/bani/${safeBaniId}`, {}, { useCache: true });
  }
}

export default new IgranthService();
