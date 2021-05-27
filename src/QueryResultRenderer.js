class QueryResultRenderer {

    imageURL;
    city;
    data;
    renderTarget;
    cards = document.querySelectorAll(".card");

    constructor(renderTarget) {
        this.renderTarget = renderTarget;

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
    }

    render(imageURL, city, data) {
        // Refresh fields for faster UI reloads.
        this.imageURL = imageURL;
        this.city = city;
        this.data = data;

        //
        document.querySelector("#landkreisImage").src = imageURL;
        document.querySelector("#landkreisTitle").innerHTML = "Show RKI-statistics for " + city;
    }
}