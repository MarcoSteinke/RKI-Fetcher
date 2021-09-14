const express = require('express');
const app = express()
const port = 3000

const BackendRKIFetcher = require("./fetcher/BackendRKIFetcher.js");
let fetcher = new BackendRKIFetcher("Mettmann");



app.get('/', (req, res) => {
    fetcher.getAllLandkreise();
    console.log(fetcher.storedData);
    res.send(JSON.stringify(fetcher.storedData));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));