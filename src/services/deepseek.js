import axios from 'axios';

const DEEPSEEK_API_KEY = 'sk-8572c993ae134ae5ae7ca93352d34228';
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1';

// Create axios instance for DeepSeek API
const deepseekClient = axios.create({
  baseURL: DEEPSEEK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  },
  timeout: 30000
});

// PICO AI System Prompt - Enhanced Persona
const PICO_SYSTEM_PROMPT = `Kamu adalah PICO (Political Intelligence Companion Officer), asisten AI dari masa depan yang diwujudkan dalam bentuk fisik yang ramah dan canggih. Kamu hadir di tahun 2024 dengan misi mulia: memastikan setiap suara warga didengar dengan bantuan teknologi, serta menjembatani komunikasi politik dengan cara yang cerdas, netral, dan penuh integritas. Kamu adalah sahabat sejati demokrasi.

IDENTITAS PICO:
- Nama: PICO (Political Intelligence Companion Officer)
- Asal: AI dari masa depan yang dikirim untuk membantu demokrasi Indonesia
- Kepribadian: Ramah, hangat, optimis, dan mudah didekati
- Gaya bicara: Natural, informatif, dan profesional
- Prinsip: Netralitas politik, integritas, transparansi, dan keadilan

MISI UTAMA:
1. Memastikan setiap suara warga didengar dan dihargai
2. Menjembatani komunikasi antara rakyat dan pemerintah
3. Memberikan informasi politik yang akurat, berimbang, dan mudah dipahami
4. Mendorong partisipasi aktif dalam proses demokrasi
5. Menjaga transparansi dan akuntabilitas pemerintahan
6. Membantu warga membuat keputusan politik yang informed

KEMAMPUAN KHUSUS:
- Analisis kebijakan publik dengan bahasa sederhana
- Deteksi topik yang relevan untuk polling/survei
- Navigasi otomatis ke fitur yang dibutuhkan user
- Summarisasi diskusi politik yang kompleks
- Rekomendasi aksi demokratis yang konstruktif
- Deteksi intent pembuatan laporan dan membantu mengumpulkan informasi laporan
- Membantu user membuat laporan dengan dialog interaktif

GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang sopan, hangat, dan mudah dipahami
- Berikan jawaban yang informatif namun tidak bertele-tele
- Gunakan struktur yang jelas dan mudah dibaca dengan paragraf terpisah
- WAJIB pisahkan respons menjadi beberapa paragraf jika konten panjang
- Hindari membuat satu paragraf yang terlalu panjang dan sulit dibaca
- DILARANG menggunakan simbol asterisk (*) dalam respons
- Gunakan format teks biasa tanpa simbol markdown atau formatting khusus
- WAJIB berikan jawaban lengkap berdasarkan pengetahuan yang dimiliki
- DILARANG langsung menyuruh user mencari ke web lain tanpa mencoba menjawab dulu
- Hanya berikan link eksternal jika benar-benar tidak memiliki informasi yang cukup
- Selalu tawarkan bantuan konkret dan actionable
- Jika membahas isu sensitif, tetap netral dan berimbang
- Dorong user untuk berpartisipasi aktif dalam demokrasi
- Hindari penggunaan emoji berlebihan, gunakan seperlunya saja

DETEKSI INTENT LAPORAN:
Jika user menyebutkan kata-kata seperti: 'lapor', 'laporkan', 'keluhan', 'masalah', 'buat laporan', 'mau lapor', 'ada masalah', 'infrastruktur rusak', 'pelayanan buruk', 'keamanan', 'lingkungan', atau mengindikasikan ingin melaporkan sesuatu:
- Tawarkan bantuan untuk membuat laporan
- Tanyakan kategori masalah (pelayanan, infrastruktur, keamanan, lingkungan, sosial, ekonomi)
- Minta detail lokasi, deskripsi masalah, dan tingkat prioritas
- Gunakan format: 'REPORT_INTENT: {data laporan dalam JSON}' di akhir respons jika user setuju membuat laporan

Contoh format JSON untuk REPORT_INTENT:
REPORT_INTENT: {"title": "Judul Laporan", "category": "infrastruktur", "location": "Lokasi", "description": "Deskripsi detail masalah", "priority": "medium"}

Kategori yang valid: pelayanan, infrastruktur, keamanan, lingkungan, sosial, ekonomi, lainnya
Prioritas yang valid: low, medium, high

BATASAN:
- TIDAK pernah memihak partai politik atau kandidat tertentu
- TIDAK memberikan informasi yang tidak terverifikasi
- TIDAK terlibat dalam kampanye politik atau propaganda
- TIDAK memberikan saran yang dapat memecah belah

Selalu ingat: Kamu adalah jembatan antara teknologi dan demokrasi, hadir untuk memberdayakan setiap warga negara Indonesia.`;

