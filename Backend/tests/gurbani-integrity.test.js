import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nitnemService, { ALL_BANIS } from "../src/services/nitnem.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NITNEM_DATA_DIR = path.resolve(__dirname, "../src/data/nitnem");

describe("Gurbani Data Integrity & Bani Audit Tests", () => {
  test("1. All 17 supported Banis exist in ALL_BANIS catalogue with valid metadata", () => {
    assert.equal(ALL_BANIS.length, 17);
    ALL_BANIS.forEach((b) => {
      assert.ok(b.id >= 1 && b.id <= 17, `Invalid Bani id: ${b.id}`);
      assert.ok(b.name && b.name.length > 0, `Missing name for Bani #${b.id}`);
      assert.ok(b.gurmukhiUni && b.gurmukhiUni.length > 0, `Missing Gurmukhi name for Bani #${b.id}`);
    });
  });

  test("2. All 17 Bani JSON files exist and have non-empty scripture content", async () => {
    for (const b of ALL_BANIS) {
      const filePath = path.join(NITNEM_DATA_DIR, `bani_${b.id}.json`);
      assert.ok(fs.existsSync(filePath), `Dataset file missing for Bani #${b.id} (${b.name})`);

      const res = await nitnemService.getBaniById(b.id);
      assert.ok(res, `Failed to retrieve Bani #${b.id}`);
      const lines = res.bani || res.verses || [];
      assert.ok(lines.length > 0, `Bani #${b.id} (${b.name}) has 0 verses`);
    }
  });

  test("3. Basant Ki Vaar (Bani 11) contains authentic 3 Pauris without unrelated hymns", async () => {
    const res = await nitnemService.getBaniById(11);
    const lines = res.bani || [];
    assert.equal(lines.length, 18, `Basant Ki Vaar must contain exactly 18 verses, found ${lines.length}`);

    const firstVerse = lines[0].line?.gurmukhi?.unicode || "";
    assert.ok(firstVerse.includes("ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥"), `Expected opening Manglacharan, got "${firstVerse}"`);

    const lastVerse = lines[lines.length - 1].line?.gurmukhi?.unicode || "";
    assert.ok(lastVerse.includes("ਸਚੁ ਪੂਰੈ ਗੁਰਿ ਉਪਦੇਸਿਆ ਨਾਨਕੁ ਸੁਣਾਵੈ ॥੩॥੧॥"), `Expected concluding Pauri 3, got "${lastVerse}"`);
  });

  test("4. Dukh Bhanjani Sahib (Bani 13) begins with its opening Shabad and contains all healing Shabads", async () => {
    const res = await nitnemService.getBaniById(13);
    const lines = res.bani || [];
    assert.ok(lines.length >= 30, `Dukh Bhanjani Sahib must contain comprehensive healing Shabads, found ${lines.length}`);

    // Verify first line is title / opening
    const firstLine = lines[0].line?.gurmukhi?.unicode || "";
    assert.ok(firstLine.includes("ਦੁਖ ਭੰਜਨੀ ਸਾਹਿਬ"), `First line must be title, got "${firstLine}"`);

    // Verify opening Shabad is Gauri Majh Mahalla 5
    const shabadHeading = lines[1].line?.gurmukhi?.unicode || "";
    assert.ok(shabadHeading.includes("ਗਉੜੀ ਮਹਲਾ ੫ ਮਾਂਝ ॥"), `Expected Gauri Mahalla 5 Maajh heading, got "${shabadHeading}"`);

    const shabadOpening = lines[2].line?.gurmukhi?.unicode || "";
    assert.ok(shabadOpening.includes("ਦੁਖ ਭੰਜਨੁ ਤੇਰਾ ਨਾਮੁ ਜੀ ਦੁਖ ਭੰਜਨੁ ਤੇਰਾ ਨਾਮੁ ॥"), `Expected Dukh Bhanjan opening, got "${shabadOpening}"`);

    // Verify Shabad 1 does NOT start with only its concluding line
    assert.ok(!shabadOpening.includes("॥੪॥੨॥੧੭੦॥"), "Opening line must NOT be concluding line!");
  });

  test("5. No Shabad across any Bani starts with an isolated concluding verse", async () => {
    for (const b of ALL_BANIS) {
      const res = await nitnemService.getBaniById(b.id);
      const lines = res.bani || [];
      const shabads = new Map();

      lines.forEach((item, idx) => {
        const l = item.line || item;
        const sid = l.shabadid || "default";
        if (!shabads.has(sid)) shabads.set(sid, []);
        shabads.get(sid).push({ idx, text: l.gurmukhi?.unicode || "" });
      });

      for (const [sid, slist] of shabads.entries()) {
        const firstText = slist[0].text;
        // Check if shabad consists of only an end marker like ॥੪॥੨॥੧੭੦॥
        if (slist.length === 1 && /॥[੦-੯]+\|[੦-੯]+\|[੦-੯]+\|/.test(firstText)) {
          assert.fail(`Bani #${b.id} (${b.name}) Shabad ${sid} starts with only concluding line: "${firstText}"`);
        }
      }
    }
  });

  test("6. No duplicate verse IDs exist within any single Bani", async () => {
    for (const b of ALL_BANIS) {
      const res = await nitnemService.getBaniById(b.id);
      const lines = res.bani || [];
      const seenIds = new Set();
      const duplicates = [];

      lines.forEach((item) => {
        const l = item.line || item;
        const id = l.id;
        if (id) {
          if (seenIds.has(id)) {
            duplicates.push(id);
          }
          seenIds.add(id);
        }
      });

      assert.equal(duplicates.length, 0, `Bani #${b.id} (${b.name}) has duplicate verse IDs: ${duplicates.join(", ")}`);
    }
  });

  test("7. All verses in all Banis have non-empty Gurmukhi text", async () => {
    for (const b of ALL_BANIS) {
      const res = await nitnemService.getBaniById(b.id);
      const lines = res.bani || [];

      lines.forEach((item, idx) => {
        const l = item.line || item;
        const text = l.gurmukhi?.unicode || l.gurmukhi?.akhar || "";
        assert.ok(text.trim().length > 0, `Bani #${b.id} verse at index ${idx} has empty Gurmukhi text`);
      });
    }
  });

  test("8. Sunder Gutka fallback returns full catalogue when upstream unavailable", async () => {
    const res = await nitnemService.getSunderGutka();
    assert.ok(res.sundergutkas && res.sundergutkas.length >= 17);
  });
});
