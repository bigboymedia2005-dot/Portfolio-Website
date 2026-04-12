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

    // --- Projects Data ---
    const projectsData = {
        '1': {
            title: 'Food Delivery App – SaaS Ad',
            description: 'This project focuses on creating a clean and modern product ad using UI animation smooth transitions and clear visual hierarchy to effectively showcase the app experience and drive user engagement.',
            videos: [
                { label: 'Director Cut', src: 'https://www.youtube.com/embed/11U91p2QU8c?autoplay=1&mute=0&controls=1' }
            ],
            isVertical: false,
            thumb: 'assets/thumb_1.png'
        },
        '2': {
            title: 'Echoes - Music Video',
            description: 'Immersive visual storytelling. A blend of narrative pacing and rhythmic cuts to match the emotional beats of the track.',
            videos: [
                { label: 'Version 1', src: 'https://www.youtube.com/embed/PAeiPh3dhr0?autoplay=0&mute=0&controls=1' },
                { label: 'Version 2 (Director Cut)', src: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0&mute=0&controls=1' }
            ],
            isVertical: true,
            thumb: 'assets/thumb_2.png'
        },
        '3': {
            title: 'Urban Flow - Streetwear Promo',
            description: 'Optimized vertical cuts for TikTok, Reels, and YouTube Shorts. Dynamic hook, fast transitions, and high-retention format designed specifically for modern social media consumption.',
            videos: [
                { label: 'Version 1', src: 'https://www.youtube.com/embed/PAeiPh3dhr0?autoplay=0&mute=0&controls=1' },
                { label: 'Version 2 (Faster Pace)', src: 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=0&mute=0&controls=1' }
            ],
            isVertical: true,
            thumb: 'assets/workspace_hero_bg.png'
        }
    };

    // --- Services Data ---
    const servicesData = {
        'cinematic': {
            icon: '🎬',
            title: 'Cinematic Edits',
            description: 'High-end editing for short films, cinematic trailers, and documentary style content focusing on emotional storytelling.',
            features: [
                'Narrative-driven storytelling flow',
                'Advanced color grading (film emulation)',
                'Immersive sound design and Foley mixing',
                'Seamless, motivated transitions'
            ]
        },
        'commercials': {
            icon: '🏎️',
            title: 'Commercials & Promos',
            description: 'Fast-paced, high-retention ads designed to convert and drive engagement for brands.',
            features: [
                'Fast-paced, high retention structuring',
                'Brand-compliant visual assets and text animations',
                'Dynamic speed ramping',
                'Audio sweetening and licensed music sourcing'
            ]
        },
        'social': {
            icon: '📱',
            title: 'Social Media / Shorts',
            description: 'Optimized vertical cuts for TikTok, Reels, and YouTube Shorts with dynamic captions and hooks.',
            features: [
                'Hook-optimized formatting (TikTok, Reels, Shorts)',
                'Engaging, branded dynamic captions',
                'Vertical 9:16 framing mastery',
                'Fast-turnaround scaling and trend-jacking'
            ]
        },
        'youtube': {
            icon: '📺',
            title: 'YouTube Videos',
            description: 'Engaging long-form content editing for creators focusing on retention flow and sound design.',
            features: [
                'Viewer retention graph optimization',
                'A-roll / B-roll management and cleanup',
                'Lower thirds, sound effects, and pop-ins',
                'Multi-cam syncing and pacing'
            ]
        }
    };
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

        let templateId = routes[hash] || 'home-view';
        let isProjectRoute = hash.startsWith('#project/');
        let projectId = null;
        let projectData = null;

        if (isProjectRoute) {
            templateId = 'project-view';
            projectId = hash.split('/')[1];
            projectData = projectsData[projectId];

            if (!projectData) {
                // Invalid project ID
                appContainer.innerHTML = '<h2>404 - Project Not Found</h2>';
                return;
            }
        }

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
                injectTemplate(template, projectData);
            }, 300);
        } else {
            injectTemplate(template, projectData);
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

    const injectTemplate = (template, data = null) => {
        appContainer.innerHTML = '';
        const clone = template.content.cloneNode(true);

        if (data) {
            const titleEl = clone.querySelector('.project-title');
            const descEl = clone.querySelector('.project-desc');
            const iframeEl = clone.querySelector('iframe');
            const videoContainer = clone.querySelector('.video-container-page');
            const versionsContainer = clone.querySelector('#project-video-versions');

            if (titleEl) titleEl.textContent = data.title;
            if (descEl) descEl.textContent = data.description;

            if (iframeEl && data.videos && data.videos.length > 0) {
                iframeEl.src = data.videos[0].src;
                iframeEl.style.transition = 'opacity 0.3s ease';

                if (data.videos.length > 1 && versionsContainer) {
                    data.videos.forEach((vid, idx) => {
                        const btn = document.createElement('button');
                        btn.className = `version-btn ${idx === 0 ? 'active' : ''}`;
                        btn.textContent = vid.label;

                        btn.addEventListener('click', (e) => {
                            versionsContainer.querySelectorAll('.version-btn').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');

                            iframeEl.style.opacity = '0';
                            setTimeout(() => {
                                iframeEl.src = vid.src;
                                setTimeout(() => {
                                    iframeEl.style.opacity = '1';
                                }, 200); // give it a moment to load before fading in
                            }, 300); // 300ms fade out
                        });

                        versionsContainer.appendChild(btn);
                    });
                }
            }

            videoContainer.classList.remove('video-vertical');
            if (data.isVertical && videoContainer) {
                videoContainer.classList.add('video-vertical');
            }

            const similarGrid = clone.querySelector('#similar-projects-grid');
            if (similarGrid) {
                let similarHtml = '';
                let count = 0;
                let currentId = window.location.hash.split('/')[1];
                Object.keys(projectsData).forEach(key => {
                    if (key !== currentId && count < 2) {
                        const pData = projectsData[key];
                        similarHtml += `
                            <a href="#project/${key}" class="portfolio-item-link" data-link>
                                <div class="portfolio-item card">
                                    <div class="thumbnail">
                                        <img src="${pData.thumb}" alt="${pData.title}">
                                        <div class="hover-overlay">
                                            <span>View Project</span>
                                        </div>
                                    </div>
                                    <h3>${pData.title}</h3>
                                </div>
                            </a>
                        `;
                        count++;
                    }
                });
                similarGrid.innerHTML = similarHtml;
            }
        }

        appContainer.appendChild(clone);
        window.scrollTo(0, 0);
        initScrollAnimations();
    }

    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });
    };

    // Handle hash change
    window.addEventListener('hashchange', renderHash);



    // Initial render
    renderHash();

    // --- Modal Logic ---
    const modal = document.getElementById('service-modal');
    const modalBody = modal.querySelector('.modal-body');

    const openServiceModal = (id) => {
        const data = servicesData[id];
        if (!data) return;

        let featuresHtml = data.features.map(f => `<li>${f}</li>`).join('');

        modalBody.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">${data.icon}</div>
            <h2 class="section-title left-align" style="margin-bottom: 1rem;">${data.title}</h2>
            <p style="margin-bottom: 2rem; font-size: 1.1rem;">${data.description}</p>
            <ul class="modal-list">
                ${featuresHtml}
            </ul>
            <a href="#contact" class="btn btn-primary" onclick="document.querySelector('#service-modal').classList.remove('open'); document.body.classList.remove('no-scroll');" style="margin-top: 2rem; width: 100%; display: block; text-align: center;">Start a Project</a>
        `;

        modal.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    };

    // Global click delegate for dynamic elements
    document.addEventListener('click', (e) => {
        // Open modal
        const serviceCard = e.target.closest('.service-card[data-service-id]');
        if (serviceCard) {
            openServiceModal(serviceCard.getAttribute('data-service-id'));
        }

        // Close modal via overlay or X
        if (e.target.closest('[data-close-modal]')) {
            closeModal();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});
