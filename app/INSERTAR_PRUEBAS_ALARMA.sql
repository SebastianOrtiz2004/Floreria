-- Insertar pedidos de prueba para verificar la alarma
-- Fecha: 2026-02-08 (Hoy)

-- 1. Pedido que debe sonar INMEDIATAMENTE (Faltan menios de 60 min)
-- Hora actual aprox: 15:17
-- Hora entrega: 16:10 (Faltan 53 min) -> SONARÁ YA
INSERT INTO public.orders (
    client_name, client_phone, recipient_name, recipient_phone, 
    delivery_address, delivery_date, delivery_time, 
    items_summary, total_amount, status, created_at, order_code
) VALUES (
    'PRUEBA INMEDIATA', '555-0001', 'Test User 1', '555-1111', 
    'Calle Prueba 1', '2026-02-08', '16:10', 
    'Ramo de Prueba - DEBE SONAR YA', 50.00, 'pendiente', NOW(), generate_order_code()
);

-- 2. Pedido que debe sonar en unos minutos (A las 15:20)
-- Hora entrega: 16:20 (Faltan 63 min desde las 15:17)
-- Cuando sean las 15:20, faltarán 60 min exactos -> SONARÁ A LAS 15:20
INSERT INTO public.orders (
    client_name, client_phone, recipient_name, recipient_phone, 
    delivery_address, delivery_date, delivery_time, 
    items_summary, total_amount, status, created_at, order_code
) VALUES (
    'PRUEBA ESPERA', '555-0002', 'Test User 2', '555-2222', 
    'Calle Prueba 2', '2026-02-08', '16:20', 
    'Ramo de Prueba - SONARÁ A LAS 15:20', 75.00, 'pendiente', NOW(), generate_order_code()
);
