
import React from 'react';
import type { CardInfo } from './types';
import { BcaLogo, BniLogo, BriLogo, DkiLogo, MandiriLogo } from './components/Icons';

const CARD_DEFINITIONS: { prefixes: string[], info: CardInfo }[] = [
  {
    prefixes: ['6032'],
    info: { name: 'Mandiri e-Money', logo: MandiriLogo(), gradient: 'from-blue-800 to-sky-500' }
  },
  {
    prefixes: ['5809', '8888'],
    info: { name: 'BRI BRIZZI', logo: BriLogo(), gradient: 'from-cyan-500 to-blue-600' }
  },
  {
    prefixes: ['0001', '2872'],
    info: { name: 'BNI TapCash', logo: BniLogo(), gradient: 'from-orange-500 to-yellow-500' }
  },
  {
    prefixes: ['6013'],
    info: { name: 'BCA Flazz', logo: BcaLogo(), gradient: 'from-blue-600 to-blue-900' }
  },
  {
    prefixes: ['1001'],
    info: { name: 'JakCard Bank DKI', logo: DkiLogo(), gradient: 'from-red-500 to-orange-600' }
  },
];


export const UNKNOWN_CARD: CardInfo = {
  name: 'Kartu Tidak Dikenal',
  logo: null,
  gradient: 'from-gray-600 to-gray-800',
};

/**
 * Identifies card information based on the card number prefix.
 * @param cardNumber - The full card number string.
 * @returns The corresponding CardInfo object or UNKNOWN_CARD if not found.
 */
export const getCardInfoByNumber = (cardNumber: string): CardInfo => {
    if (typeof cardNumber !== 'string' || cardNumber.length < 4) {
        return UNKNOWN_CARD;
    }
    const prefix = cardNumber.substring(0, 4);
    const foundCard = CARD_DEFINITIONS.find(card => card.prefixes.includes(prefix));
    return foundCard ? foundCard.info : UNKNOWN_CARD;
};
