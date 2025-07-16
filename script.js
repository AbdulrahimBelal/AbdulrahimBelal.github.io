// ===== Website Functionality =====

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const languageToggle = document.getElementById('languageToggle');
const arabicContent = document.querySelector('.arabic-content');
const englishContent = document.querySelector('.english-content');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.querySelector('.nav-menu');

// ===== Loading Screen =====
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===== Navbar Scroll Effect =====
let ticking = false;

function updateScrollEffects() {
    const scrollY = window.scrollY;
    
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollTopBtn.classList.add('visible');
    } else {
        navbar.classList.remove('scrolled');
        scrollTopBtn.classList.remove('visible');
    }
    
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Scroll to Top =====
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Language Toggle =====
let isEnglish = false;

languageToggle.addEventListener('click', () => {
    if (!isEnglish) {
        // Switch to English
        arabicContent.style.display = 'none';
        englishContent.style.display = 'block';
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        languageToggle.innerHTML = '<i class="fas fa-language"></i> العربية';
        
        // Update navigation links for English
        updateNavigation('english');
        document.querySelector('.logo').textContent = 'Abdulrahim Belal';
        isEnglish = true;
    } else {
        // Switch to Arabic
        arabicContent.style.display = 'block';
        englishContent.style.display = 'none';
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        languageToggle.innerHTML = '<i class="fas fa-language"></i> English';
        
        // Update navigation links for Arabic
        updateNavigation('arabic');
        document.querySelector('.logo').textContent = 'عبدالرحيم بلال';
        isEnglish = false;
    }
});

function updateNavigation(language) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (language === 'english') {
        navLinks[0].textContent = 'About';
        navLinks[1].textContent = 'Experience';
        navLinks[2].textContent = 'Skills';
        navLinks[3].textContent = 'Projects';
        navLinks[4].textContent = 'Contact';
    } else {
        navLinks[0].textContent = 'نبذة عني';
        navLinks[1].textContent = 'الخبرات';
        navLinks[2].textContent = 'المهارات';
        navLinks[3].textContent = 'المشاريع';
        navLinks[4].textContent = 'التواصل';
    }
}

// ===== Share Functionality =====
document.getElementById('shareBtn').addEventListener('click', async () => {
    const shareData = {
        title: 'عبدالرحيم بلال - الموقع الشخصي',
        text: 'مدير تقني بخبرة 15+ عاماً في قيادة التحول الرقمي',
        url: window.location.href
    };
    
    try {
        if (navigator.share && navigator.canShare(shareData)) {
            await navigator.share(shareData);
        } else {
            // Fallback for browsers that don't support Web Share API
            await navigator.clipboard.writeText(window.location.href);
            showNotification('تم نسخ رابط الموقع إلى الحافظة!', 'success');
        }
    } catch (error) {
        // Final fallback
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('تم نسخ رابط الموقع!', 'success');
    }
});

// ===== Download Functionality =====
document.getElementById('downloadBtn').addEventListener('click', () => {
    const htmlContent = document.documentElement.outerHTML;
    const blob = new Blob([htmlContent], {type: 'text/html;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abdulrahim-belal-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('تم تحميل الملف بنجاح!', 'success');
});

// ===== Notification System =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== Mobile Menu =====
mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
        // Add mobile menu styles
        navMenu.style.cssText = `
            position: fixed;
            top: 80px;
            left: 0;
            width: 100%;
            background: rgba(15, 48, 87, 0.98);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            backdrop-filter: blur(10px);
        `;
    } else {
        icon.className = 'fas fa-bars';
        navMenu.style.cssText = '';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        navMenu.style.cssText = '';
    });
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Print shortcut (Ctrl+P)
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    
    // Language toggle shortcut (Ctrl+L)
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        languageToggle.click();
    }
    
    // Scroll to top shortcut (Home)
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Scroll to bottom shortcut (End)
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0s';
            entry.target.style.animationPlayState = 'running';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.animationPlayState = 'paused';
    observer.observe(section);
});

// ===== Enhanced Print Functionality =====
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
    // Ensure all content is visible for printing
    if (englishContent.style.display === 'block') {
        arabicContent.style.display = 'block';
    }
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
    // Restore original display state
    if (isEnglish) {
        arabicContent.style.display = 'none';
    } else {
        englishContent.style.display = 'none';
    }
});

// ===== Dynamic Skills Progress (Future Enhancement) =====
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-list li');
    
    skillItems.forEach((item, index) => {
        const skillName = item.textContent.trim();
        let percentage = 85; // Default percentage
        
        // Assign different percentages based on skills
        if (skillName.includes('CCNA') || skillName.includes('Python')) {
            percentage = 95;
        } else if (skillName.includes('قيادة') || skillName.includes('Leadership')) {
            percentage = 90;
        } else if (skillName.includes('الأمن') || skillName.includes('Security')) {
            percentage = 88;
        }
        
        // Add progress bar (can be enhanced in future)
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: ${percentage}%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            border-radius: 2px;
            margin-top: 0.5rem;
            transition: width 1s ease;
        `;
        
        // Uncomment to add progress bars
        // item.appendChild(progressBar);
    });
}

// ===== Contact Form Enhancement (Future) =====
function initContactForm() {
    // This can be enhanced to include a contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        // Add contact form functionality here
    }
}

// ===== Theme Switcher (Future Enhancement) =====
function initThemeSwitcher() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        if (e.matches) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    });
}

// ===== Performance Monitoring =====
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track Core Web Vitals (can be enhanced)
        if ('web-vitals' in window) {
            // getCLS, getFID, getFCP, getLCP, getTTFB
        }
    });
}

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('خطأ في الموقع:', e.error);
    // Can be enhanced to send error reports
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejection:', e.reason);
    e.preventDefault();
});

// ===== Service Worker Registration (Future PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.registerServiceWorker('/sw.js')
        // Can be enhanced for offline functionality
    });
}

// ===== Analytics (Future Enhancement) =====
function trackEvent(eventName, eventData = {}) {
    // Can be enhanced to track user interactions
    console.log(`Event: ${eventName}`, eventData);
}

// Track button clicks
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        trackEvent('button_click', { button: buttonText });
    });
});

// ===== Accessibility Enhancements =====
function initAccessibility() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID
    const mainContent = document.querySelector('.content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    initPerformanceMonitoring();
    // animateSkillBars(); // Uncomment to enable skill bars
    // initContactForm(); // For future contact form
    // initThemeSwitcher(); // For future theme switching
});

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== Export for potential module use =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        trackEvent,
        debounce,
        throttle
    };
}

