'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// --- Interfaces ---
interface Order {
    id: number;
    client_name: string;
    client_phone: string;
    delivery_address: string;
    delivery_date: string; // YYYY-MM-DD
    delivery_time: string; // HH:MM
    items_summary: string;
    total_amount: number;
    status: 'pendiente' | 'en_proceso' | 'en_ruta' | 'entregado' | 'cancelado';
    created_at: string;
}

// --- Icons ---
const Icons = {
    Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Calendar: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Clock: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Filter: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Filters & Sort ---
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [orderBy, setOrderBy] = useState<'date' | 'created'>('date');
    const [dateFilter, setDateFilter] = useState<string>(''); // YYYY-MM-DD

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState({
        client_name: '',
        client_phone: '',
        delivery_address: '',
        delivery_date: new Date().toISOString().split('T')[0],
        delivery_time: '12:00',
        items_summary: '',
        total_amount: 0,
        status: 'pendiente' as Order['status']
    });

    useEffect(() => {
        fetchOrders();
    }, [filterStatus, orderBy, dateFilter]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            let query = supabase.from('orders').select('*');

            // Filters
            if (filterStatus !== 'all') {
                query = query.eq('status', filterStatus);
            }
            if (dateFilter) {
                query = query.eq('delivery_date', dateFilter);
            }

            // Order By
            if (orderBy === 'date') {
                query = query.order('delivery_date', { ascending: true }).order('delivery_time', { ascending: true });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;
            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Error al cargar pedidos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingOrder) {
                // Update
                const { error } = await supabase
                    .from('orders')
                    .update(formData)
                    .eq('id', editingOrder.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('orders')
                    .insert([formData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setEditingOrder(null);
            resetForm();
            fetchOrders();
        } catch (error: any) {
            console.error('Error saving order:', error);
            alert('Error al guardar pedido: ' + error.message);
        }
    };

    const handleDeleteOrder = async (id: number) => {
        if (!confirm('¿Seguro que quieres eliminar este pedido?')) return;
        try {
            const { error } = await supabase.from('orders').delete().eq('id', id);
            if (error) throw error;
            fetchOrders();
        } catch (error: any) {
            console.error('Error deleting order:', error);
            alert('Error al eliminar pedido');
        }
    };

    const resetForm = () => {
        setFormData({
            client_name: '',
            client_phone: '',
            delivery_address: '',
            delivery_date: new Date().toISOString().split('T')[0],
            delivery_time: '12:00',
            items_summary: '',
            total_amount: 0,
            status: 'pendiente'
        });
    };

    const openNewOrderModal = () => {
        setEditingOrder(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (order: Order) => {
        setEditingOrder(order);
        setFormData({
            client_name: order.client_name,
            client_phone: order.client_phone || '',
            delivery_address: order.delivery_address || '',
            delivery_date: order.delivery_date,
            delivery_time: order.delivery_time || '12:00',
            items_summary: order.items_summary || '',
            total_amount: order.total_amount || 0,
            status: order.status
        });
        setIsModalOpen(true);
    };

    const statusColors = {
        pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
        en_proceso: 'bg-blue-100 text-blue-800 border-blue-200',
        en_ruta: 'bg-purple-100 text-purple-800 border-purple-200',
        entregado: 'bg-green-100 text-green-800 border-green-200',
        cancelado: 'bg-stone-100 text-stone-600 border-stone-200'
    };

    const statusLabels = {
        pendiente: 'Pendiente',
        en_proceso: 'En Proceso',
        en_ruta: 'En Ruta',
        entregado: 'Entregado',
        cancelado: 'Cancelado'
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900">Agenda de Pedidos</h1>
                    <p className="text-stone-500 text-sm">Organiza tus entregas y gestiona clientes.</p>
                </div>
                <button
                    onClick={openNewOrderModal}
                    className="flex items-center gap-2 bg-stone-900 hover:bg-black text-white px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                    <Icons.Plus />
                    <span className="font-medium">Nuevo Pedido</span>
                </button>
            </div>

            {/* Toolbar: Filters & Sort */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none text-stone-700"
                        />
                        <div className="absolute left-3 top-2.5 text-stone-400 pointer-events-none"><Icons.Calendar /></div>
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-stone-50 border border-stone-200 text-stone-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 outline-none"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="en_ruta">En Ruta</option>
                        <option value="entregado">Entregados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <span className="text-sm text-stone-500 hidden sm:inline">Ordenar por:</span>
                    <div className="flex bg-stone-100 p-1 rounded-lg">
                        <button
                            onClick={() => setOrderBy('date')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${orderBy === 'date' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            Fecha Entrega
                        </button>
                        <button
                            onClick={() => setOrderBy('created')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${orderBy === 'created' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                        >
                            Creación
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Data Table/List */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center text-stone-400">Cargando pedidos...</div>
                ) : orders.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-stone-400 p-10">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                            <Icons.Calendar />
                        </div>
                        <p className="font-medium">No hay pedidos registrados</p>
                        <p className="text-sm opacity-75">Intenta cambiar los filtros o crea uno nuevo.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Cliente</th>
                                    <th className="px-6 py-4 font-semibold">Entrega</th>
                                    <th className="px-6 py-4 font-semibold">Detalle</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-sm">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-stone-900">{order.client_name}</div>
                                            <div className="text-stone-500 text-xs mt-0.5">{order.client_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-stone-700">
                                                <span className="text-stone-400"><Icons.Calendar /></span>
                                                {new Date(order.delivery_date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-stone-500 text-xs mt-1">
                                                <span className="text-stone-400"><Icons.Clock /></span>
                                                {order.delivery_time?.slice(0, 5)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[200px] truncate text-stone-700" title={order.items_summary}>
                                                {order.items_summary}
                                            </div>
                                            {order.delivery_address && (
                                                <div className="text-xs text-stone-400 mt-1 truncate max-w-[200px]">📍 {order.delivery_address}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-mono font-medium text-stone-700">
                                            ${order.total_amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                                                {statusLabels[order.status]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(order)} className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Icons.Edit /></button>
                                                <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Icons.Trash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <h3 className="font-bold text-lg text-stone-800">{editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600"><Icons.Plus /></button> {/* Reuse Plus as Close (rotate) or just X */}
                        </div>

                        <form onSubmit={handleSaveOrder} className="p-6 overflow-y-auto space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Cliente</label><input required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Nombre completo" value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} /></div>
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Teléfono</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Celular / WhatsApp" value={formData.client_phone} onChange={e => setFormData({ ...formData, client_phone: e.target.value })} /></div>
                            </div>

                            {/* Delivery Info */}
                            <div><label className="text-xs font-bold text-stone-500 uppercase">Dirección de Entrega</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Calle, Número, Referencia" value={formData.delivery_address} onChange={e => setFormData({ ...formData, delivery_address: e.target.value })} /></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Fecha Entrega</label><input type="date" required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" value={formData.delivery_date} onChange={e => setFormData({ ...formData, delivery_date: e.target.value })} /></div>
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Hora Entrega</label><input type="time" required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" value={formData.delivery_time} onChange={e => setFormData({ ...formData, delivery_time: e.target.value })} /></div>
                            </div>

                            {/* Order Details */}
                            <div><label className="text-xs font-bold text-stone-500 uppercase">Resumen del Pedido</label><textarea rows={3} className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Ej: Ramo de 12 Rosas Rojas + Tarjeta" value={formData.items_summary} onChange={e => setFormData({ ...formData, items_summary: e.target.value })} /></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Total ($)</label><input type="number" step="0.01" required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" value={formData.total_amount} onChange={e => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })} /></div>
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase">Estado</label>
                                    <select
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 bg-white"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_proceso">En Proceso</option>
                                        <option value="en_ruta">En Ruta</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 justify-end">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-black font-medium shadow-md">Guardar Pedido</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
