function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }

  const keys = ['_id', 'isFavourite', 'contactType', 'name'];

  if (keys.includes(value) !== true) {
    return '_id';
  }

  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }

  if (value !== 'asc' && value !== 'desc') {
    return 'asc';
  }

  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parseSortByParams = parseSortBy(sortBy);
  const parseSortOrderParams = parseSortOrder(sortOrder);

  return { sortBy: parseSortByParams, sortOrder: parseSortOrderParams };
}
