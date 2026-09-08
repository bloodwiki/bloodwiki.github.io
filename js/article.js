document.addEventListener(
    "DOMContentLoaded",
    loadArticle
);


async function loadArticle() {

    const params =
        new URLSearchParams(
            location.search
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
            article.title +
            " - ○○ Wiki";


        /*
        ================================
        基本情報
        ================================
        */

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
            article.summary || "";


        document
            .getElementById("updated")
            .textContent =
            article.updated || "-";


        /*
        ================================
        パンくず
        ================================
        */

        document
            .getElementById(
                "breadcrumb-category"
            )
            .textContent =
            article.category;


        document
            .getElementById(
                "breadcrumb-title"
            )
            .textContent =
            article.title;


        /*
        ================================
        HTML本文
        ================================
        */

        const content =
            document.getElementById(
                "content"
            );


        content.innerHTML =
            article.html;


        /*
        ================================
        目次生成
        ================================
        */

        generateTOC(
            content
        );


    } catch (error) {

        console.error(error);

        showError(
            "記事の読み込みに失敗しました。"
        );

    }

}


/*
========================================
目次生成
========================================
*/

function generateTOC(content) {

    const toc =
        document.getElementById(
            "toc"
        );


    const headings =
        content.querySelectorAll(
            "h2, h3"
        );


    toc.innerHTML = "";


    if (headings.length === 0) {

        toc.innerHTML =
            `<div class="toc-empty">
                見出しなし
            </div>`;

        return;

    }


    headings.forEach(
        (heading, index) => {

            const id =
                "heading-" + index;


            heading.id = id;


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                "#" + id;


            link.textContent =
                heading.textContent;


            if (
                heading.tagName === "H3"
            ) {

                link.className =
                    "toc-h3";

            }


            toc.appendChild(link);

        }
    );

}


/*
========================================
エラー
========================================
*/

function showError(message) {

    document.body.innerHTML = `

        <main style="
            max-width:700px;
            margin:100px auto;
            padding:30px;
            text-align:center;
        ">

            <h1>
                記事を表示できません
            </h1>

            <p>
                ${escapeHtml(message)}
            </p>

            <a href="index.html">
                ← ホームへ戻る
            </a>

        </main>

    `;

}


function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text ?? "";

    return div.innerHTML;

}
