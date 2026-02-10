
const https = require('https');

const urls = [
    'https://ahktfivlqgziutchzaqs.supabase.co/storage/v1/object/public/products/1770683931637.png',
    'https://ahktfivlqgziutchzaqs.supabase.co/storage/v1/render/image/public/products/1770683931637.png?width=100&quality=50'
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`URL: ${url}`);
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Content-Type: ${res.headers['content-type']}`);
        console.log(`Content-Length: ${res.headers['content-length']}`);
        console.log('---');
        res.resume(); // consume response to free memory
    }).on('error', (e) => {
        console.error(`Error fetching URL: ${url}`, e);
    });
});
