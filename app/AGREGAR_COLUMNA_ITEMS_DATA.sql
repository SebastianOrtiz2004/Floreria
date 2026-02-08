-- Agregar columna JSONB para guardar el detalle de los productos (imagenes, precios, cantidades)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS items_data JSONB DEFAULT '[]'::jsonb;

-- Comentario para saber que se ejecutó
SELECT 'Columna items_data agregada correctamente a la tabla orders.' as resultado;
