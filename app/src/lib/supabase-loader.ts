
export default function supabaseLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    try {
        const url = new URL(src);

        // Check if it's a Supabase Storage URL
        if (url.hostname.endsWith('supabase.co') && url.pathname.includes('/storage/v1/object/public')) {
            const newUrl = new URL(url.toString().replace('/object/public', '/render/image/public'));
            newUrl.searchParams.set('width', width.toString());
            newUrl.searchParams.set('quality', (quality || 75).toString());
            newUrl.searchParams.set('resize', 'contain');
            return newUrl.href;
        }

        // Unsplash optimization
        if (url.hostname.includes('unsplash.com')) {
            url.searchParams.set('w', width.toString());
            url.searchParams.set('q', (quality || 75).toString());
            return url.href;
        }

        return src;
    } catch (e) {
        return src;
    }
}
