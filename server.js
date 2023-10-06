import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import fs from 'fs'
import OpenAI from 'openai'
import multer from 'multer'

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

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    filePath = req.file?.path
    res.status(200).send('File uploaded')
  })
})

app.post('/variations', async (req, res) => {
  if (!filePath) {
    return res.status(400).send('File path not available')
  }

  try {
    const response = await openai.images.createVariation({
      image: fs.createReadStream(filePath),
      n: 1,
      size: '256x256',
    })
    console.log(response.data)
    res.send(response.data)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
})

app.post('/edit', async (req, res) => {
  if (!filePath) {
    return res.status(400).send('File path not available')
  }

  try {
    const response = await openai.images.edit({
      image: fs.createReadStream(filePath),
      prompt: 'Make a realistic photo of this person as a business man',
      size: '256x256',
    })
    console.log(response.data)
    res.send(response.data)
  } catch (error) {
    console.log(error)
    res.status(500).send('Internal server error')
  }
})

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
