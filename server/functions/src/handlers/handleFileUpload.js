const { admin } = require("../config/config");
const Busboy = require("busboy");
const sharp = require("sharp");
const uuid = require("uuid");

async function handleFileUpload(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const busboy = Busboy({ headers: req.headers });
        let uploadData = null;

        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const rgbaFilePath = `rgba-images/${uuid.v4()}.png`;
            const rgbaBucketFile = admin.storage().bucket().file(rgbaFilePath);

            const stream = file
                .pipe(sharp().toFormat("png").ensureAlpha())
                .pipe(
                    rgbaBucketFile.createWriteStream({
                        metadata: {
                            contentType: "image/png",
                        },
                    })
                );

            const streamFinished = new Promise((resolve, reject) => {
                stream.on("finish", async () => {
                    uploadData = {
                        file: rgbaBucketFile,
                        type: "image/png",
                        name: filename,
                        path: rgbaFilePath,
                    };

                    const config = {
                        action: "read",
                        expires: "03-17-2025",
                    };

                    rgbaBucketFile.getSignedUrl(config, (err, url) => {
                        if (err) {
                            console.error("Error generating signed URL", err);
                            reject(err);
                            return;
                        }
                        uploadData.signedUrl = url;
                        resolve();
                    });
                });

                stream.on("error", reject);
            });

            busboy.on("finish", async () => {
                try {
                    await streamFinished;

                    if (!uploadData) {
                        console.error("No file received");
                        return res.status(400).json({
                            success: false,
                            error: "No file received",
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        url: uploadData.signedUrl,
                        path: uploadData.path,
                    });
                } catch (error) {
                    console.error("Error processing image:", error);
                    return res.status(500).json({
                        success: false,
                        error: "Internal Server Error processing image",
                    });
                }
            });
        });
        busboy.end(req.rawBody);
    } catch (error) {
        console.error("Error uploading image:", error);
        console.error(error.stack);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
}

module.exports = { handleFileUpload };
