export const GRANTH_SOURCES = [
  { code: 'G', name: 'Sri Guru Granth Sahib Ji', totalPages: 1430, description: 'The eternal living Guru of the Sikhs' },
  { code: 'D', name: 'Sri Dasam Granth Sahib Ji', totalPages: 1428, description: 'The sacred writings of Guru Gobind Singh Ji' },
  { code: 'B', name: 'Vaaran Bhai Gurdas Ji', totalPages: 40, description: 'The key to the Guru Granth Sahib' },
  { code: 'N', name: 'Bhai Nand Lal Ji', totalPages: 100, description: 'Poetic verses of devotion and love' },
  { code: 'A', name: 'Amrit Keertan Gutka', totalPages: 1050, description: 'Compilation of hymns for devotional singing' },
];

export const SEARCH_TYPES = [
  { id: 0, label: 'First Letter (Start)', placeholder: 'e.g. ਸ ਗ (Starts with these letters)' },
  { id: 1, label: 'First Letter (Anywhere)', placeholder: 'e.g. ਸ ਗ (Letters appear anywhere)' },
  { id: 2, label: 'Full Gurmukhi Word/Line', placeholder: 'e.g. ਸਤਿਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ' },
  { id: 3, label: 'English Translation', placeholder: 'e.g. True Name, Creator' },
  { id: 4, label: 'All Gurmukhi Words', placeholder: 'e.g. ਨਾਮੁ ਸਿਮਰੁ' },
  { id: 5, label: 'All English Words', placeholder: 'e.g. remember name meditation' },
  { id: 6, label: 'Any Gurmukhi Words', placeholder: 'e.g. ਮਨ ਤਨ' },
  { id: 7, label: 'Any English Words', placeholder: 'e.g. peace joy light' },
];

export const READING_MODES = {
  PADA_CHHED: 'padached', // standard spaced words
  LARIVAAR: 'larivaar',   // continuous unbroken scripture text
};
