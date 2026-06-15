// Your Partner Technologies - Main JavaScript

// Load Header/Navigation Component
function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Check if we're in a subdirectory
        const isServicePage = window.location.pathname.includes('/services/');
        const isBlogPage = window.location.pathname.includes('/blog/');
        const isSubpage = window.location.pathname.includes('/team/') || window.location.pathname.includes('/case-studies/');
        const prefix = (isSubpage || isServicePage || isBlogPage) ? '../' : '';
        const svcPrefix = isServicePage ? '' : (isSubpage || isBlogPage ? '../services/' : 'services/');

        const isActive = (page) => {
            if (page === currentPage) return true;
            if (page === 'services.html' && (currentPage === 'value-discovery-canvas.html' || currentPage === 'agentic-ai.html' || currentPage === 'data-ai-services.html' || currentPage === 'ltad2.html' || currentPage === 'ltad.html')) return true;
            if (page === 'about.html' && window.location.pathname.includes('/team/')) return true;
            if (page === 'case-studies.html' && (currentPage === 'case-studies.html' || window.location.pathname.includes('/case-studies/'))) return true;
            return false;
        };

        const activeClass = (page) => isActive(page) ? 'active' : '';
        const mobileActiveClass = (page) => isActive(page) ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400';

        const headerHTML = `
    <a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:bg-cyan-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Skip to main content</a>
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20" style="background:rgba(3,7,18,0.85);background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E&quot;)">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="${prefix}index.html" class="flex items-center space-x-2">
                    <img src="https://objectstorage.us-sanjose-1.oraclecloud.com/n/axtx9ohfletb/b/ypt/o/Logo-128.png" alt="Your Partner Technologies" class="h-10 w-auto">
                </a>

                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center space-x-8">
                    <a href="${prefix}index.html" class="nav-link ${activeClass('index.html')}">Home</a>
                    <a href="${prefix}strategic-advisory.html" class="nav-link ${activeClass('strategic-advisory.html')}">Strategic Advisory</a>
                    <div class="services-dropdown">
                        <a href="${prefix}services.html" class="nav-link dropdown-toggle ${activeClass('services.html')}">
                            Execution &amp; Capabilities
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                        </a>
                        <div class="dropdown-menu">
                            <a href="${svcPrefix}data-ai-services.html">
                                <span class="dropdown-label">Data & AI Services</span>
                            </a>
                            <a href="${svcPrefix}agentic-ai.html">
                                <span class="dropdown-label">Agentic AI</span>
                            </a>
                            <a href="${svcPrefix}value-discovery-canvas.html">
                                <span class="dropdown-label">Value Discovery Canvas</span>
                            </a>
                            <a href="${svcPrefix}ltad.html">
                                <span class="dropdown-label">Let's Talk About Data!</span>
                            </a>
                            <a href="${svcPrefix}ltad2.html">
                                <span class="dropdown-label">LTAD 2.0</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="${prefix}services.html" class="view-all">View All &rarr;</a>
                        </div>
                    </div>
                    <a href="${prefix}ai-powered-solutions.html" class="nav-link ${activeClass('ai-powered-solutions.html')}">AI Powered Solutions</a>
                    <a href="${prefix}trainings.html" class="nav-link ${activeClass('trainings.html')}">Trainings</a>
                    <a href="${prefix}case-studies.html" class="nav-link ${activeClass('case-studies.html')}">Case Studies</a>
                    <a href="${prefix}blog/" class="nav-link ${isBlogPage ? 'active' : ''}">Blog</a>
                    <a href="${prefix}about.html" class="nav-link ${activeClass('about.html')}">Why YPT!</a>
                    <a href="https://wa.me/601123209594" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-semibold transition" style="background:#25D366;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'" aria-label="Chat on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                </div>

                <!-- Mobile Menu Button -->
                <button id="mobile-menu-button" class="md:hidden p-2" aria-label="Toggle menu" aria-expanded="false">
                    <div class="w-6 h-5 flex flex-col justify-between">
                        <span class="hamburger-bar w-full h-0.5 bg-gray-300 transition-all duration-300"></span>
                        <span class="hamburger-bar w-full h-0.5 bg-gray-300 transition-all duration-300"></span>
                        <span class="hamburger-bar w-full h-0.5 bg-gray-300 transition-all duration-300"></span>
                    </div>
                </button>
            </div>

            <!-- Mobile Menu -->
            <div id="mobile-menu" class="mobile-menu md:hidden">
                <div class="py-4 space-y-2 border-t border-cyan-500/20">
                    <a href="${prefix}index.html" class="block py-2 px-4 ${mobileActiveClass('index.html')} transition">Home</a>
                    <a href="${prefix}strategic-advisory.html" class="block py-2 px-4 ${mobileActiveClass('strategic-advisory.html')} transition">Strategic Advisory</a>
                    <div class="mobile-services-dropdown">
                        <div class="block py-2 px-4 ${mobileActiveClass('services.html')} transition mobile-dropdown-toggle cursor-pointer">
                            Execution &amp; Capabilities
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                        </div>
                        <div class="mobile-dropdown-menu">
                            <a href="${svcPrefix}data-ai-services.html">Data & AI Services</a>
                            <a href="${svcPrefix}agentic-ai.html">Agentic AI</a>
                            <a href="${svcPrefix}value-discovery-canvas.html">Value Discovery Canvas</a>
                            <a href="${svcPrefix}ltad.html">Let's Talk About Data!</a>
                            <a href="${svcPrefix}ltad2.html">LTAD 2.0</a>
                            <a href="${prefix}services.html">View All</a>
                        </div>
                    </div>
                    <a href="${prefix}ai-powered-solutions.html" class="block py-2 px-4 ${mobileActiveClass('ai-powered-solutions.html')} transition">AI Powered Solutions</a>
                    <a href="${prefix}trainings.html" class="block py-2 px-4 ${mobileActiveClass('trainings.html')} transition">Trainings</a>
                    <a href="${prefix}case-studies.html" class="block py-2 px-4 ${mobileActiveClass('case-studies.html')} transition">Case Studies</a>
                    <a href="${prefix}blog/" class="block py-2 px-4 ${isBlogPage ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'} transition">Blog</a>
                    <a href="${prefix}about.html" class="block py-2 px-4 ${mobileActiveClass('about.html')} transition">Why YPT!</a>
                    <a href="https://wa.me/601123209594" target="_blank" rel="noopener noreferrer" class="block py-2 px-4 hover:text-green-300 transition" style="color:#25D366;">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 inline mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    </nav>`;

        headerPlaceholder.innerHTML = headerHTML;

        // Initialize mobile menu after header is loaded
        initMobileMenu();
        initMobileServicesDropdown();
    }
}

