class QueryResultRenderer {

    imageURL;
    city;
    data;
    renderTarget;
    cards = document.querySelectorAll(".card");


    constructor(renderTarget) {
        this.renderTarget = renderTarget;

        this.addClickToCloseButtons();

        if(!this.renderTarget) {
            console.warn("No RKITarget found. Please add id=\"RKITarget\" to any object to be able to display the results.");
            document.body.insertAdjacentHTML("beforeend", "<button class=\"btn btn-danger\" type=\"button\">You have to annotate any object with id=\"#RKITarget\" !</button>");
        }
    }

    hideRenderTarget() {
        this.renderTarget.style.display = "none";
    }

    showRenderTarget() {
        this.renderTarget.style.display = "block";
        document.querySelector("#apiReturnTitle").style.display = "block";

        this.renderTarget.innerHTML = JSON.stringify(this.data);
        this.renderTarget.rows = Math.floor(this.renderTarget.innerHTML.length / this.renderTarget.cols + 5);
        
        this.cards.forEach(card => card.style.display = "block");

        document.querySelector("#shareAndAPI").style.display = "block";
    }

    addClickToCloseButtons() {
        document.querySelectorAll(".close-card").forEach(button => button.addEventListener("click", function(e) {
            e.preventDefault();
            e.target.parentNode.parentNode.parentNode.style.display = "none";
        }))
    }

    render(imageData, city, data) {
        // Refresh fields for faster UI reloads.
        this.imageURL = imageData.url;
        this.city = city;
        this.data = data;

        //
        document.querySelector("#landkreisImage").src = this.imageURL;
        document.querySelector("#landkreisTitle").innerHTML = "Zeige Corona-Statistiken des RKI an für " + city;

        document.querySelector("#imageLabel").innerHTML = [imageData.user, imageData.page].join(", ");
        document.querySelector("#imageLabel").style.display = "block";

        document.body.style.background = "url(" + this.imageURL + ")";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundAttachment = "fixed";

        document.querySelector("#landkreisResultName").innerHTML = city;
        document.querySelector("#landkreisResultAnnotation").innerHTML = data.BEZ;
        document.querySelector("#landkreisResultState").innerHTML = data.BL;
        document.querySelector("#landkreisResultPopulation").innerHTML = "Einwohnerzahl: " + data.EWZ;

        document.querySelector("#last7cases").innerHTML = "Fälle: " + data.cases7_lk;
        document.querySelector("#last7cases100k").innerHTML = "Inzidenz: " + data.cases7_per_100k_txt;
        document.querySelector("#last7deaths").innerHTML = "Todesfälle: " + data.death7_lk;


        document.querySelector("#totalcases").innerHTML = "Fälle: " + data.cases;
        document.querySelector("#totalcases100k").innerHTML = "Todesfälle: " + data.deaths;
        document.querySelector("#totaldeaths").innerHTML = "Überlebensrate: " +  (Number.parseInt((100 - data.death_rate) * 100) / 100) + "%" ;
        document.querySelector("#showAfterwards").style.display = "block";
        
    }

    async updateNeighbours(neighbours) {
        const neighboursHook = document.querySelector("#neighbours");

        document.querySelectorAll(".neighbour").forEach(neighbour => neighbour.remove());

        let pictures = [];

        for(let i = 0; i < neighbours.length; i++) {
            let pic = await LandkreisPictureQuery.requestPictureFromAPI(new LandkreisPictureQuery(neighbours[i].properties.GEN));
            pictures.push(pic);
        }

        let iterator = 0;

        neighbours.forEach(neighbour => {

            let picture = pictures[iterator++];

            neighboursHook.insertAdjacentHTML(
                "beforeend", 
                "<div class=\"card neighbour\" onclick=\"update(\'" + neighbour.properties.GEN + "\')\">\
                <img class=\"card-img-top\" src=\"" + picture.url + "\">\
                <div class=\"card-body\">\
                    <h4 class=\"card-title\">" + neighbour.properties.GEN + "</h4>\
                    <p class=\"card-text\">" + neighbour.properties.cases7_per_100k_txt + "</p>\
                </div>\
            </div>"
            );
        });
    }

    static async updateHotSpots(hotspots) {
        const hotspotsHook = document.querySelector("#hotspots");

        document.querySelectorAll(".hotspot").forEach(hotspot => hotspot.remove());

        let pictures = [];

        for(let i = 0; i < hotspots.length; i++) {
            let pic = await LandkreisPictureQuery.requestPictureFromAPI(new LandkreisPictureQuery(hotspots[i].properties.GEN));
            pictures.push(pic);
        }

        let iterator = 0;

        hotspots.forEach(hotspot => {

            let picture = pictures[iterator++];

            hotspotsHook.insertAdjacentHTML(
                "beforeend", 
                "<div class=\"card hotspot\" onclick=\"update(\'" + hotspot.properties.GEN + "\')\">\
                <img class=\"card-img-top\" src=\"" + picture.url + "\">\
                <div class=\"card-body\">\
                    <h4 class=\"card-title\">" + hotspot.properties.GEN + "</h4>\
                    <p class=\"card-text\">" + hotspot.properties.cases7_per_100k_txt + "</p>\
                </div>\
            </div>"
            );
        });
    }

    static showCountryStatistics() {
        document.querySelector("#countryIncidency").innerHTML = "Inzidenz: " + RKIFetcher.incidency;
        document.querySelector("#countryCases").innerHTML = "Fälle: " + RKIFetcher.totalCases;
        document.querySelector("#countryDeaths").innerHTML = "Todesfälle: " + RKIFetcher.totalDeaths;
        document.querySelector("#countrySurvivalRate").innerHTML = "Überlebensrate: " + RKIFetcher.survivalRate + '%';
        document.querySelector("#countryCard").style.display = "block";
    }

    static async updateSafest(safest) {
        const safestHook = document.querySelector("#safest");

        document.querySelectorAll(".safe").forEach(safe => safe.remove());

        let pictures = [];

        for(let i = 0; i < safest.length; i++) {
            let pic = await LandkreisPictureQuery.requestPictureFromAPI(new LandkreisPictureQuery(safest[i].properties.GEN));
            pictures.push(pic);
        }

        let iterator = 0;

        safest.forEach(safe => {

            let picture = pictures[iterator++];

            safestHook.insertAdjacentHTML(
                "beforeend", 
                "<div class=\"card safe\" onclick=\"update(\'" + safe.properties.GEN + "\')\">\
                <img class=\"card-img-top\" src=\"" + picture.url + "\">\
                <div class=\"card-body\">\
                    <h4 class=\"card-title\">" + safe.properties.GEN + "</h4>\
                    <p class=\"card-text\">" + safe.properties.cases7_per_100k_txt + "</p>\
                </div>\
            </div>"
            );
        });
    }
}

const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next)

function update(data) {

    if(!window.location.href.includes('?')) {
        window.location.href = window.location.href.split("?")[0] + "?share=" + RKIFetcher.landkreisToURL(data);
        return;
    }
    
    window.location.href = window.location.href.split("?")[0] + "?share=" + RKIFetcher.landkreisToURL(data);
    window.location.reload();
}