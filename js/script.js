document.addEventListener('DOMContentLoaded', () => {
    
    // --- UI Elements ---
    const appContainer = document.getElementById('app');
    const navLinks = document.querySelectorAll('.nav-item');
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    // Automatically set the current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('open');
        mobileMenuBtn.classList.toggle('open');
    });

    // --- SPA Hash Router ---
    
    const routes = {
        '': 'home-view',
        '#home': 'home-view',
        '#portfolio': 'portfolio-view',
        '#services': 'services-view',
        '#about': 'about-view',
        '#contact': 'contact-view'
    };

    const renderHash = () => {
        let hash = window.location.hash;
        
        // Find the matched template ID, default to home
        const templateId = routes[hash] || 'home-view';
        const template = document.getElementById(templateId);

        if (!template) {
            appContainer.innerHTML = '<h2>404 - Page Not Found</h2>';
            return;
        }

        // Animate out the old view if modifying
        const currentView = appContainer.firstElementChild;
        if (currentView) {
            currentView.classList.replace('view-enter', 'view-leave');
            setTimeout(() => {
                injectTemplate(template);
            }, 300);
        } else {
            injectTemplate(template);
        }

        // Update active nav links
        let currentHash = hash || '#home';
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
        
        // Close mobile menu if open
        if (nav.classList.contains('open')) {
            nav.classList.remove('open');
            mobileMenuBtn.classList.remove('open');
        }
    };

    const injectTemplate = (template) => {
        appContainer.innerHTML = '';
        const clone = template.content.cloneNode(true);
        appContainer.appendChild(clone);
        window.scrollTo(0, 0);
    }

    // Handle hash change
    window.addEventListener('hashchange', renderHash);



    // Initial render
    renderHash();
});
