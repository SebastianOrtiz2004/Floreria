-- ==============================================================================
-- SCRIPT: AGREGAR COLUMNA 'image_url' A LA TABLA DE PEDIDOS
-- ==============================================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS image_url text;

-- Confirmación
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';
