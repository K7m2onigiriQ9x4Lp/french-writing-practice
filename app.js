
let missionData = null;

async function loadMission() {
    try {
        const response = await fetch("/api/missions");

        if (!response.ok) {
            throw new Error("Failed to load missions");
        }

        const missions = await response.json();

        if (!Array.isArray(missions) || missions.length === 0) {
            throw new Error("No missions found");
        }

        // Choose one random mission.
        const randomIndex = Math.floor(
            Math.random() * missions.length
        );

        missionData = missions[randomIndex];

        displayMission();
    } catch (error) {
        console.error(error);
        alert("ミッションを読み込めませんでした。");
    }
}

function displayMission() {
    document.getElementById("home-theme").textContent =
        missionData["テーマ"];

    document.getElementById("writing-theme").textContent =
        missionData["テーマ"];

    document.getElementById("home-description").textContent =
        missionData["背景"];

    document.getElementById("writing-description").textContent =
        missionData["背景"];

    const fields = {
        background: "背景",
        situation1: "状況1",
        situation2: "状況2",
        situation3: "状況3",
        mission: "ミッション",
        condition1: "作文条件1",
        condition2: "作文条件2",
        condition3: "作文条件3"
    };

    for (const [id, columnName] of Object.entries(fields)) {
        document.getElementById(id).textContent =
            missionData[columnName] ?? "";
    }
}

function showScreen(screenName) {
    document.getElementById("home-screen").hidden =
        screenName !== "home";

    document.getElementById("writing-screen").hidden =
        screenName !== "writing";
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadMission();

    document.getElementById("start-button").addEventListener(
        "click",
        () => {
            if (!missionData) return;

            showScreen("writing");
            window.scrollTo(0, 0);
        }
    );

    document.getElementById("back-button").addEventListener(
        "click",
        () => {
            showScreen("home");
            window.scrollTo(0, 0);
        }
    );

});


const submitButton = document.getElementById("submit-button");
const writingInput = document.getElementById("writing-input");
const correctionResult = document.getElementById("correction-result");
const correctionFeedback = document.getElementById("correction-feedback");

submitButton.addEventListener("click", async () => {
    const text = writingInput.value.trim();

    if (!text) {
        alert("フランス語の作文を入力してください。");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "添削中...";
    correctionResult.hidden = false;
    correctionFeedback.textContent = "添削しています。少しお待ちください。";

    try {
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

        correctionFeedback.textContent = data.feedback;
    } catch (error) {
        correctionFeedback.textContent =
            "エラー：" + error.message;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "添削する";
    }
});
