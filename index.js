const app = require('express')();
const cors = require('cors');

const Lookup = require('./endpoints/Lookup');
const Search = require('./endpoints/Search');

app.use(cors());

app.get('/lookup/:symbols', Lookup.run);
app.get('/search/:symbol', Search.run);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));
