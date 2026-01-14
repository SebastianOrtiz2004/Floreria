import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';

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
            <Link href={`/product/${product.id}`} className="relative h-[420px] w-full overflow-hidden bg-white block cursor-pointer">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Badge de Precio - Estilo Etiqueta Boutique */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 text-sm font-serif font-medium text-primary-900 shadow-sm rounded-sm">
                    ${product.price.toFixed(2)}
                </div>
            </Link>

            <div className="p-6 text-center bg-white flex flex-col flex-grow">
                <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-primary-400">
                        {product.category}
                    </span>
                </div>

                <Link href={`/product/${product.id}`} className="block group-hover:text-primary-700 transition-colors">
                    <h3 className="text-xl font-serif font-medium text-primary-900 mb-3 leading-tight min-h-[56px] flex items-center justify-center">
                        {product.name}
                    </h3>
                </Link>

                {/* Botón Desktop: Aparece sutilmente */}
                <div className="pt-2 mt-auto">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-3 border border-primary-200 text-primary-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary-900 hover:text-white hover:border-primary-900 transition-all duration-300 w-full md:w-auto min-w-[160px]"
                    >
                        Ordenar
                    </a>
                </div>
            </div>
        </div>
    );
}
