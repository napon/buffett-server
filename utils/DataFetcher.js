const https = require('https');
const cache = {};

module.exports = {
  getData: (url) => {
    return new Promise((resolve, reject) => {
      if (cache[url]) {
        resolve(cache[url]);
        return;
      }
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const result = JSON.parse(data);
          cache[url] = result;
          resolve(result);
          return;
        });
      }).on('error', (err) => {
        console.log('ERROR: ' + err.message);
        reject(err);
      });
    });
  }
};