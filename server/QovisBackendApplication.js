const express = require('express')
const app = express()
const port = 3000

const RKIFetcher = require("../src/RKIFetcher.js");
let fetcher = new RKIFetcher();

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))