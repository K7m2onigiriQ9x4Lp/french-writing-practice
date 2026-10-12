
require("dotenv").config();

const express = require("express");
const { google } = require("googleapis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "20kb" }));

// Serve only the files needed by the browser.
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});

app.get("/app.js", (req, res) => {
    res.sendFile(path.join(__dirname, "app.js"));
});

//===============テスト用============================================
app.get("/notes_test.html", (req, res) => {
    res.sendFile(path.join(__dirname, "notes_test.html"));
});

app.get("/notes_test.css", (req, res) => {
    res.sendFile(path.join(__dirname, "notes_test.css"));
});
//===============テスト用============================================

// Google Sheets settings
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
});


// Keep your existing values here.
const SPREADSHEET_ID = "1IHA2Xk9PTQkixpgHnkYekYvrlDzjx2IQZgRFSFqOA2Q";
const RANGE = "シート1!A:J";

app.get("/api/missions", async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const sheets = google.sheets({
            version: "v4",
            auth: authClient
        });

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE
        });

        const rows = result.data.values || [];
        const headers = rows[0] || [];

        const missions = rows.slice(1).map(row => {
            const mission = {};

            headers.forEach((header, index) => {
                mission[header] = row[index] || "";
            });

            return mission;
        });

        res.json(missions);
    } catch (error) {
        console.error("Google Sheets error:", error.message);
        res.status(500).json({
            error: "スプレッドシートを読み込めませんでした。"
        });
    }
});

// Correct a French writing submission.
app.post("/api/correct", async (req, res) => {
    try {
        const text = req.body.text;

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                error: "フランス語の作文を入力してください。"
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                error: "作文は5000文字以内にしてください。"
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                error: "APIキーが設定されていません。.envを確認してください。"
            });
        }

        const { GoogleGenAI } = await import("@google/genai");
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: `
            Tu es un professeur de français.
            Corrige le texte français de l'apprenant.

            Réponds en japonais, de façon concise.
            Ne donne aucune note.
            Montre les corrections grammaticales nécessaires.
            Propose aussi une formulation plus naturelle si nécessaire.
            Ne réécris pas tout le texte si ce n'est pas nécessaire.

            Texte de l'apprenant :
            ${text}
            `
        });

        res.json({
            feedback: response.text || "添削結果を取得できませんでした。"
        });
    } catch (error) {
        console.error("Gemini API error:", error.message);
        res.status(500).json({
            error: "添削に失敗しました。サーバーのターミナルを確認してください。"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Registered routes:");
    console.log("POST /api/correct");
    console.log(`Server running at http://localhost:${PORT}`);
});
