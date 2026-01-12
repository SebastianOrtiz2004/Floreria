'use client';

import { useState } from 'react';

type OrderStatus = 'confirmar' | 'cola' | 'elaboracion' | 'ruta' | 'entregado';

interface Order {
    id: string;
    customer: string;
    product: string;
    amount: number;
    status: OrderStatus;
    time: string;
}

const initialOrders: Order[] = [
    { id: '101', customer: 'Juan Silva', product: 'Primavera Eterna', amount: 35, status: 'confirmar', time: '14:20' },
    { id: '102', customer: 'Andrea Loor', product: 'Pasión Escarlata', amount: 45, status: 'cola', time: '13:00' },
    { id: '103', customer: 'Empresa X', product: 'Alegría Solar', amount: 30, status: 'elaboracion', time: '11:30' },
    { id: '104', customer: 'Carlos M.', product: 'Orquídea', amount: 60, status: 'ruta', time: '10:00' },
];

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>(initialOrders);

    const copyLink = () => {
        // En producción sería la URL real
        const link = typeof window !== 'undefined' ? window.location.origin + '/envio' : '/envio';
        navigator.clipboard.writeText(link);
        alert('Link copiado: ' + link);
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'confirmar': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cola': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'elaboracion': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'ruta': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'entregado': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100';
        }
    };

    const getColumnTitle = (status: OrderStatus) => {
        switch (status) {
            case 'confirmar': return 'Por Confirmar Pago';
            case 'cola': return 'Confirmado / En Cola';
            case 'elaboracion': return 'En Elaboración';
            case 'ruta': return 'En Ruta';
            case 'entregado': return 'Entregado';
        }
    };

    const KanbanColumn = ({ status }: { status: OrderStatus }) => (
        <div className="flex-1 min-w-[250px] bg-stone-50 rounded-xl p-4 border border-stone-200 h-full flex flex-col">
            <h3 className="font-bold text-stone-700 mb-4 flex justify-between items-center">
                {getColumnTitle(status)}
                <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-stone-200">
                    {orders.filter(o => o.status === status).length}
                </span>
            </h3>
            <div className="space-y-3 overflow-y-auto flex-1">
                {orders.filter(o => o.status === status).map(order => (
                    <div key={order.id} className="bg-white p-3 rounded-lg shadow-sm border border-stone-100 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-stone-800">#{order.id}</span>
                            <span className="text-xs text-stone-400">{order.time}</span>
                        </div>
                        <p className="font-medium text-primary-700 text-sm">{order.customer}</p>
                        <p className="text-stone-500 text-xs truncate">{order.product}</p>
                        <div className="mt-2 flex justify-end">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getStatusColor(order.status)} bg-opacity-50`}>
                                ${order.amount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Layout ya provee la estructura base. Renderizamos solo el contenido del Dashboard.
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-primary-900">Tablero de Pedidos</h1>
                    <p className="text-stone-500">Gestión de órdenes en tiempo real</p>
                </div>
                <button
                    onClick={copyLink}
                    className="flex items-center gap-2 bg-white border border-primary-200 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar Link Pedido
                </button>
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-4 h-full min-w-max">
                    <KanbanColumn status="confirmar" />
                    <KanbanColumn status="cola" />
                    <KanbanColumn status="elaboracion" />
                    <KanbanColumn status="ruta" />
                    <KanbanColumn status="entregado" />
                </div>
            </div>
        </div>
    );
}
