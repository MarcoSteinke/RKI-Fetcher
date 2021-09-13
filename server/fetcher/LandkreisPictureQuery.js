class LandkreisPictureQuery {

    /*String*/ landkreis;
    /*String*/ static apiRequestURL = "https://pixabay.com/api/";
    /*String */ static apiRequestToken = "18455198-2cc93b5bfbf3e988d656de091";

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
            return {url: "https://pixabay.com/get/gb91ce1bdc71e347e210d8d34d33127f5da2a18d00b87e195d3a29e461827013204db69cd9f8ec5348cd6f0b049bc32cd648ed79fcf9bdd1d42dd74ab8e7a0146_640.jpg", user: "scholty1970", page: "https://pixabay.com/photos/l%C3%BCbeck-holsten-gate-landmark-4081324/"};
        }


        let random = Math.floor(Math.random() * result.length);
        return result != null ? {url: result[random].webformatURL, user: result[random].user, page: result[random].pageURL} : null;
    }
}

module.exports = LandkreisPictureQuery;