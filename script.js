// --- URL GOOGLE SCRIPT ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbwJnx4osfo-n8K1e6qeVmZhkAucHYF18J1FNpmswJOij6-U_sLATx741StzCk892iEsyw/exec';
// ==============================
// AMBIL NAMA TAMU DARI URL (?to=nama)
// ==============================
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const elemenNamaTamu = document.getElementById('nama-tamu-teks');

if (namaTamu && elemenNamaTamu) {
    // Mengganti teks default dengan nama dari link URL
    elemenNamaTamu.innerText = namaTamu;
}
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
// BUKA UNDANGAN
// ==============================
if (tombolBuka) {
    tombolBuka.addEventListener('click', () => {
        if (musikLatar && musikLatar.paused) {
            musikLatar.play().catch(() => {});
        }

        layarPembuka.style.transform = 'translateY(-100%)';
        layarPembuka.style.opacity = '0';
        layarPembuka.style.transition = 'all 1s ease';

        setTimeout(() => {
            layarPembuka.style.display = 'none';
            isiUndangan.classList.remove('sembunyi');
            document.body.classList.remove('kunci-scroll');
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
        document.getElementById("hari").innerText =
            Math.floor(distance / (1000 * 60 * 60 * 24))
            .toString().padStart(2, '0');

        document.getElementById("jam").innerText =
            Math.floor((distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60))
            .toString().padStart(2, '0');

        document.getElementById("menit").innerText =
            Math.floor((distance % (1000 * 60 * 60)) /
            (1000 * 60))
            .toString().padStart(2, '0');

        document.getElementById("detik").innerText =
            Math.floor((distance % (1000 * 60)) / 1000)
            .toString().padStart(2, '0');
    }
}, 1000);

// ==============================
// FOTO MUNCUL SATU SATU
// ==============================
function initScrollAnimation() {
    const allItems = document.querySelectorAll(
        '.section-teks, .section-full, .kotak-acara-modern, .kotak-bank'
    );

    allItems.forEach(item => {
        item.classList.add('scroll-animate');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.15
    });

    allItems.forEach(item => observer.observe(item));

    // FOTO SATU-SATU
    const fotoItems = document.querySelectorAll('.item-foto');

    const fotoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){

                fotoItems.forEach((foto, index) => {
                    setTimeout(() => {
                        foto.classList.add('show');
                    }, index * 250); // muncul satu satu
                });

                fotoObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    const galeri = document.querySelector('.susunan-galeri');
    if(galeri){
        fotoObserver.observe(galeri);
    }
}

// auto start kalau undangan udah kebuka
window.addEventListener('load', () => {
    if (!isiUndangan.classList.contains('sembunyi')) {
        initScrollAnimation();
    }
});

// ==============================
// FUNGSI SALIN TEKS (COPY REKENING)
// ==============================
function salinTeks(teks, tombol) {
    navigator.clipboard.writeText(teks).then(() => {
        // Simpan icon asli
        let iconAsli = tombol.innerHTML;
        
        // Ubah jadi icon ceklis dengan ukuran 16x16 biar tombol gak berubah ukurannya
        tombol.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16"><path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/></svg>`;
        
        // Kembalikan ke icon asli setelah 2 detik
        setTimeout(() => {
            tombol.innerHTML = iconAsli;
        }, 2000);
    }).catch(err => {
        console.error('Gagal menyalin teks: ', err);
        alert('Gagal menyalin teks, silakan coba lagi!');
    });
    
    // ==============================
    // KIRIM FORM KE GOOGLE SHEETS
    // ==============================
    const form = document.forms['submit-ke-google-sheet'];
    const btnKirim = document.getElementById('tombol-kirim');
    
    form.addEventListener('submit', e => {
        e.preventDefault(); // Biar halaman nggak ke-refresh otomatis
        btnKirim.innerText = 'MENGIRIM...'; // Ubah teks tombol pas loading
    
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => {
                alert('Mantap! Konfirmasi kehadiran udah berhasil terkirim.');
                form.reset(); // Kosongin isian form
                btnKirim.innerText = 'KIRIM KONFIRMASI'; // Balikin teks tombol
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Waduh, gagal ngirim nih. Coba cek koneksi dan ulangi ya!');
                btnKirim.innerText = 'KIRIM KONFIRMASI';
            });
    });
    
}
