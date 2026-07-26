// 1. Inisialisasi Particles.js dengan Tema Forex & Data Flow
// Menggunakan partikel kecil yang mengalir ke atas, merepresentasikan data pasar
particlesJS('particles-js', {
  particles: {
    number: {
      value: 80, // Jumlah elemen pasar
      density: {
        enable: true,
        value_area: 1000
      }
    },
    color: {
      // Menggunakan warna pasar: Putih (netral), Hijau (Bullish), Merah (Bearish)
      value: ["#ffffff", "#2ecc71", "#e74c3c"] 
    },
    shape: {
      type: ["circle", "edge"], // Kombinasi titik data dan grafik batang
      stroke: {
        width: 0,
        color: "#000000"
      },
    },
    opacity: {
      value: 0.25, // Sedikit lebih terlihat tapi tetap samar
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 3,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 120, // Menghubungkan titik data untuk membentuk tren
      color: "#ffffff",
      opacity: 0.05,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5, // Aliran data yang lambat
      direction: "top", // Aliran data ke atas (bullish bias)
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: true,
        mode: "grab" // Efek saat kursor mendekat, data "terkoneksi"
      },
      onclick: {
        enable: true,
        mode: "push" // Menambah data saat diklik
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.2
        }
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 200,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
});

// 2. Animasi Muncul (Reveal) saat Loading (Tetap sama)
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('active');
        }, 200 * index); // Efek muncul bergantian (staggered)
    });
});

// 3. Efek Click Feedback (Tetap sama)
const buttons = document.querySelectorAll('.glass-btn');
buttons.forEach(btn => {
    btn.addEventListener('mousedown', () => btn.style.transform = "scale(0.95)");
    btn.addEventListener('mouseup', () => btn.style.transform = "scale(1.05)");
});
