import express from "express";
import cors from "cors";
import { config } from "dotenv";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());
app.use(express.json());
config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const storage = getStorage(firebaseApp);

const openai = new OpenAI();
if (process.env.VITE_OPENAI_API_KEY) {
    openai.apiKey = process.env.VITE_OPENAI_API_KEY;
}

let filePath: string | undefined;
const filePathRGBA = "images/rgba-images";

app.post("/convert-rgba", async (req, res) => {
    try {
        const { imagePath } = req.body;

        const imageUrl = await getDownloadURL(ref(storage, imagePath));
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();

        const imageBuffer = Buffer.from(arrayBuffer);

        const convertedBuffer = await sharp(imageBuffer)
            .ensureAlpha()
            .toBuffer();

        const convertedImageRef = ref(
            storage,
            `images/rgba-images/${Date.now()}-converted.png`
        );
        await uploadBytes(convertedImageRef, convertedBuffer);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error converting image to RGBA:", error);
        res.status(500).json({
            success: false,
            error: "Error converting image to RGBA",
        });
    }
});

app.post("/edit", async (req, res) => {
    if (!filePath) {
        return res.status(400).send("File path not available");
    }

    const filedir = filePath.split("\\").pop();
    if (!filedir) {
        return res.status(400).send("File path not available");
    }

    try {
        const originalImageStream = fs.createReadStream(filePath);
        const maskImageStream = fs.createReadStream(
            path.join(filePathRGBA, filedir)
        );

        const response = await openai.images.edit({
            image: originalImageStream,
            mask: maskImageStream,
            prompt: "Put a suit on that person",
            size: "256x256",
        });

        console.log(response.data);
        res.send(response.data);
    } catch (error) {
        console.error("Error editing image:", error);
        res.status(500).json({ success: false, error: "Error editing image" });
    }
});

app.listen(PORT, () => console.log("Your server is running on PORT " + PORT));
