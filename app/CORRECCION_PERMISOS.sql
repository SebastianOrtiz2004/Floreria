-- ==============================================================================
-- SCRIPT DE CORRECCIÓN DE PERMISOS (EJECUTAR EN SUPABASE SQL EDITOR)
-- ==============================================================================
-- Instrucciones:
-- 1. Ve a tu proyecto en Supabase (app.supabase.com)
-- 2. Entra a la sección "SQL Editor" (icono de hoja/papel en la barra lateral)
-- 3. Crea una "New Query"
-- 4. Pega todo este contenido y presiona "RUN"
-- ==============================================================================

-- 1. Asegurar que RLS esté activado (es buena práctica, aunque vamos a ser permisivos por ahora)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas antiguas para evitar errores de duplicados
DROP POLICY IF EXISTS "Categorias públicas" ON public.categories;
DROP POLICY IF EXISTS "Admin Insert Categorias" ON public.categories;
DROP POLICY IF EXISTS "Admin Update Categorias" ON public.categories;
DROP POLICY IF EXISTS "Admin Delete Categorias" ON public.categories;
DROP POLICY IF EXISTS "Gestión total de categorías" ON public.categories;

DROP POLICY IF EXISTS "Productos públicos" ON public.products;
DROP POLICY IF EXISTS "Admin Insert Productos" ON public.products;
DROP POLICY IF EXISTS "Admin Update Productos" ON public.products;
DROP POLICY IF EXISTS "Admin Delete Productos" ON public.products;
DROP POLICY IF EXISTS "Gestión total de productos" ON public.products;

-- 3. Crear políticas MAESTRAS permisivas (Permite TODO a todos)
-- NOTA: Esto es para que tu administración funcione sin configurar autenticación compleja por ahora.
-- En un futuro, cambiaríamos "TO public" por roles específicos.

-- Para CATEGORÍAS
CREATE POLICY "Gestión total de categorías"
ON public.categories
FOR ALL -- Aplica para SELECT, INSERT, UPDATE, DELETE
TO public
USING (true)
WITH CHECK (true);

-- Para PRODUCTOS
CREATE POLICY "Gestión total de productos"
ON public.products
FOR ALL -- Aplica para SELECT, INSERT, UPDATE, DELETE
TO public
USING (true)
WITH CHECK (true);

-- Confirmación
SELECT 'Permisos actualizados correctamente. Ahora puedes editar y eliminar.' as resultado;
