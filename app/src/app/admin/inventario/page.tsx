'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// Tipos adaptados a la BDD
interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number; // Relación con ID de categoría
    category_name?: string; // Para mostrar en la tabla (join)
    image_url: string;
    description: string;
}

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [isLoading, setIsLoading] = useState(true);

    // Estado de Datos
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Estados de UI/Formulario
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null); // ID del producto en edición
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        category_id: 0,
        image_url: 'https://images.unsplash.com/photo-1563241527-3af805364841?q=80&w=800',
        description: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Cargar Categorías
            const { data: cats, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (catError) throw catError;
            setCategories(cats || []);

            // 2. Cargar Productos (con Join a categorías)
            const { data: prods, error: prodError } = await supabase
                .from('products')
                .select(`
                    *,
                    categories (name)
                `)
                .order('created_at', { ascending: false });

            if (prodError) throw prodError;

            // Formatear datos
            const formattedProducts = prods?.map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                category_id: p.category_id,
                category_name: p.categories?.name || 'Sin Categoría',
                image_url: p.image_url,
                description: p.description
            })) || [];

            setProducts(formattedProducts);
        } catch (error) {
            console.error('Error cargando datos:', error);
            alert('Error al conectar con la base de datos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            const { error } = await supabase
                .from('categories')
                .insert([{ name: newCategoryName }]);

            if (error) throw error;

            setNewCategoryName('');
            fetchData();
            alert('Categoría agregada exitosamente');
        } catch (error) {
            console.error('Error al crear categoría:', error);
            alert('Error: No se pudo crear la categoría');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Abrir modal para crear nuevo
    const openCreateModal = () => {
        setEditingProductId(null);
        setNewProduct({
            name: '',
            price: 0,
            category_id: categories[0]?.id || 0,
            image_url: '',
            description: ''
        });
        setImageFile(null);
        setImagePreview('');
        setIsProductModalOpen(true);
    };

    // Abrir modal para editar existente
    const handleEditProduct = (product: Product) => {
        setEditingProductId(product.id);
        setNewProduct({
            name: product.name,
            price: product.price,
            category_id: product.category_id,
            image_url: product.image_url,
            description: product.description || ''
        });
        setImageFile(null);
        setImagePreview(product.image_url); // Mostrar imagen actual
        setIsProductModalOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones básicas
        if (!newProduct.name || newProduct.price <= 0 || !newProduct.category_id) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        if (!editingProductId && !imageFile && !newProduct.image_url) {
            alert('Por favor selecciona una imagen para el producto');
            return;
        }

        setIsUploading(true);

        try {
            let finalImageUrl = newProduct.image_url;

            // 1. Si hay nueva imagen, subirla
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            }

            // 2. Insertar o Actualizar en BDD
            if (editingProductId) {
                // UPDATE
                const { error: dbError } = await supabase
                    .from('products')
                    .update({
                        name: newProduct.name,
                        price: newProduct.price,
                        category_id: newProduct.category_id,
                        image_url: finalImageUrl,
                        description: newProduct.description
                    })
                    .eq('id', editingProductId);

                if (dbError) throw dbError;
                alert('Producto actualizado correctamente');
            } else {
                // INSERT
                const { error: dbError } = await supabase.from('products').insert([{
                    name: newProduct.name,
                    price: newProduct.price,
                    category_id: newProduct.category_id,
                    image_url: finalImageUrl,
                    description: newProduct.description
                }]);

                if (dbError) throw dbError;
                alert('Producto creado correctamente');
            }

            // Limpieza
            setIsProductModalOpen(false);
            setEditingProductId(null);
            fetchData();

        } catch (error: any) {
            console.error('Error:', error);
            alert('Error al guardar: ' + (error.message || 'Error desconocido'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error eliminando:', error);
            alert('No se pudo eliminar el producto');
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-stone-500">Cargando datos del sistema...</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Con Pestañas Estilizadas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-900">Inventario</h1>
                    <p className="text-stone-500 mt-1">Gestiona tu catálogo de productos y categorías de forma centralizada.</p>
                </div>

                {activeTab === 'products' && (
                    <button
                        onClick={openCreateModal}
                        className="group bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transform hover:-translate-y-0.5"
                    >
                        <div className="bg-white/20 p-1 rounded-lg group-hover:bg-white/30 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Nuevo Producto
                    </button>
                )}
            </div>

            {/* Navegación de Pestañas Tipo "Pill" */}
            <div className="flex p-1 space-x-1 bg-stone-100/80 rounded-xl w-fit border border-stone-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`
                        px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeTab === 'products'
                            ? 'bg-white text-primary-900 shadow-sm ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'}
                    `}
                >
                    Productos <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'products' ? 'bg-primary-50 text-primary-700' : 'bg-stone-200 text-stone-600'}`}>{products.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`
                        px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${activeTab === 'categories'
                            ? 'bg-white text-primary-900 shadow-sm ring-1 ring-black/5'
                            : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'}
                    `}
                >
                    Categorías <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === 'categories' ? 'bg-primary-50 text-primary-700' : 'bg-stone-200 text-stone-600'}`}>{categories.length}</span>
                </button>
            </div>

            {/* Contenido Principal */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden min-h-[500px]">
                {activeTab === 'products' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-stone-50/50 text-stone-500 border-b border-stone-100">
                                <tr>
                                    <th className="px-8 py-5 font-semibold w-[40%]">Producto</th>
                                    <th className="px-6 py-5 font-semibold">Categoría</th>
                                    <th className="px-6 py-5 font-semibold">Precio</th>
                                    <th className="px-8 py-5 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center text-stone-400">
                                                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                                </div>
                                                <p className="text-lg font-medium text-stone-600">No hay productos aún</p>
                                                <p className="text-sm">Empieza agregando uno nuevo a tu inventario.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-primary-50/10 transition-colors">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-100 shadow-sm bg-stone-50 group-hover:scale-105 transition-transform duration-300">
                                                    <Image
                                                        src={product.image_url || '/placeholder.png'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized={true}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-stone-900 text-base">{product.name}</div>
                                                    {product.description && (
                                                        <div className="text-xs text-stone-500 truncate max-w-[240px] mt-0.5">{product.description}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
                                                {product.category_name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-stone-700 font-medium">
                                                ${product.price ? product.price.toFixed(2) : '0.00'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className="text-stone-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Editar producto"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    className="text-stone-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar producto"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Panel Izquierdo: Lista */}
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary-400 rounded-full"></span>
                                Categorías Activas
                            </h3>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="group flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-primary-200 hover:shadow-md transition-all">
                                        <span className="font-medium text-stone-700 group-hover:text-primary-700">{cat.name}</span>
                                        <span className="text-xs font-mono text-stone-400 bg-stone-50 px-3 py-1 rounded border border-stone-100">ID: {cat.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Panel Derecho: Formulario */}
                        <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                            <h3 className="text-lg font-bold text-stone-800 mb-2">Nueva Categoría</h3>
                            <p className="text-stone-500 text-sm mb-6">Agrega una nueva clasificación para organizar tus productos.</p>

                            <form onSubmit={handleAddCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre de la Categoría</label>
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Ej: Bodas, San Valentín..."
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none bg-white text-stone-900 placeholder:text-stone-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newCategoryName.trim()}
                                    className="w-full bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-stone-900/10 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    Agregar Categoría
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Optimizado */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white/50 p-6">
                            <div>
                                <h3 className="font-serif font-bold text-2xl text-stone-900">
                                    {editingProductId ? 'Editar Producto' : 'Nuevo Producto'}
                                </h3>
                                <p className="text-sm text-stone-500 mt-1">Completa los detalles para {editingProductId ? 'editar' : 'publicar'}.</p>
                            </div>
                            <button
                                onClick={() => setIsProductModalOpen(false)}
                                className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-8 space-y-8 overflow-y-auto">
                            {/* Sección 1: Detalles Básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Nombre del Modelo</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.name}
                                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white text-stone-900 placeholder:text-stone-400"
                                            placeholder="Ej: Ramo Primavera"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-stone-700 mb-2">Precio ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-stone-400">$</span>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={newProduct.price}
                                                onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                                className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white text-stone-900 placeholder:text-stone-400 font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-stone-700 mb-2">Categoría</label>
                                    <select
                                        value={newProduct.category_id}
                                        onChange={e => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white text-stone-900"
                                    >
                                        <option value={0}>Seleccionar categoría...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="mt-2 text-xs text-stone-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ¿No encuentras la categoría? Créala en la pestaña "Categorías".
                                    </div>
                                </div>
                            </div>

                            {/* Sección 2: Imagen */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Fotografía del Producto</label>
                                <div
                                    className={`
                                        relative mt-1 flex flex-col justify-center items-center px-6 pt-8 pb-8 border-2 border-dashed rounded-2xl transition-all duration-200 bg-stone-50
                                        ${imagePreview ? 'border-primary-500 bg-primary-50/10' : 'border-stone-300 hover:border-primary-400 hover:bg-stone-100'}
                                    `}
                                >
                                    <div className="space-y-4 text-center w-full">
                                        {imagePreview ? (
                                            <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg group">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setImageFile(null);
                                                            if (editingProductId) {
                                                                // Si estamos editando y eliminamos imagen
                                                            }
                                                            setImagePreview('');
                                                            setNewProduct({ ...newProduct, image_url: '' });
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
                                                    >
                                                        Cambiar / Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-20 h-20 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                                <div className="flex flex-col text-sm text-stone-600">
                                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-bold text-primary-600 hover:text-primary-700 hover:underline">
                                                        <span>Haz clic para subir una foto</span>
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                                                    </label>
                                                    <p className="mt-2 text-stone-400">o arrastra y suelta tu archivo aquí</p>
                                                    <p className="text-xs text-stone-400 mt-1">PNG, JPG hasta 5MB</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sección 3: Descripción */}
                            <div>
                                <label className="block text-sm font-semibold text-stone-700 mb-2">Descripción Detallada</label>
                                <textarea
                                    rows={4}
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white text-stone-900 placeholder:text-stone-400 resize-none"
                                    placeholder="Describe las flores, colores y ocasión ideal..."
                                />
                            </div>

                            {/* Footer del Modal */}
                            <div className="pt-6 border-t border-stone-100 flex gap-4 justify-end items-center">
                                <button
                                    type="button"
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="px-6 py-3 text-stone-600 hover:bg-stone-100 hover:text-stone-900 rounded-xl font-medium transition-colors"
                                    disabled={isUploading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`
                                        pl-6 pr-8 py-3 rounded-xl font-medium shadow-lg transition-all flex items-center gap-3
                                        ${isUploading
                                            ? 'bg-primary-400 text-white cursor-wait'
                                            : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-primary-600/30 hover:-translate-y-0.5'}
                                    `}
                                >
                                    {isUploading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {editingProductId ? 'Actualizando...' : 'Guardando...'}
                                        </>
                                    ) : (
                                        <>
                                            <span>{editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
