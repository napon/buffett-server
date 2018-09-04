const Fuse = require('fuse.js');
const SEARCH_API = 'https://api.iextrading.com/1.0/ref-data/symbols';
const fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 5,
  maxPatternLength: 5,
  minMatchCharLength: 1,
  keys: [
    'symbol',
    'name',
  ],
};

let fuse = undefined;
let results = [];

const performFuzzySearchOnResults = (patternStr) => {
  if (!fuse) {
    fuse = new Fuse(results, fuseOptions);
  }
  return fuse.search(patternStr);
};

/**
 * Get list of matching stocks.
 * Includes:
 *   - Symbol
 *   - Company name
 */
module.exports = {
  run: async (req, res) => {
    if (results.length === 0) {
      const DataFetcher = require('../utils/DataFetcher');
      const data = await DataFetcher.getData(SEARCH_API);
      results = data
        .filter(d => d.isEnabled)
        .map(d => {
          return {
            symbol: d.symbol,
            name: d.name,
          };
        });
    }
    res.send(performFuzzySearchOnResults(req.params.symbol));
    return;
  }
};
