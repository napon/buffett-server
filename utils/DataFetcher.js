const https = require('https');

module.exports = {
  getData: (url) => {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
          return;
        });
      }).on('error', (err) => {
        console.log('ERROR: ' + err.message);
        reject(err);
      });
    });
  }
};