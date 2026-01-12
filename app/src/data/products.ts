export type ProductCategory = 'Amor' | 'Cumpleaños' | 'Condolencias' | 'Aniversario' | 'Detalles';

export interface Product {
    id: string | number;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
}

export const products: Product[] = [
    {
        id: '1',
        name: 'Primavera Eterna',
        price: 35.00,
        category: 'Amor',
        image: 'https://images.unsplash.com/photo-1563241527-3af805364841?q=80&w=800&auto=format&fit=crop', // Tulipanes rosas
        description: 'Hermoso arreglo de 12 tulipanes frescos en base de cristal.'
    },
    {
        id: '2',
        name: 'Pasión Escarlata',
        price: 45.00,
        category: 'Amor',
        image: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=800&auto=format&fit=crop', // Rosas rojas
        description: '24 rosas rojas de alta calidad, perfectas para declarar tu amor.'
    },
    {
        id: '3',
        name: 'Consuelo Blanco',
        price: 40.00,
        category: 'Condolencias',
        image: 'https://images.unsplash.com/photo-1606561226788-b7156942416c?q=80&w=800&auto=format&fit=crop', // Lirios blancos
        description: 'Lirios y rosas blancas en diseño sobrio y elegante.'
    },
    {
        id: '4',
        name: 'Alegría Solar',
        price: 30.00,
        category: 'Cumpleaños',
        image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=800&auto=format&fit=crop', // Girasoles
        description: 'Radiante arreglo de girasoles para iluminar el día.'
    },
    {
        id: '5',
        name: 'Dulce Romance',
        price: 50.00,
        category: 'Aniversario',
        image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800&auto=format&fit=crop', // Pastel colors
        description: 'Mix de flores en tonos pastel con follaje fino.'
    },
    {
        id: '6',
        name: 'Orquídea Imperial',
        price: 60.00,
        category: 'Detalles',
        image: 'https://images.unsplash.com/photo-1566938064504-a6998b3164a2?q=80&w=800&auto=format&fit=crop', // Orquídea
        description: 'Orquídea Phalaenopsis de doble vara en maceta decorativa.'
    },
];
