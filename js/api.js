```javascript
/*
========================================
API設定
========================================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycby2sOYs5HFKri8CvWygsreNtsCqVXRgZLV0aNfNvlTxKiK9p-E7Z4bMieKJ-P9xr_p74w/exec";


/*
========================================
キャッシュ設定
========================================
*/

/*
通常時のキャッシュ時間

24時間
*/

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

GAS:
?action=articles

返ってくるデータ：

{
    id,
    title,
    category,
    subCategory,
    summary,
    html,
    updated
}

========================================
*/

async function getArticles(options = {}) {

    const force =
        options.force === true;


    /*
    ========================================
    キャッシュ確認
    ========================================
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
    ========================================
    GASから取得
    ========================================
    */

    console.log(
        "記事: GASから取得"
    );


    const response =
        await fetch(
            API_URL +
            "?action=articles"
        );


    /*
    ========================================
    HTTPエラー
    ========================================
    */

    if (!response.ok) {

        throw new Error(
            "API request failed: " +
            response.status
        );

    }


    /*
    ========================================
    JSON
    ========================================
    */

    const data =
        await response.json();


    /*
    ========================================
    APIエラー
    ========================================
    */

    if (!data.success) {

        throw new Error(
            data.error ||
            "API error"
        );

    }


    /*
    ========================================
    データ確認
    ========================================
    */

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
    ========================================
    サブカテゴリーを正規化
    ========================================

    code.gsから

    subCategory

    が返ってくる。

    空の場合も必ず文字列にする。
    ========================================
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
    ========================================
    キャッシュ保存
    ========================================
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

現在は記事一覧キャッシュから検索する。

そのため、

・高速
・追加通信なし

というメリットがある。

========================================
*/

async function getArticle(
    id,
    options = {}
) {

    /*
    ========================================
    全記事取得
    ========================================
    */

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


    /*
    ========================================
    記事検索
    ========================================
    */

    const article =
        result.articles.find(
            item =>
                String(item.id) ===
                String(id)
        );


    /*
    ========================================
    見つからない
    ========================================
    */

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

            JSON.stringify(
                record
            )

        );


        /*
        共通キャッシュ時刻
        */

        localStorage.setItem(

            CACHE_KEYS.time,

            String(
                Date.now()
            )

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
            JSON.parse(
                raw
            );


        /*
        ====================================
        壊れたキャッシュ
        ====================================
        */

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


        /*
        ====================================
        有効期限
        ====================================
        */

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


    /*
    ========================================
    Wiki関連キーを検索
    ========================================
    */

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(
                i
            );


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


    /*
    ========================================
    削除
    ========================================
    */

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

「最新データに更新」用。

既存キャッシュを削除してから
GASから最新データを取得する。

========================================
*/

async function forceRefresh() {

    console.log(
        "Wiki: 最新データを取得"
    );


    /*
    ========================================
    1. キャッシュ削除
    ========================================
    */

    clearWikiCache();


    /*
    ========================================
    2. 最新データ取得
    ========================================
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
```