// Mobile Services Dropdown Toggle
function initMobileServicesDropdown() {
    const dropdowns = document.querySelectorAll('.mobile-services-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('open');
            });
        }
    });
}

// Load Footer Component
function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // Determine if we're in a subdirectory
        const isServicePage = window.location.pathname.includes('/services/');
        const isBlogPage = window.location.pathname.includes('/blog/');
        const isSubpage = window.location.pathname.includes('/team/') || window.location.pathname.includes('/case-studies/');
        const prefix = (isSubpage || isServicePage || isBlogPage) ? '../' : '';
        const svcPrefix = isServicePage ? '' : (isSubpage || isBlogPage ? '../services/' : 'services/');

        const footerHTML = `
<footer class="bg-black py-12 border-t border-cyan-500/20 relative z-10">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
            <div>
                <h4 class="text-lg font-bold text-gradient from-blue-400 to-cyan-400 mb-4">Your Partner Technologies</h4>
                <p class="text-gray-400 text-sm">Elite Data & AI Advisory. Independent strategic advisors for enterprise transformation.</p>
            </div>
            <div>
                <h5 class="text-white font-semibold mb-4">Quick Links</h5>
                <ul class="space-y-2 text-gray-400 text-sm">
                    <li><a href="${prefix}strategic-advisory.html" class="hover:text-cyan-400 transition">Strategic Advisory</a></li>
                    <li><a href="${prefix}services.html" class="hover:text-cyan-400 transition">Execution & Capabilities</a></li>
                    <li><a href="${prefix}ai-powered-solutions.html" class="hover:text-amber-400 transition">AI Powered Solutions</a></li>
                    <li><a href="${prefix}trainings.html" class="hover:text-cyan-400 transition">Trainings</a></li>
                    <li><a href="${prefix}case-studies.html" class="hover:text-cyan-400 transition">Case Studies</a></li>
                    <li><a href="${prefix}about.html" class="hover:text-cyan-400 transition">Why YPT!</a></li>
                    <li><a href="${prefix}contact.html" class="hover:text-cyan-400 transition">Contact</a></li>
                </ul>
            </div>
            <div>
                <h5 class="text-white font-semibold mb-4">Execution & Capabilities</h5>
                <ul class="space-y-2 text-gray-400 text-sm">
                    <li><a href="${svcPrefix}value-discovery-canvas.html" class="hover:text-cyan-400 transition">Value Discovery Canvas</a></li>
                    <li><a href="${svcPrefix}agentic-ai.html" class="hover:text-cyan-400 transition">Agentic AI</a></li>
                    <li><a href="${svcPrefix}data-ai-services.html" class="hover:text-cyan-400 transition">Data & AI Services</a></li>
                    <li><a href="${svcPrefix}ltad2.html" class="hover:text-orange-400 transition">LTAD 2.0</a></li>
                    <li><a href="${svcPrefix}ltad.html" class="hover:text-red-400 transition">Let's Talk About Data!</a></li>
                </ul>
            </div>
        </div>
        <div class="flex justify-center mb-6">
            <a href="https://www.youtube.com/@letstalkaboutdata?sub_confirmation=1" target="_blank" class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span class="text-sm">Subscribe to Let's Talk About Data!</span>
            </a>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center">
            <p class="text-gray-500 text-sm">&copy; 2026 Your Partner Technologies. All Rights Reserved.</p>
        </div>
    </div>
</footer>`;

        footerPlaceholder.innerHTML = footerHTML;
    }
}

