-- ==============================================================================
-- SCRIPT PARA ACTUALIZAR TABLA DE PEDIDOS (EJECUTAR EN SUPABASE SQL EDITOR)
-- ==============================================================================

-- Agregar nuevas columnas para información del destinatario
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS recipient_name text,   -- Nombre de quien recibe
ADD COLUMN IF NOT EXISTS recipient_phone text,  -- Teléfono de quien recibe
ADD COLUMN IF NOT EXISTS card_note text;        -- Texto para la tarjeta

-- Confirmación
SELECT 'Columnas agregadas correctamente: recipient_name, recipient_phone, card_note' as resultado;
