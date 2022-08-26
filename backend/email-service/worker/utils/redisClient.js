const Redis = require('ioredis');

const MAX_SEARCH_RESULTS = 1000;

const redis = new Redis({
  host: '192.168.1.200',
  port: 6379,
  password: "FG0RVs9xv025s7bR/zGmifF9zaByxA2eNN0qUmasW1kuLk14/GEYxml5NrLsMacL+mNPBlUCQzcgSgs",
});

const performSearch = async (index, ...query) => {
  try {
    const searchResults = await redis.call('FT.SEARCH', index, query, 'LIMIT', '0', MAX_SEARCH_RESULTS);
    if (searchResults.length === 1) {
      return [];
    }
    const results = [];
    for (let n = 2; n < searchResults.length; n += 2) {
      const result = {};
      const fieldNamesAndValues = searchResults[n];

      for (let m = 0; m < fieldNamesAndValues.length; m += 2) {
        const k = fieldNamesAndValues[m];
        const v = fieldNamesAndValues[m + 1];
        result[k] = v;
      }

      results.push(result);
    }
    return results;
  } catch (e) {
    console.log(`Invalid search request for index: ${index}, query: ${query}`);
    console.error(e);
    return [];
  }
};

module.exports = {
  getClient: () => redis,
  getKeyName: (...args) => `emailer:${args.join(':')}`,
  performSearch,
};