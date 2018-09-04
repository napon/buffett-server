const app = require('express')();
app.get('/', (req, res) => res.send('success!'));

const Lookup = require('./endpoints/Lookup');
const Search = require('./endpoints/Search');
app.get('/lookup/:symbols', Lookup.run);
app.get('/search/:symbol', Search.run);

app.listen(3000, () => console.log('App listening on port 3000..'));
