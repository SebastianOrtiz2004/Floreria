import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // ⚠️ IMPORTANTE: Aquí defines tu contraseña segura.
        // Idealmente esto debería venir de una variable de entorno como process.env.ADMIN_PASSWORD
        const SECRET_PASSWORD = "admin_floreria";

        if (password === SECRET_PASSWORD) {
            // Crear la respuesta exitosa
            const response = NextResponse.json({ success: true });

            // Establecer cookie 'auth_token' segura
            // En producción, 'secure: true' es obligatorio (requiere HTTPS)
            const cookieStore = await cookies();
            cookieStore.set('auth_token', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 día de sesión
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
