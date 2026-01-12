'use client';

import { useState } from 'react';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function EnvioPage() {
    const [formData, setFormData] = useState({
        nombreRemitente: '',
        telefonoRemitente: '',
        nombreDestinatario: '',
        telefonoDestinatario: '',
        direccion: '',
        referencia: '',
        fechaEntrega: '',
        dedicatoria: '',
        tipoTarjeta: 'estandar'
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para enviar a Supabase
        console.log('Datos enviados:', formData);
        setSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-primary-900 mb-4">¡Datos Recibidos!</h2>
                    <p className="text-stone-600 mb-8">
                        Hemos registrado tu información de envío correctamente. Tu pedido está en buenas manos.
                    </p>
                    <a href="/" className="inline-block bg-primary-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
                        Volver al Inicio
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-4xl font-bold text-primary-900">Datos de Envío</h1>
                    <p className="mt-2 text-stone-600">Completa la información para que tu detalle llegue perfecto.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-100">
                    <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600"></div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* Sección Destinatario */}
                        <div>
                            <h3 className="text-lg font-bold text-primary-800 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                ¿A quién envías?
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nombreDestinatario" className="block text-sm font-medium text-stone-700 mb-1">Nombre del Destinatario</label>
                                    <input
                                        type="text"
                                        id="nombreDestinatario"
                                        name="nombreDestinatario"
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Ej: María Pérez"
                                        value={formData.nombreDestinatario}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="telefonoDestinatario" className="block text-sm font-medium text-stone-700 mb-1">Teléfono de Contacto</label>
                                    <input
                                        type="tel"
                                        id="telefonoDestinatario"
                                        name="telefonoDestinatario"
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Ej: 0991234567"
                                        value={formData.telefonoDestinatario}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Dirección */}
                        <div>
                            <h3 className="text-lg font-bold text-primary-800 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                ¿A dónde va?
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="direccion" className="block text-sm font-medium text-stone-700 mb-1">Dirección Exacta</label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        placeholder="Calle Principal #123 y Calle Secundaria"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="referencia" className="block text-sm font-medium text-stone-700 mb-1">Referencia / Ubicación Google Maps</label>
                                    <textarea
                                        id="referencia"
                                        name="referencia"
                                        rows={2}
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                                        placeholder="Casa color amarillo, frente al parque..."
                                        value={formData.referencia}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fechaEntrega" className="block text-sm font-medium text-stone-700 mb-1">Fecha y Hora Preferida</label>
                                    <input
                                        type="datetime-local"
                                        id="fechaEntrega"
                                        name="fechaEntrega"
                                        required
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        value={formData.fechaEntrega}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Dedicatoria */}
                        <div>
                            <h3 className="text-lg font-bold text-primary-800 border-b border-primary-100 pb-2 mb-4 flex items-center gap-2">
                                <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                El Mensaje
                            </h3>
                            <div>
                                <label htmlFor="dedicatoria" className="block text-sm font-medium text-stone-700 mb-1">Mensaje para la Tarjeta</label>
                                <textarea
                                    id="dedicatoria"
                                    name="dedicatoria"
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-serif italic text-lg text-stone-600 bg-stone-50"
                                    placeholder="Escibe aquí tus palabras..."
                                    value={formData.dedicatoria}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-right text-stone-400 mt-1">Revisaremos la ortografía antes de imprimir.</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-primary-700 text-white font-bold py-4 rounded-xl hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Confirmar Datos de Envío
                            </button>
                        </div>

                    </form>
                </div>
                <p className="text-center text-stone-400 text-sm mt-8">
                    Tus datos están protegidos. Florería El Tulipán &copy; 2024
                </p>
            </div>
            <FloatingWhatsApp />
        </div>
    );
}
