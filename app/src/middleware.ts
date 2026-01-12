import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Solo protegemos las rutas que empiezan con /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const authToken = request.cookies.get('auth_token');

        // Si no hay cookie de autenticación, redirigir al login
        if (!authToken || authToken.value !== 'authenticated') {
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configuración del matcher para que el middleware solo se ejecute en rutas relevantes
export const config = {
    matcher: '/admin/:path*',
};
