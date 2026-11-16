import AUDIO_CATALOG_FALLBACK from '../config/audioCatalogFallback';

/**
 * Normalizes text for resilient matching (e.g. "Japji Sahib" -> "japjisahib")
 */
const normalizeKey = (str) =>
  (str || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/**
 * Map of standard Nitnem Bani IDs to audio slugs
 */
const NITNEM_ID_MAP = {
  1: 'japji-sahib',
  2: 'jaap-sahib',
  3: 'tav-prasad-savaiye',
  4: 'chaupai-sahib',
  5: 'anand-sahib',
  6: 'rehras-sahib',
  7: 'kirtan-sohila',
  8: 'sukhmani-sahib',
  9: 'mool-mantar',
};

/**
 * Finds an audio track for a Bani by id, slug, english name, or punjabi name.
 * Strictly returns the track ONLY if it is available in our library (`is_available: true` and `audio_url`).
 * If not available or no match, returns null.
 *
 * @param {number|string|object} baniIdentifier
 * @param {Array} playlist - optional playlist from AudioPlayerContext
 * @returns {object|null}
 */
export const findBaniAudio = (baniIdentifier, playlist = null) => {
  if (!baniIdentifier) return null;

  const catalog = playlist && Array.isArray(playlist) && playlist.length > 0
    ? playlist
    : AUDIO_CATALOG_FALLBACK;

  let targetId = null;
  let targetSlug = '';
  let targetEnglish = '';
  let targetPunjabi = '';

  if (typeof baniIdentifier === 'number' || (!isNaN(baniIdentifier) && typeof baniIdentifier === 'string' && /^\d+$/.test(baniIdentifier.trim()))) {
    targetId = Number(baniIdentifier);
    targetSlug = NITNEM_ID_MAP[targetId] || '';
  } else if (typeof baniIdentifier === 'string') {
    targetSlug = normalizeKey(baniIdentifier);
    targetEnglish = targetSlug;
    targetPunjabi = baniIdentifier.trim();
  } else if (typeof baniIdentifier === 'object') {
    if (baniIdentifier.id) {
      targetId = Number(baniIdentifier.id);
      targetSlug = NITNEM_ID_MAP[targetId] || normalizeKey(baniIdentifier.slug || '');
    } else {
      targetSlug = normalizeKey(baniIdentifier.slug || '');
    }
    targetEnglish = normalizeKey(
      baniIdentifier.english ||
      baniIdentifier.english_name ||
      baniIdentifier.title ||
      baniIdentifier.name ||
      ''
    );
    targetPunjabi = (
      baniIdentifier.punjabi ||
      baniIdentifier.punjabi_name ||
      baniIdentifier.gurmukhi ||
      baniIdentifier.name ||
      ''
    ).trim();
  }

  // Find match in catalog
  const match = catalog.find((track) => {
    // 1. Direct match by mapped slug
    if (targetSlug && normalizeKey(track.slug) === targetSlug) {
      return true;
    }

    // 2. Direct match by numeric ID if known Nitnem
    if (targetId && track.id === targetId) {
      return true;
    }

    // 3. Match normalized english name / title
    const trackEnglish = normalizeKey(track.english_name || track.title || track.slug);
    if (targetEnglish && trackEnglish) {
      if (trackEnglish === targetEnglish || trackEnglish.includes(targetEnglish) || targetEnglish.includes(trackEnglish)) {
        return true;
      }
    }

    // 4. Match punjabi name
    if (targetPunjabi && track.punjabi_name) {
      if (track.punjabi_name.includes(targetPunjabi) || targetPunjabi.includes(track.punjabi_name)) {
        return true;
      }
    }

    return false;
  });

  // STRICT REQUIREMENT: Only return if the track is actually available and has an audio_url!
  if (match && match.is_available && match.audio_url) {
    return match;
  }

  return null;
};

export default findBaniAudio;
