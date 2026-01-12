---
description: Guía paso a paso para desplegar la aplicación Next.js en Vercel
---

# Despliegue en Vercel

Esta guía te ayudará a poner tu florera en línea utilizando Vercel, la plataforma recomendada para Next.js.

## 1. Preparación en GitHub (Recomendado)

La forma más fácil de desplegar es conectando tu repositorio de GitHub.

1.  Asegúrate de que todo tu código esté guardado y subido a un repositorio en GitHub.
    *   Si aún no lo has hecho:
        ```bash
        git add .
        git commit -m "Listo para producción"
        git push
        ```

## 2. Configuración en Vercel

1.  Ve a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2.  En tu Dashboard, haz clic en **"Add New..."** -> **"Project"**.
3.  Busca tu repositorio `Floreria` en la lista y haz clic en **"Import"**.

## 3. Configuración del Proyecto

En la pantalla de "Configure Project":

1.  **Framework Preset**: Debería detectar automáticamente **Next.js**.
2.  **Root Directory**: Si tu `package.json` está en la raíz (que lo está), déjalo como está (`./`).

### ⚠️ IMPORTANTE: Variables de Entorno

Esta es la parte más crítica. Debes agregar las variables para que Supabase y el Login funcionen.

Despliega la sección **"Environment Variables"** y agrega una por una las mismas que tienes en tu archivo `.env.local`:

| Key (Nombre) | Value (Valor) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | *Tu URL de Supabase (ej: https://...supabase.co)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *Tu Anon Key de Supabase* |
| `ADMIN_PASSWORD` | *La contraseña que definiste para entrar al admin* |

*Nota: Copia y pega estos valores directamente desde tu archivo `.env.local` o desde el panel de Supabase.*

## 4. Desplegar

1.  Una vez agregadas las variables, haz clic en el botón **"Deploy"**.
2.  Vercel comenzará a construir tu aplicación. Esto tomará un minuto aproximadamente.
3.  ¡Listo! Verás una pantalla de felicitaciones con una captura de tu web.

## 5. Post-Despliegue (Supabase)

Para que todo funcione perfecto en producción:

1.  **URL del Sitio**: Copia la URL que Vercel te asignó (ej: `floreria-sebastian.vercel.app`).
2.  **Supabase Auth (Opcional)**: Si en el futuro usas autenticación de Supabase (login de usuarios, no solo admin), ve a tu panel de Supabase -> Authentication -> URL Configuration y agrega tu dominio de Vercel en "Site URL" y "Redirect URLs".
3.  **Storage**: Asegúrate de que tus buckets de Supabase sean públicos (como lo configuramos) para que las imágenes se vean.

## Solución de Problemas Comunes

*   **Las imágenes no cargan**:
    *   Verifica que agregaste `NEXT_PUBLIC_SUPABASE_URL` a las variables de entorno en Vercel.
    *   Asegúrate de que `next.config.ts` tenga el dominio de Supabase configurado (ya lo hicimos en un paso anterior).
*   **No puedo entrar al Admin**:
    *   Verifica que la variable `ADMIN_PASSWORD` esté correctamente escrita en Vercel.

---
¡Ahora tu floristería es accesible para todo el mundo! 🌸🚀
