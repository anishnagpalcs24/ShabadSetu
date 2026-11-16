export const validateAngParams = (params) => {
  const errors = [];
  const { page, source } = params;

  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1 || pageNum > 5000) {
    errors.push("Page must be a valid positive number");
  }

  if (source && typeof source !== "string") {
    errors.push("Source must be a valid string code (e.g. 'G')");
  }

  return errors;
};

export const validateIdParam = (params) => {
  const errors = [];
  const { id } = params;

  if (!id || (typeof id !== "string" && typeof id !== "number") || !String(id).trim()) {
    errors.push("ID parameter must be provided");
  } else if (!isNaN(Number(id)) && Number(id) < 1) {
    errors.push("Numeric ID must be a positive integer");
  }

  return errors;
};

export default {
  validateAngParams,
  validateIdParam
};
