// ==========================
// Supabase Auth 共通設定
// ==========================

// ① Supabase の Project URL を入力してください
const SUPABASE_URL = "https://jtsdpgujzyxnsfagsuim.supabase.co";

// ② Supabase の Publishable key（sb_publishable_...）を入力してください
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_H9an-6TYw32f18GDAqR-mA_3HZ3Db_N";

// Supabase クライアントを作成
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================
// 現在のページ名を取得
// ==========================

function getCurrentPage() {

    const path =
        window.location.pathname;

    return path.substring(
        path.lastIndexOf("/") + 1
    ) || "index.html";

}


// ==========================
// クイズ画面をログイン必須にする
// ==========================

async function protectQuizPage() {

    const currentPage =
        getCurrentPage();

    if (
        currentPage !== "index.html"
    ) {
        return;
    }

    // Supabaseサーバー側で
    // 本当にユーザーが存在するか確認
    const {
        data: { user },
        error
    } =
        await supabaseClient.auth.getUser();


    // ユーザー削除済み・セッション無効など
    if (error || !user) {

        // ブラウザに残った古いセッションも削除
        await supabaseClient.auth.signOut({
            scope: "local"
        });

        window.location.replace(
            "login.html"
        );

        return;
    }

    // 認証確認が成功したら画面を表示
	document.documentElement.classList.remove(
	    "auth-checking"
	);


    // ログイン中メールアドレス表示
    const userEmail =
        document.getElementById(
            "userEmail"
        );

    if (userEmail) {

        userEmail.textContent =
            user.email ?? "";

    }


    // ログアウトボタン
    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async () => {

                const {
                    error: signOutError
                } =
                    await supabaseClient.auth.signOut({
                        scope: "local"
                    });


                if (signOutError) {

                    alert(
                        "ログアウトに失敗しました: " +
                        signOutError.message
                    );

                    return;
                }


                window.location.replace(
                    "login.html"
                );

            }
        );

    }

}

// ==========================
// ログイン済みの場合
// login/register画面から
// index.htmlへ戻す
// ==========================

async function redirectIfLoggedIn() {

    const currentPage =
        getCurrentPage();


    if (
        currentPage !== "login.html" &&
        currentPage !== "register.html"
    ) {
        return;
    }


    const {
        data: { user },
        error
    } =
        await supabaseClient.auth.getUser();


    if (!error && user) {

        window.location.replace(
            "index.html"
        );

    }

}

// ==========================
// 実行
// ==========================

protectQuizPage();

redirectIfLoggedIn();