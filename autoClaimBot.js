const axios = require('axios');
const fs = require('fs');

const accounts = JSON.parse(fs.readFileSync('./tokens.json', 'utf-8'));
const INTERVAL_HOURS = 19;
const INTERVAL_MS = INTERVAL_HOURS * 60 * 60 * 1000; // 19 jam dalam milidetik

// Fungsi untuk claim reward 1 akun
async function claimReward(account, index) {
  try {
    const response = await axios.post("https://testnet.humanity.org/api/rewards/daily/claim", null, {
      headers: {
        accept: "application/json, text/plain, */*",
        authorization: account.token,
        token: account.token.replace('Bearer ', ''),
        "user-agent": "Mozilla/5.0",
        origin: "https://testnet.humanity.org",
        referer: "https://testnet.humanity.org/dashboard"
      }
    });

    console.log(`✅ [Akun ${index + 1}] Claim berhasil:`, response.data);
  } catch (error) {
    const message = error.response?.data || error.message;
    console.error(`❌ [Akun ${index + 1}] Claim gagal:`, message);
  }
}

// Menjalankan claim untuk semua akun
async function runAllClaims() {
  console.log(`🔁 Menjalankan auto-claim untuk ${accounts.length} akun... [${new Date().toLocaleString()}]`);
  for (let i = 0; i < accounts.length; i++) {
    await claimReward(accounts[i], i);
  }

  // Jadwalkan ulang 19 jam setelah ini selesai
  console.log(`🕒 Menjadwalkan ulang claim dalam ${INTERVAL_HOURS} jam...`);
  setTimeout(runAllClaims, INTERVAL_MS);
}

// Jalankan pertama kali saat script dijalankan
runAllClaims();
