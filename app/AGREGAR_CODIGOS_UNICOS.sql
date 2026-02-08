-- ==============================================================================
-- SCRIPT: GENERAR CÓDIGOS "SV-XXXX" (SECUENCIALES Y PREFIJO ESTRATÉGICO)
-- ==============================================================================

-- 1. Agregar columna 'order_code' (si no existe)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_code text UNIQUE;

-- 2. Crear una SECUENCIA para tener números ordenados (1, 2, 3...)
--    Esto garantiza que sean cortos y fáciles de memorizar (ej: "El 105")
CREATE SEQUENCE IF NOT EXISTS orders_sv_seq START 100;

-- 3. Crear función para generar códigos tipo "SV-105"
CREATE OR REPLACE FUNCTION generate_order_code() 
RETURNS TRIGGER AS $$
BEGIN
  -- Si el código ya viene (ej: manual), lo respetamos. Si es NULL, lo generamos.
  IF NEW.order_code IS NULL THEN
    -- Formato: SV (San Valentín) + Número Secuencial
    -- Resultado: SV-100, SV-101, SV-102...
    NEW.order_code := 'SV-' || nextval('orders_sv_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear Trigger (o reemplazar el anterior)
DROP TRIGGER IF EXISTS trigger_set_order_code ON public.orders;
CREATE TRIGGER trigger_set_order_code
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION generate_order_code();

-- 5. Actualizar pedidos viejos para que tengan código también
--    (Usamos la secuencia para ellos también para mantener orden)
UPDATE public.orders 
SET order_code = 'SV-' || nextval('orders_sv_seq')
WHERE order_code IS NULL;

-- Confirmación visual
SELECT order_code, client_name FROM public.orders ORDER BY order_code DESC LIMIT 5;
