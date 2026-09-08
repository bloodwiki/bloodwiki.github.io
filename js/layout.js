/*
========================================
共通レイアウト
========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    createHeader();
    createSidebar();
    setupLayoutEvents();
    setActiveSidebar();

});


/*
========================================
ヘッダー
========================================
*/

function createHeader() {

    const target = document.getElementById("site-header");

    if (!target) return;

    target.innerHTML = `

        <header class="header">

            <div class="header-inner">

                <a
                    href="index.html"
                    class="logo"
                >
                    <span class="logo-mark">W</span>

                    <span>
                        <strong>○○ Wiki</strong>
                        <small>Unofficial Wiki</small>
                    </span>
                </a>


                <div class="header-search">

                    <span class="search-icon">⌕</span>

                    <input
                        type="search"
                        id="global-search"
                        placeholder="Wikiを検索..."
                        autocomplete="off"
                    >

                    <div class="search-shortcut">
                        <kbd>Ctrl</kbd>
                        <kbd>K</kbd>
                    </div>

                </div>


                <div class="header-actions">

                    <button
                        class="icon-button"
                        id="menu-button"
                        aria-label="メニュー"
                    >
                        ☰
                    </button>

                </div>

            </div>

        </header>

    `;

}


/*
========================================
サイドバー
========================================
*/

function createSidebar() {

    const target = document.getElementById("site-sidebar");

    if (!target) return;

    target.innerHTML = `

        <aside class="sidebar" id="sidebar">

            <nav>

                <div class="sidebar-section">

                    <div class="sidebar-title">
                        Wiki
                    </div>


                    <a
                        href="index.html"
                        class="sidebar-link"
                        data-page="home"
                    >
                        <span>⌂</span>
                        ホーム
                    </a>


                    <a
                        href="category.html?category=enemy"
                        class="sidebar-link"
                        data-category="enemy"
                    >
                        <span>⚔</span>
                        敵・ボス
                    </a>


                    <a
                        href="category.html?category=fishing"
                        class="sidebar-link"
                        data-category="fishing"
                    >
                        <span>♨</span>
                        釣り
                    </a>


                    <a
                        href="category.html?category=equipment"
                        class="sidebar-link"
                        data-category="equipment"
                    >
                        <span>◇</span>
                        装備・アクセサリー
                    </a>


                    <a
                        href="category.html?category=item"
                        class="sidebar-link"
                        data-category="item"
                    >
                        <span>□</span>
                        アイテム
                    </a>


                    <a
                        href="category.html?category=area"
                        class="sidebar-link"
                        data-category="area"
                    >
                        <span>⌖</span>
                        地域
                    </a>


                    <a
                        href="category.html?category=npc"
                        class="sidebar-link"
                        data-category="npc"
                    >
                        <span>♙</span>
                        NPC
                    </a>


                    <a
                        href="category.html?category=quest"
                        class="sidebar-link"
                        data-category="quest"
                    >
                        <span>✓</span>
                        クエスト
                    </a>

                </div>


                <div class="sidebar-section">

                    <div class="sidebar-title">
                        Wiki情報
                    </div>


                    <a
                        href="recent.html"
                        class="sidebar-link"
                        data-page="recent"
                    >
                        <span>◌</span>
                        最近の更新
                    </a>


                    <a
                        href="research.html"
                        class="sidebar-link"
                        data-page="research"
                    >
                        <span>⌕</span>
                        調査・検証
                    </a>


                    <a
                        href="about.html"
                        class="sidebar-link"
                        data-page="about"
                    >
                        <span>?</span>
                        Wikiについて
                    </a>

                </div>

            </nav>


            <div class="sidebar-bottom">

                <button
                    class="update-button"
                    id="update-wiki"
                >
                    ↻ 最新の情報に更新
                </button>


                <div class="sidebar-version">
                    Wiki v0.1
                </div>

            </div>

        </aside>

    `;

}


/*
========================================
イベント
========================================
*/

function setupLayoutEvents() {

    /*
    ------------------------------------
    モバイルメニュー
    ------------------------------------
    */

    const menuButton =
        document.getElementById("menu-button");

    const sidebar =
        document.getElementById("sidebar");


    if (menuButton && sidebar) {

        menuButton.addEventListener(
            "click",
            () => {

                sidebar.classList.toggle("open");

            }
        );

    }


    /*
    ------------------------------------
    検索
    ------------------------------------
    */

    const search =
        document.getElementById("global-search");


    if (search) {

        search.addEventListener(
            "keydown",
            event => {

                if (event.key !== "Enter") return;

                const keyword =
                    search.value.trim();

                if (!keyword) return;

                location.href =
                    "search.html?q=" +
                    encodeURIComponent(keyword);

            }
        );

    }


    /*
    ------------------------------------
    Ctrl + K
    ------------------------------------
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.ctrlKey &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                const input =
                    document.getElementById(
                        "global-search"
                    );

                if (input) {

                    input.focus();
                    input.select();

                }

            }

        }
    );


    /*
    ------------------------------------
    最新情報へ更新
    ------------------------------------
    */

    const updateButton =
        document.getElementById("update-wiki");


    if (updateButton) {

        updateButton.addEventListener(
            "click",
            async () => {

                updateButton.disabled = true;

                updateButton.textContent =
                    "↻ 更新中...";

                try {

                    await forceRefresh();

                    location.reload();

                } catch (error) {

                    console.error(error);

                    alert(
                        "更新に失敗しました。"
                    );

                    updateButton.disabled = false;

                    updateButton.textContent =
                        "↻ 最新の情報に更新";

                }

            }
        );

    }

}


/*
========================================
現在位置
========================================
*/

function setActiveSidebar() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    links.forEach(link => {

        link.classList.remove("active");

    });


    const path =
        location.pathname;

    const file =
        path.split("/").pop();


    /*
    ホーム
    */

    if (
        file === "" ||
        file === "index.html"
    ) {

        const link =
            document.querySelector(
                '[data-page="home"]'
            );

        if (link)
            link.classList.add("active");

        return;

    }


    /*
    カテゴリ
    */

    if (file === "category.html") {

        const params =
            new URLSearchParams(
                location.search
            );

        const category =
            params.get("category");

        const link =
            document.querySelector(
                `[data-category="${category}"]`
            );

        if (link)
            link.classList.add("active");

        return;

    }


    /*
    その他
    */

    const pageMap = {

        "recent.html": "recent",
        "research.html": "research",
        "about.html": "about"

    };


    const page =
        pageMap[file];

    if (!page) return;


    const link =
        document.querySelector(
            `[data-page="${page}"]`
        );

    if (link)
        link.classList.add("active");

}
