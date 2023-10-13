import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import fs from 'fs'
import OpenAI from 'openai'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'

const PORT = 8000
const app = express()

app.use(cors())
app.use(express.json())
config()

const openai = new OpenAI()
openai.apiKey = process.env.VITE_OPENAI_API_KEY

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploaded-images')
  },
  filename: (req, file, cb) => {
    console.log('file', file)
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage }).single('file')

let filePath
const filePathRGBA = 'public/rgba-images'

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    filePath = req.file?.path

    if (!fs.existsSync(filePathRGBA)) {
      try {
        fs.mkdirSync(filePathRGBA, { recursive: true })
      } catch (mkdirErr) {
        console.error('Error creating directory:', mkdirErr)
        return res.status(500).send('Error creating directory.')
      }
    }

    sharp(filePath)
      .ensureAlpha()
      .toFile(
        path.join(filePathRGBA, path.basename(filePath)),
        (sharpErr, info) => {
          if (sharpErr) {
            console.error('Error converting image:', sharpErr)
            return res.status(500).send('Error converting image.')
          } else {
            console.log('Image converted successfully: ', info)
            res.status(200).send('File uploaded')
          }
        },
      )
  })
})

app.post('/edit', async (req, res) => {
  if (!filePath) {
    return res.status(400).send('File path not available')
  }

  const filedir = filePath.split('\\').pop()

  const response = await openai.images.edit({
    image: fs.createReadStream(filePath),
    mask: fs.createReadStream(path.join(filePathRGBA, filedir)),
    prompt: 'Put a suit on that person',
    size: '256x256',
  })

  console.log(response.data)
  res.send(response.data)
})

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
