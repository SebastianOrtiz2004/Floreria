'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

            {/* Menú Móvil Desplegable */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-stone-100 shadow-lg animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <a
                            href="#catalogo"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-primary-900 hover:bg-primary-50 transition-colors"
                        >
                            Catálogo
                        </a>
                        <a
                            href="#nosotros"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-lg text-base font-medium text-stone-700 hover:text-primary-900 hover:bg-primary-50 transition-colors"
                        >
                            Nosotros
                        </a>
                        <a
                            href="https://wa.me/593995676815"
                            onClick={() => setIsMenuOpen(false)}
                            className="block w-full text-center mt-4 bg-primary-700 text-white px-5 py-3 rounded-xl text-base font-medium shadow-md hover:bg-primary-800 transition-colors"
                        >
                            Pedir por WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