// Navigation Component
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Highlight active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            menuButton.setAttribute('aria-expanded', isOpen);

            // Update hamburger icon
            const bars = menuButton.querySelectorAll('.hamburger-bar');
            if (bars.length === 3) {
                if (isOpen) {
                    bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    bars[1].style.opacity = '0';
                    bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Enable animations after page is stable (prevents CLS)
function enableAnimations() {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            document.body.classList.add('animations-ready');
        }, { timeout: 2000 });
    } else {
        setTimeout(() => {
            document.body.classList.add('animations-ready');
        }, 1000);
    }
}

// Fetch and display dynamic episode count from YouTube
async function loadEpisodeCount() {
    const elements = document.querySelectorAll('[data-episode-count]');
    if (elements.length === 0) return;

    try {
        const response = await fetch(
            'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLM_Wylnk9Tfs6ypCBmFi5_Sg3WhB8LH-C&maxResults=10&key=AIzaSyBlMehnBk0gcwux_F6ZMDagYsJcGSb6AFs'
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            let maxEpisode = 0;
            data.items.forEach(item => {
                const match = item.snippet.title.match(/(?:Episode\s*#?|EP\s*#?|#)(\d+)/i);
                if (match) {
                    const epNum = parseInt(match[1]);
                    if (epNum > maxEpisode) maxEpisode = epNum;
                }
            });

            if (maxEpisode > 0) {
                const displayText = Math.floor(maxEpisode / 5) * 5 + '+';
                elements.forEach(el => {
                    el.textContent = displayText;
                });
            }
        }
    } catch (error) {
        console.error('Error fetching episode count:', error);
    }
}

// Floating Scroll to Top Button
function initFloatingButtons() {
    var container = document.createElement('div');
    container.id = 'floating-buttons';
    Object.assign(container.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: '40'
    });

    // Scroll to Top Button
    var topBtn = document.createElement('button');
    topBtn.id = 'scroll-to-top';
    topBtn.setAttribute('aria-label', 'Scroll to top');
    topBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    Object.assign(topBtn.style, {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #3b82f6, #22d3ee)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: 'none'
    });

    container.appendChild(topBtn);
    document.body.appendChild(container);

    var scrollTicking = false;
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    topBtn.style.opacity = '1';
                    topBtn.style.transform = 'translateY(0)';
                    topBtn.style.pointerEvents = 'auto';
                } else {
                    topBtn.style.opacity = '0';
                    topBtn.style.transform = 'translateY(20px)';
                    topBtn.style.pointerEvents = 'none';
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    topBtn.addEventListener('mouseenter', function() {
        topBtn.style.transform = window.scrollY > 300 ? 'translateY(-3px) scale(1.1)' : 'translateY(20px)';
    });
    topBtn.addEventListener('mouseleave', function() {
        topBtn.style.transform = window.scrollY > 300 ? 'translateY(0)' : 'translateY(20px)';
    });

    topBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Pause/play videos based on viewport visibility
function initVideoObserver() {
    var videos = document.querySelectorAll('video[autoplay]');
    if (videos.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.play().catch(function() {});
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.1 });

    videos.forEach(function(video) { observer.observe(video); });
}

// Pause animations when tab is hidden (Page Visibility API)
function initVisibilityHandler() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.body.classList.add('tab-hidden');
            document.querySelectorAll('video').forEach(function(v) { v.pause(); });
        } else {
            document.body.classList.remove('tab-hidden');
            document.querySelectorAll('video[autoplay]').forEach(function(v) {
                var rect = v.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    v.play().catch(function() {});
                }
            });
        }
    });
}

