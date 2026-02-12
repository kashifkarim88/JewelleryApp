"use client"
import React, { useState } from 'react';
import MainHeader from './MainHeader';
import DesktopSidebar from './DesktopSidebar';

// IMPORTANT: Make sure these paths match your folder structure exactly
import IndexPage from './IndexPage';
import StockPage from './StockPage';
import InvoicePage from './InvoicePage';

export default function HomePage() {
    const [activeTab, setActiveTab] = useState('Index');

    // 1. You must define the function here
    const renderContent = () => {
        switch (activeTab) {
            case 'Index':
                return <IndexPage />;
            case 'Stock':
                return <StockPage />;
            case 'Invoice':
                return <InvoicePage />;
            default:
                return <IndexPage />;
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <MainHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex flex-1 overflow-hidden">
                <div className="hidden md:block">
                    <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <main className="flex-1 p-5 md:p-8 overflow-y-auto bg-white">
                    {/* 2. Now this call will work because the function exists above */}
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}