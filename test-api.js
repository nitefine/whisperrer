import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Error: GEMINI_API_KEY tidak ditemukan di file .env!");
  process.exit(1);
}

const modelName = 'gemini-3.8-flash';
const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

async function testConnection() {
  console.log("🚀 Mengirim test request sederhana ke Gemini API...");
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: "Halo, balas dengan kalimat 'KONEKSI API BERHASIL' jika kamu menerima pesan ini." }]
          }
        ]
      })
    });

    console.log(`📡 Status HTTP Code: ${response.status} ${response.statusText}`);
    
    const data = await response.json();

    if (response.ok) {
      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log("\n✨ Sukses besar! Respons dari Gemini:");
      console.log("----------------------------------------");
      console.log(replyText);
      console.log("----------------------------------------");
    } else {
      console.log("\n❌ Gagal! Respons mentah dari server Google:");
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (err) {
    console.error("❌ Terjadi kesalahan jaringan/fetch:", err.message);
  }
}

testConnection();