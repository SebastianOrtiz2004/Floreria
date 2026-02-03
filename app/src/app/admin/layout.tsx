'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex font-sans relative">
            {/* Overlay para móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-stone-900/50 z-20 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Responsivo */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 bg-primary-900 text-white flex flex-col shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 border-b border-primary-800 flex items-center justify-between lg:justify-start gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center font-serif font-bold text-white text-lg">
                            T
                        </div>
                        <div>
                            <h1 className="font-serif font-bold text-lg leading-tight">El Tulipán</h1>
                            <p className="text-xs text-primary-300">Admin Console</p>
                        </div>
                    </div>
                </div>

                {/* Botón Cerrar Menú en Móvil (Opcional, ya que se cierra con el overlay o navegando) */}
                <div className="lg:hidden absolute top-4 right-4">
                    <button onClick={() => setIsSidebarOpen(false)} className="text-primary-300 p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <p className="px-4 text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 mt-2">Principal</p>
                    <Link
                        href="/admin"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-primary-800 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                        </svg>
                        <span>Dashboard / Pedidos</span>
                    </Link>

                    <p className="px-4 text-xs font-bold text-primary-400 uppercase tracking-wider mb-2 mt-6">Gestión</p>
                    <Link
                        href="/admin/inventario"
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-primary-800 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Inventario & Productos</span>
                    </Link>

                </nav>

                <div className="p-4 border-t border-primary-800">
                    <button
                        onClick={() => {
                            setIsSidebarOpen(false);
                            setShowLogoutModal(true);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-primary-300 hover:text-white w-full transition-colors hover:bg-primary-800 rounded-lg group"
                    >
                        <svg className="w-5 h-5 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="group-hover:text-red-100 transition-colors">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden relative z-10 w-full">
                {/* Topbar sticky */}
                <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        {/* Botón Hamburguesa Admin */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-stone-500 hover:text-primary-700 p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-stone-800 truncate">Panel de Administración</h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="hidden sm:inline text-sm text-stone-500">Bienvenido, Admin</span>
                        <div className="h-8 w-8 sm:h-9 sm:w-9 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold border border-primary-200 shadow-inner text-sm">
                            A
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto bg-stone-50 p-4 sm:p-6">
                    {children}
                </div>
            </main>

            {/* Modal de Logout con Animación Glassmorphism */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop con blur */}
                    <div
                        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                        onClick={() => !isLoggingOut && setShowLogoutModal(false)}
                    ></div>

                    {/* Modal Card */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg leading-6 font-bold text-stone-900 mb-2">
                                ¿Cerrar sesión?
                            </h3>
                            <p className="text-sm text-stone-500 mb-6">
                                Estás a punto de salir del panel de administración. Tendrás que volver a ingresar tu contraseña para acceder.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full inline-flex justify-center rounded-xl border border-stone-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-stone-700 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={isLoggingOut}
                                onClick={handleLogout}
                                className="w-full inline-flex justify-center items-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition-all disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoggingOut ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saliendo...
                                    </>
                                ) : (
                                    'Sí, Cerrar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
