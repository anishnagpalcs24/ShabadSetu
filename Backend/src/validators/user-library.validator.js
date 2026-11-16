export const validateBookmark = (body) => {
  const errors = [];
  const { type, pageNumber, shabadId, lineId } = body;

  const validTypes = ["ang", "shabad", "line", "bani", "custom"];
  if (!type || !validTypes.includes(type)) {
    errors.push(`Type must be one of: ${validTypes.join(", ")}`);
  }

  if (type === "ang" && (!pageNumber || pageNumber < 1)) {
    errors.push("Valid pageNumber is required for ang bookmarks");
  }

  if (type === "shabad" && (!shabadId || shabadId < 1)) {
    errors.push("Valid shabadId is required for shabad bookmarks");
  }

  if (type === "line" && (!lineId || lineId < 1)) {
    errors.push("Valid lineId is required for line bookmarks");
  }

  return errors;
};

export const validateCollection = (body) => {
  const errors = [];
  const { title } = body;

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.push("Collection title is required");
  }

  return errors;
};

export const validateNote = (body) => {
  const errors = [];
  const { content } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    errors.push("Note content is required");
  }

  return errors;
};

export default {
  validateBookmark,
  validateCollection,
  validateNote
};
