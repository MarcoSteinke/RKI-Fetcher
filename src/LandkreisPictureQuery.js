class LandkreisPictureQuery {

    /*String*/ landkreis;
    /*String*/ static apiRequestURL = "https://pixabay.com/api/";
    /*String (devToken)*/ static apiRequestToken = "18455198-2cc93b5bfbf3e988d656de091";

    constructor(landkreis) {
        this.landkreis = landkreis;
    }

    static async requestPictureFromAPI(query) {
        let result = null;
        await fetch([this.apiRequestURL, ["key=" + this.apiRequestToken, "q=" + query.landkreis].join("&")].join("?"))
            .then(res => res.json())
            .then(json => result = (json.totalHits > 0) ? json.hits : null);

        
        if(!result) {
            console.log("Default picture presented by FotoArt-Treu, https://pixabay.com/photos/field-coupling-nature-meadow-4193125/");
            return {url: "https://pixabay.com/get/g1967f234e2261c69cb19697486a0be30c7cd18a6dc560eb449df528c6607f3ad2db3ff524da07b82da5fd511df655a5c72fd915c3cb43fe7d15a9650910295bd_640.jpg", user: "FotoArt-Treu", page: "https:"};
        }


        let random = Math.floor(Math.random() * result.length);
        return result != null ? {url: result[random].webformatURL, user: result[random].user, page: result[random].pageURL} : null;
    }
}