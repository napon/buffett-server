const app = require('express')();
app.get('/', (req, res) => res.send('success!'));

const Lookup = require('./endpoints/Lookup');
app.get('/lookup/:symbols', Lookup.run);

app.listen(3000, () => console.log('App listening on port 3000..'));
