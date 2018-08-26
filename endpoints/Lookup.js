const STOCKS_TOKEN = '%STOCKS%';
const LOOKUP_API = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${STOCKS_TOKEN}&types=quote,chart&chartInterval=5`;

/**
 * Get full detail of a particular stock symbol.
 * Includes:
 *   - Symbol
 *   - Company name
 *   - One month history
 *   - Market info
 */
module.exports = {
  run: async (req, res) => {
    let symbols = req.params.symbols;
    symbols = symbols.split(',');
    const DataFetcher = require('../utils/DataFetcher');
    const APIRequest = LOOKUP_API.replace(STOCKS_TOKEN, symbols.join(','));
    const data = await DataFetcher.getData(APIRequest);
    
    // construct response
    const response = {};
    Object.keys(data).forEach((sym) => {
      const stockData = data[sym];
      response[sym] = {
        symbol: stockData.quote.symbol,
        name: stockData.quote.companyName,
        exchange: stockData.quote.primaryExchange,
        sector: stockData.quote.sector,
        peRatio: stockData.quote.peRatio,
        marketCap: stockData.quote.marketCap,
        price: stockData.quote.latestPrice,
        data: stockData.chart.map(point => {
          return {
            date: point.label,
            volume: point.volume,
            open: point.open,
            close: point.close,
            high: point.high,
            low: point.low
          };
        })
      };
    });
    res.send(response);
  }
};