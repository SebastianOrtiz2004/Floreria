-- Agregar columna para diferenciar si es envío a domicilio o retiro en tienda
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_type text DEFAULT 'delivery'; -- valores: 'delivery', 'pickup'

-- Opcional: Actualizar registros viejos si se desea
-- UPDATE public.orders SET delivery_type = 'delivery' WHERE delivery_type IS NULL;
