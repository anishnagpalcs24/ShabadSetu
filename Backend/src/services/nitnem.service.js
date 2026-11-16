import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import igranthService from "./igranth.service.js";
import logger from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NITNEM_DATA_DIR = path.resolve(__dirname, "../data/nitnem");

// Full 17 Banis Metadata
export const ALL_BANIS = [
  { id: 1, name: "Japji Sahib", gurmukhiUni: "ਜਪੁਜੀ ਸਾਹਿਬ", time: "Morning (Amritvela)", author: "Guru Nanak Dev Ji" },
  { id: 2, name: "Jaap Sahib", gurmukhiUni: "ਜਾਪੁ ਸਾਹਿਬ", time: "Morning (Amritvela)", author: "Guru Gobind Singh Ji" },
  { id: 3, name: "Tav-Prasad Savaiye", gurmukhiUni: "ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ", time: "Morning (Amritvela)", author: "Guru Gobind Singh Ji" },
  { id: 4, name: "Chaupai Sahib", gurmukhiUni: "ਚੌਪਈ ਸਾਹਿਬ", time: "Morning / Evening", author: "Guru Gobind Singh Ji" },
  { id: 5, name: "Anand Sahib", gurmukhiUni: "ਅਨੰਦੁ ਸਾਹਿਬ", time: "Morning / Completion", author: "Guru Amar Das Ji" },
  { id: 6, name: "Rehras Sahib", gurmukhiUni: "ਰਹਰਾਸਿ ਸਾਹਿਬ", time: "Evening (Sunset)", author: "Multiple Gurus" },
  { id: 7, name: "Kirtan Sohila", gurmukhiUni: "ਕੀਰਤਨ ਸੋਹਿਲਾ", time: "Bedtime (Night)", author: "Guru Nanak, Guru Ram Das, Guru Arjan" },
  { id: 8, name: "Sukhmani Sahib", gurmukhiUni: "ਸੁਖਮਨੀ ਸਾਹਿਬ", time: "Daily Contemplation", author: "Guru Arjan Dev Ji" },
  { id: 9, name: "Asa Ki Vaar", gurmukhiUni: "ਆਸਾ ਕੀ ਵਾਰ", time: "Morning Devotion", author: "Guru Nanak Dev Ji" },
  { id: 10, name: "Shabad Hazare", gurmukhiUni: "ਸ਼ਬਦ ਹਜ਼ਾਰੇ", time: "Devotional Longing", author: "Guru Ram Das & Guru Arjan Dev Ji" },
  { id: 11, name: "Basant Ki Vaar", gurmukhiUni: "ਬਸੰਤ ਕੀ ਵਾਰ", time: "Seasonal Praise", author: "Guru Arjan Dev Ji" },
  { id: 12, name: "Salok Mahalla 9", gurmukhiUni: "ਸਲੋਕ ਮਹਲਾ ੯", time: "Reflective Wisdom", author: "Guru Tegh Bahadur Ji" },
  { id: 13, name: "Dukh Bhanjani Sahib", gurmukhiUni: "ਦੁਖ ਭੰਜਨੀ ਸਾਹਿਬ", time: "Healing & Protection", author: "Guru Arjan Dev Ji" },
  { id: 14, name: "Aarti", gurmukhiUni: "ਆਰਤੀ", time: "Cosmic Adoration", author: "Guru Nanak Dev Ji" },
  { id: 15, name: "Ardaas", gurmukhiUni: "ਅਰਦਾਸਿ", time: "Supplication", author: "Sikh Panth Tradition" },
  { id: 16, name: "Barah Maha", gurmukhiUni: "ਬਾਰਹ ਮਾਹਾ", time: "Twelve Months Cycle", author: "Guru Arjan Dev Ji" },
  { id: 17, name: "Sidh Gosht", gurmukhiUni: "ਸਿਧ ਗੋਸਟਿ", time: "Spiritual Discourse", author: "Guru Nanak Dev Ji" },
];

