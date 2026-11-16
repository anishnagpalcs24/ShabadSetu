import { test, describe } from "node:test";
import assert from "node:assert/strict";
import audioService from "../src/services/audio.service.js";
import INITIAL_AUDIO_CATALOG from "../src/config/audio-catalog.js";

describe("Audio Paath Feature - Catalogue and Service Tests", () => {
  test("1. Initial catalogue contains all 8 uploaded recordings with exact ImageKit URLs", () => {
    const slugs = [
      "anand-sahib",
      "jaap-sahib",
      "japji-sahib",
      "chaupai-sahib",
      "tav-prasad-savaiye",
      "kirtan-sohila",
      "sukhmani-sahib",
      "mool-mantar",
    ];

    for (const slug of slugs) {
      const bani = INITIAL_AUDIO_CATALOG.find((b) => b.slug === slug);
      assert.ok(bani, `${slug} must exist in catalogue`);
      assert.equal(bani.is_available, true, `${slug} must be marked available`);
      assert.ok(
        bani.audio_url && bani.audio_url.startsWith("https://ik.imagekit.io/anish03/shabadsetu-audio/"),
        `${slug} must have an ImageKit audio URL`
      );
    }

    // Check Anand Sahib URL without .mp3 is preserved
    const anand = INITIAL_AUDIO_CATALOG.find((b) => b.slug === "anand-sahib");
    assert.equal(anand.audio_url, "https://ik.imagekit.io/anish03/shabadsetu-audio/anand-sahib");

    // Check Tav-Prasad Savaiye query parameter is preserved
    const savaiye = INITIAL_AUDIO_CATALOG.find((b) => b.slug === "tav-prasad-savaiye");
    assert.ok(savaiye.audio_url.includes("updatedAt=1794759772992"));

    // Check Mool Mantar URL
    const mool = INITIAL_AUDIO_CATALOG.find((b) => b.slug === "mool-mantar");
    assert.equal(mool.audio_url, "https://ik.imagekit.io/anish03/shabadsetu-audio/mool-mantra.mp3");
  });

  test("2. Un-uploaded Banis (Rehras Sahib) are marked unavailable by default", () => {
    const rehras = INITIAL_AUDIO_CATALOG.find((b) => b.slug === "rehras-sahib");
    assert.ok(rehras, "Rehras Sahib entry must exist in catalogue");
    assert.equal(rehras.is_available, false, "Rehras Sahib must be unavailable until audio is uploaded");
    assert.equal(rehras.audio_url, null);
  });

  test("3. audioService.getCatalog returns all banis and correct available count of 8", async () => {
    const catalog = await audioService.getCatalog();
    assert.ok(Array.isArray(catalog.banis), "Catalogue banis must be an array");
    assert.equal(catalog.total, 9);
    assert.equal(catalog.available_count, 8, "Exactly 8 recordings should be available");
  });

  test("4. audioService.getCatalog({ onlyAvailable: true }) filters only playable recordings", async () => {
    const catalog = await audioService.getCatalog({ onlyAvailable: true });
    assert.equal(catalog.banis.length, 8);
    for (const bani of catalog.banis) {
      assert.equal(bani.is_available, true);
      assert.ok(bani.audio_url);
    }
  });

  test("5. audioService.getBySlug retrieves metadata for any valid slug", async () => {
    const anand = await audioService.getBySlug("anand-sahib");
    assert.ok(anand);
    assert.equal(anand.english_name, "Anand Sahib");
    assert.equal(anand.slug, "anand-sahib");

    const mool = await audioService.getBySlug("mool-mantar");
    assert.ok(mool);
    assert.equal(mool.english_name, "Mool Mantar");
    assert.equal(mool.punjabi_name, "ਮੂਲ ਮੰਤਰ");
  });

  test("6. audioService.getBySlug throws 404 for unknown slug", async () => {
    await assert.rejects(
      async () => {
        await audioService.getBySlug("non-existent-bani");
      },
      { statusCode: 404 }
    );
  });
});
