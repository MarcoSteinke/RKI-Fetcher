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

    static URLToLandkreis(landkreis) {
        let result = "";
        for(let i = 1; i < landkreis.split("#").length; i++) {
          result += String.fromCharCode(landkreis.split("#")[i]);
        }
      
      return result;
    }

    async displayResult() {
        if(!this.data) await this.getInformation();
        const imageData = await LandkreisPictureQuery.requestPictureFromAPI(this.#landkreisPictureQuery);

        this.#queryResultRenderer.render(imageData, this.#city, this.data.properties);
        this.#queryResultRenderer.showRenderTarget();
    }

    static transformParameterToLandkreis() {
        return window.location.href
                .split("?")[1]
                .replace("share=", "")
                .split("&")[0]
                .replace("#1", "ä")
                .replace("#2", "Ä")
                .replace("#3", "ö")
                .replace("#4", "Ö")
                .replace("#5", "ü")
                .replace("#6", "Ü")
                .replace("#7", " ")
                .replace("#8", "-");
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