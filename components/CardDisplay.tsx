
import React from 'react';
import type { CardData } from '../types';
import { CardChipIcon, WifiIcon } from './Icons';

interface CardDisplayProps {
    cardData: CardData;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ cardData }) => {
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatCardNumber = (num: string) => {
        return num.replace(/(\d{4})/g, '$1 ').trim();
    };

    const statusClasses = cardData.status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';
    const statusText = cardData.status === 'success' ? 'Berhasil Dibaca' : 'Gagal Dibaca';

    const isEMoney = cardData.name.includes('e-Money');
    const cardClasses = `relative w-full max-w-sm h-56 rounded-xl p-6 flex flex-col justify-between text-white shadow-lg shadow-blue-900/20 overflow-hidden transform transition-all duration-500 ${cardData.gradient}`;

    const eMoneyStyle: React.CSSProperties = isEMoney ? {
        backgroundImage: `${cardData.gradient.includes('black') ? 'linear-gradient(to right, #1a202c, #000)' : ''}`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        position: 'relative',
    } : {};
    
    const eMoneyOverlay: React.CSSProperties = isEMoney ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        zIndex: 1,
    } : {};

    return (
        <div 
            role="region"
            aria-label={`Kartu ${cardData.name} dengan nomor ${formatCardNumber(cardData.cardNumber)}`}
            className={cardClasses} 
            style={eMoneyStyle}
        >
             {isEMoney && <div style={eMoneyOverlay}></div>}
            {/* Background decorative elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 z-0"></div>
            <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/10 z-0"></div>

            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="font-semibold text-base">{cardData.name}</div>
                    {cardData.logo && <div className="mt-1">{cardData.logo}</div>}
                </div>
                <WifiIcon />
            </div>

            <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-2">
                    <CardChipIcon />
                    <p className="text-xl font-mono tracking-widest">{formatCardNumber(cardData.cardNumber)}</p>
                </div>
                <div className="text-left">
                    <p className="text-sm opacity-80">Saldo Tersisa</p>
                    <p className="text-2xl font-bold">{formatCurrency(cardData.balance)}</p>
                </div>
            </div>
            
             <div className={`absolute bottom-4 right-4 text-xs font-semibold px-2 py-1 rounded-full z-10 ${statusClasses}`}>
                {statusText}
            </div>
        </div>
    );
};

export default CardDisplay;
