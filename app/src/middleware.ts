import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Deshabilitar ruta de mantenimiento (Redirigir a Home)
    if (pathname === '/maintenance') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Proteger rutas de admin
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

export const config = {
    matcher: ['/admin/:path*', '/maintenance'],
};
