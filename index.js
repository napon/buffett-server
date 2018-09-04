const app = require('express')();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => res.send('success!'));

const Lookup = require('./endpoints/Lookup');
const Search = require('./endpoints/Search');
app.get('/lookup/:symbols', Lookup.run);
app.get('/search/:symbol', Search.run);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));
