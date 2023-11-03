const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const uuid = require("uuid");
const Busboy = require("busboy");

require("dotenv").config();

const serviceAccount = {
    type: "service_account",
    project_id: process.env.FB_PROJECT_ID,
    private_key_id: process.env.FB_PRIVATE_KEY_ID,
    private_key: process.env.FB_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FB_CLIENT_EMAIL,
    client_id: process.env.FB_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://accounts.google.com/o/oauth2/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FB_STORAGE_BUCKET,
});

const corsMiddleware = cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type"],
    credentials: true,
    contentType: true,
});

exports.upload = functions.https.onRequest(async (req, res) => {
    corsMiddleware(req, res, async () => {
        console.log("Requisição recebida", req.method);

        if (req.method !== "POST") {
            return res.status(405).end();
        }

        try {
            const busboy = Busboy({ headers: req.headers });
            let uploadData = null;

            busboy.on(
                "file",
                (fieldname, file, filename, encoding, mimetype) => {
                    const filepath = `uploaded-images/${uuid.v4()}.png`;
                    console.log("Nome do Arquivo:", filepath);

                    const bucketFile = admin.storage().bucket().file(filepath);
                    uploadData = {
                        file: bucketFile,
                        type: mimetype,
                        name: filename,
                    };

                    file.pipe(
                        bucketFile.createWriteStream({
                            metadata: {
                                contentType: mimetype,
                            },
                        })
                    );
                }
            );

            busboy.on("finish", async () => {
                if (!uploadData) {
                    console.error("No file received");
                    return res.status(400).json({
                        success: false,
                        error: "No file received",
                    });
                }

                const publicUrl = `https://storage.googleapis.com/${process.env.FB_STORAGE_BUCKET}/${uploadData.file.name}`;
                console.log("URL Pública:", publicUrl);

                return res.status(200).json({ success: true, url: publicUrl });
            });

            busboy.end(req.rawBody);
        } catch (error) {
            console.error("Error uploading image:", error);
            console.error(error.stack);
            return res
                .status(500)
                .json({ success: false, error: "Internal Server Error" });
        }
    });
});
