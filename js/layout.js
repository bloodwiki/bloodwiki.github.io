/*
========================================
共通レイアウト
========================================
*/


/*
========================================
ヘッダー
========================================
*/

function injectHeader() {

    const container =
        document.getElementById(
            "site-header"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <header class="header">

            <div class="header-inner">


                <!-- ロゴ -->

                <a
                    href="index.html"
                    class="logo"
                >

                    <span class="logo-mark">
                        W
                    </span>

                    <span>

                        <strong>
                            BLOOD Wiki
                        </strong>

                        <small>
                            Unofficial Wiki
                        </small>

                    </span>

                </a>



                <!-- 検索 -->

                <div class="header-search">

                    <span class="search-icon">
                        ⌕
                    </span>


                    <input
                        type="search"
                        id="global-search"
                        placeholder="Wikiを検索..."
                        autocomplete="off"
                    >


                    <div class="search-shortcut">

                        <kbd>
                            Ctrl
                        </kbd>

                        <kbd>
                            K
                        </kbd>

                    </div>

                </div>



                <!-- 右側 -->

                <div class="header-actions">

                    <button
                        type="button"
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

function injectSidebar() {

    const container =
        document.getElementById(
            "site-sidebar"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <aside
            class="sidebar"
            id="sidebar"
        >

            <nav>


                <!-- =================================
                     Wiki
                ================================== -->

                <div class="sidebar-section">


                    <div class="sidebar-title">
                        Wiki
                    </div>


                    <a
                        href="index.html"
                        class="sidebar-link"
                    >

                        <span>
                            ⌂
                        </span>

                        ホーム

                    </a>


                    <a
                        href="category.html?category=enemy"
                        class="sidebar-link"
                    >

                        <span>
                            ⚔
                        </span>

                        敵

                    </a>


                    <a
                        href="category.html?category=boss"
                        class="sidebar-link"
                    >

                        <span>
                            ☠
                        </span>

                        ボス

                    </a>


                    <a
                        href="category.html?category=fishing"
                        class="sidebar-link"
                    >

                        <span>
                            ♨
                        </span>

                        釣り

                    </a>


                    <a
                        href="category.html?category=weapon"
                        class="sidebar-link"
                    >

                        <span>
                            ⚔
                        </span>

                        武器

                    </a>


                    <a
                        href="category.html?category=armor"
                        class="sidebar-link"
                    >

                        <span>
                            ♢
                        </span>

                        防具

                    </a>


                    <a
                        href="category.html?category=accessory"
                        class="sidebar-link"
                    >

                        <span>
                            ◇
                        </span>

                        アクセサリー

                    </a>


                    <a
                        href="category.html?category=item"
                        class="sidebar-link"
                    >

                        <span>
                            □
                        </span>

                        アイテム

                    </a>


                    <a
                        href="category.html?category=npc"
                        class="sidebar-link"
                    >

                        <span>
                            ♙
                        </span>

                        NPC

                    </a>


                </div>



                <!-- =================================
                     Wiki情報
                ================================== -->

                <div class="sidebar-section">


                    <div class="sidebar-title">
                        Wiki情報
                    </div>


                    <a
                        href="recent.html"
                        class="sidebar-link"
                    >

                        <span>
                            ◌
                        </span>

                        最近の更新

                    </a>


                    <a
                        href="research.html"
                        class="sidebar-link"
                    >

                        <span>
                            ⌕
                        </span>

                        調査・検証

                    </a>


                    <a
                        href="about.html"
                        class="sidebar-link"
                    >

                        <span>
                            ?
                        </span>

                        Wikiについて

                    </a>


                </div>


            </nav>



            <!-- =================================
                 下部
            ================================== -->

            <div class="sidebar-bottom">


                <button
                    type="button"
                    class="update-button"
                    id="update-button"
                >
                    最新の情報に更新
                </button>


                <div class="sidebar-version">
                    Wiki v1.0
                </div>


            </div>


        </aside>

    `;

}


/*
========================================
検索
========================================
*/

function setupGlobalSearch() {

    const globalInput =
        document.getElementById(
            "global-search"
        );


    const heroInput =
        document.getElementById(
            "hero-search"
        );


    /*
    検索処理
    */

    function search(input) {

        if (!input) {
            return;
        }


        const keyword =
            input.value.trim();


        if (!keyword) {
            return;
        }


        location.href =
            "search.html?q=" +
            encodeURIComponent(
                keyword
            );

    }


    /*
    Enter
    */

    if (globalInput) {

        globalInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    search(
                        globalInput
                    );

                }

            }
        );

    }


    /*
    ヒーロー検索
    */

    if (heroInput) {

        heroInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    search(
                        heroInput
                    );

                }

            }
        );

    }


    /*
    Ctrl + K
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();


                if (globalInput) {

                    globalInput.focus();

                }

            }

        }
    );

}


/*
========================================
メニュー
========================================
*/

function setupMenu() {

    const button =
        document.getElementById(
            "menu-button"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        !button ||
        !sidebar
    ) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "open"
            );

        }
    );

}


/*
========================================
更新ボタン
========================================
*/

function setupUpdateButton() {

    const button =
        document.getElementById(
            "update-button"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        async () => {

            button.disabled = true;

            button.textContent =
                "更新中...";


            try {

                if (
                    typeof forceRefresh ===
                    "function"
                ) {

                    await forceRefresh();

                    location.reload();

                } else {

                    console.warn(
                        "forceRefresh が見つかりません"
                    );

                }

            } catch (error) {

                console.error(
                    "更新エラー:",
                    error
                );

            } finally {

                button.disabled = false;

                button.textContent =
                    "最新の情報に更新";

            }

        }
    );

}


/*
========================================
現在ページのリンクをactiveにする
========================================
*/

function setupActiveLink() {

    const links =
        document.querySelectorAll(
            ".sidebar-link"
        );


    const currentPage =
        location.pathname
            .split("/")
            .pop() ||
        "index.html";


    const params =
        new URLSearchParams(
            location.search
        );


    const currentCategory =
        params.get(
            "category"
        );


    links.forEach(
        link => {

            const href =
                link.getAttribute(
                    "href"
                );


            if (!href) {
                return;
            }


            /*
            index
            */

            if (
                currentPage ===
                    "index.html" &&
                href ===
                    "index.html"
            ) {

                link.classList.add(
                    "active"
                );

                return;

            }


            /*
            category
            */

            if (
                currentPage ===
                    "category.html"
            ) {

                const linkParams =
                    new URLSearchParams(
                        href.split("?")[1] ||
                        ""
                    );


                const linkCategory =
                    linkParams.get(
                        "category"
                    );


                if (
                    linkCategory &&
                    linkCategory ===
                        currentCategory
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }

        }
    );

}


/*
========================================
開始
========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        injectHeader();

        injectSidebar();

        setupGlobalSearch();

        setupMenu();

        setupUpdateButton();

        setupActiveLink();

    }
);
