
import React from 'react';

export const InfinityPayLogo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.364 7.63604C14.6736 5.94562 12.4413 5 10 5C5.02944 5 1 9.02944 1 14C1 18.9706 5.02944 23 10 23C14.9706 23 19 18.9706 19 14C19 11.5587 18.0544 9.3264 16.364 7.63604Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(2, -2)"/>
        <path d="M7.63604 16.364C9.3264 18.0544 11.5587 19 14 19C18.9706 19 23 14.9706 23 10C23 5.02944 18.9706 1 14 1C9.02944 1 5 5.02944 5 10C5 12.4413 5.94562 14.6736 7.63604 16.364Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(-2, 2)"/>
    </svg>
);

export const CardChipIcon = () => (
    <svg width="48" height="38" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="47" height="37" rx="3.5" fill="#D1D5DB" fillOpacity="0.8" stroke="#FBBF24" />
        <path d="M24 0V11M24 38V27M48 19H35M0 19H13" stroke="#FBBF24" strokeWidth="1" />
        <rect x="16" y="12" width="16" height="14" rx="2" fill="#FBBF24" />
    </svg>
);

export const WifiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
);

export const MandiriLogo = () => <div className="font-bold text-lg bg-white text-blue-600 px-3 py-1 rounded">e-money</div>;
export const BriLogo = () => <div className="font-extrabold text-xl text-white italic">BRIZZI</div>;
export const BniLogo = () => <div className="font-bold text-lg text-white">TapCash</div>;
export const BcaLogo = () => <div className="font-serif font-bold text-xl text-blue-900 bg-white px-2 rounded-sm">Flazz</div>;
export const DkiLogo = () => <div className="font-sans font-bold text-lg text-white">JakCard</div>;

export const NfcIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8.32a7.43 7.43 0 0 1 7.43 7.43" />
        <path d="M6 12.16a3.59 3.59 0 0 1 3.59 3.59" />
        <path d="M6 4a12 12 0 0 1 12 12" />
        <path d="M18 6a12 12 0 0 1-12 12" />
    </svg>
);
