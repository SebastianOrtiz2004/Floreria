
import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { supabase } from '@/lib/supabase';

// Revalidate data every 60 seconds
export const revalidate = 60;

// Type definition
interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

// Fetch product data
async function getProduct(id: string) {
    const { data: product, error } = await supabase
        .from('products')
        .select(`
      *,
      categories (name)
    `)
        .eq('id', id)
        .single();

    if (error || !product) {
        console.error("Error fetching product:", error);
        return null;
    }

    return {
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image_url || 'https://images.unsplash.com/photo-1563241527-3af805364841?q=80&w=800',
        category: product.categories?.name || 'Varios',
        description: product.description || 'Una hermosa selección de flores frescas diseñadas para cautivar.'
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const phoneNumber = '593995676815';
    const message = `Hola, estoy interesado en el arreglo '${product.name}' de $${product.price}. ¿Me podrían dar más información?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-primary-50">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm text-stone-500 mb-8">
                        <Link href="/" className="hover:text-primary-700 transition-colors">Inicio</Link>
                        <span>/</span>
                        <Link href="/#catalogo" className="hover:text-primary-700 transition-colors">Catálogo</Link>
                        <span>/</span>
                        <span className="text-primary-800 font-medium truncate">{product.name}</span>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Product Image Side */}
                            <div className="relative h-[500px] lg:h-[700px] bg-white">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>

                            {/* Product Details Side */}
                            <div className="p-8 lg:p-16 flex flex-col justify-center bg-white relative">
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative z-10">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-bold tracking-widest uppercase mb-6">
                                        {product.category}
                                    </span>

                                    <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-900 mb-4 leading-tight">
                                        {product.name}
                                    </h1>

                                    <div className="text-3xl font-light text-primary-700 mb-8">
                                        ${product.price.toFixed(2)}
                                    </div>

                                    <div className="w-16 h-1 bg-primary-100 mb-8"></div>

                                    <div className="prose prose-stone text-stone-600 mb-10 leading-relaxed font-light text-lg">
                                        <p>{product.description}</p>
                                        <p className="mt-4 text-sm text-stone-400 italic">
                                            Nota: Debido a la naturaleza estacional de las flores, algunos tallos pueden variar ligeramente, manteniendo siempre el estilo y calidad premium del diseño.
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-primary-700 text-white text-center px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-primary-800 transition-all shadow-lg hover:shadow-primary-900/20 hover:-translate-y-1 flex items-center justify-center gap-2"
                                        >
                                            <span>Ordenar por WhatsApp</span>
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.698c1.005.572 1.903.87 3.05.87 4.961 0 5.061-6.195 5.061-6.195a6.6 6.6 0 0 0-5.305-5.622z" /></svg>
                                        </a>
                                    </div>

                                    <div className="mt-12 pt-8 border-t border-stone-100 flex items-center gap-4 text-stone-400 text-sm">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                                            <span>Entrega Segura</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <span>Frescura Garantizada</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <FloatingWhatsApp />
        </div>
    );
}
