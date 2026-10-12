
// テストモードではGeminiの添削APIを呼び出さない
const TEST_MODE = false;
const API_TEST_MODE = false;

// 選択中のミッションを保存する
let missionData = null;

// 画面要素
const homeScreen = document.getElementById("home-screen");
const writingScreen = document.getElementById("writing-screen");
const resultScreen = document.getElementById("result-screen");

// ボタン要素
const startButton = document.getElementById("start-button");
const backButton = document.getElementById("back-button");
const resultBackButton = document.getElementById("result-back-button");
const submitButton = document.getElementById("submit-button");

// 作文と添削結果の要素
const writingInput = document.getElementById("writing-input");
const correctionFeedback = document.getElementById("correction-feedback");

// 指定した要素にテキストを表示する
function setText(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "";
    }
}

// Googleスプレッドシートからミッションを読み込む

async function loadMission() {
    try {
        let missions;

        if (TEST_MODE) {
            // テストモード：サンプルデータを使用（API通信なし）
            missions = [
                {
                    "テーマ": "海から流れ着いた未来の日記",
                    "背景": "海辺の町で暮らすあなたは、ある朝、砂浜に流れ着いた古い日記を見つけました。日記には、まだ起きていない出来事が書かれています。",
                    "状況1": "日記の日付は10年後になっている",
                    "状況2": "日記には見覚えのある町の名前がある",
                    "状況3": "最後のページだけ読むことができない",
                    "ミッション": "日記を読んで考えたことや、これからの行動について書いてください。",
                    "作文条件1": "日記を見つけたときの状況を説明する",
                    "作文条件2": "気になった記述について述べる",
                    "作文条件3": "これから何をするか伝える"
                },
                {
                    "テーマ": "彗星の手紙を届ける郵便屋さん",
                    "背景": "普通の郵便では届けられない彗星の手紙を運ぶ郵便屋さんがいます。その手紙は、遠く離れた人や、もう会えない人にも届くと言われています。",
                    "状況1": "手紙を出せるのは一年に一度だけ",
                    "状況2": "宛先には名前ではなく、相手との思い出を書く",
                    "状況3": "手紙が届くまでの時間はわからない",
                    "ミッション": "あなたが届けたい手紙について書いてください。",
                    "作文条件1": "手紙を送りたい相手を紹介する",
                    "作文条件2": "伝えたいことを説明する",
                    "作文条件3": "手紙を届けたい理由を述べる"
                }
            ];
        } else {
            // 本番モード：GoogleスプレッドシートのAPIから取得
            const response = await fetch("/api/missions");

            if (!response.ok) {
                throw new Error("ミッションの読み込みに失敗しました。");
            }

            missions = await response.json();
        }

        if (!Array.isArray(missions) || missions.length === 0) {
            throw new Error("ミッションが見つかりません。");
        }

        // ミッションをランダムに1つ選ぶ
        const randomIndex = Math.floor(Math.random() * missions.length);
        missionData = missions[randomIndex];

        displayMission();

    } catch (error) {
        console.error("ミッション読み込みエラー:", error);
        alert("ミッションを読み込めませんでした。");
    }
}


// 選択したミッションを各画面に表示する
function displayMission() {
    if (!missionData) return;

    const theme = missionData["テーマ"] || "";
    const description = missionData["背景"] || "";

    setText("home-theme", theme);
    setText("writing-theme", theme);
    setText("result-theme", theme);

    setText("home-description", description);
    setText("writing-description", description);
    setText("background", description);

    // スプレッドシートの列と画面の要素IDを対応させる
    const fields = {
        situation1: "状況1",
        situation2: "状況2",
        situation3: "状況3",
        mission: "ミッション",
        condition1: "作文条件1",
        condition2: "作文条件2",
        condition3: "作文条件3"
    };

    for (const [id, columnName] of Object.entries(fields)) {
        setText(id, missionData[columnName]);
    }
}

// 指定した画面だけを表示する
function showScreen(screenName) {
    const screens = {
        home: homeScreen,
        writing: writingScreen,
        result: resultScreen
    };

    for (const [name, screen] of Object.entries(screens)) {
        if (screen) {
            screen.hidden = name !== screenName;
        }
    }

    // 画面を切り替えたらページの先頭に戻る
    window.scrollTo(0, 0);
}

// 作文画面を開く
function startWriting() {
    if (!missionData) {
        alert("ミッションを読み込んでいます。少しお待ちください。");
        return;
    }

    // 新しく作文を始めるときは入力欄を空にする
    writingInput.value = "";
    showScreen("writing");
}

// ホーム画面に戻る
function goHome() {
    showScreen("home");
}

// 作文画面に戻る
// 入力した作文は消さずに保持する
function returnToWriting() {
    showScreen("writing");
}

const frenchDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
}).format(new Date());

document.getElementById("writing-date").textContent =
    frenchDate;

// 添削結果を表示して結果画面に切り替える
function displayResult(text, feedback) {
    setText("result-theme", missionData?.["テーマ"] || "");
    setText("result-original", text);
    setText("correction-feedback", feedback);

    showScreen("result");
}

// テスト用のダミー添削結果を返す
function getTestFeedback() {
    return "【テスト表示】ここに添削結果が表示されます。APIは呼び出していません。";
}

// サーバーに作文を送り、添削結果を取得する
async function requestCorrection(text) {
    const response = await fetch("/api/correct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "添削に失敗しました。");
    }

    return data.feedback || "添削結果を取得できませんでした。";
}

// 添削ボタンを押したときの処理
async function submitWriting() {
    const text = writingInput.value.trim();

    // 作文が空の場合は処理を行わない
    if (!text) {
        alert("フランス語の作文を入力してください。");
        return;
    }

    // 処理中の二重送信を防ぐ
    submitButton.disabled = true;
    submitButton.textContent = API_TEST_MODE ? "テスト中..." : "添削中...";

    try {
        let feedback;

        // テストモードと本番モードで処理を分ける
        if (API_TEST_MODE) {
            feedback = getTestFeedback();
        } else {
            feedback = await requestCorrection(text);
        }

        // 取得した結果を画面に表示する
        displayResult(text, feedback);
    } catch (error) {
        console.error("添削エラー:", error);

        alert("添削に失敗しました。\n" + error.message);
    } finally {
        // 成功・失敗にかかわらずボタンを元に戻す
        submitButton.disabled = false;
        submitButton.innerHTML = '添削する <span aria-hidden="true">↗</span>';
    }
}

// HTMLの読み込みが終わってからイベントを登録する
document.addEventListener("DOMContentLoaded", () => {
    // ホーム画面から作文画面へ
    if (startButton) {
        startButton.addEventListener("click", startWriting);
    }

    // ホーム画面へ戻る
    if (backButton) {
        backButton.addEventListener("click", goHome);
    }

    // 結果画面から作文画面へ戻る
    if (resultBackButton) {
        resultBackButton.addEventListener("click", returnToWriting);
    }

    // フォーム送信時にページの再読み込みを防ぐ
    const writingForm = document.getElementById("writing-form");

    if (writingForm) {
        writingForm.addEventListener("submit", (event) => {
            event.preventDefault();
            submitWriting();
        });
    }

    // 最初のミッションを読み込む
    loadMission();
});
