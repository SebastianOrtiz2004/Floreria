'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// --- Interfaces ---
interface Order {
    id: number;
    order_code?: string; // e.g. PED-A1B2
    client_name: string;
    client_phone: string;
    recipient_name?: string;
    recipient_phone?: string;
    delivery_address: string;
    delivery_date: string; // YYYY-MM-DD
    delivery_time: string; // HH:MM
    items_summary: string;
    image_url?: string; // Optional (Main image)
    items_data?: FormItem[]; // JSONB column for detailed items list
    card_note?: string;
    total_amount: number;
    status: 'pendiente' | 'en_proceso' | 'en_ruta' | 'entregado' | 'cancelado';
    created_at: string;
}

interface FormItem {
    id?: number; // if from catalog
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    image_url?: string;
}

// --- Icons ---
const Icons = {
    Plus: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Calendar: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    Clock: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Search: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Filter: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
    Edit: () => <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Copy: () => <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>,
    Eye: () => <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    X: () => <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Bell: () => <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    MessageCircle: () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
    User: () => <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    List: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Grid: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    // --- View Mode State ---
    const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

    // --- Product Picker State ---
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    const [isLoading, setIsLoading] = useState(true);

    // --- Helper for Local Date (YYYY-MM-DD) ---
    const getLocalDate = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // --- Filters & Sort ---
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [orderBy, setOrderBy] = useState<'date' | 'created'>('date');
    const [dateFilter, setDateFilter] = useState<string>(getLocalDate()); // Local Date
    const [codeSearch, setCodeSearch] = useState(''); // Search by Code

    // --- View State (Production Ticket) ---
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

    // --- Notification State ---
    const [notifiedOrders, setNotifiedOrders] = useState<Set<number>>(new Set());
    const [urgentOrdersList, setUrgentOrdersList] = useState<Order[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false); // Browser Autoplay Fix

    // --- Quick Status Dropdown State ---
    const [activeStatusDropdown, setActiveStatusDropdown] = useState<number | null>(null);

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // --- Multi-Product Logic ---
    // (Moved FormItem interface up)
    const [formItems, setFormItems] = useState<FormItem[]>([]);

    // --- Custom Product Modal State ---
    const [isCustomProductModalOpen, setIsCustomProductModalOpen] = useState(false);
    const [customProductForm, setCustomProductForm] = useState({ name: '', price: '' });

    const [formData, setFormData] = useState({
        client_name: '',
        client_phone: '',
        recipient_name: '',
        recipient_phone: '',
        delivery_address: '',
        delivery_date: getLocalDate(), // Local Date
        delivery_time: '12:00',
        card_note: '',
        status: 'pendiente' as Order['status']
    });

    // --- Toast / Notification ---
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        if (toastMessage) {
            // Longer duration for alerts (emoji 🚨 or ⚠️), shorter for info
            const isAlarm = toastMessage.includes('🔔') || toastMessage.includes('🚨');
            const duration = isAlarm ? 20000 : 4000; // 20 seconds for alarms
            const timer = setTimeout(() => setToastMessage(null), duration);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    useEffect(() => {
        fetchOrders();
        fetchProducts(); // Fetch products on mount
    }, [filterStatus, orderBy, dateFilter]); // We do code search client-side for speed

    const fetchProducts = async () => {
        const { data } = await supabase.from('products').select('id, name, price, image_url').order('name');
        if (data) setProducts(data);
    };

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

            // Sorting
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
        } finally {
            setIsLoading(false);
        }
    };

    const playAlarm = () => {
        if (!audioEnabled) {
            setToastMessage("🔊 Haz clic en el icono de bocina arriba para activar el sonido.");
            return;
        }

        // Softer, distinct "Digital Bell" sound (not a siren)
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.volume = 1.0;
        // Loop for 5 seconds to ensure it's heard, but it's a pleasant sound
        audio.loop = true;
        audio.play().catch(e => {
            console.error("Error reproduciendo audio:", e);
        });

        // Stop after 5 seconds
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
        }, 5000);
    };

    const toggleAudio = () => {
        if (!audioEnabled) {
            // Unlock Audio Context with a silent interaction
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Pop
            audio.volume = 0.2;
            audio.play().catch(() => { });
            setAudioEnabled(true);
            setToastMessage("🔊 Sonido ACTIVADO para notificaciones.");
        } else {
            setAudioEnabled(false);
            setToastMessage("🔇 Sonido DESACTIVADO.");
        }
    };

    // --- TEST DATA GENERATOR ---
    const generateTestOrders = async () => {
        const today = new Date().toISOString().split('T')[0];

        await supabase.from('orders').insert([
            {
                client_name: 'PRUEBA ALARMA YA',
                client_phone: '555-000',
                delivery_address: 'Calle Falsa 123',
                delivery_date: today,
                delivery_time: '16:10', // 16:10 is < 60 mins from 15:17 -> ALARM NOW
                items_summary: 'ESTE DEBE SONAR YA (Faltan ~53 min)',
                total_amount: 50,
                status: 'pendiente'
            },
            {
                client_name: 'PRUEBA ALARMA 15:20',
                client_phone: '555-000',
                delivery_address: 'Calle Futuro 456',
                delivery_date: today,
                delivery_time: '16:20', // 16:20 is > 60 mins from 15:17. Will trigger at 15:20.
                items_summary: 'ESTE SONARÁ A LAS 15:20',
                total_amount: 50,
                status: 'pendiente'
            }
        ]);
        alert("✅ Datos de prueba insertados. Espera 30 segundos.");
        fetchOrders();
    };

    // --- Auto-Refresh Removed as per request ---
    // The user prefers manual refresh or optimistic updates to avoid UI jumps.

    // 2. Check for upcoming orders whenever 'orders' list updates
    useEffect(() => {
        const checkUpcomingOrders = () => {
            console.log('Checking for urgent orders in local state...');
            const now = new Date();
            const upcomingOrders: number[] = [];

            orders.forEach(order => {
                // Ignore completed or cancelled
                if (order.status === 'entregado' || order.status === 'cancelado') return;

                // Parse date
                const orderDate = new Date(`${order.delivery_date}T${order.delivery_time}`);
                const diffMs = orderDate.getTime() - now.getTime();
                const diffMins = diffMs / (1000 * 60);

                // Alert if <= 60 minutes (Includes OVERDUE orders which have negative diffMins)
                if (diffMins <= 60 && diffMins > -1440) {
                    // Check if not notified yet
                    if (!notifiedOrders.has(order.id)) {
                        upcomingOrders.push(order.id);
                    }
                }
            });

            // Update Urgent List State (always keep this current)
            const currentUrgentOrders = orders.filter(order => {
                if (order.status === 'entregado' || order.status === 'cancelado') return false;
                const orderDate = new Date(`${order.delivery_date}T${order.delivery_time}`);
                const diffMs = orderDate.getTime() - now.getTime();
                const diffMins = diffMs / (1000 * 60);
                return diffMins <= 60 && diffMins > -1440;
            });
            setUrgentOrdersList(currentUrgentOrders);

            // If we found NEW urgent orders that haven't been notified yet
            if (upcomingOrders.length > 0) {
                playAlarm(); // Play sound ONCE for the batch

                // Construct a summary message (REMOVED TOAST AS PER USER REQUEST)
                // The sound will play, and the Bell icon will show the list.
                /*
                const orderCodes = upcomingOrders.map(id => {
                    const o = orders.find(x => x.id === id);
                    if (!o) return `#${id}`;

                    // Re-calc diff for label
                    const oDate = new Date(`${o.delivery_date}T${o.delivery_time}`);
                    const dMs = oDate.getTime() - new Date().getTime();
                    const dMins = Math.ceil(dMs / (1000 * 60));

                    const timeLabel = dMins < 0 ? `(Hace ${Math.abs(dMins)} min)` : `(En ${dMins} min)`;
                    return `${o.order_code || '#' + id} ${timeLabel}`;
                }).join(', ');

                setToastMessage(`🔔 ATENCIÓN: Pedidos por entregar: ${orderCodes}`);
                */

                setNotifiedOrders(prev => {
                    const next = new Set(prev);
                    upcomingOrders.forEach(id => next.add(id));
                    return next;
                });
            }
        };

        checkUpcomingOrders();
    }, [orders]); // Run whenever orders list is updated (either by initial load or polling)

    const handleSaveOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // Construct Summary & Total from Items
        const itemsSummary = formItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
        const totalAmount = formItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        const mainImage = formItems.find(i => i.image_url)?.image_url || '';

        const payload = {
            ...formData,
            items_summary: itemsSummary || 'Sin productos', // Fallback Text
            items_data: formItems, // JSON Data for detailed items list
            total_amount: totalAmount,
            image_url: mainImage
        };

        try {
            if (editingOrder) {
                const { error } = await supabase
                    .from('orders')
                    .update(payload)
                    .eq('id', editingOrder.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('orders')
                    .insert([payload]);
                if (error) throw error;
            }
            setIsModalOpen(false);
            setEditingOrder(null);
            resetForm();
            fetchOrders();
            setToastMessage("Pedido guardado exitosamente");
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
            setToastMessage("Pedido eliminado");
        } catch (error: any) {
            console.error('Error deleting order:', error);
            alert('Error al eliminar pedido');
        }
    };

    const handleQuickStatusUpdate = async (orderId: number, newStatus: Order['status']) => {
        try {
            // Optimistic Update
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            setActiveStatusDropdown(null);

            const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
            if (error) throw error;

            // Success sound effect (subtle)
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'); // Pop sound
            audio.volume = 0.5;
            audio.play().catch(() => { });

            setToastMessage(`Estado actualizado a: ${statusLabels[newStatus]}`);

            // Update filter lists if needed (re-fetch not strictly needed due to optimistic, but good for sync)
            // fetchOrders();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar estado');
            fetchOrders(); // Revert on error
        }
    };

    const resetForm = () => {
        setFormData({
            client_name: '',
            client_phone: '',
            recipient_name: '',
            recipient_phone: '',
            delivery_address: '',
            delivery_date: getLocalDate(), // Local Date Fix
            delivery_time: '12:00',
            card_note: '',
            status: 'pendiente'
        });
        setFormItems([]); // Reset items
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
            recipient_name: order.recipient_name || '',
            recipient_phone: order.recipient_phone || '',
            delivery_address: order.delivery_address || '',
            delivery_date: order.delivery_date,
            delivery_time: order.delivery_time || '12:00',
            card_note: order.card_note || '',
            status: order.status
        });

        // Load Items from JSON if available, else Fallback to Legacy Summary
        if (order.items_data && Array.isArray(order.items_data) && order.items_data.length > 0) {
            setFormItems(order.items_data);
        } else {
            // Legacy Fallback
            setFormItems([{
                name: order.items_summary || 'Producto Legacy',
                price: order.total_amount,
                quantity: 1,
                image_url: order.image_url
            }]);
        }

        setIsModalOpen(true);
    };

    // --- Action: Copy Delivery Info ---
    const copyDeliveryInfo = (order: Order) => {
        // Formato para WhatsApp
        const text = `📦 *PEDIDO ${order.order_code || `PED-${order.id}`}*
📍 *Dirección:* ${order.delivery_address}
👤 *Recibe:* ${order.recipient_name || 'No especificado'}
📞 *Tel:* ${order.recipient_phone || order.client_phone}
🕒 *Hora:* ${order.delivery_time}
💐 *Detalle:* ${order.items_summary}

⚠️ ${order.card_note ? `*NOTA:* ${order.card_note}` : ''}`;

        navigator.clipboard.writeText(text).then(() => {
            setToastMessage("¡Info copiada! Lista para pegar en WhatsApp.");
        }).catch(err => {
            console.error('Error al copiar:', err);
            alert('Error al copiar al portapapeles');
        });
    };

    const statusColors = {
        pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
        en_proceso: 'bg-blue-100 text-blue-800 border-blue-200',
        en_ruta: 'bg-purple-100 text-purple-800 border-purple-200',
        entregado: 'bg-green-100 text-green-800 border-green-200',
        cancelado: 'bg-red-100 text-red-800 border-red-200',
    };

    const statusLabels = {
        pendiente: 'Pendiente',
        en_proceso: 'En Proceso',
        en_ruta: 'En Ruta',
        entregado: 'Entregado',
        cancelado: 'Cancelado',
    };

    // --- Search Logic (Case Insensitive) ---
    const filteredOrders = orders.filter(o => {
        if (!codeSearch.trim()) return true;
        const code = o.order_code || `PED-${o.id}`;
        return code.toLowerCase().includes(codeSearch.toLowerCase().trim());
    });

    const handleAddCustomProduct = () => {
        if (!customProductForm.name || !customProductForm.price) {
            alert("Por favor, ingresa el nombre y el precio del producto.");
            return;
        }
        const price = parseFloat(customProductForm.price);
        if (isNaN(price) || price <= 0) {
            alert("El precio debe ser un número positivo.");
            return;
        }

        setFormItems([...formItems, { name: customProductForm.name, price, quantity: 1 }]);
        setCustomProductForm({ name: '', price: '' });
        setIsCustomProductModalOpen(false);
    };

    return (
        <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-20 relative">

            {/* Toast Notification */}
            {toastMessage && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 backdrop-blur-sm flex items-center gap-2 border font-medium text-sm
                    ${(toastMessage.includes('🔔') || toastMessage.includes('🔊')) ? 'bg-stone-900/90 text-white border-stone-800' : 'bg-white/90 text-stone-900 border-stone-200'}
                `}>
                    {toastMessage.includes('🔔') ? <Icons.Bell /> : <Icons.Copy />}
                    <span>{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="ml-2 opacity-60 hover:opacity-100"><Icons.X /></button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-900">Pedidos</h1>
                    <p className="text-stone-500 mt-1">Gestión de entregas y logística.</p>
                </div>
                <div className="flex gap-2 items-center">

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-3 bg-white text-stone-600 rounded-xl hover:bg-stone-100 border border-stone-200 transition-colors shadow-sm active:scale-95"
                        >
                            <Icons.Bell />
                            {urgentOrdersList.length > 0 && (
                                <span className="absolute top-2 right-2 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </button>

                        {/* Dropdown Notification Center */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-stone-100 bg-stone-50">
                                    <h4 className="font-bold text-stone-800">Centro de Notificaciones</h4>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {urgentOrdersList.length === 0 ? (
                                        <div className="p-6 text-center text-stone-400 text-sm">
                                            ✅ Todo en orden. No hay pedidos urgentes.
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-stone-100">
                                            {urgentOrdersList.map(order => (
                                                <li key={order.id} className="p-4 hover:bg-red-50 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-red-600 text-xs uppercase tracking-wider">¡Urgente!</span>
                                                        <span className="text-xs font-mono text-stone-400">{order.delivery_time}</span>
                                                    </div>
                                                    <div className="font-bold text-stone-800 mb-1">{order.order_code}</div>
                                                    <div className="text-xs text-stone-500 mb-2 truncate">{order.items_summary}</div>
                                                    <button
                                                        onClick={() => {
                                                            setViewingOrder(order);
                                                            setShowNotifications(false);
                                                        }}
                                                        className="w-full py-1.5 bg-white border border-stone-200 text-stone-600 text-xs font-bold rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors"
                                                    >
                                                        Ver Pedido
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Audio Toggle */}
                    <button
                        onClick={toggleAudio}
                        title={audioEnabled ? "Desactivar Sonido" : "Activar Sonido"}
                        className={`p-3 rounded-xl border transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2
                            ${audioEnabled ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-200 hover:bg-stone-50'}
                        `}
                    >
                        {audioEnabled ? (
                            <>
                                <span>🔊</span>
                            </>
                        ) : (
                            <>
                                <span>🔇</span>
                                <span className="text-xs font-bold hidden md:inline">Activar Sonido</span>
                            </>
                        )}
                    </button>

                </div>

                <button
                    onClick={openNewOrderModal}
                    className="w-full md:w-auto bg-stone-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                    <Icons.Plus />
                    <span>Nuevo Pedido</span>
                </button>
            </div>



            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                {/* 1. CODE SEARCH (Priority) */}
                <div className="relative md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Icons.Search />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar Código (Ej: PED-A1B2)"
                        value={codeSearch}
                        onChange={(e) => setCodeSearch(e.target.value)}
                        className="pl-10 w-full p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-500 font-mono uppercase tracking-wider placeholder:text-stone-400 text-stone-900 font-bold"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Icons.Calendar />
                    </div>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="pl-10 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-stone-600"
                    />
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                        <Icons.Filter />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-stone-600 appearance-none"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="en_ruta">En Ruta</option>
                        <option value="entregado">Entregados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                </div>

                <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value as 'date' | 'created')}
                    className="w-full md:w-auto p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-stone-600"
                >
                    <option value="date">Por Fecha Entrega</option>
                    <option value="created">Por Creación</option>
                </select>

                {/* View Switcher */}
                <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                        title="Vista de Lista"
                    >
                        <Icons.List />
                    </button>
                    <button
                        onClick={() => setViewMode('timeline')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'timeline' ? 'bg-white shadow text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                        title="Vista de Tarjetas / Agenda"
                    >
                        <Icons.Grid />
                    </button>
                </div>
            </div>

            {/* --- TIMELINE VIEW --- */}
            {
                viewMode === 'timeline' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Empty State */}
                        {filteredOrders.length === 0 && (
                            <div className="p-10 text-center text-stone-400 bg-white rounded-2xl shadow-sm border border-stone-100">
                                <span className="text-4xl mb-2 block">📅</span>
                                No hay pedidos para mostrar en esta vista.
                            </div>
                        )}

                        {/* Group by Hour */}
                        {Array.from(new Set(filteredOrders.map(o => o.delivery_time.split(':')[0]))).sort().map(hour => {
                            const ordersInHour = filteredOrders.filter(o => o.delivery_time.startsWith(hour)).sort((a, b) => a.delivery_time.localeCompare(b.delivery_time));

                            return (
                                <div key={hour} className="relative">
                                    {/* Hour Divider */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-2xl font-black text-stone-300 w-auto md:w-24 text-left md:text-right">{hour}:00</div>
                                        <div className="h-px flex-1 bg-stone-200 border-t border-dashed border-stone-300"></div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:ml-28">
                                        {ordersInHour.map(order => (
                                            <div key={order.id} onClick={() => setViewingOrder(order)} className="group bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                                                {/* Status Dot */}
                                                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${statusColors[order.status].replace('text-', 'bg-').split(' ')[0]} ring-4 ring-white`}></div>

                                                {/* Header: Time & Code */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="bg-stone-900 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                                                        {order.delivery_time.substring(0, 5)}
                                                    </div>
                                                    <div className="text-xs font-mono font-bold text-stone-400">
                                                        #{order.order_code || order.id}
                                                    </div>
                                                </div>

                                                {/* Client */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold border border-stone-200 shrink-0">
                                                        {order.client_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-stone-900 text-sm truncate">{order.client_name}</div>
                                                        {order.recipient_name && <div className="text-xs text-stone-500 truncate">Para: {order.recipient_name}</div>}
                                                    </div>
                                                </div>

                                                {/* Items Preview */}
                                                <div className="bg-stone-50 rounded-xl p-3 mb-3 border border-stone-100">
                                                    {order.items_data && order.items_data.length > 0 ? (
                                                        <div className="flex items-center gap-3">
                                                            {order.image_url ? (
                                                                <div className="w-12 h-12 rounded-lg bg-white shrink-0 overflow-hidden border border-stone-200">
                                                                    <img src={order.image_url} className="w-full h-full object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-12 h-12 rounded-lg bg-white shrink-0 flex items-center justify-center text-xl border border-stone-200">🎁</div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-bold text-stone-800 text-sm truncate">{order.items_data[0].name}</div>
                                                                {order.items_data.length > 1 && (
                                                                    <div className="text-xs text-stone-500">+{order.items_data.length - 1} más</div>
                                                                )}
                                                                <div className="text-xs font-bold text-stone-400 mt-0.5">${order.total_amount.toFixed(2)}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-stone-500 italic truncate">{order.items_summary}</div>
                                                    )}
                                                </div>

                                                {/* Footer Actions */}
                                                <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                                                    <button onClick={(e) => { e.stopPropagation(); copyDeliveryInfo(order); }} className="text-xs font-bold text-stone-400 hover:text-stone-600 flex items-center gap-1">
                                                        <Icons.Copy /> Copiar
                                                    </button>
                                                    {order.client_phone && (
                                                        <a
                                                            href={`https://wa.me/${order.client_phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 p-1.5 rounded-full transition-colors"
                                                        >
                                                            <Icons.MessageCircle />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            }

            {/* Orders Table (LIST VIEW) */}
            {
                viewMode === 'list' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden min-h-[400px]">
                        {isLoading ? (
                            <div className="p-10 text-center text-stone-400">Cargando...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="p-10 text-center text-stone-400 flex flex-col items-center">
                                <span className="text-4xl mb-2">🔍</span>
                                No se encontraron pedidos con ese código/filtro.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-stone-50 text-stone-500 border-b border-stone-100 font-semibold uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-6 py-4">Código / Hora</th>
                                            <th className="px-6 py-4">Cliente / Recibe</th>
                                            <th className="px-6 py-4">Productos</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Total</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Estado</th>
                                            <th className="px-6 py-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-100">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="group hover:bg-stone-50/50 transition-colors">
                                                <td className="px-6 py-4 min-w-[140px]">
                                                    <div className="flex flex-col items-start bg-stone-50/50 p-2 rounded-xl border border-stone-100/50 hover:bg-stone-100/80 transition-colors">
                                                        <div className="font-mono font-black text-white bg-stone-900 inline-block px-2 py-1 rounded-md text-xs tracking-wider shadow-sm mb-2 transform -rotate-1">
                                                            {order.order_code || `PED-${order.id}`}
                                                        </div>
                                                        <div className="flex items-center text-stone-800 gap-1.5 text-2xl font-black tracking-tighter leading-none">
                                                            <span>{order.delivery_time.substring(0, 5)}</span>
                                                            <span className="text-xs font-bold text-stone-400 self-end mb-1">hrs</span>
                                                        </div>
                                                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1 border-t border-stone-200 pt-1 w-full">
                                                            {new Date(order.delivery_date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-3">
                                                        {/* Avatar Placeholder */}
                                                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold border border-stone-200 shadow-sm shrink-0">
                                                            {order.client_name.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="flex flex-col">
                                                            {/* Client Name + Phone Action */}
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-stone-900 text-sm">{order.client_name}</span>
                                                                {order.client_phone && (
                                                                    <a
                                                                        href={`https://wa.me/${order.client_phone.replace(/\D/g, '')}`}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full p-1 transition-colors"
                                                                        title="Contactar al Cliente por WhatsApp"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <Icons.MessageCircle />
                                                                    </a>
                                                                )}
                                                            </div>

                                                            {/* Recipient */}
                                                            {order.recipient_name && (
                                                                <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                                                                    <span className="text-stone-400"><Icons.User /></span>
                                                                    <span className="font-medium text-stone-600">Para: {order.recipient_name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* Total Products Count Badge */}
                                                    {order.items_data && order.items_data.length > 0 && (
                                                        <div className="mt-2 text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded inline-block">
                                                            Total piezas: {order.items_data.reduce((acc, item) => acc + item.quantity, 0)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {order.items_data && order.items_data.length > 0 ? (
                                                        <div className="space-y-1.5">
                                                            {order.items_data.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-white border border-stone-100 p-1.5 rounded-lg shadow-sm">
                                                                    <span className="bg-stone-900 text-white px-1.5 py-0.5 rounded text-[10px] font-bold min-w-[20px] text-center">
                                                                        {item.quantity}x
                                                                    </span>
                                                                    <span className="font-medium truncate max-w-[140px]" title={item.name}>
                                                                        {item.name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-xs text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-100 max-w-[180px]">
                                                            {order.items_summary || 'Sin detalle'}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell font-mono font-medium text-stone-700">
                                                    ${order.total_amount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 relative hidden md:table-cell">
                                                    <button
                                                        onClick={() => setActiveStatusDropdown(activeStatusDropdown === order.id ? null : order.id)}
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-transform active:scale-95 ${statusColors[order.status]} hover:brightness-95`}
                                                    >
                                                        {statusLabels[order.status]}
                                                        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeStatusDropdown === order.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setActiveStatusDropdown(null)} />
                                                            <div className="absolute left-6 top-12 z-20 w-40 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                                                {Object.entries(statusLabels).map(([key, label]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() => handleQuickStatusUpdate(order.id, key as Order['status'])}
                                                                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-2 ${key === order.status ? 'bg-stone-50 text-stone-900' : 'text-stone-500'}`}
                                                                    >
                                                                        <span className={`w-2 h-2 rounded-full ${statusColors[key as Order['status']].replace('text-', 'bg-').split(' ')[0]}`}></span>
                                                                        {label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setViewingOrder(order)}
                                                            title="Ver Ticket de Producción"
                                                            className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-transparent hover:border-stone-200 active:scale-95"
                                                        >
                                                            <Icons.Eye />
                                                        </button>
                                                        <button
                                                            onClick={() => copyDeliveryInfo(order)}
                                                            title="Copiar mensaje de reparto para pegar en WhatsApp"
                                                            className="p-2 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 active:scale-95"
                                                        >
                                                            <Icons.Copy />
                                                        </button>
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
                )
            }

            {/* Modal Form */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                                <h3 className="font-bold text-lg text-stone-800">{editingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600 p-2 hover:bg-stone-200 rounded-full transition-colors"><Icons.X /></button>
                            </div>

                            <form onSubmit={handleSaveOrder} className="p-6 overflow-y-auto space-y-6">
                                {/* Client Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Cliente</label><input required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Nombre completo" value={formData.client_name} onChange={e => setFormData({ ...formData, client_name: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Teléfono</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Celular / WhatsApp" value={formData.client_phone} onChange={e => setFormData({ ...formData, client_phone: e.target.value })} /></div>
                                </div>

                                {/* Recipient Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Destinatario (Quien recibe)</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Nombre completo" value={formData.recipient_name} onChange={e => setFormData({ ...formData, recipient_name: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Teléfono Destinatario</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Celular" value={formData.recipient_phone} onChange={e => setFormData({ ...formData, recipient_phone: e.target.value })} /></div>
                                    <div className="md:col-span-2"><label className="text-xs font-bold text-stone-500 uppercase">Nota para Tarjeta</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Mensaje corto para la tarjeta..." value={formData.card_note} onChange={e => setFormData({ ...formData, card_note: e.target.value })} /></div>
                                </div>

                                {/* Delivery Info */}
                                <div><label className="text-xs font-bold text-stone-500 uppercase">Dirección de Entrega</label><input className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" placeholder="Calle, Número, Referencia" value={formData.delivery_address} onChange={e => setFormData({ ...formData, delivery_address: e.target.value })} /></div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Fecha Entrega</label><input type="date" required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" value={formData.delivery_date} onChange={e => setFormData({ ...formData, delivery_date: e.target.value })} /></div>
                                    <div><label className="text-xs font-bold text-stone-500 uppercase">Hora Entrega</label><input type="time" required className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-white" value={formData.delivery_time} onChange={e => setFormData({ ...formData, delivery_time: e.target.value })} /></div>
                                </div>

                                {/* --- Start Product Section --- */}
                                <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    <label className="text-xs font-bold text-stone-500 uppercase flex justify-between items-center">
                                        <span>Productos ({formItems.length})</span>
                                        <span className='text-stone-900 font-mono'>Total: ${formItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
                                    </label>

                                    {/* List of Added Items */}
                                    <div className="space-y-2 mb-2">
                                        {formItems.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-stone-200 shadow-sm">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded-md" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-stone-100 rounded-md flex items-center justify-center text-lg">💐</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-semibold text-sm text-stone-800 truncate">{item.name}</div>
                                                    <div className="text-xs text-stone-500">${item.price} x {item.quantity}</div>
                                                </div>
                                                <div className="font-bold text-stone-900 text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormItems(prev => prev.filter((_, i) => i !== idx))}
                                                    className="text-stone-400 hover:text-red-500 p-1"
                                                >
                                                    <Icons.X />
                                                </button>
                                            </div>
                                        ))}
                                        {formItems.length === 0 && (
                                            <div className="text-center py-4 text-stone-400 text-sm italic border-2 border-dashed border-stone-200 rounded-lg">
                                                No hay productos agregados
                                            </div>
                                        )}
                                    </div>

                                    {/* Add Product Controls */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowProductPicker(!showProductPicker)}
                                            className="flex-1 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg text-sm font-bold hover:bg-stone-50 flex items-center justify-center gap-2"
                                        >
                                            <Icons.Search /> {showProductPicker ? 'Cerrar Catálogo' : 'Buscar en Catálogo'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomProductModalOpen(true)}
                                            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-lg text-sm font-bold hover:bg-stone-50"
                                        >
                                            + Otro
                                        </button>
                                    </div>

                                    {/* Product Picker Dropdown */}
                                    {showProductPicker && (
                                        <div className="mt-2 bg-white border border-stone-200 rounded-xl shadow-lg p-2 animate-in fade-in slide-in-from-top-2">
                                            <input
                                                type="text"
                                                placeholder="Filtrar productos..."
                                                autoFocus
                                                className="w-full p-2 mb-2 bg-white text-stone-900 placeholder:text-stone-400 border border-stone-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                                value={productSearch}
                                                onChange={e => setProductSearch(e.target.value)}
                                            />
                                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                                                {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())).map(product => (
                                                    <div
                                                        key={product.id}
                                                        onClick={() => {
                                                            const existing = formItems.find(i => i.id === product.id);
                                                            if (existing) {
                                                                alert("Ya agregaste este producto. Puedes cambiar la cantidad si deseas.");
                                                            } else {
                                                                setFormItems([...formItems, {
                                                                    id: product.id,
                                                                    name: product.name,
                                                                    price: product.price,
                                                                    image_url: product.image_url,
                                                                    quantity: 1
                                                                }]);
                                                            }
                                                            setShowProductPicker(false);
                                                            setProductSearch('');
                                                        }}
                                                        className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer border border-transparent hover:border-stone-200 transition-all flex items-center gap-2"
                                                    >
                                                        {product.image_url && <img src={product.image_url} className="w-8 h-8 rounded object-cover" />}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs font-bold text-stone-800 truncate">{product.name}</div>
                                                            <div className="text-xs text-stone-500">${product.price}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {/* --- End Product Section --- */}
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


                                <div className="flex gap-3 pt-4 justify-end">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg">Cancelar</button>
                                    <button type="submit" className="px-6 py-2 bg-stone-900 text-white rounded-lg hover:bg-black font-medium shadow-md">Guardar Pedido</button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }


            {/* --- Modal: Production View (Ticket Digital) --- */}
            {
                viewingOrder && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-md animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] relative">
                            {/* Header Ticket */}
                            <div className="bg-stone-900 text-white p-6 text-center relative">
                                <button
                                    onClick={() => setViewingOrder(null)}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                                >
                                    <Icons.X />
                                </button>
                                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-widest uppercase mb-2 text-stone-300">
                                    Ticket de Producción
                                </div>
                                <h2 className="text-5xl font-mono font-black tracking-tighter mb-2">
                                    {viewingOrder.order_code || `PED-${viewingOrder.id}`}
                                </h2>
                                <div className="text-xl font-bold text-stone-300 mb-4 bg-white/10 inline-block px-4 py-1 rounded-lg">
                                    Total: ${viewingOrder.total_amount.toFixed(2)}
                                </div>
                                <div className="flex flex-col items-center justify-center gap-1 text-stone-200">
                                    <div className="flex items-center gap-2 text-3xl font-bold text-white">
                                        <Icons.Clock />
                                        <span>{viewingOrder.delivery_time}</span>
                                    </div>
                                    <div className="text-sm font-bold opacity-75 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                                        {new Date(viewingOrder.delivery_date + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-8 bg-white">
                                {/* Producto & Imagen */}
                                <div className="space-y-4 text-center">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">A preparar</label>

                                    {/* Gallery or Single Image */}
                                    {viewingOrder.items_data && viewingOrder.items_data.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {viewingOrder.items_data.map((item, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-2 p-4 border border-stone-100 rounded-xl bg-stone-50">
                                                    {item.image_url && (
                                                        <div className="w-full max-w-[200px] aspect-square rounded-lg overflow-hidden shadow-sm">
                                                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="font-bold text-stone-900 text-lg">
                                                        {item.quantity}x {item.name}
                                                    </div>
                                                    {!item.image_url && <span className="text-xs text-stone-400 italic">(Producto personalizado / Sin foto)</span>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Fallback for Legacy Orders
                                        <>
                                            {viewingOrder.image_url && (
                                                <div className="w-full max-w-sm mx-auto aspect-square rounded-xl overflow-hidden shadow-sm border border-stone-100">
                                                    <img src={viewingOrder.image_url} alt="Referencia" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="text-2xl font-bold text-stone-900 leading-tight">
                                                {viewingOrder.items_summary}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <hr className="border-dashed border-stone-200" />

                                {/* Tarjeta */}
                                <div className="bg-stone-50 p-6 rounded-2xl border-2 border-stone-100 relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-200 text-stone-600 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                        Para la Tarjeta
                                    </div>
                                    {viewingOrder.card_note ? (
                                        <p className="font-handwriting text-2xl md:text-3xl text-stone-800 text-center leading-relaxed font-medium italic">
                                            "{viewingOrder.card_note}"
                                        </p>
                                    ) : (
                                        <p className="text-stone-400 text-center italic text-lg">(Sin mensaje para tarjeta)</p>
                                    )}
                                </div>

                                {/* Info Adicional */}
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="p-3 bg-stone-50 rounded-xl">
                                        <div className="text-xs font-bold text-stone-400 uppercase">Destinatario</div>
                                        <div className="font-bold text-stone-800 truncate">{viewingOrder.recipient_name || 'No especificado'}</div>
                                    </div>
                                    <div className="p-3 bg-stone-50 rounded-xl">
                                        <div className="text-xs font-bold text-stone-400 uppercase">Cliente</div>
                                        <div className="font-bold text-stone-800 truncate">{viewingOrder.client_name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-stone-100 bg-stone-50 flex gap-3">
                                <button
                                    onClick={() => setViewingOrder(null)}
                                    className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all"
                                >
                                    Listo / Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- Modal: Add Custom Product --- */}
            {
                isCustomProductModalOpen && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
                            <h3 className="font-bold text-lg text-stone-800">Agregar Producto Personalizado</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase">Nombre del Producto</label>
                                    <input
                                        autoFocus
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-stone-50"
                                        placeholder="Ej: Globo Gigante, Peluche..."
                                        value={customProductForm.name}
                                        onChange={e => setCustomProductForm({ ...customProductForm, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-stone-500 uppercase">Precio ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-stone-900 placeholder:text-stone-400 bg-stone-50"
                                        placeholder="0.00"
                                        value={customProductForm.price}
                                        onChange={e => setCustomProductForm({ ...customProductForm, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2">
                                <button
                                    onClick={() => setIsCustomProductModalOpen(false)}
                                    className="px-4 py-2 text-stone-500 hover:bg-stone-100 rounded-lg text-sm font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        if (!customProductForm.name) return;
                                        const price = parseFloat(customProductForm.price) || 0;
                                        setFormItems([...formItems, { name: customProductForm.name, price, quantity: 1 }]);
                                        setCustomProductForm({ name: '', price: '' });
                                        setIsCustomProductModalOpen(false);
                                    }}
                                    className="px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-black text-sm font-bold shadow-md"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

