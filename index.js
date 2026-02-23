const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "open") {
            console.log("✅ BOT BERHASIL TERHUBUNG!")
        }

        if (connection === "close") {
            console.log("❌ Koneksi tertutup")
            startBot()
        }
    })

    // === PAIRING CODE ===
    if (!state.creds.registered) {
        const phoneNumber = "6283841106098" // GANTI NOMOR KAMU
        try {
            const code = await sock.requestPairingCode(phoneNumber)
            console.log("PAIRING CODE ANDA:")
            console.log(code)
        } catch (err) {
            console.log("Gagal ambil pairing code:", err)
        }
    }
}

startBot()
