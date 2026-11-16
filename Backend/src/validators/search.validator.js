export const validateSearchParams = (params) => {
  const errors = [];
  const { query } = params;

  if (!query || typeof query !== "string" || !query.trim()) {
    errors.push("Search query parameter cannot be empty");
  }

  return errors;
};

export const validateSearchQuery = (queryObj) => {
  const errors = [];
  const { type, searchtype, results, skip } = queryObj;

  const t = searchtype !== undefined ? searchtype : type;
  if (t !== undefined) {
    const typeNum = parseInt(t, 10);
    if (isNaN(typeNum) || typeNum < 0 || typeNum > 7) {
      errors.push("Search type must be an integer between 0 and 7");
    }
  }

  if (results !== undefined) {
    const resNum = parseInt(results, 10);
    if (isNaN(resNum) || resNum < 1 || resNum > 100) {
      errors.push("Results limit must be between 1 and 100");
    }
  }

  if (skip !== undefined) {
    const skipNum = parseInt(skip, 10);
    if (isNaN(skipNum) || skipNum < 0) {
      errors.push("Skip offset must be a non-negative integer");
    }
  }

  return errors;
};

export default {
  validateSearchParams,
  validateSearchQuery
};
