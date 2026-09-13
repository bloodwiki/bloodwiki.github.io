/*
========================================
API設定
========================================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycby2sOYs5HFKri8CvWygsreNtsCqVXRgZLV0aNfNvlTxKiK9p-E7Z4bMieKJ-P9xr_p74w/exec";


const CACHE_TIME =
    24 * 60 * 60 * 1000;


/*
========================================
キャッシュキー
========================================
*/

const CACHE_KEYS = {

    articles:
        "wiki_cache_articles",

    time:
        "wiki_cache_time"

};


/*
========================================
記事一覧取得
========================================
*/

async function getArticles(options = {}) {

    const force =
        options.force === true;


    /*
    ------------------------------------
    キャッシュ確認
    ------------------------------------
    */

    if (!force) {

        const cached =
            getCache(
                CACHE_KEYS.articles
            );


        if (cached) {

            console.log(
                "記事: キャッシュを使用"
            );

            return cached;

        }

    }


    /*
    ------------------------------------
    GASから取得
    ------------------------------------
    */

    console.log(
        "記事: GASから取得"
    );


    const response =
        await fetch(
            API_URL +
            "?action=articles"
        );


    if (!response.ok) {

        throw new Error(
            "API request failed: " +
            response.status
        );

    }


    const data =
        await response.json();


    if (!data.success) {

        throw new Error(
            data.error ||
            "API error"
        );

    }


    if (
        !Array.isArray(
            data.articles
        )
    ) {

        throw new Error(
            "記事データが正しくありません"
        );

    }


    /*
    ------------------------------------
    データを正規化
    ------------------------------------
    */

    data.articles =
        data.articles.map(
            article => {

                return {

                    ...article,

                    id:
                        String(
                            article.id ?? ""
                        ),

                    title:
                        String(
                            article.title ?? ""
                        ),

                    category:
                        String(
                            article.category ?? ""
                        ),

                    subCategory:
                        String(
                            article.subCategory ?? ""
                        ).trim(),

                    summary:
                        String(
                            article.summary ?? ""
                        ),

                    html:
                        String(
                            article.html ?? ""
                        ),

                    updated:
                        article.updated ?? ""

                };

            }
        );


    /*
    ------------------------------------
    キャッシュ保存
    ------------------------------------
    */

    setCache(
        CACHE_KEYS.articles,
        data
    );


    return data;

}


/*
========================================
個別記事取得
========================================
*/

async function getArticle(
    id,
    options = {}
) {

    const result =
        await getArticles(
            options
        );


    if (
        !result ||
        !result.success
    ) {

        throw new Error(
            "記事一覧の取得に失敗しました"
        );

    }


    const article =
        result.articles.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!article) {

        return {

            success: false,

            error:
                "Article not found"

        };

    }


    console.log(
        "記事: キャッシュから表示",
        id
    );


    return {

        success: true,

        article:
            article

    };

}


/*
========================================
キャッシュ保存
========================================
*/

function setCache(
    key,
    data
) {

    try {

        const record = {

            savedAt:
                Date.now(),

            data:
                data

        };


        localStorage.setItem(
            key,
            JSON.stringify(record)
        );


        localStorage.setItem(
            CACHE_KEYS.time,
            String(Date.now())
        );


    } catch (error) {

        console.warn(
            "キャッシュ保存失敗:",
            error
        );

    }

}


/*
========================================
キャッシュ取得
========================================
*/

function getCache(
    key
) {

    try {

        const raw =
            localStorage.getItem(
                key
            );


        if (!raw) {

            return null;

        }


        const record =
            JSON.parse(raw);


        if (
            !record ||
            !record.savedAt ||
            !record.data
        ) {

            localStorage.removeItem(
                key
            );

            return null;

        }


        const age =
            Date.now() -
            Number(
                record.savedAt
            );


        if (
            age >= CACHE_TIME
        ) {

            console.log(
                "記事: キャッシュ期限切れ"
            );


            localStorage.removeItem(
                key
            );

            return null;

        }


        return record.data;


    } catch (error) {

        console.warn(
            "キャッシュ読み込み失敗:",
            error
        );


        localStorage.removeItem(
            key
        );


        return null;

    }

}


/*
========================================
キャッシュ削除
========================================
*/

function clearWikiCache() {

    const keys = [];


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);


        if (!key) {

            continue;

        }


        if (
            key.startsWith(
                "wiki_cache_"
            )
        ) {

            keys.push(
                key
            );

        }

    }


    keys.forEach(
        key => {

            localStorage.removeItem(
                key
            );

        }
    );


    console.log(
        "Wikiキャッシュを削除しました"
    );

}


/*
========================================
キャッシュ強制更新
========================================
*/

async function forceRefresh() {

    console.log(
        "Wiki: 最新データを取得"
    );


    /*
    ------------------------------------
    キャッシュ削除
    ------------------------------------
    */

    clearWikiCache();


    /*
    ------------------------------------
    最新データ取得
    ------------------------------------
    */

    const data =
        await getArticles({

            force: true

        });


    console.log(
        "Wiki: 最新データ取得完了"
    );


    return data;

}
