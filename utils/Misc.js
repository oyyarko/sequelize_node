export const usernameRegex = /^[a-zA-Z0-9_]+$/;

module.exports.Pagination = (page) => {
  const page = page || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
