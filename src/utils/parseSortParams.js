function parseSortBy(value) {
  const keys = ['_id', 'isFavourite', 'contactType', 'name'];
  return keys.includes(value) ? value : '_id';
}

function parseSortOrder(value) {
return value === 'desc' ? -1 : 1;
}

export function parseSortParams(query) {
const { sortBy, sortOrder } = query;
return {
  sortBy: parseSortBy(sortBy),
  sortOrder: parseSortOrder(sortOrder),
};
}
