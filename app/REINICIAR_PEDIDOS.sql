-- ⚠️ PELIGRO: ESTE SCRIPT BORRARÁ TODOS LOS PEDIDOS EXISTENTES
-- Y REINICIARÁ EL CONTADOR DE IDs (y por tanto los códigos PED-1, PED-2...) DESDE CERO.

-- 1. Borrar todos los datos de la tabla y reiniciar la secuencia de IDs
TRUNCATE TABLE public.orders RESTART IDENTITY;

-- Si por alguna razón el comando anterior no reinicia la secuencia en tu versión de Postgres,
-- puedes forzarlo con estas líneas adicionales (descoméntalas si es necesario):
-- DELETE FROM public.orders;
-- ALTER SEQUENCE public.orders_id_seq RESTART WITH 1;
