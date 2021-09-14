const express = require('express');
const app = express()
const port = 3000

const BackendRKIFetcher = require("./fetcher/BackendRKIFetcher.js");

const SessionManager = require("./web/SessionManager.js");



app.get('/', SessionManager.asyncMiddleware(async (req, res, next) => {
    await BackendRKIFetcher.getAllLandkreiseAsObjects();
    console.log(BackendRKIFetcher.storedData);
    res.send('hi');
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));