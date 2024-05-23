const multer = require('multer')
const { Storage } = require('@google-cloud/storage')
const { StatusCodes } = require('http-status-codes')

const setupUpload = (app) => {
  const storage = new Storage({ keyFilename: 'key.json' })
  const bucket = storage.bucket('hoangnv')
  const multerUpload = multer({ storage: multer.memoryStorage() })

  // app.post('/upload', multerUpload.single('file'), async (req, res) => {
  //   try {
  //     if (!req.file) {
  //       return res.status(400).send('No file uploaded.')
  //     }

  //     const blob = bucket.file(req.file.originalname)
  //     const blobStream = blob.createWriteStream()

  //     blobStream.on('error', (err) => {
  //       res.status(500).send('Error uploading file', err)
  //     })

  //     blobStream.on('finish', async () => {
  //       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  //       res.status(StatusCodes.OK).json({ publicUrl: publicUrl, fileName: blob.name, status: StatusCodes.OK })
  //     })

  //     blobStream.end(req.file.buffer)
  //   } catch (err) {
  //     res.status(500).send('Error uploading file')
  //   }
  // })
  app.post('/upload', multerUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.')
      }

      const blob = bucket.file(req.file.originalname)
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
          cacheControl: 'public, max-age=31536000'
        }
      })

      blobStream.on('error', (err) => {
        res.status(500).send('Error uploading file', err)
      })

      blobStream.on('finish', async () => {
        await blob.makePublic()
        const config = {
          action: 'read',
          expires: '03-09-2491'
        }
        const [signedUrl] = await blob.getSignedUrl(config)

        res.status(StatusCodes.OK).json({ signedUrl, fileName: blob.name, status: StatusCodes.OK })
      })

      blobStream.end(req.file.buffer)
    } catch (err) {
      res.status(500).send('Error uploading file')
    }
  })
  app.get('/download/:fileName', async (req, res) => {
    try {
      const fileName = req.params.fileName
      const file = bucket.file(fileName)

      const fileExists = await file.exists()
      if (!fileExists[0]) {
        return res.status(404).send('File not found')
      }

      const readStream = file.createReadStream()
      readStream.pipe(res)
    } catch (err) {
      res.status(500).send('Error downloading file')
    }
  })
  app.get('/read/:fileName', async (req, res) => {
    try {
      const fileName = req.params.fileName
      const file = bucket.file(fileName)

      const fileExists = await file.exists()
      if (!fileExists[0]) {
        return res.status(404).send('File not found')
      }

      const fileContent = (await file.download())[0]
      res.status(200).send(fileContent.toString())
    } catch (err) {
      res.status(500).send('Error reading file')
    }
  })

  // Delete a file from Google Cloud Storage
  app.delete('/delete/:fileName', async (req, res) => {
    try {
      const fileName = req.params.fileName
      const file = bucket.file(fileName)

      const fileExists = await file.exists()
      if (!fileExists[0]) {
        return res.status(404).send('File not found')
      }

      await file.delete()
      res.status(200).send('File deleted successfully')
    } catch (err) {
      res.status(500).send('Error deleting file')
    }
  })
}

module.exports = { setupUpload }
