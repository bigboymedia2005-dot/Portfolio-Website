document.addEventListener('DOMContentLoaded', () => {

    // --- UI Elements ---
    const appContainer = document.getElementById('app');
    const navLinks = document.querySelectorAll('.nav-item');
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    // Automatically set the current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Global Scroll & Parallax Effect ---
    let isTicking = false;

    const updateParallax = () => {
        const parallaxEls = document.querySelectorAll('.hero-bg img, .about-image img');
        if (!parallaxEls.length) return;

        const windowHeight = window.innerHeight;
        parallaxEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                const elemCenter = rect.top + rect.height / 2;
                const windowCenter = windowHeight / 2;
                const distanceFromCenter = elemCenter - windowCenter;
                const yOffset = distanceFromCenter * 0.05;
                el.style.setProperty('--parallax-y', `${yOffset}px`);
            }
        });
    };

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                isTicking = false;
            });
            isTicking = true;
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
                { label: 'Director Cut', src: 'https://www.youtube.com/embed/11U91p2QU8c?autoplay=0&mute=0&controls=1' }
            ],
            isVertical: false,
            thumb: 'assets/thumb_1.jpg'
        },
        '2': {
            title: 'Viral Shorts Editing',
            description: 'A collection of high-retention short-form edits using fast cuts, subtitles, and dynamic pacing to keep viewers engaged and improve watch time across social platforms.',
            videos: [
                { label: 'Edit 1', src: 'https://www.youtube.com/embed/AOwFqAW4wm8' },
                { label: 'Edit 2', src: 'https://www.youtube.com/embed/Lsfnb61ilR0' }
            ],
            isVertical: true,
            thumb: 'assets/3TH.jpg'
        },
        '3': {
            title: 'Podcast Editing',
            description: 'A collection of podcast edits focused on clean cuts, subtitles, and smooth pacing to maintain viewer attention and deliver a professional viewing experience across long-form and short-form content.',
            videos: [
                { label: 'Primary Edits', src: 'https://www.youtube.com/embed/OuyFYODX8-4' },
                { label: 'Other Edits', src: 'https://www.youtube.com/embed/rRqSJM165-Q' }
            ],
            isVertical: true,
            thumb: 'assets/2TH.jpg'
        }
    };

    // --- Services Data ---
    const servicesData = {
        'saas': {
            icon: '💻',
            title: 'SaaS Ads & UI Animation',
            description: 'High-converting SaaS ad videos and UI animations designed to clearly showcase product features, improve user understanding, and drive engagement and conversions.',
            features: [
                'Product-focused storytelling and UI walkthroughs',
                'Smooth UI animations and motion graphics',
                'Clean transitions and modern visual style',
                'Optimized pacing for ads and landing pages'
            ]
        },
        'shorts': {
            icon: '📱',
            title: 'Viral Shorts Editing',
            description: 'Fast-paced short-form edits designed to capture attention instantly and maximize viewer retention across social platforms.',
            features: [
                'Strong hooks within the first seconds',
                'Dynamic cuts, zooms, and transitions',
                'Engaging subtitles and captions',
                'Optimized pacing for TikTok, Reels, and Shorts'
            ]
        },
        'podcast': {
            icon: '🎙️',
            title: 'Podcast Editing',
            description: 'Clean and professional podcast edits focused on clarity, smooth flow, and maintaining audience attention across long and short formats.',
            features: [
                'Clean cuts and natural conversation flow',
                'Subtitles for short-form clips',
                'Audio balancing and clarity enhancement',
                'Distraction-free, professional finish'
            ]
        },
        'youtube': {
            icon: '📺',
            title: 'YouTube Long-Form Editing',
            description: 'Structured long-form video editing focused on storytelling, pacing, and keeping viewers engaged throughout the entire video.',
            features: [
                'Story-driven editing and pacing',
                'Retention-focused cuts and structure',
                'Clean visuals and sound design',
                'Optimized flow for audience engagement'
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
        if (document.body.classList.contains('standalone-page')) return;
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

    const getSrcDoc = (src) => {
        const videoIdMatch = src.match(/\/embed\/([^?]+)/);
        if (!videoIdMatch) return '';
        const videoId = videoIdMatch[1];
        let autoplaySrc = src;
        if (autoplaySrc.includes('autoplay=0')) {
            autoplaySrc = autoplaySrc.replace('autoplay=0', 'autoplay=1');
        } else if (!autoplaySrc.includes('autoplay=1')) {
            autoplaySrc += (autoplaySrc.includes('?') ? '&' : '?') + 'autoplay=1';
        }
        return `<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%;background:#000;}img{position:absolute;width:100%;top:0;bottom:0;margin:auto;object-fit:cover;}.play-btn{position:absolute;width:80px;height:80px;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(255,255,255,0.1);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border:1px solid rgba(255,255,255,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all 0.4s cubic-bezier(0.16,1,0.3,1);}.play-icon{width:0;height:0;border-top:12px solid transparent;border-bottom:12px solid transparent;border-left:18px solid #ffffff;margin-left:6px;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);}a{display:block;width:100%;height:100%;}a:hover .play-btn{transform:translate(-50%,-50%) scale(1.1);background:rgba(255,255,255,0.2);}</style><a href="${autoplaySrc}"><img src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'" alt="Play Video"><div class="play-btn"><div class="play-icon"></div></div></a>`;
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
                const setVideo = (vidStr) => {
                    if (data.isVertical) {
                        iframeEl.removeAttribute('srcdoc');
                        let autoSrc = vidStr;
                        if (autoSrc.includes('autoplay=0')) {
                            autoSrc = autoSrc.replace('autoplay=0', 'autoplay=1');
                        } else if (!autoSrc.includes('autoplay=1')) {
                            autoSrc += (autoSrc.includes('?') ? '&' : '?') + 'autoplay=1';
                        }
                        if (!autoSrc.includes('rel=0')) autoSrc += '&rel=0';
                        iframeEl.src = autoSrc;
                    } else {
                        iframeEl.src = vidStr;
                        iframeEl.srcdoc = getSrcDoc(vidStr);
                    }
                };

                setVideo(data.videos[0].src);
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
                                setVideo(vid.src);
                                setTimeout(() => {
                                    iframeEl.style.opacity = '1';
                                }, data.isVertical ? 450 : 200);
                            }, 300);
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

    const initServiceCardEffects = () => {
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--rotate-x', `0deg`);
                card.style.setProperty('--rotate-y', `0deg`);
            });
        });
    };

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

        initServiceCardEffects();
        updateParallax();
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
        
        // Toggle Password Visibility
        const toggleBtn = e.target.closest('#toggle-password');
        if (toggleBtn) {
            const input = document.getElementById('access-code');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Toggle Icon
            if (type === 'text') {
                toggleBtn.innerHTML = `
                    <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            } else {
                toggleBtn.innerHTML = `
                    <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            }
        }

        // Client Portal Login
        const loginBtn = e.target.closest('.client-portal .btn-primary');
        if (loginBtn) {
            e.preventDefault();
            const clientIdInput = document.getElementById('client-id');
            const accessCodeInput = document.getElementById('access-code');
            const errorEl = document.getElementById('portal-error');
            
            if (clientIdInput && accessCodeInput) {
                const clientId = clientIdInput.value.trim();
                const accessCode = accessCodeInput.value.trim();

                if (clientId === 'PLI-2026' && accessCode === 'Platinum Interiors') {
                    if (errorEl) errorEl.style.display = 'none';
                    window.location.href = 'https://www.notion.so/Client-Portal-e08a2a7bbac947a0b39ca201e10f95c5?source=copy_link';
                } else {
                    if (errorEl) {
                        errorEl.textContent = 'Invalid Client ID or Access Code';
                        errorEl.style.display = 'block';
                    }
                }
            }
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});