// Lazy-load background images using data-bg attribute
function initLazyBackgrounds() {
    var lazyBgs = document.querySelectorAll('[data-bg]');
    if (lazyBgs.length === 0) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.backgroundImage = "url('" + entry.target.getAttribute('data-bg') + "')";
                entry.target.removeAttribute('data-bg');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    lazyBgs.forEach(function(el) { observer.observe(el); });
}

// Breadcrumbs Component
function renderBreadcrumbs(items) {
    var container = document.getElementById('breadcrumbs');
    if (!container || !items || items.length === 0) return;

    var sep = '<span class="breadcrumbs-sep">›</span>';
    var html = '<nav class="breadcrumbs" aria-label="Breadcrumb"><div class="breadcrumbs-inner">';
    items.forEach(function(item, i) {
        if (i === items.length - 1) {
            html += '<span class="breadcrumbs-current" aria-current="page">' + item.name + '</span>';
        } else {
            html += '<a href="' + item.url + '">' + item.name + '</a>' + sep;
        }
    });
    html += '</div></nav>';
    container.innerHTML = html;

    // Inject BreadcrumbList JSON-LD schema
    var schemaItems = items.map(function(item, i) {
        var entry = {
            '@type': 'ListItem',
            'position': i + 1,
            'name': item.name
        };
        if (i < items.length - 1) {
            entry.item = 'https://yourpartnertechnologies.com/' + item.url.replace(/^\.\.\//, '');
        }
        return entry;
    });
    var schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': schemaItems
    };
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// FAQ Accordion Component
function renderFAQ(config) {
    var container = document.getElementById('faq-section');
    if (!container || !config || !config.faqs || config.faqs.length === 0) return;

    var colorMap = {
        cyan:   { accent: '#22d3ee', border: 'rgba(34,211,238,0.2)', borderHover: 'rgba(34,211,238,0.4)', bg: 'rgba(34,211,238,0.03)', bgOpen: 'rgba(34,211,238,0.06)', gradient: 'from-cyan-400 to-blue-400' },
        purple: { accent: '#c084fc', border: 'rgba(192,132,252,0.2)', borderHover: 'rgba(192,132,252,0.4)', bg: 'rgba(192,132,252,0.03)', bgOpen: 'rgba(192,132,252,0.06)', gradient: 'from-purple-400 to-cyan-400' },
        red:    { accent: '#f87171', border: 'rgba(248,113,113,0.2)', borderHover: 'rgba(248,113,113,0.4)', bg: 'rgba(248,113,113,0.03)', bgOpen: 'rgba(248,113,113,0.06)', gradient: 'from-red-400 to-orange-400' },
        orange: { accent: '#fb923c', border: 'rgba(251,146,60,0.2)', borderHover: 'rgba(251,146,60,0.4)', bg: 'rgba(251,146,60,0.03)', bgOpen: 'rgba(251,146,60,0.06)', gradient: 'from-orange-400 to-cyan-400' },
        green:  { accent: '#4ade80', border: 'rgba(74,222,128,0.2)', borderHover: 'rgba(74,222,128,0.4)', bg: 'rgba(74,222,128,0.03)', bgOpen: 'rgba(74,222,128,0.06)', gradient: 'from-green-400 to-cyan-400' },
        pink:   { accent: '#f472b6', border: 'rgba(244,114,182,0.2)', borderHover: 'rgba(244,114,182,0.4)', bg: 'rgba(244,114,182,0.03)', bgOpen: 'rgba(244,114,182,0.06)', gradient: 'from-pink-400 to-purple-400' }
    };

    var theme = colorMap[config.color] || colorMap.cyan;
    var cssVars = '--faq-accent:' + theme.accent + ';--faq-border:' + theme.border + ';--faq-border-hover:' + theme.borderHover + ';--faq-bg:' + theme.bg + ';--faq-bg-open:' + theme.bgOpen + ';';

    var html = '<section class="pt-4 pb-2 relative z-10" style="' + cssVars + '">';
    html += '<div class="faq-section">';
    html += '<h2 class="text-gradient ' + theme.gradient + '" data-aos="fade-up">Frequently Asked Questions</h2>';
    html += '<p class="faq-subtitle" data-aos="fade-up" data-aos-delay="100">Find answers to common questions</p>';
    html += '<div class="faq-list" role="list">';

    config.faqs.forEach(function(faq, i) {
        var id = 'faq-' + i;
        html += '<div class="faq-item" role="listitem" data-aos="fade-up" data-aos-delay="' + (100 + i * 50) + '">';
        html += '<button class="faq-question" aria-expanded="false" aria-controls="' + id + '">';
        html += '<span>' + faq.q + '</span>';
        html += '<svg class="faq-chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
        html += '</button>';
        html += '<div id="' + id + '" class="faq-answer" role="region">';
        html += '<div class="faq-answer-inner">' + faq.a + '</div>';
        html += '</div></div>';
    });

    html += '</div></div></section>';
    container.innerHTML = html;

    // Wire accordion behavior (single-expand)
    var items = container.querySelectorAll('.faq-item');
    items.forEach(function(item) {
        var btn = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        btn.addEventListener('click', function() {
            var isOpen = item.classList.contains('faq-open');
            // Close all
            items.forEach(function(other) {
                other.classList.remove('faq-open');
                other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                other.querySelector('.faq-answer').style.maxHeight = null;
            });
            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('faq-open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Inject FAQPage JSON-LD schema
    var schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': config.faqs.map(function(faq) {
            return {
                '@type': 'Question',
                'name': faq.q,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.a.replace(/<[^>]*>/g, '')
                }
            };
        })
    };
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Training Investment Pricing Component
var TRAINING_INVESTMENT_DATA = {
    courses: [
        { id: 'data-ai-essentials', name: 'Data & AI Essentials', url: 'data-ai-essentials.html' },
        { id: 'data-blueprint', name: 'The Data Blueprint', url: 'data-blueprint.html' },
        { id: 'enterprise-data-modelling', name: 'Enterprise Data Modelling', url: 'enterprise-data-modelling.html' },
        { id: 'enterprise-data-architecture', name: 'Enterprise Data Architecture', url: 'enterprise-data-architecture.html' },
        { id: 'agentic-ai-strategy-adoption', name: 'Agentic AI Strategy & Adoption', url: 'agentic-ai-strategy-adoption.html' },
        { id: 'ai-powered-product-development', name: 'AI-Powered Product Development', url: 'ai-powered-product-development.html', bonuses: ['PromptOS Starter Edition (RM 1,500+)', 'Data Blueprint Foundations Module (RM 1,499)', 'Product Development Templates &amp; Frameworks', 'Prompt Engineering Library', 'Capstone Project Assets', 'Certificate of Participation'] }
    ],
    regions: {
        malaysia: {
            key: 'malaysia',
            tabLabel: '🇲🇾 Malaysia',
            title: '🇲🇾 Malaysia',
            subtitle: "Founder's Launch Offer",
            badge: '🔥 Save Up To 50%',
            discountLabel: 'Discount',
            prices: {
                'data-ai-essentials': { original: 'RM 1,398', discount: '50% OFF', save: 'RM 699', today: 'RM 699' },
                'data-blueprint': { original: 'RM 2,998', discount: '50% OFF', save: 'RM 1,499', today: 'RM 1,499' },
                'enterprise-data-modelling': { original: 'RM 4,998', discount: '50% OFF', save: 'RM 2,499', today: 'RM 2,499' },
                'enterprise-data-architecture': { original: 'RM 5,998', discount: '50% OFF', save: 'RM 2,999', today: 'RM 2,999' },
                'agentic-ai-strategy-adoption': { original: 'RM 3,998', discount: '50% OFF', save: 'RM 1,999', today: 'RM 1,999' },
                'ai-powered-product-development': { original: 'RM 4,998', discount: '50% OFF', save: 'RM 2,499', today: 'RM 2,499' }
            }
        },
        pakistan: {
            key: 'pakistan',
            tabLabel: '🇵🇰 Pakistan',
            title: '🇵🇰 Pakistan',
            subtitle: 'Regional Scholarship Program',
            badge: '🎓 Regional Scholarship – Save 70%',
            discountLabel: 'Scholarship',
            prices: {
                'data-ai-essentials': { original: 'Rs. 95,983.00', discount: '70% OFF', save: 'Rs. 67,188.10', today: 'Rs. 28,794.90' },
                'data-blueprint': { original: 'Rs. 205,528.84', discount: '70% OFF', save: 'Rs. 143,870.19', today: 'Rs. 61,658.65' },
                'enterprise-data-modelling': { original: 'Rs. 342,799.53', discount: '70% OFF', save: 'Rs. 239,959.67', today: 'Rs. 102,839.86' },
                'enterprise-data-architecture': { original: 'Rs. 411,165.42', discount: '70% OFF', save: 'Rs. 287,815.79', today: 'Rs. 123,349.63' },
                'agentic-ai-strategy-adoption': { original: 'Rs. 274,434.11', discount: '70% OFF', save: 'Rs. 192,103.88', today: 'Rs. 82,330.23' },
                'ai-powered-product-development': { original: 'Rs. 342,799.53', discount: '70% OFF', save: 'Rs. 239,959.67', today: 'Rs. 102,839.86' }
            }
        },
        international: {
            key: 'international',
            tabLabel: '🌍 International',
            title: '🌍 International',
            subtitle: 'Global Professional Pricing',
            badge: '🌎 Global Launch Offer – Save 10%',
            discountLabel: 'Discount',
            prices: {
                'data-ai-essentials': { original: 'USD 874', discount: '10% OFF', save: 'USD 88', today: 'USD 786' },
                'data-blueprint': { original: 'USD 1,874', discount: '10% OFF', save: 'USD 188', today: 'USD 1,686' },
                'enterprise-data-modelling': { original: 'USD 3,124', discount: '10% OFF', save: 'USD 313', today: 'USD 2,811' },
                'enterprise-data-architecture': { original: 'USD 3,749', discount: '10% OFF', save: 'USD 375', today: 'USD 3,374' },
                'agentic-ai-strategy-adoption': { original: 'USD 2,499', discount: '10% OFF', save: 'USD 250', today: 'USD 2,249' },
                'ai-powered-product-development': { original: 'USD 3,124', discount: '10% OFF', save: 'USD 313', today: 'USD 2,811' }
            }
        }
    }
};

function renderTrainingInvestment(config) {
    var container = document.getElementById('training-investment-section');
    if (!container || !config) return;

    var colorMap = {
        cyan:   { accent: '#22d3ee', accentRgb: '34,211,238', border: 'rgba(34,211,238,0.25)', bg: 'rgba(34,211,238,0.08)', gradient: 'linear-gradient(to right, #06b6d4, #22d3ee)' },
        blue:   { accent: '#60a5fa', accentRgb: '96,165,250', border: 'rgba(96,165,250,0.25)', bg: 'rgba(96,165,250,0.08)', gradient: 'linear-gradient(to right, #3b82f6, #60a5fa)' },
        purple: { accent: '#c084fc', accentRgb: '192,132,252', border: 'rgba(192,132,252,0.25)', bg: 'rgba(192,132,252,0.08)', gradient: 'linear-gradient(to right, #a855f7, #c084fc)' },
        green:  { accent: '#4ade80', accentRgb: '74,222,128', border: 'rgba(74,222,128,0.25)', bg: 'rgba(74,222,128,0.08)', gradient: 'linear-gradient(to right, #22c55e, #4ade80)' },
        pink:   { accent: '#f472b6', accentRgb: '244,114,182', border: 'rgba(244,114,182,0.25)', bg: 'rgba(244,114,182,0.08)', gradient: 'linear-gradient(to right, #ec4899, #f472b6)' },
        orange: { accent: '#fb923c', accentRgb: '251,146,60', border: 'rgba(251,146,60,0.25)', bg: 'rgba(251,146,60,0.08)', gradient: 'linear-gradient(to right, #f97316, #fb923c)' }
    };

    var theme = colorMap[config.color] || colorMap.cyan;
    var data = TRAINING_INVESTMENT_DATA;
    var currentCourse = config.course || null;
    var cssVars = '--ti-accent:' + theme.accent + ';--ti-accent-rgb:' + theme.accentRgb + ';--ti-border:' + theme.border + ';--ti-bg:' + theme.bg + ';--ti-gradient:' + theme.gradient + ';';

    function buildRows(region) {
        var rowsHtml = '';
        data.courses.forEach(function(course) {
            var price = region.prices[course.id];
            if (!price) return;
            var isCurrent = course.id === currentCourse;
            var rowClass = 'ti-row' + (isCurrent ? ' ti-row-current' : '');
            var badge = isCurrent ? '<span class="ti-viewing-badge">⭐ You\'re Viewing This Course</span>' : '';
            var nameCell = isCurrent
                ? '<span class="ti-program-name">' + course.name + '</span>' + badge
                : '<a href="' + course.url + '" class="ti-program-link">' + course.name + '</a>';
            if (course.bonuses && course.bonuses.length) {
                nameCell += '<div class="ti-included-bonuses"><span class="ti-included-label">Included FREE</span><ul class="ti-included-list">';
                course.bonuses.forEach(function(item) {
                    nameCell += '<li>' + item + '</li>';
                });
                nameCell += '</ul></div>';
            }

            rowsHtml += '<tr class="' + rowClass + '" data-course="' + course.id + '">';
            rowsHtml += '<td class="ti-cell-program" data-label="Training Program">' + nameCell + '</td>';
            rowsHtml += '<td class="ti-cell-original" data-label="Original Price"><span class="ti-original">' + price.original + '</span></td>';
            rowsHtml += '<td class="ti-cell-discount" data-label="' + region.discountLabel + '"><span class="ti-discount-badge">' + price.discount + '</span></td>';
            rowsHtml += '<td class="ti-cell-save" data-label="You Save"><span class="ti-save">' + price.save + '</span></td>';
            rowsHtml += '<td class="ti-cell-today" data-label="Today"><span class="ti-today">' + price.today + '</span></td>';
            rowsHtml += '</tr>';
        });
        return rowsHtml;
    }

    function buildPanel(region, isActive) {
        var panelId = 'ti-panel-' + region.key;
        var hidden = isActive ? '' : ' hidden';
        var html = '<div id="' + panelId + '" class="ti-panel" role="tabpanel" aria-labelledby="ti-tab-' + region.key + '"' + hidden + '>';
        html += '<div class="ti-region-header">';
        html += '<div><h3 class="ti-region-title">' + region.title + '</h3>';
        html += '<p class="ti-region-subtitle">' + region.subtitle + '</p></div>';
        html += '<span class="ti-region-badge">' + region.badge + '</span>';
        html += '</div>';
        html += '<div class="ti-table-wrap"><table class="ti-table"><thead><tr>';
        html += '<th scope="col">Training Program</th>';
        html += '<th scope="col">Original Price</th>';
        html += '<th scope="col">' + region.discountLabel + '</th>';
        html += '<th scope="col">You Save</th>';
        html += '<th scope="col">Today</th>';
        html += '</tr></thead><tbody>' + buildRows(region) + '</tbody></table></div>';
        html += '</div>';
        return html;
    }

    var isSidebar = config.layout === 'sidebar';
    var sectionClass = 'training-investment-section' + (isSidebar ? ' training-investment-section--sidebar' : ' mb-16');
    var headingSize = isSidebar ? 'text-2xl' : 'text-3xl';
    var introMargin = isSidebar ? 'mb-6' : 'mb-8';

    var regionKeys = ['malaysia', 'pakistan', 'international'];
    var html = '<section class="' + sectionClass + '" style="' + cssVars + '" data-reveal="up">';
    html += '<div class="ti-inner inner-glow backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-2xl gradient-border">';
    html += '<h2 class="' + headingSize + ' font-bold text-center mb-3 text-gradient from-blue-400 to-cyan-400">Training Investment</h2>';
    if (!isSidebar) {
        html += '<p class="text-gray-400 text-center max-w-3xl mx-auto mb-2">Invest in practical Data &amp; AI skills delivered by industry practitioners with real-world enterprise experience.</p>';
        html += '<p class="text-gray-500 text-center text-sm max-w-2xl mx-auto ' + introMargin + '">Choose the pricing option that best fits your location and learning needs.</p>';
    } else {
        html += '<p class="text-gray-400 text-center text-sm mb-2">Practical Data &amp; AI skills from industry practitioners.</p>';
        html += '<p class="text-gray-500 text-center text-xs mb-6">Choose your region to view pricing.</p>';
    }

    html += '<div class="ti-tabs" role="tablist" aria-label="Training pricing by region">';
    regionKeys.forEach(function(key, i) {
        var region = data.regions[key];
        var active = i === 0 ? ' ti-tab-active' : '';
        var selected = i === 0 ? 'true' : 'false';
        html += '<button type="button" class="ti-tab' + active + '" id="ti-tab-' + key + '" role="tab" aria-selected="' + selected + '" aria-controls="ti-panel-' + key + '" data-region="' + key + '">' + region.tabLabel + '</button>';
    });
    html += '</div>';

    html += '<div class="ti-panels">';
    regionKeys.forEach(function(key, i) {
        html += buildPanel(data.regions[key], i === 0);
    });
    html += '</div>';

    html += '<div class="ti-corporate' + (isSidebar ? ' ti-corporate--compact' : '') + '">';
    html += '<h3 class="ti-corporate-title">Corporate Training Pricing</h3>';
    html += '<p class="ti-corporate-intro">Customized pricing is available for:</p>';
    html += '<ul class="ti-corporate-list">';
    ['Corporate Workshops', 'Private Team Training', 'Executive Leadership Sessions', 'Government Programs', 'University Programs', 'Graduate Development Programs'].forEach(function(item) {
        html += '<li>' + item + '</li>';
    });
    html += '</ul>';
    html += '<p class="ti-corporate-note">Pricing depends on number of participants, delivery mode, duration, customization requirements, and location.</p>';
    html += '<div class="ti-corporate-cta-wrap"><a href="contact.html" class="ti-corporate-cta" style="background: var(--ti-gradient);">Request Corporate Training Proposal</a></div>';
    html += '</div>';

    html += '<div class="ti-trust' + (isSidebar ? ' ti-trust--compact' : '') + '">';
    ['Certificate of Participation', 'Real-World Industry Examples', 'Delivered by Industry Practitioners', 'Onsite, Virtual &amp; Hybrid Delivery', 'Corporate &amp; Public Programs Available'].forEach(function(item) {
        html += '<div class="ti-trust-item"><svg xmlns="http://www.w3.org/2000/svg" class="ti-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-8.64"/><path d="M22 4L12 14.01l-3-3"/></svg><span>' + item + '</span></div>';
    });
    html += '</div>';

    html += '</div></section>';
    container.innerHTML = html;

    var tabs = container.querySelectorAll('.ti-tab');
    var panels = container.querySelectorAll('.ti-panel');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var region = tab.getAttribute('data-region');
            tabs.forEach(function(t) {
                t.classList.remove('ti-tab-active');
                t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(function(p) { p.hidden = true; });
            tab.classList.add('ti-tab-active');
            tab.setAttribute('aria-selected', 'true');
            var panel = container.querySelector('#ti-panel-' + region);
            if (panel) panel.hidden = false;
        });
    });
}

// Initialize all functionality on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    initNavigation();
    initAOS();
    initSmoothScroll();
    enableAnimations();
    loadEpisodeCount();
    initFloatingButtons();
    initVideoObserver();
    initVisibilityHandler();
    initLazyBackgrounds();
});
