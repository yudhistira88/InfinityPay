
import React from 'react';
import { InfinityPayLogo } from './Icons';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm w-full">
            <div className="flex items-center space-x-3 text-blue-700">
                <InfinityPayLogo />
                <h1 className="text-xl font-bold tracking-tight text-slate-900">InfinityPay</h1>
            </div>
        </header>
    );
};

export default Header;
