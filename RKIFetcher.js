class RKIFetcher {

    #api = "https://opendata.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0.geojson";
    #city;
    #renderTarget = document.querySelector("#RKITarget");
    data;

    constructor(city) {
        if(city) {
            this.#city = city;
        }
        if(!this.#renderTarget) {
            console.warn("No RKITarget found. Please add id=\"RKITarget\" to any object to be able to display the results.");
            document.body.insertAdjacentHTML("beforeend", "<button class=\"btn btn-danger\" type=\"button\">You have to annotate any object with id=\"#RKITarget\" !</button>");
        }
        this.hideRenderTarget();
    }

    hideRenderTarget() {
        this.#renderTarget.style.display = "none";
    }

    showRenderTarget() {
        this.#renderTarget.style.display = "block";
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
        this.#renderTarget.innerHTML = JSON.stringify(this.data.properties);
        this.#renderTarget.rows = Math.floor(this.#renderTarget.innerHTML.length / this.#renderTarget.cols + 5);
        this.showRenderTarget();
    }
}