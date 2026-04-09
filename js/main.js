window.addEventListener('error',function(e){if(e.message&&(e.message.includes('null')||e.message.includes('undefined')))e.preventDefault()},true);
/* ============================================
   BATTERIESPEICHER SOLAR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navbar Scroll ----------
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.querySelector('.scroll-top');

    function handleScroll() {
        const y = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', y > 50);
        if (scrollTop) scrollTop.classList.toggle('visible', y > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---------- Scroll to Top ----------
    if (scrollTop) {
        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---------- Mobile Nav ----------
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- FAQ Accordion ----------
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isActive) item.classList.add('active');
        });
    });

    // ---------- Scroll Animations ----------
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        animateElements.forEach(el => observer.observe(el));
    } else {
        animateElements.forEach(el => el.classList.add('visible'));
    }

    // ---------- ROI Calculator ----------
    const roiCapacity = document.getElementById('roi-capacity');
    const roiConsumption = document.getElementById('roi-consumption');
    const roiTariff = document.getElementById('roi-tariff');

    function updateROI() {
        if (!roiCapacity) return;

        const capacity = parseFloat(roiCapacity.value);
        const consumption = parseFloat(roiConsumption.value);
        const tariff = parseFloat(roiTariff.value);

        // Display current values
        const capDisplay = document.getElementById('roi-capacity-val');
        const conDisplay = document.getElementById('roi-consumption-val');
        const tarDisplay = document.getElementById('roi-tariff-val');

        if (capDisplay) capDisplay.textContent = capacity + ' kWh';
        if (conDisplay) conDisplay.textContent = consumption.toLocaleString('de-CH') + ' kWh';
        if (tarDisplay) tarDisplay.textContent = tariff + ' Rp./kWh';

        // Calculations
        const selfConsumptionRate = Math.min(0.35 + (capacity / consumption) * 0.8, 0.85);
        const annualSaving = consumption * selfConsumptionRate * 0.5 * (tariff / 100);
        const systemCost = capacity * 850 + 2500;
        const paybackYears = systemCost / annualSaving;

        const savingEl = document.getElementById('roi-saving');
        const costEl = document.getElementById('roi-cost');
        const paybackEl = document.getElementById('roi-payback');
        const eigenEl = document.getElementById('roi-eigen');

        if (savingEl) savingEl.textContent = 'CHF ' + Math.round(annualSaving).toLocaleString('de-CH');
        if (costEl) costEl.textContent = 'CHF ' + Math.round(systemCost).toLocaleString('de-CH');
        if (paybackEl) paybackEl.textContent = Math.round(paybackYears * 10) / 10 + ' Jahre';
        if (eigenEl) eigenEl.textContent = Math.round(selfConsumptionRate * 100) + '%';
    }

    if (roiCapacity) {
        [roiCapacity, roiConsumption, roiTariff].forEach(input => {
            input.addEventListener('input', updateROI);
        });
        updateROI();
    }

    // ---------- Cookie Banner ----------
    const cookieBanner = document.querySelector('.cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookies-set')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookies-set', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookies-set', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight : 0;
                const top = target.getBoundingClientRect().top + window.scrollY - offset - 20;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---------- Active nav link highlighting ----------
    const sections = document.querySelectorAll('section[id]');
    function highlightNav() {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', highlightNav, { passive: true });

    // ---------- Hero stats count-up ----------
    const statNums = document.querySelectorAll('.hero-stat-number[data-count]');
    statNums.forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        if (isNaN(target)) return;
        const suffix = el.dataset.suffix || '';
        const duration = 1600;
        const start = performance.now() + 300;
        function tick(now) {
            const t = Math.min(1, Math.max(0, (now - start) / duration));
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(eased * target) + (t === 1 ? suffix : (suffix && t > 0.95 ? suffix : ''));
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
    });

});
