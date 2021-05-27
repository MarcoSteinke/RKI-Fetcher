class LandkreisPictureQuery {

    /*private String*/ #landkreis;
    /*private String*/ static #apiRequestURL = "https://pixabay.com/api/";
    /*private String (devToken)*/ static #apiRequestToken = "18455198-2cc93b5bfbf3e988d656de091";

    constructor(landkreis) {
        this.#landkreis = landkreis;
    }

    static async requestPictureFromAPI(query) {
        let result = null;
        await fetch([this.#apiRequestURL, ["key=" + this.#apiRequestToken, "q=" + query.#landkreis].join("&")].join("?"))
            .then(res => res.json())
            .then(json => result = (json.totalHits > 0) ? json.hits : null);


        let random = Math.floor(Math.random() * result.length);
        return result != null ? {url: result[random].webformatURL, user: result[random].user, page: result[random].pageURL} : null;
    }
}