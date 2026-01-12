# Guía de Imágenes - Florería El Tulipán

Esta carpeta está diseñada para que organices las imágenes de tu sitio web de manera profesional.

## Estructura de Carpetas

### 1. `/logo`
Coloca aquí el logotipo de tu empresa.
- **Recomendación**: Usa formato `.png` con fondo transparente o `.svg` (vectorial) para mejor calidad.
- **Nombre de archivo sugerido**: `logo-main.png` o `logo.png`.

### 2. `/products`
Aquí debes guardar las fotos de tus arreglos florales.
- **Recomendación**: 
    - Trata de que todas las fotos sean cuadradas (relación 1:1) o verticales (3:4) para mantener uniformidad.
    - Nombres sugeridos: `primavera-eterna.jpg`, `pasion-escarlata.jpg`, etc.
    - **Tamaño**: Idealmente menos de 200KB por imagen para que la web cargue rápido. Puedes usar herramientas como [TinyPNG](https://tinypng.com) para comprimirlas.

### 3. `/ui`
Para imágenes decorativas del sitio, como el fondo de la portada (Hero) o iconos especiales.
- **Hero/Banner**: `hero-bg.jpg` (Alta calidad, ~1920px de ancho).

## Cómo usar tus imágenes en el código

Cuando quieras usar una imagen en el código (por ejemplo en `src/data/products.ts`), la ruta empieza con `/images`.

**Ejemplo:**
Si guardas una foto en `public/images/products/rosa.jpg`, la ruta en el código será:
```typescript
image: '/images/products/rosa.jpg'
```
