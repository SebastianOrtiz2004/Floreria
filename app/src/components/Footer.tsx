export default function Footer() {
    return (
        <footer className="bg-primary-900 text-primary-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <span className="font-serif text-2xl font-bold text-white tracking-tight">
                            Florería El Tulipán
                        </span>
                        <p className="mt-4 text-sm text-primary-200">
                            Transformando sentimientos en arte floral. Entregas a domicilio en la ciudad de Ambato y alrededores.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Enlaces</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <a href="#" className="text-base text-primary-300 hover:text-white transition-colors">
                                    Catálogo
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-base text-primary-300 hover:text-white transition-colors">
                                    Términos y Condiciones
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Contacto</h3>
                        <ul className="mt-4 space-y-4">
                            <li className="flex items-center">
                                <span className="text-primary-300">Avenida Cevallos entre Pasaje Rodó y Guayaquil, Ambato - Ecuador</span>
                            </li>
                            <li className="mt-2">
                                <a
                                    href="https://maps.app.goo.gl/ENGpiXYfjbyQjBz97?g_st=aw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all border border-white/10 hover:border-white/30 shadow-sm group"
                                >
                                    <svg className="w-4 h-4 text-primary-300 group-hover:text-white transition-colors animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Ver Ubicación en Mapa
                                </a>
                            </li>
                            <li className="flex items-center">
                                <a href="https://wa.me/593995676815" className="text-primary-300 hover:text-white transition-colors">
                                    +593 99 567 6815
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-primary-800 pt-8 md:flex md:items-center md:justify-between">
                    <p className="text-base text-primary-400">
                        &copy; {new Date().getFullYear()} Florería El Tulipán. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