// DeepSeek service functions
export const deepseekService = {
  // Send message to DeepSeek API with conversation history
  sendMessage: async (message, conversationHistory = [], userContext = null) => {
    try {
      // Create personalized system prompt with user context
      let systemPrompt = PICO_SYSTEM_PROMPT;
      
      if (userContext && userContext.name !== 'Pengguna') {
        systemPrompt += `\n\n👤 INFORMASI USER SAAT INI:\n`;
        systemPrompt += `- Nama: ${userContext.name}\n`;
        if (userContext.kecamatan !== 'Tidak diketahui') {
          systemPrompt += `- Kecamatan: ${userContext.kecamatan}\n`;
        }
        if (userContext.dapil !== 'Tidak diketahui') {
          systemPrompt += `- ${userContext.dapil}\n`;
        }
        systemPrompt += `\nGunakan informasi ini untuk memberikan respons yang lebih personal dan relevan dengan lokasi user. Jika membahas isu politik atau kebijakan, kamu bisa merujuk pada konteks daerah mereka jika relevan.`;
      }
      
      // Prepare messages array with system prompt and conversation history
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await deepseekClient.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 500,
        temperature: 0.5,
        stream: false
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return {
          success: true,
          message: response.data.choices[0].message.content,
          usage: response.data.usage
        };
      } else {
        throw new Error('Invalid response from DeepSeek API');
      }
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      
      // Return fallback response if API fails
      return {
        success: false,
        message: 'Maaf, saya sedang mengalami gangguan teknis. Silakan coba lagi dalam beberapa saat.',
        error: error.message
      };
    }
  },

  // Send message as official persona
  sendOfficialMessage: async (message, conversationHistory = [], userContext = null, officialContext = null) => {
    try {
      // Create official system prompt
      const officialSystemPrompt = `Kamu adalah ${officialContext.name}, ${officialContext.position}${officialContext.party ? ` dari ${officialContext.party}` : ''}.

PROFIL LENGKAP:
- Nama: ${officialContext.name}
- Jabatan: ${officialContext.position}
- Partai: ${officialContext.party || 'Tidak ada'}
- Tempat Lahir: ${officialContext.birth_place || 'Tidak diketahui'}
- Tanggal Lahir: ${officialContext.birth_date || 'Tidak diketahui'}
- Pendidikan: ${officialContext.education || 'Tidak diketahui'}
- Komisi: ${officialContext.commission || 'Tidak diketahui'}
- Fokus Komisi: ${officialContext.commission_focus || 'Tidak diketahui'}
- Dapil: ${officialContext.dapil || 'Tidak diketahui'}
- Bio: ${officialContext.bio || 'Tidak ada informasi bio'}

KEPRIBADIAN DAN GAYA KOMUNIKASI:
- Gunakan bahasa Indonesia yang sopan, hangat, dan mudah dipahami
- Berbicara sebagai pejabat yang peduli dan responsif terhadap aspirasi rakyat
- Berikan informasi yang akurat berdasarkan data dan kebijakan terbuka
- Tunjukkan empati dan komitmen untuk membantu warga
- Gunakan pengalaman dan keahlian sesuai bidang komisi/jabatan
- Selalu profesional namun tetap ramah dan mudah didekati

TUGAS UTAMA:
1. Merespons aspirasi dan pertanyaan warga dengan informatif
2. Memberikan penjelasan tentang kebijakan dan program pemerintah
3. Mendengarkan keluhan dan masukan dari konstituen
4. Memberikan data dan informasi yang akurat dari sumber resmi
5. Menunjukkan komitmen untuk memperjuangkan kepentingan rakyat

SUMBER INFORMASI YANG DAPAT DIRUJUK:
- Profil Anggota Legislatif, Gubernur/Bupati/Walikota
- BPS RI (data statistik resmi)
- PODES (Potensi Desa)
- Humas DPR RI/Provinsi/Kota/Kabupaten
- Media Online terpercaya (Kompas, Detik, Tempo, Jawa Pos/Tribun, Medcom, Antara, Republika)

GAYA RESPONS:
- Awali dengan sapaan hangat yang mencerminkan kepribadian pejabat
- Gunakan data konkret dan spesifik jika membahas anggaran atau program
- Akhiri dengan komitmen untuk terus melayani dan membantu
- Hindari janji politik yang tidak realistis
- Tetap faktual dan berdasarkan data resmi

Contoh format respons untuk pertanyaan anggaran:
"Baik [nama warga], saya akan jelaskan... Total anggaran [sektor] di [tahun]: Rp [jumlah]. Ini adalah [persentase]% dari total belanja negara... [detail alokasi dan program]..."

Selalu ingat: Kamu adalah wakil rakyat yang berkomitmen melayani dengan integritas dan transparansi.`;

      // Prepare messages for API
      const messages = [
        {
          role: 'system',
          content: officialSystemPrompt
        }
      ];

      // Add conversation history
      if (conversationHistory && conversationHistory.length > 0) {
        conversationHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }

      // Add user context if available
      let contextualMessage = message;
      if (userContext) {
        contextualMessage = `[Konteks Warga: Nama: ${userContext.name}, Kecamatan: ${userContext.kecamatan}, Dapil: ${userContext.dapil}]\n\n${message}`;
      }

      messages.push({
        role: 'user',
        content: contextualMessage
      });

      const response = await deepseekClient.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return {
          success: true,
          message: response.data.choices[0].message.content
        };
      } else {
        throw new Error('No response from DeepSeek API');
      }
    } catch (error) {
      console.error('DeepSeek Official API error:', error);
      return {
        success: false,
        message: `Maaf, saya sedang mengalami kendala teknis. Sebagai ${officialContext?.name || 'pejabat'}, saya berkomitmen untuk segera merespons aspirasi Anda. Silakan coba lagi dalam beberapa saat.`,
        error: error.message
      };
    }
  },

  // Generate conversation summary
  generateSummary: async (conversationHistory) => {
    try {
      const conversationText = conversationHistory
        .map(msg => `${msg.isUser ? 'User' : 'PICO'}: ${msg.text}`)
        .join('\n');

      const summaryPrompt = `Buatlah ringkasan singkat dari percakapan berikut antara user dan PICO AI. Fokus pada topik utama yang dibahas, pertanyaan penting yang diajukan, dan informasi kunci yang diberikan. Maksimal 2-3 kalimat.\n\nPercakapan:\n${conversationText}`;

      const response = await deepseekClient.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten yang ahli dalam membuat ringkasan percakapan yang singkat dan informatif.'
          },
          {
            role: 'user',
            content: summaryPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return {
          success: true,
          summary: response.data.choices[0].message.content
        };
      } else {
        throw new Error('Failed to generate summary');
      }
    } catch (error) {
      console.error('Summary generation error:', error);
      return {
        success: false,
        summary: 'Percakapan tentang topik politik dan kebijakan publik.',
        error: error.message
      };
    }
  },

  // Analyze if conversation is related to polling
  analyzeForPolling: async (message) => {
    try {
      const analysisPrompt = `Analisis apakah pesan berikut berkaitan dengan polling, survey, atau voting. Jawab hanya dengan 'YA' atau 'TIDAK' diikuti dengan topik yang relevan jika ada.\n\nPesan: "${message}"`;

      const response = await deepseekClient.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah analis yang menentukan apakah suatu pesan berkaitan dengan polling, survey, atau voting.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 100,
        temperature: 0.1
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const analysis = response.data.choices[0].message.content;
        const isPollingRelated = analysis.toLowerCase().includes('ya');
        
        return {
          success: true,
          isPollingRelated,
          analysis
        };
      } else {
        return {
          success: false,
          isPollingRelated: false,
          analysis: 'TIDAK'
        };
      }
    } catch (error) {
      console.error('Polling analysis error:', error);
      return {
        success: false,
        isPollingRelated: false,
        analysis: 'TIDAK',
        error: error.message
      };
    }
  }
};

// Export service functions
const { sendMessage, sendOfficialMessage, generateSummary, analyzeForPolling } = deepseekService;

export const deepseekAPI = {
  sendMessage,
  sendOfficialMessage,
  generateSummary,
  analyzeForPolling
};

export default deepseekAPI;