/**
 * Modul ini mengelola sintesis text-to-speech, memastikan suara Bahasa Indonesia
 * digunakan jika tersedia. Modul ini secara cerdas memilih suara berkualitas tinggi
 * (misalnya, suara "Natural" di Edge) dan menangani pemuatan suara oleh browser
 * yang bersifat asinkron secara andal.
 */

// State di tingkat modul untuk menyimpan suara yang dipilih, status pemuatan, dan antrean.
let selectedIndonesianVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;
let utteranceQueue: SpeechSynthesisUtterance[] = [];

/**
 * Memilih suara Bahasa Indonesia terbaik yang tersedia dengan menggunakan sistem skor
 * untuk memprioritaskan suara berkualitas tinggi seperti suara "Natural" di Edge.
 * @param availableVoices - Daftar suara SpeechSynthesisVoice yang tersedia.
 * @returns Suara Bahasa Indonesia terbaik atau null jika tidak ditemukan.
 */
const findBestIndonesianVoice = (availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // Filter suara untuk Bahasa Indonesia dengan lebih toleran (case-insensitive)
    const indonesianVoices = availableVoices.filter(
        voice => voice.lang.toLowerCase() === 'id-id' || voice.lang.toLowerCase() === 'id'
    );

    if (indonesianVoices.length === 0) {
        console.warn('Tidak ada suara dengan lang "id-ID" atau "id" yang ditemukan.');
        return null;
    }

    // Urutkan suara berdasarkan prioritas untuk kualitas terbaik
    const sortedVoices = indonesianVoices.sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        // Prioritas tertinggi untuk suara "Natural" dari Microsoft (Edge)
        if (a.name.includes('Natural')) scoreA += 10;
        if (b.name.includes('Natural')) scoreB += 10;
        
        // Prioritas kedua untuk suara "Google" (Chrome)
        if (a.name.includes('Google')) scoreA += 5;
        if (b.name.includes('Google')) scoreB += 5;

        // Prioritas untuk suara lokal vs online (lokal lebih disukai untuk latensi)
        if (a.localService) scoreA += 2;
        if (b.localService) scoreB += 2;

        return scoreB - scoreA; // Urutkan dari skor tertinggi ke terendah
    });

    return sortedVoices[0];
};


/**
 * Mengisi daftar suara, memilih suara terbaik, dan memproses permintaan ucapan yang ada di antrean.
 * Fungsi ini dirancang untuk dipanggil sekali ketika suara telah dimuat.
 */
const processAndSpeakQueue = () => {
    const allVoices = window.speechSynthesis.getVoices();
    if (allVoices.length === 0) {
        return; // Mungkin dipanggil terlalu dini, tunggu panggilan berikutnya.
    }

    voicesLoaded = true;
    selectedIndonesianVoice = findBestIndonesianVoice(allVoices);

    if (!selectedIndonesianVoice) {
        console.warn('Suara Bahasa Indonesia tidak ditemukan. Menggunakan default browser untuk id-ID.');
    } else {
        console.log(`Menggunakan suara: ${selectedIndonesianVoice.name} (${selectedIndonesianVoice.lang})`);
    }

    // Ucapkan setiap item dari antrean dengan suara yang telah dipilih.
    utteranceQueue.forEach(utterance => {
        if (selectedIndonesianVoice) {
            utterance.voice = selectedIndonesianVoice;
        }
        window.speechSynthesis.speak(utterance);
    });

    // Kosongkan antrean dan hapus listener karena pekerjaan selesai.
    utteranceQueue = [];
    window.speechSynthesis.onvoiceschanged = null;
};

/**
 * Menggunakan Web Speech API untuk mengucapkan teks dalam Bahasa Indonesia.
 * Fungsi ini menangani pemuatan suara dan mengantrekan permintaan jika perlu.
 * @param text Teks yang akan diucapkan.
 */
export const speak = (text: string): void => {
    if (!('speechSynthesis'in window)) {
        console.warn('Web Speech API tidak didukung di browser ini.');
        return;
    }

    // Selalu batalkan ucapan sebelumnya untuk mencegah suara tumpang tindih.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID'; // Fallback jika tidak ada suara yang cocok.
    utterance.rate = 0.95;
    utterance.pitch = 1;

    if (voicesLoaded) {
        // Jika suara sudah siap, gunakan suara yang telah dipilih dan langsung ucapkan.
        if (selectedIndonesianVoice) {
            utterance.voice = selectedIndonesianVoice;
        }
        window.speechSynthesis.speak(utterance);
    } else {
        // Jika suara belum dimuat, tambahkan ke antrean.
        // Handler `onvoiceschanged` (processAndSpeakQueue) akan menanganinya nanti.
        utteranceQueue.push(utterance);
    }
};


// --- Inisialisasi ---
// Siapkan pemuatan suara segera setelah modul dimuat.
if ('speechSynthesis' in window) {
    // Coba dapatkan suara secara langsung. Mungkin sudah ada di cache.
    const initialVoices = window.speechSynthesis.getVoices();
    if (initialVoices.length > 0) {
       // Suara sudah dimuat, proses langsung.
       processAndSpeakQueue();
    } else {
        // Jika tidak tersedia, atur event listener. Ini akan dipicu saat suara siap.
        window.speechSynthesis.onvoiceschanged = processAndSpeakQueue;
    }
}