const FALLBACK_VERSES = {
  2: [
    { gurmukhi: "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥", transliteration: "ik oankaar sree vaaheguroo jee kee fateh ||", english: "One Universal Creator God. Victory unto the Wondrous Lord." },
    { gurmukhi: "ਜਾਪੁ ॥ ਸ੍ਰੀ ਮੁਖਵਾਕ ਪਾਤਿਸਾਹੀ ੧੦ ॥", transliteration: "jaap || sree mukhavaak paatisaahee 10 ||", english: "Jaap Sahib. The Sacred Utterance of the Tenth Sovereign." },
    { gurmukhi: "ਛਪੈ ਛੰਦ ॥ ਤ੍ਵਪ੍ਰਸਾਦਿ ॥", transliteration: "chapai chhand || tvaprasaad ||", english: "Chhapai Chhand. By Thy Grace." },
    { gurmukhi: "ਚਕ੍ਰ ਚਿਹਨ ਅਰੁ ਬਰਨ ਜਾਤਿ ਅਰੁ ਪਾਤਿ ਨਹਿਨ ਜਿਹ ॥", transliteration: "chakra chihan ar baran jaat ar paat nahin jih ||", english: "Who has no mark, no sign, no color, no caste, and no lineage." },
    { gurmukhi: "ਰੂਪ ਰੰਗ ਅਰੁ ਰੇਖ ਭੇਖ ਕੋਊ ਕਹਿ ਨ ਸਕਤਿ ਕਿਹ ॥", transliteration: "roop rang ar rekh bhekh koo kah na sakat kih ||", english: "No one can describe Your form, Your hue, Your features, or Your garb." },
    { gurmukhi: "ਅਚਲ ਮੂਰਤਿ ਅਨਭਉ ਪ੍ਰਕਾਸ ਅਮਿਤੋਜਿ ਕਹਿਜੈ ॥", transliteration: "achal moorat anbhau prakaas amitoj kahijai ||", english: "Steadfast manifestation, Self-Illuminated, of Immeasurable Might." },
    { gurmukhi: "ਕੋਟਿ ਇੰਦ੍ਰ ਇੰਦ੍ਰਾਣ ਸਾਹੁ ਸਾਹਾਣਿ ਗਣਿਜੈ ॥", transliteration: "kot indr indraan saahu saahaan ganijai ||", english: "Revered as the King of millions of Indras and Sovereign of rulers." },
    { gurmukhi: "ਤ੍ਰਿਭਵਣ ਮਹੀਪ ਸੁਰ ਨਰ ਅਸੁਰ ਨੇਤ ਨੇਤ ਬਨ ਤ੍ਰਿਣ ਕਹਤ ॥", transliteration: "tribhavan maheep sur nar asur net net ban trin kahat ||", english: "Sovereign of the three realms; demigods, mortals, demons, and the forest blades proclaim: 'Not this, Not this'." },
    { gurmukhi: "ਤਵ ਸਰਬ ਨਾਮ ਕਥੈ ਕਵਨ ਕਰਮ ਨਾਮ ਬਰਣਤ ਸੁਮਤਿ ॥੧॥", transliteration: "tav sarab naam kathai kavan karam naam barnat sumat ||1||", english: "Who can recite all Your primordial names? Through enlightened intellect, only Your action-names are related. ||1||" },
  ],
  3: [
    { gurmukhi: "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥", transliteration: "ik oankaar sree vaaheguroo jee kee fateh ||", english: "One Universal Creator God. Victory unto the Wondrous Lord." },
    { gurmukhi: "ਪਾਤਿਸਾਹੀ ੧੦ ॥ ਤ੍ਵਪ੍ਰਸਾਦਿ ਸਵੱਯੇ ॥", transliteration: "paatisaahee 10 || tvaprasaad savaiye ||", english: "Tenth Sovereign. Tav-Prasad Savaiye." },
    { gurmukhi: "ਸ੍ਰਾਵਗ ਸੁਧ ਸਮੂਹ ਸਿਧਾਨ ਕੇ ਦੇਖਿ ਫਿਰਿਓ ਘਰ ਜੋਗ ਜਤੀ ਕੇ ॥", transliteration: "sraavag sudh samooh sidhaan ke dekh phirio ghar jog jatee ke ||", english: "I have seen flocks of pure Jains, crowds of Siddhas, Yogis and celibates in their retreats." },
    { gurmukhi: "ਸੂਰ ਸੁਰਾਰਦਨ ਸੁਧ ਸੁਧਾਦਿਕ ਸੰਤ ਸਮੂਹ ਅਨੇਕ ਮਤੀ ਕੇ ॥", transliteration: "soor suraaradan sudh sudhaadik sant samooh anek matee ke ||", english: "Warriors, conquerors of demons, heavenly nectar-drinkers, and saintly assemblies of numerous sects." },
    { gurmukhi: "ਸਾਰੇ ਹੀ ਦੇਸ ਕੋ ਦੇਖਿ ਰਹਿਓ ਮਤ ਕੋਊ ਨ ਦੇਖੀਅਤ ਪ੍ਰਾਨਪਤੀ ਕੇ ॥", transliteration: "saare hee des ko dekh rahio mat koo na dekheeat praanapatee ke ||", english: "Having explored lands of every creed, none saw I that truly realized the Sovereign of life." },
    { gurmukhi: "ਸ੍ਰੀ ਭਗਵਾਨ ਕੀ ਭਾਇ ਕ੍ਰਿਪਾ ਹੂ ਤੇ ਏਕ ਰਤੀ ਬਿਨੁ ਏਕ ਰਤੀ ਕੇ ॥੧॥੨੧॥", transliteration: "sree bhagavaan kee bhaai kripaa hoo te ek ratee bin ek ratee ke ||1||21||", english: "Without even a particle of love and grace from the Divine Supreme, all are worth nothing at all. ||1||21||" },
  ],
  4: [
    { gurmukhi: "ੴ ਸ੍ਰੀ ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫ਼ਤਹਿ ॥", transliteration: "ik oankaar sree vaaheguroo jee kee fateh ||", english: "One Universal Creator God. Victory unto the Wondrous Lord." },
    { gurmukhi: "ਕਬਿਯੋਬਾਚ ਬੇਨਤੀ ॥ ਚੌਪਈ ॥", transliteration: "kabiyobaach benatee || chaupaee ||", english: "The Poet's Devout Prayer. Chaupai." },
    { gurmukhi: "ਹਮਰੀ ਕਰੋ ਹਾਥ ਦੈ ਰੱਛਾ ॥ ਪੂਰਨ ਹੋਇ ਚਿਤ ਕੀ ਇੱਛਾ ॥", transliteration: "hamaree karo haath dai rachhaa || pooran hoi chit kee ichhaa ||", english: "Extend Your Hand and grant me protection; let the heartfelt desire of my soul be fulfilled." },
    { gurmukhi: "ਤਵ ਚਰਨਨ ਮਨ ਰਹੈ ਹਮਾਰਾ ॥ ਅਪਨਾ ਜਾਨ ਕਰੋ ਪ੍ਰਤਿਪਾਰਾ ॥੧॥", transliteration: "tav charanan man rahai hamaaraa || apanaa jaan karo pratipaaraa ||1||", english: "May my mind remain anchored at Your holy feet; look upon me as Your own and cherish me. ||1||" },
    { gurmukhi: "ਹਮਰੇ ਦੁਸਟ ਸਭੈ ਤੁਮ ਘਾਵਹੁ ॥ ਆਪੁ ਹਾਥ ਦੈ ਮੋਹਿ ਬਚਾਵਹੁ ॥", transliteration: "hamare dusat sabhai tum ghaavahu || aap haath dai mohi bachaavahu ||", english: "Vanquish all my adversaries; with Your own hand protect and preserve me." },
    { gurmukhi: "ਸੁਖੀ ਬਸੈ ਮੋਰੋ ਪਰਿਵਾਰਾ ॥ ਸੇਵਕ ਸਿੱਖ ਸਭੈ ਕਰਤਾਰਾ ॥੨॥", transliteration: "sukhee basai moro parivaaraa || sevak sikkh sabhai karataaraa ||2||", english: "May my entire household dwell in peace and bliss—all disciples and servants of the Creator. ||2||" },
  ],
  5: [
    { gurmukhi: "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥", transliteration: "ik oankaar satigur prasaad ||", english: "One Universal Creator God. Realized by Grace of the True Guru." },
    { gurmukhi: "ਰਾਮਕਲੀ ਮਹਲਾ ੩ ਅਨੰਦੁ ॥", transliteration: "raamakalee mahalaa 3 anand ||", english: "Raag Ramkali, Third Mehl, Anand ~ The Song of Celestial Bliss." },
    { gurmukhi: "ਅਨੰਦੁ ਭਇਆ ਮੇਰੀ ਮਾਏ ਸਤਿਗੁਰੂ ਮੈ ਪਾਇਆ ॥", transliteration: "anand bhaiaa meree maae satiguroo mai paaiaa ||", english: "I am in supreme ecstasy, O my mother, for I have attained the True Guru." },
    { gurmukhi: "ਸਤਿਗੁਰੁ ਤ ਪਾਇਆ ਸਹਜ ਸੇਤੀ ਮਨਿ ਵਜੀਆ ਵਾਧਾਈਆ ॥", transliteration: "satigur ta paaiaa sahaj setee man vajeeaa vaadhaaeeaa ||", english: "I found the True Guru with effortless intuitive ease, and melodies of celebration resound within my mind." },
    { gurmukhi: "ਰਾਗ ਰਤਨ ਪਰਵਾਰ ਪਰੀਆ ਸਬਦ ਗਾਵਣ ਆਈਆ ॥", transliteration: "raag ratan paravaar pareeaa sabad gaavan aaeeaa ||", english: "The celestial harmonies, jeweled melodies, and angelic singers have arrived to sing the sacred Word." },
    { gurmukhi: "ਸਬਦੋ ਤ ਗਾਵਹੁ ਹਰੀ ਕੇਰਾ ਮਨਿ ਜਿਨੀ ਵਸਾਇਆ ॥", transliteration: "sabado ta gaavahu haree keraa man jinee vasaaiaa ||", english: "Sing praises of the Lord, all you whose hearts have enshrined the sacred Word." },
    { gurmukhi: "ਕਹੈ ਨਾਨਕੁ ਅਨੰਦੁ ਹੋਆ ਸਤਿਗੁਰੂ ਮੈ ਪਾਇਆ ॥੧॥", transliteration: "kahai naanak anand hoaa satiguroo mai paaiaa ||1||", english: "Says Nanak, celestial bliss has descended, for I have attained the True Guru. ||1||" },
  ],
  8: [
    { gurmukhi: "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥", transliteration: "ik oankaar satigur prasaad ||", english: "One Universal Creator God. By Grace of the True Guru." },
    { gurmukhi: "ਗਉੜੀ ਸੁਖਮਨੀ ਮਹਲਾ ੫ ॥ ਸਲੋਕੁ ॥", transliteration: "gauree sukhmanee mahalaa 5 || salok ||", english: "Gauree Sukhmani, Fifth Mehl. Salok." },
    { gurmukhi: "ਆਦਿ ਗੁਰਏ ਨਮਹ ॥ ਜੁਗਾਦਿ ਗੁਰਏ ਨਮਹ ॥", transliteration: "aadi gurae namah || jugaadi gurae namah ||", english: "I bow to the Primal Guru. I bow to the Guru of all the Ages." },
    { gurmukhi: "ਸਤਿਗੁਰਏ ਨਮਹ ॥ ਸ੍ਰੀ ਗੁਰਦੇਵਏ ਨਮਹ ॥੧॥", transliteration: "satigurae namah || sree gurdevae namah ||1||", english: "I bow to the True Guru. I bow to the Divine Resplendent Teacher. ||1||" },
    { gurmukhi: "ਅਸਟਪਦੀ ॥", transliteration: "asatapadee ||", english: "Ashtpadi 1." },
    { gurmukhi: "ਪ੍ਰਭ ਕੈ ਸਿਮਰਨਿ ਕਲਿ ਕਲੇਸ ਮਿਟਹਿ ॥", transliteration: "prabh kai simaran kali kales mitahi ||", english: "In the remembrance of God, strife and sorrows are eradicated." },
    { gurmukhi: "ਪ੍ਰਭ ਕੈ ਸਿਮਰਨਿ ਮਨ ਕੀ ਮਲੁ ਜਾਇ ॥", transliteration: "prabh kai simaran man kee mal jaai ||", english: "In the remembrance of God, the pollution of the mind is washed away." },
    { gurmukhi: "ਸੁਖਮਨੀ ਸੁਖ ਅੰਮ੍ਰਿਤ ਪ੍ਰਭ ਨਾਮੁ ॥ ਭਗਤ ਜਨਾ ਕੈ ਮਨਿ ਬਿਸ੍ਰਾਮੁ ॥ ਰਹਾਉ ॥", transliteration: "sukhmanee sukh amrit prabh naam || bhagat janaa kai man bisraam || rahaau ||", english: "Sukhmani: The Jewel of Peace, the Nectar of God's Name. It brings blissful rest to the minds of devotees. ||Pause||" },
  ],
};

