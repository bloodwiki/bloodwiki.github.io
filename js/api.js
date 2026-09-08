/*
========================================
API設定
========================================
*/

const API_URL =
    "ここにGASのウェブアプリURL";


const CACHE_TIME =
    24 * 60 * 60 * 1000;


/*
========================================
キャッシュ
========================================
*/

const CACHE_KEYS = {

    articles:
        "wiki_cache_articles",

    articlePrefix:
        "wiki_cache_article_",

    time:
        "wiki_cache_time"

};


/*
========================================
記事一覧
========================================
*/

async function getArticles(options = {}) {

    const force =
        options.force === true;


    /*
    キャッシュ確認
    */

    if (!force) {

        const cached =
            getCache(
                CACHE_KEYS.articles
            );

        if (cached) {

            console.log(
                "記事一覧: キャッシュを使用"
            );

            return cached;

        }

    }


    /*
    GASから取得
    */

    console.log(
        "記事一覧: GASから取得"
    );


    const response =
        await fetch(
            API_URL +
            "?action=articles"
        );


    if (!response.ok) {

        throw new Error(
            "API request failed"
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


    /*
    保存
    */

    setCache(
        CACHE_KEYS.articles,
        data
    );


    return data;

}


/*
========================================
記事
========================================
*/

async function getArticle(
    id,
    options = {}
) {

    const force =
        options.force === true;


    const cacheKey =
        CACHE_KEYS.articlePrefix +
        id;


    /*
    キャッシュ
    */

    if (!force) {

        const cached =
            getCache(cacheKey);

        if (cached) {

            console.log(
                "記事: キャッシュを使用"
            );

            return cached;

        }

    }


    /*
    API
    */

    const response =
        await fetch(
            API_URL +
            "?action=article&id=" +
            encodeURIComponent(id)
        );


    if (!response.ok) {

        throw new Error(
            "API request failed"
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


    setCache(
        cacheKey,
        data
    );


    return data;

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

function getCache(key) {

    try {

        const raw =
            localStorage.getItem(key);


        if (!raw)
            return null;


        const record =
            JSON.parse(raw);


        if (
            !record ||
            !record.savedAt ||
            !record.data
        ) {

            localStorage.removeItem(key);

            return null;

        }


        const age =
            Date.now() -
            record.savedAt;


        /*
        24時間以上経過
        */

        if (
            age >= CACHE_TIME
        ) {

            localStorage.removeItem(key);

            return null;

        }


        return record.data;

    } catch (error) {

        console.warn(
            "キャッシュ読み込み失敗:",
            error
        );

        localStorage.removeItem(key);

        return null;

    }

}


/*
========================================
キャッシュ削除
========================================
*/

async function forceRefresh() {

    console.log(
        "Wikiキャッシュを削除"
    );


    /*
    Wiki関連のキャッシュだけ削除
    */

    const keys = [];

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);

        if (!key) continue;


        if (
            key.startsWith(
                "wiki_cache_"
            )
        ) {

            keys.push(key);

        }

    }


    keys.forEach(
        key =>
            localStorage.removeItem(key)
    );


    /*
    次回アクセスでは
    必ずGASから取得される
    */

    return true;

}
