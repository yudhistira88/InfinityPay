
import React from 'react';
import type { HistoryEntry } from '../types';
import { getCardInfoByNumber } from '../constants';

interface HistoryProps {
    entries: HistoryEntry[];
    isLoading: boolean;
}

const History: React.FC<HistoryProps> = ({ entries, isLoading }) => {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <section className="w-full max-w-sm mt-8" aria-labelledby="history-title">
            <h2 id="history-title" className="text-lg font-semibold mb-4 text-slate-600">Riwayat Pengecekan</h2>
            {isLoading ? (
                 <p className="text-center text-slate-500 py-4">Memuat riwayat...</p>
            ) : entries.length === 0 ? (
                <p className="text-center text-slate-500 py-4">Belum ada riwayat.</p>
            ) : (
                <ul className="space-y-3">
                    {entries.map((entry, index) => {
                         const cardInfo = getCardInfoByNumber(entry.cardNumber);
                         const lastFour = entry.cardNumber.slice(-4);
                        return (
                        <li key={index} className="bg-white p-4 rounded-lg flex justify-between items-center transition-transform hover:scale-105 hover:shadow-lg shadow-md border border-slate-200/80">
                            <div className="flex items-center space-x-4">
                               <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${cardInfo.gradient}`}>
                                   {cardInfo.name.charAt(0)}
                               </div>
                               <div>
                                   <p className="font-semibold text-slate-800 text-sm">{cardInfo.name}</p>
                                   <p className="text-xs text-slate-500">**** **** **** {lastFour}</p>
                               </div>
                            </div>
                            <div>
                                <p className="font-mono text-base text-blue-600 font-semibold">{formatCurrency(entry.balance)}</p>
                                <p className="text-xs text-slate-400 text-right">{new Date(entry.readAt).toLocaleTimeString('id-ID')}</p>
                            </div>
                        </li>
                    )})}
                </ul>
            )}
        </section>
    );
};

export default History;
