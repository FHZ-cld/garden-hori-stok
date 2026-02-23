const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const QRCode = require("qrcode")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { qr, connection } = update

        if (qr) {
            const qrImage = await QRCode.toDataURL(qr)
            console.log("Scan QR ini di browser:")
            console.log(qrImage)
        }

        if (connection === "open") {
            console.log("✅ Bot WhatsApp Aktif!")
        }
    })
}

startBot()
