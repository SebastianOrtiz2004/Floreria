-- ⚠️ PELIGRO: ESTE SCRIPT BORRARÁ TODOS LOS PEDIDOS Y REINICIARÁ LOS CONTADORES
-- --------------------------------------------------------------------------------

-- 1. Borrar todos los pedidos existentes
TRUNCATE TABLE public.orders RESTART IDENTITY CASCADE;

-- 2. Reiniciar la secuencia del ID principal (aunque TRUNCATE ya suele hacerlo)
ALTER SEQUENCE public.orders_id_seq RESTART WITH 1;

-- 3. IMPORTANTE: Reiniciar la secuencia personalizada de los códigos "SV-..."
--    Esto hará que el próximo pedido sea SV-1
ALTER SEQUENCE public.orders_sv_seq RESTART WITH 1;

-- Confirmación visual (opcional)
-- SELECT currval('public.orders_sv_seq');
