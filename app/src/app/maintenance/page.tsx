import Image from 'next/image';

export default function MaintenancePage() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* 1. IMAGEN DE FONDO (Blurred) para atmósfera */}
            <div className="absolute inset-0 opacity-50 blur-xl scale-110">
                <Image
                    src="/images/CuposAgotados.jpeg"
                    alt="Fondo"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Overlay oscuro para legibilidad */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* 2. TARJETA CENTRAL (Diseño tipo Historia de Instagram/WhatsApp) */}
            <div className="relative z-10 w-full max-w-sm mx-auto bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl animate-fade-in flex flex-col">

                {/* Cabecera de la Tarjeta */}
                <div className="p-6 text-center border-b border-white/10">
                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] text-white/80 uppercase">
                        Florería El Tulipán
                    </span>
                    <h1 className="font-serif text-3xl font-medium text-white mt-2 leading-tight">
                        Gracias por su <br />
                        <span className="text-primary-200 italic">Preferencia</span>
                    </h1>
                </div>

                {/* Imagen Principal */}
                <div className="relative w-full aspect-square">
                    <Image
                        src="/images/CuposAgotados.jpeg"
                        alt="Cupos Agotados"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Badge Sutil */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Sold Out</span>
                    </div>
                </div>

                {/* Cuerpo del Mensaje */}
                <div className="p-8 text-center bg-white">
                    <h2 className="text-xl font-bold text-stone-900 tracking-widest uppercase mb-4">
                        CUPOS AGOTADOS
                    </h2>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                        Queridos clientes, debido a la gran acogida, hemos alcanzado nuestra capacidad máxima.
                    </p>
                    <p className="text-stone-500 text-xs italic">
                        "Cerramos pedidos para garantizar la calidad y frescura en cada detalle que nos caracteriza."
                    </p>

                    <div className="mt-6 w-12 h-1 bg-primary-200 mx-auto rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
