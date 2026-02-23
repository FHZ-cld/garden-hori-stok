const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (update) => {
        const { qr, connection } = update

        if (qr) {
            console.log("Scan QR ini di WhatsApp:")
            qrcode.generate(qr, { small: true })
        }

        if (connection === "open") {
            console.log("✅ Bot WhatsApp Aktif!")
        }
    })

    const groupID = process.env.GROUP_ID

    setInterval(async () => {
        await sock.sendMessage(groupID, {
            text: "🌱 Garden Horizone Update!\nGolden Seed RESTOCK!"
        })
        console.log("Notif terkirim!")
    }, 300000)
}

startBot()
