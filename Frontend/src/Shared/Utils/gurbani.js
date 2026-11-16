/**
 * Normalizes any verse/line representation returned by iGranth API.
 * iGranth returns lines wrapped in `{ line: { id, gurmukhi: { unicode, akhar }, translation: { english: { source_1 } }, writer: { english, unicode }, raag: { english } } }`.
 */
export const normalizeVerse = (rawItem) => {
  if (!rawItem) {
    return {
      id: '',
      shabadId: '',
      verse: '',
      translation: '',
      transliteration: '',
      teeka: '',
      writer: '',
      raag: '',
      pageNumber: '',
      source: 'G',
    };
  }

  // If item is wrapped in { line: { ... } } or { verse: { ... } }, unwrap it
  const line = rawItem.line || rawItem;

  // Extract Gurmukhi scripture text (Must always be a clean string, never an object)
  let verseText = '';
  if (typeof line.verse === 'string') {
    verseText = line.verse;
  } else if (line.verse && typeof line.verse === 'object') {
    if (typeof line.verse.unicode === 'string') {
      verseText = line.verse.unicode;
    } else if (typeof line.verse.gurmukhi === 'string') {
      verseText = line.verse.gurmukhi;
    } else if (typeof line.verse.akhar === 'string') {
      verseText = line.verse.akhar;
    } else if (line.verse.verse && typeof line.verse.verse === 'object') {
      verseText = line.verse.verse.unicode || line.verse.verse.gurmukhi || '';
    }
  } else if (line.gurmukhi && typeof line.gurmukhi === 'object') {
    verseText = line.gurmukhi.unicode || line.gurmukhi.akhar || '';
  } else if (typeof line.gurmukhi === 'string') {
    verseText = line.gurmukhi;
  } else if (typeof line.text === 'string') {
    verseText = line.text;
  }

  // Extract English Translation (Must always be a string)
  let translationText = '';
  if (line.translation && typeof line.translation === 'object') {
    if (line.translation.english && typeof line.translation.english === 'object') {
      translationText =
        line.translation.english.default ||
        line.translation.english.source_1 ||
        line.translation.english.source_2 ||
        line.translation.english.source_3 ||
        '';
    } else if (typeof line.translation.english === 'string') {
      translationText = line.translation.english;
    } else if (line.translation.en && typeof line.translation.en === 'object') {
      translationText =
        line.translation.en.bdb ||
        line.translation.en.ms ||
        line.translation.en.ssk ||
        line.translation.en.default ||
        '';
    } else if (typeof line.translation.en === 'string') {
      translationText = line.translation.en;
    }
  } else if (typeof line.translation === 'string') {
    translationText = line.translation;
  } else if (typeof line.english === 'string') {
    translationText = line.english;
  }

  // Extract Transliteration (Pronunciation)
  let transliterationText = '';
  if (line.transliteration && typeof line.transliteration === 'object') {
    if (line.transliteration.english && typeof line.transliteration.english === 'object') {
      transliterationText = line.transliteration.english.text || '';
    } else if (typeof line.transliteration.english === 'string') {
      transliterationText = line.transliteration.english;
    } else if (typeof line.transliteration.en === 'string') {
      transliterationText = line.transliteration.en;
    }
  } else if (typeof line.transliteration === 'string') {
    transliterationText = line.transliteration;
  }

  // Extract Punjabi Teeka
  let teekaText = '';
  if (line.translation && typeof line.translation === 'object') {
    const pb = line.translation.punjabi;
    if (pb && typeof pb === 'object') {
      teekaText =
        pb.default?.unicode ||
        pb.default?.akhar ||
        pb.source_3?.unicode ||
        pb.source_6?.unicode ||
        pb.source_5?.unicode ||
        '';
    } else if (typeof pb === 'string') {
      teekaText = pb;
    }

    const pu = line.translation.pu;
    if (!teekaText && pu && typeof pu === 'object') {
      teekaText =
        pu.ms?.unicode ||
        pu.ft?.unicode ||
        pu.ss?.unicode ||
        pu.bdb?.unicode ||
        '';
    }
  } else if (typeof line.punjabi === 'string') {
    teekaText = line.punjabi;
  } else if (typeof line.teeka === 'string') {
    teekaText = line.teeka;
  }

  // Extract Writer info (Can be object in iGranth)
  let writerName = '';
  if (line.writer && typeof line.writer === 'object') {
    writerName = line.writer.english || line.writer.unicode || '';
  } else if (typeof line.writer === 'string') {
    writerName = line.writer;
  }

  // Extract Raag info (Can be object in iGranth)
  let raagName = '';
  if (line.raag && typeof line.raag === 'object') {
    raagName = line.raag.english || line.raag.unicode || '';
  } else if (typeof line.raag === 'string') {
    raagName = line.raag;
  }

  // Extract Page / Ang Number safely
  let pageNum = line.pageno || line.page_no || line.pageNo || line.page || line.ang || '';
  if (typeof pageNum === 'object' && pageNum !== null) {
    pageNum = pageNum.page || pageNum.ang || pageNum.pageno || pageNum.pageNo || '';
  }

  // Extract Source safely (can be object like { id: 1, english: "..." } or string code)
  let sourceVal = 'G';
  if (typeof line.source === 'string') {
    sourceVal = line.source;
  } else if (line.source && typeof line.source === 'object') {
    sourceVal = line.source.code || line.source.english || 'G';
  }

  return {
    id: String(line.id || line.verse_id || line.verseId || line.orderid || ''),
    shabadId: String(line.shabadid || line.shabad_id || line.shabadId || ''),
    verse: typeof verseText === 'string' ? verseText : '',
    translation: typeof translationText === 'string' ? translationText : '',
    transliteration: typeof transliterationText === 'string' ? transliterationText : '',
    teeka: typeof teekaText === 'string' ? teekaText : '',
    writer: typeof writerName === 'string' ? writerName : '',
    raag: typeof raagName === 'string' ? raagName : '',
    pageNumber: String(pageNum || ''),
    source: String(sourceVal || 'G'),
    raw: line,
  };
};

export default normalizeVerse;
