// TODO: Add visual output!

class RKIFetcher {

    /*private String*/ static api = "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson";
    /*private String*/ city;
    /*List(Feature)*/ data = null;
    /*private LandkreisPictureQuery*/; landkreisPictureQuery;
    /*private QueryResultRenderer*/ queryResultRenderer;
    static incidency;
    static totalCases;
    static totalDeaths;
    static survivalRate;
    static storedData = [];
    cards = document.querySelectorAll(".card");

    constructor(city) {
        if(city) {
            this.city = city;
        }

        this.landkreisPictureQuery = new LandkreisPictureQuery(city);
    }



    async getAllLandkreise() {
        const landkreise = [];
        await fetch(RKIFetcher.api).then(res => res.json()).then(json => json.features.forEach(feature => landkreise.push(feature.properties.GEN)));

        return landkreise;
    }

    static calculateIncidency() {
        RKIFetcher.incidency = Number.parseInt((RKIFetcher.storedData.map(landkreis => landkreis.properties.cases7_per_100k).reduce((a,b) => a+b) / RKIFetcher.storedData.length) * 10) / 10
    }
    
    static async getAllLandkreiseAsObjects() {
        if(RKIFetcher.storedData.length < 1) {
            await fetch(RKIFetcher.api)
                .then(res => res.json())
                .then(json => json.features.forEach(feature => this.storedData.push(feature)));
        }

        RKIFetcher.calculateIncidency();
        RKIFetcher.totalCases = RKIFetcher.calculateTotalCases();
        RKIFetcher.totalDeaths = RKIFetcher.calculateTotalDeaths();
        RKIFetcher.survivalRate = RKIFetcher.calculateAverageSurvivalRate();
    }

    async getInformation() {
        await fetch(RKIFetcher.api).then(res => res.json()).then(json => json.features.forEach(feature => {
          if(feature.properties.GEN == this.city) {
            this.data = feature;
            console.log(this.data);
            window.location.href = window.location.href.split("?")[0] + "?share=" + RKIFetcher.landkreisToURL(feature.properties.GEN);
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
        return RKIFetcher.storedData.sort(function(a,b) { return b.properties.cases7_per_100k - a.properties.cases7_per_100k }).slice(0,5);
    }

    static calculateTotalCases() {
        return RKIFetcher.storedData.map(landkreis => landkreis.properties.cases).reduce((a,b) => a+b)
    }

    static calculateTotalDeaths() {
        return RKIFetcher.storedData.map(landkreis => landkreis.properties.deaths).reduce((a,b) => a+b)
    }

    static calculateAverageSurvivalRate() {
        return Number.parseInt((RKIFetcher.storedData.map(landkreis => (Number.parseInt((100 - landkreis.properties.death_rate) * 100) / 100)).reduce((a,b) => a+b) / RKIFetcher.storedData.length) * 10) / 10
    }

    static findSafestAreas() {
        return RKIFetcher.storedData.sort(function(a,b) { return a.properties.cases7_per_100k - b.properties.cases7_per_100k }).slice(0,5);
    }

    static URLToLandkreis(landkreis) {
        let result = "";
        for(let i = 1; i < landkreis.split("#").length; i++) {
          result += String.fromCharCode(landkreis.split("#")[i]);
        }
      
      return result;
    }

    getAPIUrl() {
        return RKIFetcher.api;
    }
}

let landkreise = [];

RKIFetcher.getAllLandkreiseAsObjects();