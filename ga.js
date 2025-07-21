// Injecter le vrai script gtag
const script = document.createElement('script');
script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HHB456PQGJ';
script.async = true;
document.head.appendChild(script);

// Config GA avec anonymisation
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-HHB456PQGJ', { anonymize_ip: true });
