import test from "node:test";
import assert from "node:assert/strict";
import { IgranthService } from "../src/services/igranth.service.js";
import { getGurbaniProvider, getActiveProviderName } from "../src/services/provider.factory.js";

test("iGranth Integration - Complete Single-Provider Tests", async (t) => {
  const originalFetch = global.fetch;

  t.after(() => {
    global.fetch = originalFetch;
  });

  await t.test("1. Provider factory exclusively returns iGranth", () => {
    const provider = getGurbaniProvider();
    assert.equal(getActiveProviderName(), "igranth");
    assert.equal(provider.providerName, "igranth");
  });

  await t.test("2. getAng attaches correct page, source and apikey", async () => {
    let capturedUrl = null;
    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          pageno: 1,
          source: "G",
          count: 5,
          page: [{ id: 1, verse: "ੴ ਸਤਿ ਨਾਮੁ" }]
        })
      };
    };

    const service = new IgranthService();
    const result = await service.getAng(1, "G");
    assert.ok(capturedUrl.includes("/ang/1/g/G"));
    assert.ok(capturedUrl.includes("apikey="));
    assert.equal(result.pageno, 1);
    assert.equal(result.page[0].verse, "ੴ ਸਤਿ ਨਾਮੁ");
  });

  await t.test("3. getShabad and getLine format scripture endpoints correctly", async () => {
    const urls = [];
    global.fetch = async (url) => {
      urls.push(url);
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 456, shabad: [] })
      };
    };

    const service = new IgranthService();
    await service.getShabad(123);
    await service.getLine(456);

    assert.ok(urls[0].includes("/shabad/123"));
    assert.ok(urls[1].includes("/line/456"));
  });

  await t.test("4. search respects 100 max results, maps params and encodes query", async () => {
    let capturedUrl = null;
    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        status: 200,
        json: async () => ({ results: [], total: 0 })
      };
    };

    const service = new IgranthService();
    await service.search("ਸਤਿਨਾਮੁ", { results: 500, type: 0, source: 1, ang: 1 });

    const parsed = new URL(capturedUrl);
    assert.equal(parsed.searchParams.get("results"), "100", "Results must cap at 100");
    assert.equal(parsed.searchParams.get("type"), "0");
    assert.equal(parsed.searchParams.get("source"), "G", "Numeric source 1 should map to 'G'");
    assert.equal(parsed.searchParams.get("ang"), "1");
    assert.ok(capturedUrl.includes(encodeURIComponent("ਸਤਿਨਾਮੁ")));
  });

  await t.test("5. Nitnem and SunderGutka endpoints format correctly", async () => {
    const urls = [];
    global.fetch = async (url) => {
      urls.push(url);
      return {
        ok: true,
        status: 200,
        json: async () => ({ banis: [] })
      };
    };

    const service = new IgranthService();
    await service.getSunderGutka();
    await service.getSunderGutkaById(2);
    await service.getBani();
    await service.getBaniById(1);
    await service.getSunderGutkaBani(2, 5);

    assert.ok(urls[0].includes("/sundergutka"));
    assert.ok(urls[1].includes("/sundergutka/2"));
    assert.ok(urls[2].includes("/bani"));
    assert.ok(urls[3].includes("/bani/1"));
    assert.ok(urls[4].includes("/sundergutka/2/bani/5"));
  });

  await t.test("6. Upstream 401 error maps to 502 with friendly message", async () => {
    global.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: "Unauthorized" })
    });

    const service = new IgranthService();
    await assert.rejects(
      async () => {
        await service.getShabad(123);
      },
      (err) => {
        assert.equal(err.statusCode, 502);
        assert.match(err.message, /authentication failed/i);
        return true;
      }
    );
  });

  await t.test("7. Upstream 429 rate limit maps to 429", async () => {
    global.fetch = async () => ({
      ok: false,
      status: 429,
      json: async () => ({ error: "Rate limit exceeded" })
    });

    const service = new IgranthService();
    await assert.rejects(
      async () => {
        await service.getLine(456);
      },
      (err) => {
        assert.equal(err.statusCode, 429);
        return true;
      }
    );
  });

  await t.test("8. Upstream 404 maps to 404 not found", async () => {
    global.fetch = async () => ({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" })
    });

    const service = new IgranthService();
    await assert.rejects(
      async () => {
        await service.getAng(9999, "G");
      },
      (err) => {
        assert.equal(err.statusCode, 404);
        return true;
      }
    );
  });

  await t.test("9. In-memory caching avoids duplicate network requests", async () => {
    let callCount = 0;
    global.fetch = async () => {
      callCount++;
      return {
        ok: true,
        status: 200,
        json: async () => ({ pageno: 5, page: [] })
      };
    };

    const service = new IgranthService();
    await service.getAng(5, "G");
    await service.getAng(5, "G");

    assert.equal(callCount, 1, "Cached request should not hit fetch a second time");
  });
});
