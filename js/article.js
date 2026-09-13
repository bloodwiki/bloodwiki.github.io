document.addEventListener(
    "DOMContentLoaded",
    loadArticle
);


/*
========================================
カテゴリ
========================================
*/

const categorySlugs = {

    "敵": "enemy",

    "ボス": "boss",

    "釣り": "fishing",

    "武器": "weapon",

    "防具": "armor",

    "アクセサリー": "accessory",

    "アイテム": "item",

    "NPC": "npc",

    "エリア": "biome",

    "攻略": "guide"

};


/*
========================================
記事読み込み
========================================
*/

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
            " - BLOOD Wiki";


        /*
        ================================
        基本情報
        ================================
        */


        /*
        カテゴリ
        */

        document
            .getElementById("category")
            .textContent =
            article.category;


        /*
        サブカテゴリー
        */

        const subCategoryElement =
            document.getElementById(
                "subcategory"
            );


        const subCategory =
            String(
                article.subCategory || ""
            ).trim();


        if (subCategory) {

            subCategoryElement.textContent =
                subCategory;

        } else {

            subCategoryElement.textContent =
                "";

        }


        /*
        タイトル
        */

        document
            .getElementById("title")
            .textContent =
            article.title;


        /*
        概要
        */

        document
            .getElementById("summary")
            .textContent =
            article.summary || "";


        /*
        更新日
        */

        document
            .getElementById("updated")
            .textContent =
            article.updated || "-";


        /*
        ================================
        パンくず
        ================================
        */

        const categoryBreadcrumb =
            document.getElementById(
                "breadcrumb-category"
            );


        const category =
            article.category;


        const slug =
            categorySlugs[category];


        /*
        カテゴリ
        */

        if (slug) {

            const link =
                document.createElement(
                    "a"
                );


            link.href =
                "category.html?category=" +
                encodeURIComponent(
                    slug
                );


            link.textContent =
                category;


            categoryBreadcrumb.replaceWith(
                link
            );

        } else {

            categoryBreadcrumb.textContent =
                category;

        }


        /*
        ================================
        サブカテゴリーのパンくず
        ================================
        */

        if (
            subCategory &&
            slug
        ) {

            const breadcrumbs =
                document.getElementById(
                    "breadcrumbs"
                );


            const titleBreadcrumb =
                document.getElementById(
                    "breadcrumb-title"
                );


            /*
            区切り
            */

            const separator =
                document.createElement(
                    "span"
                );


            separator.textContent =
                "/";


            /*
            サブカテゴリー
            */

            const subCategoryLink =
                document.createElement(
                    "a"
                );


            subCategoryLink.href =
                "category.html?category=" +
                encodeURIComponent(
                    slug
                ) +
                "&subcategory=" +
                encodeURIComponent(
                    subCategory
                );


            subCategoryLink.textContent =
                subCategory;


            /*
            タイトルの前に追加
            */

            breadcrumbs.insertBefore(
                separator,
                titleBreadcrumb
            );


            breadcrumbs.insertBefore(
                subCategoryLink,
                titleBreadcrumb
            );

        }


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

function generateTOC(
    content
) {

    const toc =
        document.getElementById(
            "toc"
        );


    const headings =
        content.querySelectorAll(
            "h2, h3"
        );


    toc.innerHTML = "";


    if (
        headings.length === 0
    ) {

        toc.innerHTML =
            `<div class="toc-empty">
                見出しなし
            </div>`;

        return;

    }


    headings.forEach(
        (
            heading,
            index
        ) => {

            const id =
                "heading-" +
                index;


            heading.id =
                id;


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


            toc.appendChild(
                link
            );

        }
    );

}


/*
========================================
エラー
========================================
*/

function showError(
    message
) {

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


/*
========================================
HTMLエスケープ
========================================
*/

function escapeHtml(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text ?? "";


    return div.innerHTML;

}
