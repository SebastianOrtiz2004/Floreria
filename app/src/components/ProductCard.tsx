import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';
import supabaseLoader from '@/lib/supabase-loader';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const phoneNumber = '593995676815'; // Número real
    const message = `Hola, quiero el arreglo '${product.name}' de $${product.price}. ¿Está disponible?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-500 overflow-hidden border border-stone-100/50 hover:border-primary-100 relative flex flex-col h-full">
            {/* Imagen Vertical Elegante - Clickable */}
            <Link href={`/product/${product.id}`} className="relative h-[250px] md:h-[420px] w-full overflow-hidden bg-stone-100 block cursor-pointer">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loader={supabaseLoader}
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badge de Precio - Estilo Etiqueta Boutique */}
                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/95 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm font-serif font-medium text-primary-900 shadow-sm rounded-sm">
                    ${product.price.toFixed(2)}
                </div>
            </Link>

            <div className="p-3 md:p-6 text-center bg-white flex flex-col flex-grow">
                <div className="mb-1 md:mb-2">
                    <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-primary-400">
                        {product.category}
                    </span>
                </div>

                <Link href={`/product/${product.id}`} className="block group-hover:text-primary-700 transition-colors">
                    <h3 className="text-sm md:text-xl font-serif font-medium text-primary-900 mb-2 md:mb-3 leading-tight min-h-[40px] md:min-h-[56px] flex items-center justify-center line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Botón Desktop: Aparece sutilmente */}
                <div className="pt-2 mt-auto w-full">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-2 py-2 md:px-8 md:py-3 border border-primary-200 text-primary-900 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-primary-900 hover:text-white hover:border-primary-900 transition-all duration-300 rounded-sm"
                    >
                        Ordenar
                    </a>
                </div>
            </div>
        </div>
    );
}
