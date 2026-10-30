/* Android Açık Kalsın: small, dependency-free page script */
(function () {
    'use strict';

    var HASHTAG = '#AndroidAçıkKalsın';
    document.documentElement.classList.add('js');

    /* Toast */
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    var toastTimer = 0;

    function showToast(message) {
        /* Clear first so a repeated message is announced again */
        toast.textContent = '';
        setTimeout(function () {
            toast.textContent = message;
        }, 50);
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove('is-visible');
        }, 2500);
    }

    /* Clipboard with execCommand fallback */
    function copyText(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text).catch(function () {
                return legacyCopy(text);
            });
        }
        return legacyCopy(text);
    }

    function legacyCopy(text) {
        return new Promise(function (resolve, reject) {
            var area = document.createElement('textarea');
            area.value = text;
            area.setAttribute('readonly', '');
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            var ok = false;
            try {
                ok = document.execCommand('copy');
            } catch (e) {
                ok = false;
            }
            document.body.removeChild(area);
            ok ? resolve() : reject(new Error('copy failed'));
        });
    }

    /* Share */
    function shareUrl() {
        var base = (document.body.dataset.shareBase || '').trim();
        return base || window.location.href;
    }

    /* Web Share first; a cancelled sheet is not an error, anything else falls back */
    function nativeShare(data, fallback) {
        if (!navigator.share) {
            fallback();
            return;
        }
        navigator.share(data).catch(function (err) {
            if (!err || err.name !== 'AbortError') fallback();
        });
    }

    function shareWebsite() {
        var url = shareUrl();
        nativeShare({ title: 'Android Açık Kalsın', url: url }, function () {
            copyText(url).then(function () {
                showToast('Bağlantı kopyalandı');
            }, function () {
                window.prompt('Bağlantı:', url);
            });
        });
    }

    function shareHashtag() {
        var text = HASHTAG + ' ' + shareUrl();
        if (!navigator.share) {
            /* noopener hides whether the popup opened, so also copy the text */
            copyText(text).then(function () {
                showToast('Metin kopyalandı');
            }, function () {});
            var intent = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text);
            window.open(intent, '_blank', 'noopener,noreferrer');
            return;
        }
        /* After a rejected share the click activation may be gone; copy instead of a popup */
        nativeShare({ text: text }, function () {
            copyText(text).then(function () {
                showToast('Metin kopyalandı');
            }, function () {
                window.prompt('Metin:', text);
            });
        });
    }

    document.querySelectorAll('[data-share]').forEach(function (el) {
        el.addEventListener('click', function () {
            el.dataset.share === 'hashtag' ? shareHashtag() : shareWebsite();
        });
    });

    /* Answers ship expanded for no-JS readers; the accordion closes them here */
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
    });

    /* FAQ accordion */
    document.querySelectorAll('.faq-q').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var open = btn.getAttribute('aria-expanded') === 'true';
            var panel = document.getElementById(btn.getAttribute('aria-controls'));
            btn.setAttribute('aria-expanded', String(!open));
            if (panel) panel.hidden = open;
        });
    });

    /* Copy the sample complaint as plain text with paragraph breaks */
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var source = document.getElementById(btn.dataset.copy);
            if (!source) return;
            var text = Array.prototype.map.call(source.querySelectorAll('p'), function (p) {
                return p.textContent.trim();
            }).join('\n\n');
            copyText(text).then(function () {
                showToast('Metin kopyalandı');
            }, function () {
                /* Clipboard refused: open the box and select it so a long press can copy */
                var box = source.closest('.sample');
                if (box) setSampleOpen(box, true);
                var range = document.createRange();
                range.selectNodeContents(source);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                showToast('Kopyalanamadı');
            });
        });
    });

    /* Expand / collapse the sample; box state, aria and label move together */
    function setSampleOpen(box, open) {
        box.classList.toggle('is-open', open);
        var btn = document.querySelector('[data-expand="' + box.id + '"]');
        if (!btn) return;
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? btn.dataset.labelOpen : btn.dataset.labelClosed;
    }

    document.querySelectorAll('[data-expand]').forEach(function (btn) {
        var box = document.getElementById(btn.dataset.expand);
        if (!box) return;
        btn.dataset.labelClosed = btn.textContent;
        if (!btn.dataset.labelOpen) btn.dataset.labelOpen = btn.textContent;
        btn.addEventListener('click', function () {
            var open = !box.classList.contains('is-open');
            setSampleOpen(box, open);
            if (!open) box.scrollIntoView({ block: 'nearest' });
        });
    });

    /* Lightbox for guide screenshots; links still work without it */
    var lightbox = document.getElementById('lightbox');
    if (lightbox && typeof lightbox.showModal === 'function') {
        var lightboxImg = lightbox.querySelector('img');
        document.querySelectorAll('[data-lightbox]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                var img = link.querySelector('img');
                lightboxImg.src = link.href;
                lightboxImg.alt = img ? img.alt : '';
                lightbox.showModal();
            });
        });
        lightbox.querySelector('[data-lightbox-close]').addEventListener('click', function () {
            lightbox.close();
        });
        lightbox.addEventListener('click', function (event) {
            if (event.target === lightbox) lightbox.close();
        });
        lightbox.addEventListener('close', function () {
            lightboxImg.removeAttribute('src');
        });
    }
})();
