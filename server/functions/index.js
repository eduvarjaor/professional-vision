const functions = require("firebase-functions");
const { openai, admin } = require("./src/config/config");
const cors = require("cors");
const { handleFileUpload } = require("./src/handlers/handleFileUpload");
const { handleSendToOpenai } = require("./src/handlers/handleSendToOpenai");

const corsMiddleware = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type"],
    credentials: true,
    contentType: true,
});

exports.upload = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, () => handleFileUpload(req, res));
});

exports.sendToOpenAI = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, () => handleSendToOpenai(req, res));
});
