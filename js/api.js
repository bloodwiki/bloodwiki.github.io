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
記事一覧キャッシュ

HTML本文は含まれないので、
かなり軽量。
*/
const CACHE_TIME =
    24 * 60 * 60 * 1000;


/*
記事本文キャッシュ

記事ごとに保存する。
*/
const ARTICLE_CACHE_TIME =
    24 * 60 * 60 * 1000;


/*
バージョン情報は短時間だけ保持。
*/
const VERSION_CACHE_TIME =
    5 * 60 * 1000;


/*
========================================
キャッシュキー
========================================
*/

const CACHE_KEYS = {

    articles:
        "wiki_cache_articles",

    version:
        "wiki_cache_version"

};


/*
========================================
記事一覧
========================================

HTML本文は取得しない。

記事一覧・カテゴリ一覧などで使用。

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
                CACHE_KEYS.articles,
                CACHE_TIME
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
        "記事: GASから一覧取得"
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
個別記事
========================================

重要：

記事一覧APIにはHTML本文がないため、
ここでは action=article を直接呼ぶ。

========================================
*/

async function getArticle(
    id,
    options = {}
) {

    if (!id) {

        return {

            success: false,

            error:
                "記事IDが指定されていません"

        };

    }


    const force =
        options.force === true;


    /*
    ------------------------------------
    記事本文キャッシュ
    ------------------------------------
    */

    const cacheKey =
        getArticleCacheKey(id);


    if (!force) {

        const cached =
            getCache(
                cacheKey,
                ARTICLE_CACHE_TIME
            );


        if (cached) {

            console.log(
                "記事: キャッシュを使用",
                id
            );

            return cached;

        }

    }


    /*
    ------------------------------------
    GASから個別記事取得
    ------------------------------------
    */

    console.log(
        "記事: GASから本文取得",
        id
    );


    const response =
        await fetch(

            API_URL +
            "?action=article&id=" +
            encodeURIComponent(id)

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

        return data;

    }


    /*
    ------------------------------------
    記事本文キャッシュ
    ------------------------------------
    */

    setCache(
        cacheKey,
        data
    );


    console.log(
        "記事: GASから取得完了",
        id
    );


    return data;

}


/*
========================================
記事キャッシュキー生成
========================================
*/

function getArticleCacheKey(id) {

    /*
    IDをそのままlocalStorageのキーに
    すると特殊文字などで問題になる可能性が
    あるためencodeURIComponentする。
    */

    return (
        "wiki_cache_article_" +
        encodeURIComponent(
            String(id)
        )
    );

}


/*
========================================
最新バージョン確認
========================================

GASへの通信は非常に軽量。

記事全件を取得する前に、
更新があるかだけ確認する。

========================================
*/

async function getVersion() {

    console.log(
        "バージョン: GASへ確認"
    );


    const response =
        await fetch(
            API_URL +
            "?action=version&_=",
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Version API request failed: " +
            response.status
        );

    }


    const data =
        await response.json();


    if (!data.success) {

        throw new Error(
            data.error ||
            "Version API error"
        );

    }


    console.log(
        "バージョン:",
        data.version
    );


    return data;

}


/*
========================================
最新データ確認
========================================

現在のキャッシュとGASのバージョンを比較。

変更がなければ記事全件を
再取得しない。

========================================
*/

async function checkForUpdates() {

    /*
    ------------------------------------
    現在のローカルデータ
    ------------------------------------
    */

    const localData =
        getCache(
            CACHE_KEYS.articles,
            CACHE_TIME
        );


    /*
    ------------------------------------
    GASの最新バージョン
    ------------------------------------
    */

    const remoteData =
        await getVersion();


    /*
    ------------------------------------
    ローカルにデータがない
    ------------------------------------
    */

    if (!localData) {

        console.log(
            "更新確認: ローカルデータなし"
        );

        return {

            updated: true,

            version:
                remoteData.version

        };

    }


    /*
    ------------------------------------
    ローカルバージョン
    ------------------------------------
    */

    const localVersion =
        getLocalVersion();


    /*
    ------------------------------------
    比較
    ------------------------------------
    */

    if (
        String(localVersion)
        ===
        String(remoteData.version)
    ) {

        console.log(
            "更新確認: 最新です",
            remoteData.version
        );


        return {

            updated: false,

            version:
                remoteData.version

        };

    }


    console.log(
        "更新確認: 新しいデータがあります",
        localVersion,
        "→",
        remoteData.version
    );


    return {

        updated: true,

        version:
            remoteData.version

    };

}


/*
========================================
最新データへ更新
========================================

変更がある場合だけ
記事一覧を再取得する。

========================================
*/

async function updateToLatest() {

    console.log(
        "Wiki: 最新データを確認"
    );


    const status =
        await checkForUpdates();


    /*
    ------------------------------------
    最新なら何もしない
    ------------------------------------
    */

    if (!status.updated) {

        console.log(
            "Wiki: すでに最新です"
        );

        return await getArticles();

    }


    /*
    ------------------------------------
    記事一覧を再取得
    ------------------------------------
    */

    console.log(
        "Wiki: 最新データを取得"
    );


    const data =
        await getArticles({
            force: true
        });


    /*
    ------------------------------------
    バージョンを保存
    ------------------------------------
    */

    saveLocalVersion(
        status.version
    );


    return data;

}


/*
========================================
強制更新
========================================

ユーザーが
「最新データに更新」
などを押したときに使用。

========================================
*/

async function forceRefresh() {

    console.log(
        "Wiki: 強制更新開始"
    );


    /*
    ------------------------------------
    Wiki関連キャッシュ削除
    ------------------------------------
    */

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

            keys.push(key);

        }

    }


    keys.forEach(
        key =>
            localStorage.removeItem(key)
    );


    /*
    ------------------------------------
    最新バージョン取得
    ------------------------------------
    */

    const versionData =
        await getVersion({
            force: true
        });


    /*
    ------------------------------------
    記事一覧取得
    ------------------------------------
    */

    const articles =
        await getArticles({
            force: true
        });


    /*
    ------------------------------------
    バージョン保存
    ------------------------------------
    */

    saveLocalVersion(
        versionData.version
    );


    /*
    ------------------------------------
    完了
    ------------------------------------
    */

    console.log(
        "Wiki: 強制更新完了",
        versionData.version
    );


    return articles;

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
    key,
    maxAge = CACHE_TIME
) {

    try {

        const raw =
            localStorage.getItem(key);


        if (!raw) {

            return null;

        }


        const record =
            JSON.parse(raw);


        if (
            !record ||
            !record.savedAt ||
            record.data === undefined
        ) {

            localStorage.removeItem(
                key
            );

            return null;

        }


        /*
        --------------------------------
        有効期限
        --------------------------------
        */

        const age =
            Date.now()
            -
            record.savedAt;


        if (
            age >= maxAge
        ) {

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
ローカルバージョン取得
========================================
*/

function getLocalVersion() {

    try {

        return localStorage.getItem(
            "wiki_data_version"
        );

    } catch (error) {

        return null;

    }

}


/*
========================================
ローカルバージョン保存
========================================
*/

function saveLocalVersion(
    version
) {

    try {

        localStorage.setItem(

            "wiki_data_version",

            String(version)

        );

    } catch (error) {

        console.warn(
            "バージョン保存失敗:",
            error
        );

    }

}
