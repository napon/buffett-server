const app = require('express')();
app.get('/', (req, res) => res.send('success!'));

const Lookup = require('./endpoints/Lookup');
const Search = require('./endpoints/Search');
app.get('/lookup/:symbols', Lookup.run);
app.get('/search/:symbol', Search.run);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));
