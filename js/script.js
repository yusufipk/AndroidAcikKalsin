
// Mobile-friendly interactions and animations

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // FAQ Toggle functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Toggle active class
            faqItem.classList.toggle('active');
            
            // Toggle visibility
            if (faqItem.classList.contains('active')) {
                answer.style.display = 'block';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
                setTimeout(() => {
                    answer.style.display = 'none';
                }, 300);
            }
        });
    });

    // Initialize FAQ answers as hidden
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.display = 'none';
        answer.style.maxHeight = '0';
        answer.style.transition = 'max-height 0.3s ease';
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.stat-item, .impact-card, .step-card, .point-card, .process-step').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Enhanced CTA button interactions
    document.querySelectorAll('.cta-primary, .cta-secondary').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Copy sample complaint text
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', async () => {
            const targetId = button.dataset.copyTarget;
            const target = document.getElementById(targetId);
            if (!target) return;

            const clone = target.cloneNode(true);
            clone.querySelectorAll('button, h4').forEach(el => el.remove());

            const rawLines = clone.innerText.split('\n');
            const cleanedLines = [];

            rawLines.forEach(line => {
                const trimmed = line.trim();
                if (!trimmed && cleanedLines.at(-1) === '') {
                    return;
                }
                cleanedLines.push(trimmed);
            });

            const text = cleanedLines.join('\n').trim();

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }

                const original = button.textContent;
                button.textContent = 'Metin Kopyalandı!';
                button.disabled = true;
                setTimeout(() => {
                    button.textContent = original;
                    button.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('Metin kopyalanamadı:', error);
                button.textContent = 'Kopyalama Başarısız';
                setTimeout(() => {
                    button.textContent = 'Metni Kopyala';
                }, 2000);
            }
        });
    });

    function resolveShareUrl() {
        if (window.location.protocol !== 'file:' && window.location.origin && window.location.origin !== 'null') {
            return window.location.href;
        }

        const base = document.body?.dataset.shareBase;
        if (!base) {
            return window.location.href;
        }

        const normalizedBase = base.endsWith('/') ? base : base + '/';
        const relativePath = window.location.pathname.replace(/^\//, '') || 'index.html';
        return new URL(relativePath, normalizedBase).toString();
    }

    // Simplify CTA boxes that only contain buttons
    document.querySelectorAll('.cta-box').forEach(box => {
        const hasInlineText = Array.from(box.childNodes).some(node => {
            return node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0;
        });
        const hasNonButtonChild = Array.from(box.children).some(child => child.tagName !== 'A');

        if (!hasInlineText && !hasNonButtonChild && box.children.length) {
            box.classList.add('cta-box--button-only');
        }
    });

    // Parallax effect for hero section (desktop only)
    if (window.innerWidth > 768) {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = '0px';
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                hero.style.backgroundPositionY = `${scrolled * -0.2}px`;
            });
        }
    }

    // Step highlighting on scroll (for guide page)
    if (document.querySelector('.steps-section')) {
        const stepItems = document.querySelectorAll('.step-item');
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all steps
                    stepItems.forEach(step => step.classList.remove('active-step'));
                    // Add active class to current step
                    entry.target.classList.add('active-step');
                }
            });
        }, { threshold: 0.5 });

        stepItems.forEach(step => {
            stepObserver.observe(step);
        });
    }

    // Dynamic counter animation for stats
    function animateValue(element, start, end, duration, prefix = '', suffix = '') {
        if (start === end) return;
        const range = end - start;
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        const timer = setInterval(() => {
            current += increment;
            element.textContent = `${prefix}${current.toLocaleString('tr-TR')}${suffix}`;
            if (current == end) {
                clearInterval(timer);
                element.textContent = `${prefix}${end.toLocaleString('tr-TR')}${suffix}`;
            }
        }, stepTime);
    }

    // Animate stats when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const number = entry.target;
                const originalText = number.dataset.originalText || number.textContent.trim();
                number.dataset.originalText = originalText;
                const segments = originalText.match(/^(\D*)([\d.,]+)(\D*)$/);

                if (!segments) {
                    number.dataset.animated = 'true';
                    number.textContent = originalText;
                    return;
                }

                const [, prefix, numericPart, suffix] = segments;
                const cleanedNumeric = numericPart.replace(/[^\d]/g, '');

                if (!cleanedNumeric) {
                    number.dataset.animated = 'true';
                    number.textContent = originalText;
                    return;
                }

                animateValue(number, 0, parseInt(cleanedNumeric, 10), 2000, prefix, suffix);
                number.dataset.animated = 'true';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Mobile menu toggle (if needed in future versions)
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Form validation helper (for future contact forms)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
});

// Share functionality
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'Android\'i Açık Tutalım - Türkiye',
            text: 'Google\'ın Android tekelini durdurmak için Rekabet Kurumu\'na şikayet edelim!',
            url: resolveShareUrl()
        }).catch(console.error);
    } else {
        // Fallback for browsers that don't support Web Share API
        const url = resolveShareUrl();
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link panoya kopyalandı!');
        }).catch(() => {
            // Final fallback
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('Link panoya kopyalandı!');
        });
    }
}

function shareHashtag() {
    const shareUrl = resolveShareUrl();
    const text = '#AndroidıAçıkTutalım - Google\'ın Android tekelini durduralım! Rekabet Kurumu\'na şikayet edelim. ' + shareUrl;

    if (navigator.share) {
        navigator.share({
            text: text
        }).catch(console.error);
    } else {
        // Open Twitter/X share dialog
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    }
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#059669' : '#dc2626'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(300px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScroll = debounce((e) => {
    // Any scroll-based animations or calculations
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Non-critical error:', e.error);
    // Don't show errors to users for missing non-critical elements
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Allow escape key to close any open modals or menus
    if (e.key === 'Escape') {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.querySelector('.faq-question').click();
        });
    }
    
    // Allow enter key to activate clickable elements
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        e.target.click();
    }
});

// Focus management for accessibility
document.querySelectorAll('.cta-primary, .cta-secondary, .step-cta, .share-button').forEach(button => {
    button.addEventListener('focus', function() {
        this.style.outline = '2px solid #2563eb';
        this.style.outlineOffset = '2px';
    });
    
    button.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Print optimization
window.addEventListener('beforeprint', function() {
    // Expand all FAQ items before printing
    document.querySelectorAll('.faq-question').forEach(question => {
        if (!question.parentElement.classList.contains('active')) {
            question.click();
        }
    });
});
