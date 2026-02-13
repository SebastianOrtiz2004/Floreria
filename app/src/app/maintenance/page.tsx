import Image from 'next/image';

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-primary-50 flex flex-col items-center justify-center p-6 text-center">
            {/* Contenedor principal con efecto de tarjeta elegante */}
            <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-primary-100 p-8 md:p-12 relative animate-fade-in">

                {/* Elemento decorativo de fondo */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-300 via-primary-500 to-primary-300"></div>

                {/* Logo de marca sutil */}
                <div className="mb-8">
                    <span className="text-xs font-bold tracking-[0.4em] text-primary-400 uppercase border-b border-primary-100 pb-2">
                        Florería El Tulipán
                    </span>
                </div>

                <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary-900 mb-2 tracking-tight">
                    ¡Gracias por su Preferencia!
                </h1>

                <div className="w-24 h-1 bg-primary-200 mx-auto rounded-full my-6"></div>

                <div className="relative w-full aspect-square max-w-sm mx-auto mb-8 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-500 group">
                    <Image
                        src="/images/CuposAgotados.jpeg"
                        alt="Cupos Agotados"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    {/* Overlay sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 to-transparent"></div>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-primary-800 tracking-widest uppercase mb-4">
                    CUPOS AGOTADOS
                </h2>

                <div className="prose prose-stone mx-auto text-stone-600 mb-8 max-w-lg">
                    <p className="text-lg leading-relaxed font-light">
                        Queridos clientes, debido a la inmensa acogida, hemos alcanzado nuestra capacidad máxima.
                    </p>
                    <p className="text-lg leading-relaxed font-medium text-primary-900 mt-4">
                        Por el momento ya no estamos receptando pedidos.
                    </p>
                    <p className="text-sm mt-6 italic text-stone-400 border-t border-primary-50 pt-4">
                        Tomamos esta decisión para garantizar que cada arreglo mantenga la calidad,
                        frescura y el estilo único que nos caracteriza.
                    </p>
                </div>
            </div>

            {/* Footer minimalista */}
            <div className="mt-8 text-primary-300 text-xs tracking-wider font-light uppercase">
                &copy; {new Date().getFullYear()} Florería El Tulipán
            </div>
        </div>
    );
}
