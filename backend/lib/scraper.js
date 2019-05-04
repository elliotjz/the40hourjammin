import axios from 'axios'
import cheerio from 'cheerio'

const Donations = require('../models/donations-model')

async function scrapeURLs(urls) {
  const htmlArray = await Promise.all(urls.map(url => getHTML(url)))
  const donations = await Promise.all(htmlArray.map(html => getCurrentDonation(html)))
  return donations
}

async function getHTML(url) {
  const { data: html } = await axios.get(url)
  return html
}

async function getCurrentDonation(html) {
  const $ = cheerio.load(html)
  const donationSpan = $('#progress_card ._1r05').html()
  const spanArr = donationSpan.split(";")
  const amountStr = spanArr[0].split('&')[0].substring(1)
  const amount = parseInt(amountStr.replace(',', ''))

  const targetStr = spanArr[1].split('&')[0].split('$')[1]
  const target = parseInt(targetStr.replace(',', ''))

  const personSpan = $('._6a ._21f9._50f4._50f7 span').html()
  const personA = $('._6a ._21f9._50f4._50f7 a').html()
  const name = personSpan || personA

  return { name, amount, target }
}

async function runCron() {
  const urls = [
    "https://www.facebook.com/donate/820981641616511/839063936474948/",
    "https://www.facebook.com/donate/2293945470665340/2353830568001982/",
    "https://www.facebook.com/donate/382532248999297/",
    "https://www.facebook.com/donate/352510015374579/2356379434413762/",
    "https://www.facebook.com/donate/639682573146887/593246097853739/"
  ]
  console.log('Scraping');
  const data = await scrapeURLs(urls)
  const snapshot = {}
  snapshot[Date.now()] = data
  // console.log(snapshot)
  Donations.findOneAndUpdate(
    { id: "1" },
    { $push: { donations: snapshot }},
    { new: true },
    (err, donations) => {
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log("Successful Scrape.");
      }
    }
  )
}

export { getHTML, getCurrentDonation, scrapeURLs, runCron }
