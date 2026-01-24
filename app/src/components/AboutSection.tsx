'use client';

import Image from 'next/image';

export default function AboutSection() {
    return (
        <section id="nosotros" className="py-24 bg-white relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Contenido de Texto */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-xs font-bold tracking-widest uppercase mb-6">
                            Sobre Nosotros
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-6 leading-tight">
                            Pasión por el detalle, <br />
                            <span className="text-primary-500 italic font-light">amor en cada flor.</span>
                        </h2>

                        <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                            <p>
                                En <strong className="text-primary-800">Florería El Tulipán</strong>, no solo vendemos flores; creamos experiencias. Ubicados en <strong>Ambato</strong>, nos enorgullece ofrecer una <strong>variedad exclusiva</strong> que va más allá de lo convencional. Con mas de 25 años de experiencia ofrecemos hermosos <strong>arreglos florales</strong> adaptándonos a las tendencias globales, realizando el detalle ideal para esa persona especial.
                            </p>
                            <p>
                                Cada creación es una obra de arte confeccionada con pasión y creatividad. Ya sea para celebrar el amor, la amistad, o simplemente para alegrar el alma, nuestro compromiso es plasmar sentimientos en cada diseño floral, con elegancia y un servicio excepcional.
                            </p>
                        </div>

                        {/* Firma / Sello de Calidad */}
                        <div className="mt-10 flex items-center gap-6 border-t border-stone-100 pt-8">
                            <div className="flex flex-col">
                                <span className="font-serif text-2xl text-primary-900">El Tulipán</span>
                                <span className="text-xs text-stone-400 uppercase tracking-widest">Desde Ambato con Amor</span>
                            </div>
                            <div className="h-12 w-px bg-stone-200"></div>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <span className="block font-bold text-xl text-primary-600">100%</span>
                                    <span className="text-[10px] text-stone-400 uppercase">Frescura</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-xl text-primary-600">+5k</span>
                                    <span className="text-[10px] text-stone-400 uppercase">Entregas</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Composición de Imágenes */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/florista.jpeg"
                                alt="Florista trabajando en su taller floral"
                                fill
                                className="object-cover object-[center_0%] hover:scale-105 transition-transform duration-700"
                                unoptimized={true}
                            />
                            {/* Overlay degradado */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        </div>

                        {/* Imagen Flotante Pequeña - Efecto Parallax simulado */}
                        <div className="absolute -bottom-10 -left-10 w-2/3 h-64 rounded-xl overflow-hidden shadow-xl border-4 border-white hidden md:block animate-float">
                            <Image
                                src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800"
                                alt="Detalle de flores"
                                fill
                                className="object-cover"
                                unoptimized={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
