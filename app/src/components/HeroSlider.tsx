"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        // Composición floral amplia y elegante (Flat Lay) - Alta disponibilidad
        image: "https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=2400&q=80",
        alt: "Diseño floral artístico vista superior"
    },
    {
        id: 2,
        // (Aprobada) Primer plano artístico de rosas
        image: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?auto=format&fit=crop&w=2400&q=80",
        alt: "Textura de rosas naturales"
    },
    {
        id: 3,
        // Ramo de flores estético (Garantizado)
        image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=2400&q=80",
        alt: "Arreglo floral elegante"
    }
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-advance
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="absolute inset-0 z-0 bg-primary-50">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={slide.image}
                        alt={slide.alt}
                        fill
                        className="object-cover opacity-100 animate-subtle-zoom"
                        priority={index === 0}
                        unoptimized={true}
                    />
                    {/* Overlay Estratégico: Degradado blanco más intenso para legibilidad total del texto oscuro */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-white/70 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-white/40" />
                </div>
            ))}

            {/* Overlay Global Unificador - Más suave para dejar ver las fotos */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-primary-50/80 via-transparent to-primary-50/30 pointer-events-none" />

            {/* Controles de Navegación */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 flex justify-between px-4 md:px-12 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-primary-800 hover:bg-white hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-lg"
                    aria-label="Anterior imagen"
                >
                    <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md border border-white/50 text-primary-800 hover:bg-white hover:scale-110 transition-all duration-300 group shadow-sm hover:shadow-lg"
                    aria-label="Siguiente imagen"
                >
                    <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Indicadores de Puntos */}
            <div className="absolute bottom-10 left-1/2 z-30 transform -translate-x-1/2 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsAutoPlaying(false);
                            setCurrentSlide(index);
                        }}
                        className={`transition-all duration-500 rounded-full shadow-sm ${index === currentSlide
                            ? "w-8 h-2 bg-primary-500"
                            : "w-2 h-2 bg-primary-200 hover:bg-primary-300"
                            }`}
                        aria-label={`Ir a la imagen ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
