const axios = require('axios');
const fs = require('fs');
const cron = require('node-cron');

const accounts = JSON.parse(fs.readFileSync('./tokens.json', 'utf-8'));

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
  console.log(`🔁 Menjalankan auto-claim untuk ${accounts.length} akun...`);
  for (let i = 0; i < accounts.length; i++) {
    await claimReward(accounts[i], i);
  }
}

// Cron: Jalankan tiap hari jam 09:00 WIB
cron.schedule('0 2 * * *', () => {
  // UTC+7 = jam 2 UTC = jam 9 WIB
  runAllClaims();
});

// Jalankan langsung saat script pertama kali dijalankan
runAllClaims();
