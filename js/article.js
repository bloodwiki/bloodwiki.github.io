document.addEventListener(
    "DOMContentLoaded",
    loadArticle
);


async function loadArticle() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");


    if (!id) {

        showError(
            "記事IDが指定されていません。"
        );

        return;

    }


    try {

        const result =
            await getArticle(id);


        if (!result.success) {

            showError(
                result.error ||
                "記事が見つかりません。"
            );

            return;

        }


        const article =
            result.article;


        document.title =
            article.title + " - Wiki";


        document
            .getElementById("category")
            .textContent =
            article.category;


        document
            .getElementById("title")
            .textContent =
            article.title;


        document
            .getElementById("summary")
            .textContent =
            article.summary;


        document
            .getElementById("content")
            .innerHTML =
            article.html;


        document
            .getElementById("updated")
            .textContent =
            "最終更新: " +
            article.updated;


        document
            .getElementById("loading")
            .hidden =
            true;


        document
            .getElementById("article")
            .hidden =
            false;


    } catch (error) {

        console.error(error);

        showError(
            "記事の読み込みに失敗しました。"
        );

    }

}


function showError(message) {

    document
        .getElementById("loading")
        .hidden =
        true;


    const error =
        document.getElementById("error");


    error.textContent =
        message;

    error.hidden =
        false;

}
