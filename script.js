// --- URL API Vercel ---
const scriptURL = '/api/rsvp';

// ==============================
// AOS INIT
// ==============================
AOS.init({
    duration: 1200,
    once: true,
    easing: 'ease-in-out',
    offset: 120
});

const tombolBuka = document.getElementById('tombol-buka');
const layarPembuka = document.getElementById('layar-pembuka');
const isiUndangan = document.getElementById('isi-undangan');
const musikLatar = document.getElementById('musik-latar');

// ==============================
// AMBIL NAMA TAMU DARI URL
// ==============================
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const tempatNama = document.getElementById('nama-tamu-teks');

if (tempatNama) {
    if (namaTamu) {
        let namaBersih = decodeURIComponent(namaTamu);
        tempatNama.innerText = namaBersih.replace(/%20/g, ' ');
    } else {
        tempatNama.innerText = 'Tamu Undangan';
    }
}

// ==============================
// BUKA UNDANGAN
// ==============================
if (tombolBuka) {
    tombolBuka.addEventListener('click', () => {
        if (musikLatar && musikLatar.paused) {
            musikLatar.play().catch(() => {});
        }
        if (layarPembuka) {
            layarPembuka.style.transform = 'translateY(-100%)';
            layarPembuka.style.opacity = '0';
            layarPembuka.style.transition = 'all 1s ease';
        }
        setTimeout(() => {
            if (layarPembuka) layarPembuka.style.display = 'none';
            if (isiUndangan) {
                isiUndangan.classList.remove('sembunyi');
                document.body.classList.remove('kunci-scroll');
            }
            initScrollAnimation();
        }, 1000);
    });
}

// ==============================
// COUNTDOWN
// ==============================
const targetDate = new Date("June 1, 2026 07:30:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;
    if (distance > 0) {
        const elHari = document.getElementById("hari");
        const elJam = document.getElementById("jam");
        const elMenit = document.getElementById("menit");
        const elDetik = document.getElementById("detik");
        if (elHari) elHari.innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        if (elJam) elJam.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        if (elMenit) elMenit.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        if (elDetik) elDetik.innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }
}, 1000);

// ==============================
// FUNGSI ANIMASI & SALIN TEKS (Sama seperti sebelumnya)
// ==============================
function initScrollAnimation() {
    const allItems = document.querySelectorAll('.section-teks, .section-full, .kotak-acara-modern, .kotak-bank');
    allItems.forEach(item => item.classList.add('scroll-animate'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('show'); });
    }, { threshold: 0.15 });
    allItems.forEach(item => observer.observe(item));

    const fotoItems = document.querySelectorAll('.item-foto');
    const fotoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                fotoItems.forEach((foto, index) => { setTimeout(() => foto.classList.add('show'), index * 250); });
                fotoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const galeri = document.querySelector('.susunan-galeri');
    if(galeri) fotoObserver.observe(galeri);
}

function salinTeks(teks, tombol) {
    navigator.clipboard.writeText(teks).then(() => {
        let iconAsli = tombol.innerHTML;
        tombol.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>`;
        setTimeout(() => { tombol.innerHTML = iconAsli; }, 2000);
    });
}

// ==============================
// LOGIKA PENGIRIMAN RSVP (FIXED JSON)
// ==============================
const form = document.forms['submit-ke-google-sheet'];
const btnKirim = document.getElementById('tombol-kirim');

if (form && btnKirim) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        btnKirim.innerText = 'MENGIRIM...';
        btnKirim.disabled = true;

        // Ubah FormData ke Object JSON agar rapi
        const formData = new FormData(form);
        const dataJson = Object.fromEntries(formData.entries());

        fetch(scriptURL, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(dataJson) 
        })
        .then(response => response.json())
        .then(() => {
            btnKirim.innerText = 'TERKIRIM';
            form.reset();
            setTimeout(() => {
                btnKirim.innerText = 'KIRIM KONFIRMASI';
                btnKirim.disabled = false;
            }, 2000);
        })
        .catch(error => {
            console.error('Error!', error);
            alert('Waduh, gagal ngirim nih.');
            btnKirim.innerText = 'KIRIM KONFIRMASI';
            btnKirim.disabled = false;
        });
    });
}
