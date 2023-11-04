const { openai, admin } = require("../config/config");
const fs = require("fs");
const os = require("os");
const path = require("path");

async function handleSendToOpenai(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    try {
        const relativePath = req.body.path;
        const bucket = admin.storage().bucket();

        const file = bucket.file(relativePath);
        const fileBuffer = await file.download();

        const tempFilePath = path.join(os.tmpdir(), "tempImage.png");
        fs.writeFileSync(tempFilePath, fileBuffer[0]);

        const openAIResponse = await openai.images.edit({
            image: fs.createReadStream(tempFilePath),
            prompt: "Put a suit on that person",
            size: "256x256",
        });

        fs.unlinkSync(tempFilePath);

        return res
            .status(200)
            .json({ success: true, data: openAIResponse.data });
    } catch (error) {
        console.error("Error sending image to OpenAI:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error sending image to OpenAI",
        });
    }
}

module.exports = { handleSendToOpenai };
