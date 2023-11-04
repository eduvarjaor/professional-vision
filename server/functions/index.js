const functions = require("firebase-functions");
const { openai, admin } = require("./src/config/config");
const cors = require("cors");
const { handleFileUpload } = require("./src/handlers/handleFileUpload");
const { handleSendToOpenai } = require("./src/handlers/handleSendToOpenai");

const whitelist = [
    "http://localhost:5173",
    "https://professionalvision.netlify.app",
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

const corsMiddleware = cors(corsOptions);

exports.upload = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, () => handleFileUpload(req, res));
});

exports.sendToOpenAI = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, () => handleSendToOpenai(req, res));
});
