
import React, { useState, useEffect, useCallback } from 'react';
import type { CardData, CardInfo, HistoryEntry } from './types';
import { getCardInfoByNumber } from './constants';
import Header from './components/Header';
import CardDisplay from './components/CardDisplay';
import History from './components/History';
import { NfcIcon } from './components/Icons';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import { speak } from './utils/speech';

// Mock Web NFC API untuk lingkungan yang tidak menyediakannya
declare global {
    interface Window {
        NDEFReader: any;
    }
}

const App: React.FC = () => {
    const [nfcSupported, setNfcSupported] = useState<boolean>(false);
    const [scanMessage, setScanMessage] = useState<string>('Tempelkan kartu e-money Anda...');
    const [cardData, setCardData] = useState<CardData | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [manualCardNumber, setManualCardNumber] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchHistoryFromSupabase = useCallback(async (): Promise<HistoryEntry[]> => {
        console.log("Mengambil riwayat...");
        if (isSupabaseConfigured) {
            console.log("Menggunakan Supabase untuk mengambil data.");
            const { data, error } = await supabase
                .from('history')
                .select('name, card_number, balance, read_at')
                .order('read_at', { ascending: false })
                .limit(5);

            if (error) {
                console.error('Gagal mengambil riwayat dari Supabase:', error);
                // Kembali ke localStorage jika Supabase gagal
            } else if (data) {
                return data.map(item => ({ name: item.name, cardNumber: item.card_number, balance: item.balance, readAt: item.read_at }));
            }
        }

        console.log("Menggunakan fallback localStorage untuk mengambil data.");
        return new Promise(resolve => {
            setTimeout(() => {
                try {
                    const item = window.localStorage.getItem('infinitypay-history');
                    resolve(item ? JSON.parse(item) : []);
                } catch (error) {
                    console.error(error);
                    resolve([]);
                }
            }, 500);
        });
    }, []);

    const addHistoryToSupabase = useCallback(async (newEntry: HistoryEntry): Promise<HistoryEntry[]> => {
        console.log("Menambahkan entri baru...", newEntry);

        if (isSupabaseConfigured) {
            console.log("Menggunakan Supabase untuk menambahkan data.");
            const { error } = await supabase.from('history').insert([
                { name: newEntry.name, card_number: newEntry.cardNumber, balance: newEntry.balance, read_at: newEntry.readAt }
            ]);
            if (error) {
                console.error('Gagal menambahkan riwayat ke Supabase:', error);
            }
            // Setelah menambahkan, kita ambil ulang untuk mendapatkan daftar terbaru dari sumber data utama
            return fetchHistoryFromSupabase();
        }

        console.log("Menggunakan fallback localStorage untuk menambahkan data.");
        return new Promise<HistoryEntry[]>(resolve => {
            setTimeout(() => {
                const currentHistory = JSON.parse(window.localStorage.getItem('infinitypay-history') || '[]');
                const newHistory = [newEntry, ...currentHistory].slice(0, 5);
                window.localStorage.setItem('infinitypay-history', JSON.stringify(newHistory));
                resolve(newHistory);
            }, 300);
        });
    }, [fetchHistoryFromSupabase]);

    useEffect(() => {
        const loadHistory = async () => {
            setIsLoading(true);
            const loadedHistory = await fetchHistoryFromSupabase();
            setHistory(loadedHistory);
            setIsLoading(false);
        };
        loadHistory();
    }, [fetchHistoryFromSupabase]);

    const processCardNumber = useCallback(async (cardNumber: string) => {
        if (!cardNumber || cardNumber.length < 16) {
            setScanMessage('Nomor kartu tidak valid.');
            setIsScanning(false);
            setTimeout(() => setIsScanning(true), 3000);
            return;
        }
        
        const cardInfo = getCardInfoByNumber(cardNumber);
        const balance = Math.floor(Math.random() * (1000000 - 10000) + 10000);
        const readAt = new Date().toISOString();

        const newCardData: CardData = {
            ...cardInfo,
            cardNumber,
            balance,
            status: 'success',
            readAt
        };

        setCardData(newCardData);
        
        // Umumkan saldo menggunakan text-to-speech
        const formattedBalance = new Intl.NumberFormat('id-ID').format(balance);
        speak(`Saldo Anda ${formattedBalance} rupiah`);

        const newHistoryEntry: HistoryEntry = {
            name: newCardData.name,
            cardNumber,
            balance,
            readAt
        };

        const updatedHistory = await addHistoryToSupabase(newHistoryEntry);
        setHistory(updatedHistory);

        setScanMessage('Kartu berhasil dibaca!');
        setIsScanning(false);
        setTimeout(() => {
            setIsScanning(true);
            setScanMessage('Tempelkan kartu e-money Anda...');
        }, 5000);
    }, [addHistoryToSupabase]);

    useEffect(() => {
        if (!('NDEFReader' in window)) {
            setNfcSupported(false);
            return;
        }
        setNfcSupported(true);

        const abortController = new AbortController();
        const nfcReader = new window.NDEFReader();

        const startScan = async () => {
            try {
                await nfcReader.scan({ signal: abortController.signal });
                setScanMessage('Siap memindai. Tempelkan kartu Anda.');
                
                nfcReader.onreading = (event: any) => {
                    const serialNumber = event.serialNumber;
                    if (!serialNumber) {
                        setScanMessage('Serial number tidak ditemukan.');
                        return;
                    }
                    const mockCardNumber = (serialNumber.replace(/:/g, '') + '0000000000000000').substring(0, 16);
                    processCardNumber(mockCardNumber);
                };

                nfcReader.onreadingerror = () => {
                    setScanMessage('Gagal membaca kartu. Coba lagi.');
                };
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Pemindaian NFC dibatalkan.');
                } else {
                    console.error('Gagal Memindai NFC:', error);
                    setScanMessage('Gagal memulai pemindaian NFC.');
                    setNfcSupported(false); // Asumsikan NFC gagal dimulai
                }
            }
        };
        startScan();

        return () => {
            abortController.abort();
        };
    }, [processCardNumber]);

    const handleManualCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        await processCardNumber(manualCardNumber.replace(/\s/g, ''));
        setManualCardNumber('');
    };

    const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.replace(/\D/g, '').substring(0, 16);
        setManualCardNumber(formatted.replace(/(\d{4})/g, '$1 ').trim());
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 pt-0 font-sans">
            <Header />
            <main className="flex flex-col items-center w-full max-w-md mt-8">
                {nfcSupported ? (
                    <div className="text-center w-full flex flex-col items-center">
                        <div className="relative flex items-center justify-center w-40 h-40 mb-4">
                           {isScanning && (
                                <>
                                    <div className="absolute w-full h-full rounded-full bg-blue-500/20 animate-ping"></div>
                                    <div className="absolute w-3/4 h-3/4 rounded-full bg-blue-500/30 animate-ping delay-200"></div>
                                </>
                           )}
                           <NfcIcon className={`w-16 h-16 ${isScanning ? 'text-blue-600' : 'text-slate-400'}`} />
                        </div>
                        <p aria-live="polite" className={`transition-colors duration-300 text-sm ${isScanning ? 'text-slate-500' : 'text-green-600 font-semibold'}`}>{scanMessage}</p>
                    </div>
                ) : (
                    <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border border-slate-200">
                        <p className="text-center text-sm text-orange-600 mb-4">Perangkat Anda tidak mendukung NFC. Gunakan input manual.</p>
                        <form onSubmit={handleManualCheck} className="flex flex-col space-y-4">
                            <div>
                                <label htmlFor="manual-card-input" className="sr-only">Nomor Kartu</label>
                                <input
                                    id="manual-card-input"
                                    type="text"
                                    value={manualCardNumber}
                                    onChange={handleManualInputChange}
                                    placeholder="xxxx xxxx xxxx xxxx"
                                    className="w-full bg-slate-100 text-slate-800 p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-mono text-base"
                                    required
                                    inputMode="numeric"
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                                Cek Saldo
                            </button>
                        </form>
                    </div>
                )}

                <div className="mt-8 w-full flex justify-center min-h-[224px] items-center">
                    {cardData ? (
                        <CardDisplay cardData={cardData} />
                    ) : (
                        <div className="text-center text-slate-400 p-4 border-2 border-dashed border-slate-300 rounded-xl">
                            <p>Hasil pemindaian akan muncul di sini.</p>
                            {!nfcSupported && <p className="text-xs mt-1">Masukkan nomor kartu di atas.</p>}
                        </div>
                    )}
                </div>

                <History entries={history} isLoading={isLoading} />
            </main>
        </div>
    );
};

export default App;
