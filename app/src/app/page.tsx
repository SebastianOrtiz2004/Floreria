import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import HeroSlider from '@/components/HeroSlider';
import CatalogSection from '@/components/CatalogSection';
import { supabase } from '@/lib/supabase';

// Revalidate data every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home() {

  // 1. Fetch Categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');

  // 2. Fetch Products with Category Name
  const { data: productsData } = await supabase
    .from('products')
    .select(`
      *,
      categories (name)
    `)
    .order('created_at', { ascending: false });

  // 3. Map Data to Frontend Interface
  const categories = categoriesData || [];

  const products = productsData?.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image_url || 'https://images.unsplash.com/photo-1563241527-3af805364841?q=80&w=800', // Fallback
    category: p.categories?.name || 'Varios',
    description: p.description
  })) || [];

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900 bg-primary-50 overflow-x-hidden w-full max-w-[100vw]">
      <Header />

      <main className="flex-grow">
        {/* Hero Section - Estilo "Cherry Blossom" Luminoso */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-primary-50">
          {/* Slider de Fondo */}
          <HeroSlider />

          {/* Overlay Oscuro para Legibilidad */}
          <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none"></div>

          {/* Decoración Floral Ultra-Premium - Izquierda */}
          <div className="absolute -left-20 bottom-0 w-[600px] h-[700px] pointer-events-none hidden lg:block z-0 opacity-60 mix-blend-multiply">
            <svg viewBox="0 0 300 400" className="w-full h-full animate-gentle-sway drop-shadow-2xl">
              <defs>
                <linearGradient id="sakuraGradientLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbcfe8" /> {/* Rose 200 */}
                  <stop offset="50%" stopColor="#f472b6" /> {/* Rose 400 */}
                  <stop offset="100%" stopColor="#be185d" /> {/* Rose 700 */}
                </linearGradient>
                <filter id="glowLeft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Rama Principal - Estilo Tinta China Suave */}
              <path d="M50,400 C100,300 20,200 80,100" stroke="#831843" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
              <path d="M80,100 C110,50 150,80 160,40" stroke="#831843" strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round" />

              {/* Rama Secundaria */}
              <path d="M60,280 C90,260 120,280 140,240" stroke="#831843" strokeWidth="1" fill="none" opacity="0.25" strokeLinecap="round" />

              {/* Flores Principales - Blooming Effect */}
              <g transform="translate(80,100)">
                <title>Sakura Bloom</title>
                <g className="animate-bloom">
                  <circle cx="0" cy="0" r="25" fill="url(#sakuraGradientLeft)" opacity="0.15" filter="url(#glowLeft)" />
                  <path d="M0,-5 C5,-15 15,-15 20,-5 C25,5 15,15 5,10 C-5,20 -15,15 -15,5 C-20,-5 -10,-15 0,-5" fill="url(#sakuraGradientLeft)" opacity="0.8" />
                  <circle cx="0" cy="0" r="3" fill="#ffe4e6" />
                  {/* Estambres */}
                  <line x1="0" y1="0" x2="5" y2="-5" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
                  <line x1="0" y1="0" x2="-5" y2="-4" stroke="#fff" strokeWidth="0.5" opacity="0.6" />
                </g>
              </g>

              <g transform="translate(160,40) scale(0.8)">
                <g className="animate-bloom" style={{ animationDelay: '1s' }}>
                  <path d="M0,0 C10,-10 20,-5 25,5 C20,15 10,20 0,10 C-10,20 -20,10 -15,0 C-10,-10 0,-10 0,0" fill="url(#sakuraGradientLeft)" opacity="0.75" />
                  <circle cx="0" cy="0" r="2" fill="#fff" />
                </g>
              </g>

              {/* Pétalos Cayendo (Drifting) */}
              <g transform="translate(100,80)">
                <path d="M0,0 C2,-5 5,-2 0,5 C-5,-2 -2,-5 0,0" fill="#f472b6" className="animate-petal-drift-1" opacity="0.6" />
              </g>
              <g transform="translate(140,150)">
                <circle r="3" fill="#fbcfe8" className="animate-petal-drift-2" opacity="0.5" />
              </g>
              <g transform="translate(50,200)">
                <path d="M0,0 Q5,-5 0,-10 Q-5,-5 0,0" fill="#db2777" className="animate-petal-drift-3" opacity="0.4" />
              </g>
            </svg>
          </div>

          {/* Decoración Floral Ultra-Premium - Derecha */}
          <div className="absolute -right-20 bottom-0 w-[650px] h-[750px] pointer-events-none hidden lg:block z-0 opacity-60 mix-blend-multiply">
            <svg viewBox="0 0 300 400" className="w-full h-full animate-gentle-sway drop-shadow-2xl transform scale-x-[-1]" style={{ animationDelay: '2s' }}>
              <defs>
                <linearGradient id="sakuraGradientRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbcfe8" />
                  <stop offset="60%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#9d174d" />
                </linearGradient>
              </defs>

              {/* Rama Principal Elegante */}
              <path d="M80,400 C150,300 50,200 120,50" stroke="#831843" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
              {/* Ramas secundarias */}
              <path d="M100,250 C140,220 180,240 200,180" stroke="#831843" strokeWidth="1" fill="none" opacity="0.2" strokeLinecap="round" />

              {/* Bouquet Principal */}
              <g transform="translate(120,50) rotate(10)">
                <g className="animate-bloom" style={{ animationDelay: '0.5s' }}>
                  {/* Halo de luz */}
                  <circle cx="0" cy="0" r="40" fill="url(#sakuraGradientRight)" opacity="0.1" filter="url(#glowLeft)" />
                  {/* Flor compleja */}
                  <path d="M0,-10 C10,-25 30,-15 25,5 C30,25 10,35 0,25 C-10,35 -30,25 -25,5 C-30,-15 -10,-25 0,-10" fill="url(#sakuraGradientRight)" opacity="0.85" />
                  <circle cx="0" cy="0" r="4" fill="#fff1f2" />
                </g>
              </g>

              {/* Capullos */}
              <g transform="translate(180,180) scale(0.6)">
                <circle cx="0" cy="0" r="15" fill="url(#sakuraGradientRight)" opacity="0.6" />
              </g>

              {/* Lluvia de Pétalos */}
              <g transform="translate(150,100)">
                <path d="M0,0 C3,-4 6,0 0,6 C-6,0 -3,-4 0,0" fill="#ec4899" className="animate-petal-drift-2" opacity="0.7" />
              </g>
              <g transform="translate(100,300)">
                <circle r="4" fill="#fbcfe8" className="animate-petal-drift-1" opacity="0.4" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in pt-20 sm:pt-10">
            <div className="mb-6 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/50 text-primary-900 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Diseño Floral de Autor</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-lg filter shadow-black/20">
              Exclusividad y arte<br />
              <span className="italic font-light text-white/90">en cada creación</span>
            </h1>

            <p className="text-base sm:text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
              Transformamos sentimientos en obras maestras florales. Cada detalle cuenta una historia única.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <a
                href="#catalogo"
                className="group relative w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-primary-500 text-white rounded-full font-serif font-medium overflow-hidden transition-all shadow-xl hover:shadow-primary-500/40 hover:-translate-y-1"
              >
                <span className="relative z-10">Ver Colección</span>
                <div className="absolute inset-0 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </a>
              <a
                href="https://wa.me/593995676815"
                className="group flex items-center justify-center gap-2 text-white/90 border-b border-white/40 pb-1 hover:border-white hover:text-white transition-all font-medium text-sm sm:text-base mt-2 sm:mt-0"
              >
                <span>Solicitar Diseño Personalizado</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>
        </section>

        {/* Brand Values / Benefits - Rediseño Premium */}
        <section className="py-24 bg-stone-50 relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-10 pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-900 mb-4">La Diferencia El Tulipán</h2>
              <div className="w-24 h-1 bg-primary-300 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Card 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(219,39,119,0.15)] transition-all duration-300 transform hover:-translate-y-2 border border-primary-100/50 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 shadow-sm border border-primary-100 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4 group-hover:text-primary-700 transition-colors">Entrega Express</h3>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Entendemos la urgencia de tus sentimientos. Garantizamos entregas puntuales en menos de 4 horas para que tu sorpresa llegue perfecta.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(219,39,119,0.15)] transition-all duration-300 transform hover:-translate-y-2 border border-primary-100/50 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 shadow-sm border border-primary-100 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4 group-hover:text-primary-700 transition-colors">Frescura Garantizada</h3>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Seleccionamos cada tallo a mano cada mañana. Flores vibrantes, aromáticas y duraderas que superan las expectativas más exigentes.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] md:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(219,39,119,0.15)] transition-all duration-300 transform hover:-translate-y-2 border border-primary-100/50 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600 shadow-sm border border-primary-100 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary-900 mb-4 group-hover:text-primary-700 transition-colors">Compra Segura</h3>
                <p className="text-stone-600 font-medium leading-relaxed">
                  Tu tranquilidad es primero. Proceso de compra encriptado, atención personalizada por WhatsApp y satisfacción total garantizada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Catalog Section */}
        <CatalogSection products={products} categories={categories} />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
