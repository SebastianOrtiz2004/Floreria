import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Rutas que NO DEBEN ser redirigidas a mantenimiento
    const isMaintenancePage = pathname === '/maintenance';
    const isExcludedPath =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/public') ||
        pathname.includes('.') || // Archivos como .jpg, .css, .ico
        isMaintenancePage;

    // 2. Si NO es una ruta excluida, redirigir a Mantenimiento
    if (!isExcludedPath) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
    }

    // 3. Lógica existente para proteger /admin
    if (pathname.startsWith('/admin')) {
        const authToken = request.cookies.get('auth_token');

        // Si no hay cookie de autenticación, redirigir al login
        if (!authToken || authToken.value !== 'authenticated') {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configuración del matcher para que el middleware se ejecute en TODAS las rutas
export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