export class NitnemService {
  async getSunderGutka() {
    try {
      return await igranthService.getSunderGutka();
    } catch (err) {
      logger.warn(`iGranth getSunderGutka unavailable (${err.message}), using fallback`);
      return { sundergutkas: ALL_BANIS };
    }
  }

  async getSunderGutkaById(id) {
    try {
      return await igranthService.getSunderGutkaById(id);
    } catch (err) {
      logger.warn(`iGranth getSunderGutkaById unavailable (${err.message}), falling back to getBaniById`);
      return this.getBaniById(id);
    }
  }

  async getBani() {
    try {
      const upstream = await igranthService.getBani();
      if (upstream && (upstream.banis || Array.isArray(upstream))) {
        return upstream;
      }
      return { banis: ALL_BANIS };
    } catch (err) {
      logger.warn(`iGranth getBani unavailable (${err.message}), using fallback Banis metadata`);
      return { banis: ALL_BANIS };
    }
  }

  async getBaniById(id, options = {}) {
    const numId = parseInt(id, 10);

    // 1. Check local on-disk fallback file first if available
    const fallbackFile = path.join(NITNEM_DATA_DIR, `bani_${id}.json`);
    if (fs.existsSync(fallbackFile)) {
      try {
        const raw = fs.readFileSync(fallbackFile, "utf-8");
        const parsed = JSON.parse(raw);
        logger.info(`Serving resilient local scripture for Bani #${id}`);
        return parsed;
      } catch (readErr) {
        logger.error(`Failed to read local fallback for Bani #${id}: ${readErr.message}`);
      }
    }

    // 2. Try fetching from iGranth
    try {
      return await igranthService.getBaniById(id, options);
    } catch (err) {
      logger.warn(`Upstream Bani #${id} request failed (${err.message}), evaluating fallback`);

      // 3. Fallback scripture synthesis if upstream is rate-limited / unavailable
      const meta = ALL_BANIS.find((b) => b.id === numId) || { id: numId, name: `Bani #${numId}`, gurmukhiUni: `ਬਾਣੀ #${numId}` };
      const fallbackList = FALLBACK_VERSES[numId] || [
        {
          gurmukhi: "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
          transliteration: "ik oankaar satigur prasaad ||",
          english: "One Universal Creator God. Realized by Grace of the True Guru.",
        },
        {
          gurmukhi: `${meta.gurmukhiUni} ॥`,
          transliteration: `${meta.name} ||`,
          english: `${meta.name} - Sacred Sikh Scripture composition.`,
        },
      ];

      const synthesizedBani = {
        baniinfo: {
          id: numId,
          name: meta.name,
          gurmukhiUni: meta.gurmukhiUni,
        },
        bani: fallbackList.map((item, idx) => ({
          line: {
            id: `FB_${numId}_${idx + 1}`,
            gurmukhi: {
              unicode: item.gurmukhi,
              akhar: item.gurmukhi,
            },
            translation: {
              english: {
                default: item.english,
                source_1: item.english,
              },
            },
            transliteration: {
              english: {
                text: item.transliteration,
              },
            },
          },
        })),
      };

      return synthesizedBani;
    }
  }

  async getSunderGutkaBani(sgId, baniId) {
    try {
      return await igranthService.getSunderGutkaBani(sgId, baniId);
    } catch (err) {
      return this.getBaniById(baniId);
    }
  }
}

export default new NitnemService();
