-- ==============================================================================
-- SCRIPT DE EJEMPLO: PEDIDOS SAN VALENTÍN 2026 (EJECUTAR EN SUPABASE)
-- ==============================================================================

INSERT INTO public.orders (
    client_name, 
    client_phone, 
    recipient_name, 
    recipient_phone, 
    delivery_address, 
    delivery_date, 
    delivery_time, 
    items_summary, 
    card_note, 
    total_amount, 
    status
) VALUES 
(
    'Carlos Mendoza', 
    '0991234567', 
    'Maria Fernanda Lopez', 
    '0987654321', 
    'Av. Amazonas y Naciones Unidas, Edificio La Previsora, 5to piso', 
    '2026-02-14', 
    '09:00', 
    'Ramo Gigante de 50 Rosas Rojas + Caja de Chocolates', 
    'Para el amor de mi vida, feliz San Valentín. Te amo.', 
    120.00, 
    'pendiente'
),
(
    'Sofia Ramirez', 
    '0981122334', 
    'Juan Pablo Torres', 
    '0995566778', 
    'Calle Los Pinos 123 y Av. 6 de Diciembre, Casa Blanca', 
    '2026-02-14', 
    '14:00', 
    'Arreglo Tropical con Girasoles y Vino Tinto', 
    'Gracias por ser mi compañero de aventuras. ¡Te quiero!', 
    85.50, 
    'confirmar'
),
(
    'Andres Intriago', 
    '0978899001', 
    'Camila Velez', 
    '0965544332', 
    'Universidad San Francisco, Edificio Einstein, Aula 202', 
    '2026-02-14', 
    '11:30', 
    'Caja de Tulipanes Rosados (12 unidades)', 
    'Eres mi persona favorita en el mundo.', 
    45.00, 
    'pendiente'
),
(
    'Elena Vasquez', 
    '0955566677', 
    'Mama (Teresa)', 
    '0944433322', 
    'Conjunto Residencial El Bosque, Casa 15', 
    '2026-02-14', 
    '10:00', 
    'Orquídea Blanca en Maceta de Cerámica', 
    'Feliz día del amor y la amistad mamá. Eres la mejor.', 
    38.00, 
    'ruta'
),
(
    'Roberto Gomez', 
    '0933322110', 
    'Lucia Mendes', 
    '0922211009', 
    'Hospital Metropolitano, Habitación 305', 
    '2026-02-14', 
    '16:00', 
    'Oso de Peluche Grande + Ramo Mixto de Primavera', 
    'Recupérate pronto mi amor, te extraño.', 
    65.00, 
    'elaboracion'
);

SELECT '5 Pedidos de ejemplo para San Valentín creados correctamente.' as resultado;
