const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { connection } = update

        if (connection === "open") {
            console.log("✅ BOT BERHASIL TERHUBUNG!")
        }
    })

    if (!sock.authState.creds.registered) {
        const phoneNumber = "6283841106098" // GANTI DENGAN NOMOR KAMU TANPA +
        const code = await sock.requestPairingCode(phoneNumber)
        console.log("PAIRING CODE ANDA:")
        console.log(code)
    }
}

startBot()
