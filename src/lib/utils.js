/* eslint-disable import/prefer-default-export */

/**
 * Paginates an array of data based on the provided options.
 * @param {Array} data - The array of data to be paginated.
 * @param {Object} options - An object containing the pagination options.
 * @param {number} options.page - The page number to retrieve.
 * @param {number} options.limit - The maximum number of items per page.
 * @returns {Object} - An object with the paginated data.
 * @throws {Error} - If the data is not an array or if the page or limit values are invalid.
 */
const paginateData = (data, options) => {
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array.');
  }

  const { page, limit } = options;
  if (!Number.isInteger(page) || !Number.isInteger(limit) || page <= 0 || limit <= 0) {
    throw new Error('Invalid page or limit value.');
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const itemsOnPage = data.slice(startIndex, endIndex);
  const hasNextPage = endIndex < data.length;

  return {
    currentPage: page,
    hasNextPage,
    items: itemsOnPage,
  };
};

export {
  paginateData,
};
