'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    return (
        <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
            {/* Barra superior de anuncios */}
            <div className="bg-primary-900 text-white text-xs py-1 text-center tracking-wide hidden sm:block">
                Envíos a domicilio en Ambato • Pedidos al +593 99 567 6815
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-primary-100 shadow-sm">
                            <Image src="/images/logo/logoi.jpg" alt="Florería El Tulipán" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-serif text-lg sm:text-2xl font-bold text-primary-900 tracking-tight leading-none">
                                Florería El Tulipán
                            </h1>
                            <span className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.2em] text-primary-500 mt-1">Diseño Floral</span>
                        </div>
                    </div>

                    {/* Menú Desktop */}
                    <nav className="hidden md:flex space-x-10">
                        <a href="#catalogo" className="text-stone-600 hover:text-primary-700 font-medium text-sm tracking-wide transition-colors relative group">
                            CATÁLOGO
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all group-hover:w-full"></span>
                        </a>
                        <a href="#nosotros" className="text-stone-600 hover:text-primary-700 font-medium text-sm tracking-wide transition-colors relative group">
                            NOSOTROS
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 transition-all group-hover:w-full"></span>
                        </a>
                    </nav>

                    {/* Botón CTA Desktop */}
                    <div className="hidden md:flex items-center">
                        <a
                            href="https://wa.me/593995676815"
                            className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            Pedir Ahora
                        </a>
                    </div>

                    {/* Botón Hamburguesa Móvil */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-primary-900 hover:text-primary-700 p-2 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú Móvil - Sidebar Profesional */}
            {mounted && isMenuOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex justify-end">
                    {/* Overlay Oscuro con Blur */}
                    <div
                        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Panel Lateral Deslizable */}
                    <div className="relative w-full max-w-xs h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Cabecera del Menú */}
                        <div className="flex items-center justify-between px-6 pt-8 pb-6 bg-white border-b border-stone-100">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary-100 shadow-sm">
                                    <Image src="/images/logo/logoi.jpg" alt="Logo" fill className="object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-serif text-lg font-bold text-primary-900 leading-none">El Tulipán</span>
                                    <span className="text-[0.6rem] text-primary-500 uppercase tracking-widest mt-0.5">Diseño Floral</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 -mr-2 text-stone-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                aria-label="Cerrar menú"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Lista de Navegación */}
                        <nav className="flex-1 px-6 py-8 overflow-y-auto">
                            <ul className="space-y-1">
                                <li>
                                    <a
                                        href="#catalogo"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between py-4 text-stone-800 hover:text-primary-700 group border-b border-stone-50"
                                    >
                                        <span className="font-serif text-xl font-medium">Catálogo</span>
                                        <svg className="w-5 h-5 text-stone-300 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#nosotros"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between py-4 text-stone-800 hover:text-primary-700 group border-b border-stone-50"
                                    >
                                        <span className="font-serif text-xl font-medium">Nosotros</span>
                                        <svg className="w-5 h-5 text-stone-300 group-hover:text-primary-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </li>
                            </ul>

                            <div className="mt-10">
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Contacto Directo</p>
                                <a
                                    href="https://wa.me/593995676815"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-center w-full bg-primary-700 text-white px-6 py-4 rounded-xl text-base font-medium shadow-lg hover:bg-primary-800 transition-all active:scale-[0.98]"
                                >
                                    <span className="mr-2">Hacer Pedido por WhatsApp</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.87 3.05.87 4.961 0 5.061-6.195 5.061-6.195a6.6 6.6 0 0 0-5.305-5.622z" /></svg>
                                </a>
                            </div>
                        </nav>

                        {/* Pie de Panel */}
                        <div className="p-6 border-t border-stone-50 bg-stone-50/50">
                            <div className="flex items-center gap-3 opacity-70">
                                <div className="h-8 w-8 relative overflow-hidden rounded-full border border-stone-200">
                                    <Image src="/images/logo/logoi.jpg" alt="Logo" fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-stone-800">Florería El Tulipán</p>
                                    <p className="text-[10px] text-stone-500">Diseño Floral Exclusivo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}
