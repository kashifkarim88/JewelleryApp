"use client"
import React, { useState } from 'react';
import { Menu, X, House, Box, FileText } from 'lucide-react';

// Define what props this component accepts
interface HeaderProps {
    activeTab: string;
    setActiveTab: (tabName: string) => void;
}

export default function MainHeader({ activeTab, setActiveTab }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Update these to match your actual pages
    const navItems = [
        { name: 'Home', icon: <House size={20} /> },
        { name: 'Stock', icon: <Box size={20} /> },
        { name: 'Invoice', icon: <FileText size={20} /> },
    ];

    return (
        <>
            <header className='bg-gray-600 p-5 flex justify-between items-center z-50 relative'>
                <h1 className='text-white font-sans text-2xl font-semibold'>Hamidullah Jewellery</h1>

                <button onClick={toggleMenu} className='text-white md:hidden'>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </header>

            <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={toggleMenu}>
                <div
                    className={`bg-white w-64 h-full p-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className='text-xl font-bold mb-6 border-b pb-2 text-gray-800'>Menu</h2>
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <button
                                    onClick={() => {
                                        setActiveTab(item.name);
                                        setIsOpen(false); // Close menu after clicking
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${activeTab === item.name
                                        ? 'bg-gray-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon} {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}