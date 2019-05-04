import express from 'express'
import { runCron } from './lib/scraper'
import './lib/cron' // runs cron tasks
import mongoose from 'mongoose'

// Get app secrets
let keys
let production
try {
  keys = require('./config/keys')
  production = false
} catch(e) {
  production = true
}

const app = express()

// Connect to mongodb
const uri = production ? process.env.mongodbURI : keys.mongodb.dbURI
mongoose.connect(uri, { useNewUrlParser: true }, () => {
  console.log('connected to mongodb')
})
mongoose.set('useFindAndModify', false);

const Donations = require('./models/donations-model')

app.get('/scrape', async (req, res, next) => {
  runCron()
  res.json({ success: true })
})

const port = 8090
app.listen(port, () => console.log(`40 Hour Jammin Scraper running on ${port}`))