'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/data/products';

interface Category {
    id: number;
    name: string;
}

interface CatalogSectionProps {
    products: Product[];
    categories: Category[];
}

export default function CatalogSection({ products, categories }: CatalogSectionProps) {
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const filteredProducts = selectedCategory === 'Todos'
        ? products
        : products.filter(p => p.category === selectedCategory);

    // Combinar 'Todos' con las categorías dinámicas
    const categoryNames = ['Todos', ...categories.map(c => c.name)];

    return (
        <section id="catalogo" className="py-32 bg-primary-50 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[100px] opacity-40 pointer-events-none mix-blend-soft-light"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-200 rounded-full blur-[100px] opacity-20 pointer-events-none mix-blend-multiply"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-24">
                    <span className="text-primary-400 font-bold tracking-[0.3em] uppercase text-xs">Colección 2024</span>
                    <h2 className="mt-4 text-5xl md:text-7xl font-serif font-medium text-primary-900 tracking-tight">
                        Nuestros Arreglos
                    </h2>
                    <p className="mt-6 text-primary-800/60 max-w-2xl mx-auto text-lg font-light">Diseños únicos pensados para expresar lo que las palabras no pueden.</p>
                </div>

                {/* Categorías Filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-20 px-4">
                    {categoryNames.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${cat === selectedCategory
                                    ? 'bg-primary-900 text-white shadow-xl shadow-primary-900/10 transform scale-105'
                                    : 'bg-white text-primary-900/70 hover:bg-primary-50 hover:text-primary-900 border border-transparent hover:border-primary-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid de Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-primary-800/50 text-lg">No hay productos disponibles en esta categoría.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
