-- 1. Crear el bucket público 'products' para imágenes
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

-- 2. Políticas de Seguridad para el Storage
-- Permitir ver imágenes a todo el mundo (Público)
create policy "Public Access View"
on storage.objects for select
using ( bucket_id = 'products' );

-- Permitir subir imágenes (Idealmente solo admin, por ahora abierto para facilitar desarrollo)
create policy "Public Access Upload"
on storage.objects for insert
with check ( bucket_id = 'products' );

-- Permitir actualizar/borrar
create policy "Public Access Update"
on storage.objects for update
with check ( bucket_id = 'products' );

create policy "Public Access Delete"
on storage.objects for delete
using ( bucket_id = 'products' );
