import Image from 'next/image';

export default function Header() {
    return (
        <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-stone-100 shadow-sm">
            {/* Barra superior de anuncios */}
            <div className="bg-primary-900 text-white text-xs py-1 text-center tracking-wide hidden sm:block">
                Envíos a domicilio en Ambato • Pedidos al +593 99 567 6815
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary-100 shadow-sm">
                            <Image src="/images/logo/logoi.jpg" alt="Florería El Tulipán" fill className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-serif text-2xl font-bold text-primary-900 tracking-tight leading-none">
                                Florería El Tulipán
                            </h1>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-primary-500 mt-1">Diseño Floral</span>
                        </div>
                    </div>
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
                    <div className="flex items-center">
                        <a
                            href="https://wa.me/593995676815"
                            className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg"
                        >
                            Pedir Ahora
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
}
