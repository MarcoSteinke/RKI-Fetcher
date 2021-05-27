// TODO: Add visual output!

class RKIFetcher {

    /*private String*/ #api = "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson";
    /*private String*/ #city;
    /*List(Feature)*/ data;
    /*private LandkreisPictureQuery*/; #landkreisPictureQuery;
    /*private QueryResultRenderer*/ #queryResultRenderer;
    #cards = document.querySelectorAll(".card");

    constructor(city) {
        if(city) {
            this.#city = city;
        }
        document.querySelector("#landkreis").addEventListener("click", function(e) {
            e.target.value = "";
            e.target.click();
        })
        this.#landkreisPictureQuery = new LandkreisPictureQuery(city);
        this.#cards.forEach(card => card.style.display = "none");
        this.#queryResultRenderer = new QueryResultRenderer(document.querySelector("#RKITarget"));
        this.#queryResultRenderer.hideRenderTarget();
    }

    async getAllLandkreise() {
        const landkreise = [];
        await fetch(this.#api).then(res => res.json()).then(json => json.features.forEach(feature => landkreise.push(feature.properties.GEN)));

        return landkreise;
    }

    async getInformation() {
        await fetch(this.#api).then(res => res.json()).then(json => json.features.forEach(feature => {
          if(feature.properties.GEN == this.#city) {
            this.data = feature;
          }
        }))
    }

    async displayResult() {
        if(!this.data) await this.getInformation();
        const imageData = await LandkreisPictureQuery.requestPictureFromAPI(this.#landkreisPictureQuery);

        this.#queryResultRenderer.render(imageData, this.#city, this.data.properties);
        this.#queryResultRenderer.showRenderTarget();
    }

    static createRKIFetcherForLandkreis(landkreis) {
        return new RKIFetcher(landkreis);
    }

    getAPIUrl() {
        return this.#api;
    }
}

let landkreise = [];
        

async function waitForLandkreise() {
    landkreise = await new RKIFetcher().getAllLandkreise();
    console.log(landkreise);

    landkreise.forEach(landkreis => {
        document.querySelector("#landkreise").insertAdjacentHTML("beforeend", "<option value=\"" + landkreis + "\">");
    })
}