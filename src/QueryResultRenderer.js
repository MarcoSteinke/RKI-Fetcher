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
        document.querySelector("#landkreisTitle").innerHTML = "Zeige Corona-Statistiken vom RKI an für " + city;

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
        
    }
}