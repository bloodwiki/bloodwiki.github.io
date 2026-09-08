const API_URL =
    "https://script.google.com/macros/s/AKfycby2sOYs5HFKri8CvWygsreNtsCqVXRgZLV0aNfNvlTxKiK9p-E7Z4bMieKJ-P9xr_p74w/exec";


async function getArticle(id) {

    const url =
        API_URL +
        "?action=article&id=" +
        encodeURIComponent(id);

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "API request failed"
        );

    }

    return await response.json();

}


async function getArticles() {

    const url =
        API_URL +
        "?action=articles";

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            "API request failed"
        );

    }

    return await response.json();

}
