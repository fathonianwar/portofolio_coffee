// File: script.js
// Kebutuhan: Navbar Toggle, Animasi Scroll, Modal (Menu & Gallery), Smooth Scroll, Dark Mode, Form Validation

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Navbar Toggle (Burger Menu) ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            // Ganti ikon burger/close
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Tutup menu saat link diklik (di mobile)
        navMenu.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.querySelector('i').classList.remove('fa-times');
                    navToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // --- 2. Smooth Scroll (Untuk Home Page) ---
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Cek apakah link adalah hash link ke section di halaman yang sama
            if (this.pathname === window.location.pathname && this.hash) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- 3. Animasi Scroll (Fade-in, Slide-up) ---
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    
    // Fungsi untuk mengecek elemen yang terlihat di viewport
    const checkVisibility = () => {
        const triggerBottom = window.innerHeight * 0.9; // 90% dari viewport
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('animated');
            }
        });
    };

    // Panggil saat load dan scroll
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Panggil saat DOMContentLoaded untuk elemen yang sudah terlihat

    // --- 4. Modal Menu Detail (menu.html) ---
    const menuModal = document.getElementById('menu-modal');
    const closeMenuBtn = menuModal ? menuModal.querySelector('.close-btn') : null;

    if (menuModal) {
        document.querySelectorAll('.view-detail-btn').forEach(button => {
            button.addEventListener('click', function() {
                const card = this.closest('.menu-card');
                
                // Ambil data dari data attributes
                document.getElementById('menu-modal-img').src = card.getAttribute('data-img');
                document.getElementById('menu-modal-name').textContent = card.getAttribute('data-name');
                document.getElementById('menu-modal-price').textContent = card.getAttribute('data-price');
                document.getElementById('menu-modal-desc').textContent = card.getAttribute('data-desc');
                document.getElementById('menu-modal-ing').textContent = card.getAttribute('data-ing');
                
                menuModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Non-aktifkan scroll body
            });
        });

        // Tutup modal
        closeMenuBtn.addEventListener('click', () => {
            menuModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }


    // --- 5. Modal Gallery (Lightbox) (gallery.html) ---
    const galleryModal = document.getElementById('gallery-modal');
    const galleryModalImg = document.getElementById('gallery-modal-img');
    const closeGalleryBtn = galleryModal ? galleryModal.querySelector('.close-btn') : null;

    if (galleryModal) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                galleryModalImg.src = this.getAttribute('data-full');
                galleryModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });

        // Tutup modal
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Tutup Modal jika klik di luar area modal
    window.addEventListener('click', (event) => {
        if (event.target === menuModal) {
            menuModal.style.display = 'none';
            document.body.style.overflow = '';
        }
        if (event.target === galleryModal) {
            galleryModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // --- 6. Form Validation (contact.html) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const formStatus = document.getElementById('form-status');

        const showError = (input, message) => {
            const errorElement = document.getElementById(input.name + '-error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            input.classList.add('input-error');
        };

        const hideError = (input) => {
            const errorElement = document.getElementById(input.name + '-error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            input.classList.remove('input-error');
        };

        const isValidEmail = (email) => {
            // Regex sederhana untuk cek format email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const validateForm = () => {
            let isValid = true;

            // Cek Nama
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Nama tidak boleh kosong.');
                isValid = false;
            } else {
                hideError(nameInput);
            }

            // Cek Email
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email tidak boleh kosong.');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Format email tidak valid.');
                isValid = false;
            } else {
                hideError(emailInput);
            }

            // Cek Pesan
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Pesan tidak boleh kosong.');
                isValid = false;
            } else {
                hideError(messageInput);
            }

            return isValid;
        };

        // Event listener untuk menghilangkan error saat user mengetik
        [nameInput, emailInput, messageInput].forEach(input => {
            input.addEventListener('input', () => {
                // Hanya periksa ulang jika sudah ada class error (untuk UX yang lebih baik)
                if (input.classList.contains('input-error')) {
                    hideError(input);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formStatus.style.display = 'none';

            if (validateForm()) {
                // Simulasi pengiriman form sukses (tanpa backend)
                formStatus.style.backgroundColor = '#d4edda';
                formStatus.style.color = '#155724';
                formStatus.textContent = 'Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                formStatus.style.backgroundColor = '#f8d7da';
                formStatus.style.color = '#721c24';
                formStatus.textContent = 'Mohon perbaiki kesalahan pada form.';
                formStatus.style.display = 'block';
            }
        });
    }
    // --- 7. Dark Mode Toggle (Optional Feature) ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    const setDarkMode = (isDark) => {
        if (isDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.querySelector('i').classList.remove('fa-moon');
            darkModeToggle.querySelector('i').classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.querySelector('i').classList.remove('fa-sun');
            darkModeToggle.querySelector('i').classList.add('fa-moon');
        }
    };

    if (darkModeToggle) {
        // Cek preferensi dari Local Storage
        const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
        setDarkMode(isDarkModeEnabled);

        // Toggle saat diklik
        darkModeToggle.addEventListener('click', () => {
            const isCurrentlyDark = body.classList.contains('dark-mode');
            setDarkMode(!isCurrentlyDark);
        });
    }
});