const { Client, GatewayIntentBits } = require('discord.js')
const axios = require('axios')
const cheerio = require('cheerio')

const TOKEN = process.env.DISCORD_TOKEN
const CHANNEL_ID = process.env.CHANNEL_ID
const STOCK_URL = process.env.STOCK_URL

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
})

let lastStockText = null

async function fetchStock() {
  try {
    const { data } = await axios.get(STOCK_URL)
    const $ = cheerio.load(data)

    // TODO: GANTI SELECTOR INI SESUAI WEB
    const stockText = $('body').text().trim()

    return stockText
  } catch (err) {
    console.log("Error fetch stock:", err.message)
    return null
  }
}

async function checkStock() {
  const current = await fetchStock()
  if (!current) return

  if (lastStockText === null) {
    lastStockText = current
    return
  }

  if (current !== lastStockText) {
    const channel = await client.channels.fetch(CHANNEL_ID)
    channel.send(`🔥 **STOK UPDATE!**\n${current}`)
    lastStockText = current
  }
}

client.once('ready', () => {
  console.log(`✅ Bot online sebagai ${client.user.tag}`)
  setInterval(checkStock, 300000) // 5 menit
})

client.login(TOKEN)
