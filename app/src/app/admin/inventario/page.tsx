'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category_id: number | null;
    category_name?: string;
    image_url: string;
    description: string;
}

interface Toast {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

// --- Icons ---
const Icons = {
    Warning: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Check: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    X: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Trash: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Edit: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Info: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Plus: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Filter: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
};

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [isLoading, setIsLoading] = useState(true);

    // --- Data State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // --- Filter State ---
    const [showUncategorizedOnly, setShowUncategorizedOnly] = useState(false);

    // --- UI/Form State ---
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    // Forms
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: 0,
        category_id: 0,
        image_url: 'https://images.unsplash.com/photo-1563241527-3af805364841?q=80&w=800',
        description: ''
    });

    // Upload
    const [isUploading, setIsUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // --- Notification System ---
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: Toast['type'] = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // --- Delete Confirmation Modal State ---
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        type: 'product' | 'category';
        itemId: number | null;
        itemName: string;
        warningMessage?: string;
    }>({
        isOpen: false,
        type: 'product',
        itemId: null,
        itemName: '',
    });

    // --- Initial Load ---
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Categories
            const { data: cats, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('name');
            if (catError) throw catError;
            setCategories(cats || []);

            // 2. Products
            const { data: prods, error: prodError } = await supabase
                .from('products')
                .select(`*, categories (name)`)
                .order('created_at', { ascending: false });
            if (prodError) throw prodError;

            // Formatter
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
        } catch (error: any) {
            console.error('Error:', error);
            addToast('Error cargando datos: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Logic: Uncategorized Count & Filter ---
    const uncategorizedCount = products.filter(p => !p.category_id || p.category_name === 'Sin Categoría').length;

    const displayedProducts = showUncategorizedOnly
        ? products.filter(p => !p.category_id || p.category_name === 'Sin Categoría')
        : products;

    // --- Logic: Category Management ---
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            if (editingCategoryId) {
                const { error, data } = await supabase
                    .from('categories')
                    .update({ name: newCategoryName })
                    .eq('id', editingCategoryId)
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No se pudo actualizar. Es posible que falten permisos en la Base de Datos.");

                addToast('Categoría actualizada exitosamente', 'success');
            } else {
                const { error, data } = await supabase
                    .from('categories')
                    .insert([{ name: newCategoryName }])
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No se pudo crear. Es posible que falten permisos en la Base de Datos.");

                addToast('Categoría creada exitosamente', 'success');
            }
            setNewCategoryName('');
            setEditingCategoryId(null);
            fetchData();
        } catch (error: any) {
            console.error('Error saving category:', error);
            addToast(error.message || 'Error al guardar categoría', 'error');
        }
    };

    const confirmDeleteCategory = async () => {
        if (!deleteModal.itemId) return;
        try {
            const { error, data } = await supabase
                .from('categories')
                .delete()
                .eq('id', deleteModal.itemId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("No se pudo eliminar. Verifica los permisos de la base de datos.");

            setCategories(prev => prev.filter(c => c.id !== deleteModal.itemId));
            // Update products locally to reflect "Sin Categoría"
            setProducts(prev => prev.map(p =>
                p.category_id === deleteModal.itemId
                    ? { ...p, category_id: null, category_name: 'Sin Categoría' }
                    : p
            ));

            addToast('Categoría eliminada correctamente', 'success');
            setDeleteModal(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
            console.error('Error deleting category:', error);
            addToast(error.message || 'Error al eliminar', 'error');
        }
    };

    const initiateDeleteCategory = (category: Category) => {
        const associatedProducts = products.filter(p => p.category_id === category.id).length;
        setDeleteModal({
            isOpen: true,
            type: 'category',
            itemId: category.id,
            itemName: category.name,
            warningMessage: associatedProducts > 0
                ? `⚠️ Advertencia: Hay ${associatedProducts} producto(s) en esta categoría. Si la eliminas, estos productos quedarán "Sin Categoría".`
                : undefined
        });
    };

    // --- Logic: Product Management ---
    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newProduct.name || newProduct.price <= 0 || !newProduct.category_id) {
            addToast('Por favor completa los campos obligatorios.', 'warning');
            return;
        }

        setIsUploading(true);
        try {
            let finalImageUrl = newProduct.image_url;
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, imageFile);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                finalImageUrl = data.publicUrl;
            }

            const productData = {
                name: newProduct.name,
                price: newProduct.price,
                category_id: newProduct.category_id,
                image_url: finalImageUrl,
                description: newProduct.description
            };

            if (editingProductId) {
                const { error, data } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', editingProductId)
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No se pudo actualizar el producto. Verifica permisos.");

                addToast('Producto actualizado correctamente', 'success');
            } else {
                const { error, data } = await supabase
                    .from('products')
                    .insert([productData])
                    .select();

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No se pudo crear el producto. Verifica permisos.");

                addToast('Producto creado correctamente', 'success');
            }

            setIsProductModalOpen(false);
            setEditingProductId(null);
            fetchData();
        } catch (error: any) {
            console.error('Error saving product:', error);
            addToast(error.message || 'Error al guardar producto', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const initiateDeleteProduct = (product: Product) => {
        setDeleteModal({
            isOpen: true,
            type: 'product',
            itemId: product.id,
            itemName: product.name,
            warningMessage: 'Esta acción no se puede deshacer.'
        });
    };

    const confirmDeleteProduct = async () => {
        if (!deleteModal.itemId) return;
        try {
            const { error, data } = await supabase
                .from('products')
                .delete()
                .eq('id', deleteModal.itemId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) throw new Error("No se pudo eliminar. Verifica los permisos de la base de datos.");

            setProducts(prev => prev.filter(p => p.id !== deleteModal.itemId));
            addToast('Producto eliminado correctamente', 'success');
            setDeleteModal(prev => ({ ...prev, isOpen: false }));
        } catch (error: any) {
            addToast(error.message || 'Error al eliminar producto', 'error');
        }
    };

    // --- Render Helpers ---
    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-stone-500">Cargando inventario...</div>;

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 pb-24 md:py-8 md:pb-20">

            {/* --- Toast Container --- */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-in slide-in-from-top-full duration-300 backdrop-blur-sm
                            ${toast.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800' : ''}
                            ${toast.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' : ''}
                            ${toast.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-800' : ''}
                            ${toast.type === 'info' ? 'bg-blue-50/90 border-blue-200 text-blue-800' : ''}
                        `}
                    >
                        {toast.type === 'success' && <Icons.Check />}
                        {toast.type === 'error' && <Icons.X />}
                        {toast.type === 'warning' && <Icons.Warning />}
                        {toast.type === 'info' && <Icons.Info />}
                        <span className="text-sm font-medium flex-1">{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="hover:opacity-70"><Icons.X /></button>
                    </div>
                ))}
            </div>

            {/* --- Uncategorized Warning Banner --- */}
            {uncategorizedCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center gap-2">
                        <div className="text-amber-500"><Icons.Warning /></div>
                        <h4 className="font-bold text-amber-800 sm:hidden">Atención Requerida</h4>
                    </div>
                    <div className="flex-1">
                        <h4 className="hidden sm:block font-bold text-amber-800">Atención: Productos Sin Categoría</h4>
                        <p className="text-sm text-amber-700">
                            Tienes <strong>{uncategorizedCount}</strong> producto(s) sin categoría activa.
                            {showUncategorizedOnly && <span className="block text-xs mt-1 text-amber-800 font-semibold">(Filtrando estos productos actualmente)</span>}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 self-start sm:self-center">
                        <button
                            onClick={() => {
                                setActiveTab('products');
                                setShowUncategorizedOnly(true);
                                setTimeout(() => {
                                    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            }}
                            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors"
                        >
                            Ver Productos
                        </button>
                    </div>
                </div>
            )}

            {/* --- Header --- */}
            <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-100 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Inventario</h1>
                    <p className="text-sm md:text-base text-stone-500 mt-1">Gestiona productos y categorías.</p>
                </div>
                {activeTab === 'products' && (
                    <button
                        onClick={() => {
                            setEditingProductId(null);
                            setNewProduct({ name: '', price: 0, category_id: categories[0]?.id || 0, image_url: '', description: '' });
                            setImagePreview('');
                            setIsProductModalOpen(true);
                        }}
                        className="w-full md:w-auto justify-center bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Icons.Plus />
                        <span>Nuevo Producto</span>
                    </button>
                )}
            </div>

            {/* --- Tabs --- */}
            <div className="flex p-1 space-x-1 bg-stone-100/80 rounded-xl w-full md:w-fit border border-stone-200 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Productos <span className="ml-2 bg-stone-100 px-2 py-0.5 rounded-full text-xs font-bold text-stone-600 border border-stone-200">{products.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex-1 md:flex-none whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'categories' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    Categorías <span className="ml-2 bg-stone-100 px-2 py-0.5 rounded-full text-xs font-bold text-stone-600 border border-stone-200">{categories.length}</span>
                </button>
            </div>

            {/* --- Main Content --- */}
            <div id="products-section" className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden min-h-[500px] relative">
                {activeTab === 'products' && (
                    <>
                        {/* Clear Filter Banner within List */}
                        {showUncategorizedOnly && (
                            <div className="bg-stone-50 border-b border-stone-100 p-3 flex justify-between items-center animate-in slide-in-from-top-2">
                                <span className="text-sm font-bold text-stone-700 flex items-center gap-2">
                                    <Icons.Filter />
                                    Mostrando solo "Sin Categoría" ({displayedProducts.length})
                                </span>
                                <button
                                    onClick={() => setShowUncategorizedOnly(false)}
                                    className="text-xs text-blue-600 font-bold hover:underline"
                                >
                                    Mostrar Todos
                                </button>
                            </div>
                        )}

                        {/* Mobile View: Cards */}
                        <div className="block md:hidden p-4 space-y-4">
                            {displayedProducts.length === 0 ? (
                                <p className="text-center text-stone-400 py-10">No hay productos que coincidan.</p>
                            ) : displayedProducts.map(product => (
                                <div key={product.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex gap-4">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                                        <Image src={product.image_url || '/placeholder.png'} alt={product.name} fill className="object-cover" unoptimized />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-stone-900">{product.name}</h4>
                                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${product.category_id ? 'bg-stone-100 text-stone-600' : 'bg-red-50 text-red-600'}`}>
                                                {product.category_name}
                                            </span>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <span className="font-mono font-bold text-stone-700">${product.price.toFixed(2)}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => {
                                                    setEditingProductId(product.id);
                                                    setNewProduct({ name: product.name, price: product.price, category_id: product.category_id || 0, image_url: product.image_url, description: product.description });
                                                    setImagePreview(product.image_url);
                                                    setIsProductModalOpen(true);
                                                }} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icons.Edit /></button>
                                                <button onClick={() => initiateDeleteProduct(product)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Icons.Trash /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View: Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-stone-50 text-stone-500 border-b border-stone-100">
                                    <tr>
                                        <th className="px-8 py-4 font-semibold">Producto</th>
                                        <th className="px-6 py-4 font-semibold">Categoría</th>
                                        <th className="px-6 py-4 font-semibold">Precio</th>
                                        <th className="px-8 py-4 font-semibold text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {displayedProducts.map((product) => (
                                        <tr key={product.id} className="group hover:bg-stone-50/50 transition-colors">
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                                                        <Image src={product.image_url || '/placeholder.png'} alt={product.name} fill className="object-cover" unoptimized />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-stone-900">{product.name}</div>
                                                        {product.description && <div className="text-xs text-stone-400 truncate max-w-[200px]">{product.description}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.category_id ? 'bg-stone-100 text-stone-600 border-stone-200' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                    {product.category_name}
                                                    {!product.category_id && <span className="ml-1"><Icons.Warning /></span>}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-stone-600">${product.price.toFixed(2)}</td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => {
                                                        setEditingProductId(product.id);
                                                        setNewProduct({
                                                            name: product.name,
                                                            price: product.price,
                                                            category_id: product.category_id || 0,
                                                            image_url: product.image_url,
                                                            description: product.description
                                                        });
                                                        setImagePreview(product.image_url);
                                                        setIsProductModalOpen(true);
                                                    }} className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Icons.Edit /></button>
                                                    <button onClick={() => initiateDeleteProduct(product)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Icons.Trash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {displayedProducts.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-20 text-stone-400">No hay productos.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {activeTab === 'categories' && (
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {/* Order-1 on mobile so form is first, Order-2 on desktop so form is right */}
                        <div className="order-1 md:order-2 bg-stone-50 p-6 rounded-2xl border border-stone-100 h-fit">
                            <h3 className="font-bold text-stone-800 mb-4">{editingCategoryId ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                            <form onSubmit={handleSaveCategory} className="space-y-4">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nombre de la categoría..."
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 bg-white"
                                />
                                <div className="flex gap-2">
                                    {editingCategoryId && <button type="button" onClick={() => { setEditingCategoryId(null); setNewCategoryName(''); }} className="flex-1 py-3 bg-white border border-stone-200 rounded-xl text-stone-600">Cancelar</button>}
                                    <button type="submit" className="flex-1 py-3 bg-stone-900 text-white rounded-xl font-medium">{editingCategoryId ? 'Actualizar' : 'Guardar'}</button>
                                </div>
                            </form>
                        </div>

                        <div className="order-2 md:order-1 space-y-4">
                            <h3 className="font-bold text-stone-800">Categorías Existentes</h3>
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-all group">
                                    <span className="font-medium text-stone-700">{cat.name}</span>
                                    <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingCategoryId(cat.id); setNewCategoryName(cat.name); }} className="p-2 text-stone-400 hover:text-blue-600 bg-stone-50 rounded-lg"><Icons.Edit /></button>
                                        <button onClick={() => initiateDeleteCategory(cat)} className="p-2 text-stone-400 hover:text-red-600 bg-stone-50 rounded-lg"><Icons.Trash /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- Modal: Create/Edit Product --- */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                            <h3 className="font-serif font-bold text-xl md:text-2xl text-stone-900">{editingProductId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="p-2 bg-stone-100 rounded-full hover:bg-stone-200 text-stone-500"><Icons.X /></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div><label className="block text-sm font-bold mb-1 text-stone-700">Nombre</label><input required className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-stone-900 bg-white" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
                                    <div><label className="block text-sm font-bold mb-1 text-stone-700">Precio</label><input type="number" step="0.01" required className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-stone-900 bg-white" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} /></div>
                                </div>
                                <div><label className="block text-sm font-bold mb-1 text-stone-700">Categoría</label>
                                    <select className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-stone-900 bg-white" value={newProduct.category_id} onChange={e => setNewProduct({ ...newProduct, category_id: parseInt(e.target.value) })}>
                                        <option value={0}>Seleccionar...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div><label className="block text-sm font-bold mb-1 text-stone-700">Imagen</label>
                                <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors relative">
                                    {imagePreview ? (
                                        <div className="relative h-40 w-full"><Image src={imagePreview} alt="Preview" fill className="object-contain" /></div>
                                    ) : <span className="text-stone-400">Click para subir imagen</span>}
                                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => {
                                        if (e.target.files?.[0]) { setImageFile(e.target.files[0]); setImagePreview(URL.createObjectURL(e.target.files[0])); }
                                    }} />
                                </div>
                            </div>
                            <div><label className="block text-sm font-bold mb-1 text-stone-700">Descripción</label><textarea rows={3} className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-stone-900 bg-white" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 w-full md:w-auto text-stone-700">Cancelar</button>
                                <button type="submit" disabled={isUploading} className="px-6 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 w-full md:w-auto">{isUploading ? 'Guardando...' : 'Guardar'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Modal: Delete Confirmation --- */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
                            <Icons.Trash />
                        </div>
                        <h3 className="text-xl font-bold text-center text-stone-900 mb-2">¿Eliminar {deleteModal.type === 'category' ? 'Categoría' : 'Producto'}?</h3>
                        <p className="text-center text-stone-500 mb-6">
                            Estás a punto de eliminar <strong>"{deleteModal.itemName}"</strong>.
                            {deleteModal.warningMessage && (
                                <span className="block mt-3 bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200 text-left">
                                    {deleteModal.warningMessage}
                                </span>
                            )}
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))} className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium transition-colors">
                                Cancelar
                            </button>
                            <button onClick={deleteModal.type === 'category' ? confirmDeleteCategory : confirmDeleteProduct} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg shadow-red-600/20 transition-all">
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
