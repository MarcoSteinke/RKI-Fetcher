// TODO: Add visual output!

let LandkreisPictureQuery = require("./LandkreisPictureQuery.js");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
exports.fetch = fetch;

module.exports = class BackendRKIFetcher {

    static api = "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson";
    city;
    data = null;
    landkreisPictureQuery;
    queryResultRenderer;
    static incidency;
    static totalCases;
    static totalDeaths;
    static survivalRate;
    static storedData = [];

    constructor(city) {
        if(city) {
            this.city = city;
        }

        this.landkreisPictureQuery = new LandkreisPictureQuery(city);
    }



    async getAllLandkreise() {
        const landkreise = [];
        try {
            await fetch(BackendRKIFetcher.api).then(res => res.json()).then(json => json.features.forEach(feature => landkreise.push(feature.properties.GEN)));
        } catch(e) {
            console.log(e);
        }

        return landkreise;
    }

    static calculateIncidency() {
        BackendRKIFetcher.incidency = Number.parseInt((BackendRKIFetcher.storedData.map(landkreis => landkreis.properties.cases7_per_100k).reduce((a,b) => a+b) / BackendRKIFetcher.storedData.length) * 10) / 10
    }
    
    static async getAllLandkreiseAsObjects() {
        if(BackendRKIFetcher.storedData.length < 1) {
            await fetch(BackendRKIFetcher.api)
                .then(res => res.json())
                .then(json => json.features.forEach(feature => this.storedData.push(feature)));
        }

        BackendRKIFetcher.calculateIncidency();
        BackendRKIFetcher.totalCases = BackendRKIFetcher.calculateTotalCases();
        BackendRKIFetcher.totalDeaths = BackendRKIFetcher.calculateTotalDeaths();
        BackendRKIFetcher.survivalRate = BackendRKIFetcher.calculateAverageSurvivalRate();
    }

    async getInformation() {
        await fetch(BackendRKIFetcher.api).then(res => res.json()).then(json => json.features.forEach(feature => {
          if(feature.properties.GEN == this.city) {
            this.data = feature;
            console.log(this.data);
            window.location.href = window.location.href.split("?")[0] + "?share=" + BackendRKIFetcher.landkreisToURL(feature.properties.GEN);
          }
        }))
    }

    static landkreisToURL(landkreis) {
        let result = "";
        for(let i = 0; i < landkreis.length; i++) {
          result += "#" + landkreis.charCodeAt(i);
        }
      
        return result;
    }

    static findHotspots() {
        return BackendRKIFetcher.storedData.sort(function(a,b) { return b.properties.cases7_per_100k - a.properties.cases7_per_100k }).slice(0,5);
    }

    static calculateTotalCases() {
        return BackendRKIFetcher.storedData.map(landkreis => landkreis.properties.cases).reduce((a,b) => a+b)
    }

    static calculateTotalDeaths() {
        return BackendRKIFetcher.storedData.map(landkreis => landkreis.properties.deaths).reduce((a,b) => a+b)
    }

    static calculateAverageSurvivalRate() {
        return Number.parseInt((BackendRKIFetcher.storedData.map(landkreis => (Number.parseInt((100 - landkreis.properties.death_rate) * 100) / 100)).reduce((a,b) => a+b) / BackendRKIFetcher.storedData.length) * 10) / 10
    }

    static findSafestAreas() {
        return BackendRKIFetcher.storedData.sort(function(a,b) { return a.properties.cases7_per_100k - b.properties.cases7_per_100k }).slice(0,5);
    }

    static URLToLandkreis(landkreis) {
        let result = "";
        for(let i = 1; i < landkreis.split("#").length; i++) {
          result += String.fromCharCode(landkreis.split("#")[i]);
        }
      
      return result;
    }

    getAPIUrl() {
        return BackendRKIFetcher.api;
    }
}
