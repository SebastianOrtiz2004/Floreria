-- Agregar columna para el abono (dinero adelantado)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS deposit_amount numeric DEFAULT 0;

-- El saldo (balance) se calcula: total_amount - deposit_amount
