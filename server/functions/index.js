const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const storage = admin.storage();
const bucket = storage.bucket();

exports.convertRGBA = functions.https.onRequest(async (req, res) => {});
