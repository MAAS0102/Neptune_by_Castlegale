(function () {
  var btn = document.getElementById('menuBtn');
  var overlay = document.getElementById('menuOverlay');
  var close = document.getElementById('menuClose');
  if (!btn || !overlay || !close) return;
  function open() {
    overlay.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    close.focus();
  }
  function shut() {
    overlay.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    btn.focus();
  }
  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !overlay.hidden) shut();
  });
  overlay.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') shut();
  });
})();

(function () {
  document.documentElement.classList.add('js');
})();

(function () {
  var items = document.querySelectorAll('.slide-in');
  if (!items.length) return;
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function update() {
    var h = window.innerHeight;
    items.forEach(function (el) {
      var p = 1;
      if (!calm) {
        var top = el.getBoundingClientRect().top;
        p = Math.min(1, Math.max(0, (h - top) / (h * 0.45)));
        p = p * (2 - p);
      }
      el.style.setProperty('--p', p);
    });
  }
  var waiting = false;
  function onScroll() {
    if (waiting) return;
    waiting = true;
    window.requestAnimationFrame(function () { waiting = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

(function () {
  document.querySelectorAll('.carousel').forEach(function (box) {
    var strip = box.querySelector('.slides');
    var next = box.querySelector('.carousel-next');
    var prev = box.querySelector('.carousel-prev');
    var now = box.querySelector('.carousel-now');
    if (!strip || !next) return;
    var slides = Array.prototype.slice.call(strip.children);
    function start(i) { return slides[i].offsetLeft - slides[0].offsetLeft; }
    function index() {
      var best = 0, bestDist = Infinity;
      slides.forEach(function (_, i) {
        var d = Math.abs(strip.scrollLeft - start(i));
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    function go(i) {
      var n = slides.length;
      strip.scrollTo({ left: start(((i % n) + n) % n) });
    }

    next.addEventListener('click', function () { go(index() + 1); });
    if (prev) prev.addEventListener('click', function () { go(index() - 1); });
    if (now) {
      strip.addEventListener('scroll', function () {
        now.textContent = String(index() + 1).padStart(2, '0');
      }, { passive: true });
    }
    var queued = false;
    function fit() {
      queued = false;
      strip.style.height = slides[index()].offsetHeight + 'px';
    }
    function queueFit() { if (!queued) { queued = true; requestAnimationFrame(fit); } }
    strip.addEventListener('scroll', queueFit, { passive: true });
    window.addEventListener('resize', queueFit);
    strip.querySelectorAll('img').forEach(function (img) {
      if (!img.complete) img.addEventListener('load', queueFit);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueFit);
    fit();
  });
})();

(function () {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements['name'].value;
    var email = form.elements['email'].value;
    var company = form.elements['company'].value;
    var message = form.elements['message'].value;

    var subject = 'Neptune enquiry from ' + name;
    var body = 'Name: ' + name + '\n' +
               'Email: ' + email + '\n' +
               'Company / plant: ' + company + '\n\n' +
               message;

    window.location.href = 'mailto:info@castlegale.com' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
    var note = document.getElementById('formNote');
    if (note) note.hidden = false;
  });
})();

(function () {
  var ANIMATIONS = [
    ['.site-header .logo', 'drop'],
    ['.wordmark a', 'letters'],
    ['.tagline', 'rise', false, 0.7],
    ['.page-intro', 'rise'],
    ['.menu-btn', 'fade', false, 0.5],
    ['.contact-btn', 'fade', false, 0.6],
    ['.values', 'rise', false, 0.35],
    ['.hero h1', 'rise'],
    ['.testimonial', 'left'],
    ['.hero .btn', 'rise'],
    ['.footnote', 'fade', false, 0.3],
    ['.video-frame', 'pop'],
    ['.split:not(.reverse) .split-text', 'left'],
    ['.split:not(.reverse) .media-box, .split:not(.reverse) .shot', 'right'],
    ['.split.reverse .media-box, .split.reverse .shot', 'left'],
    ['.split.reverse .split-text', 'right'],
    ['.faq details', 'rise', true],
    ['.cta-box', 'pop'],
    ['.or', 'spin', false, 0.4],
    ['.water-band p', 'rise', true],
    ['section > h2:not([class])', 'rise'],
    ['.pillar .big-c', 'pop', false, 0.3],
    ['.learn-band h2', 'rise'],
    ['.learn-band .btn', 'rise', true],
    ['.carousel', 'pop'],
    ['.quote > *', 'rise', true],
    ['.feature', 'rise'],
    ['.feature:not(.reverse) .feature-text', 'left'],
    ['.feature:not(.reverse) .media-box, .feature:not(.reverse) > .shot, .feature:not(.reverse) > .shot-stack', 'right'],
    ['.feature.reverse .feature-text', 'right'],
    ['.feature.reverse .media-box, .feature.reverse > .shot, .feature.reverse > .shot-stack', 'left'],
    ['.team-title', 'rise'],
    ['.team-card', 'pop', true],
    ['.team-bubble', 'rise'],
    ['.team-wave', 'fade'],
    ['.contact-details', 'left'],
    ['.contact-form label, .contact-form .btn', 'rise', true],
    ['.footer-brand, .footer-contact, .footer-menu, .footer-address', 'rise', true],
    ['.footer-bottom p', 'fade']
  ];
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var seenHeader = false;
  try {
    seenHeader = sessionStorage.getItem('neptuneHeaderSeen') === '1';
    sessionStorage.setItem('neptuneHeaderSeen', '1');
  } catch (e) {}
  var HEADER_RULES = ['.site-header .logo', '.wordmark a', '.tagline', '.menu-btn', '.contact-btn'];

  ANIMATIONS.forEach(function (rule) {
    var selector = rule[0], effect = rule[1], stagger = rule[2], extra = rule[3] || 0;
    var counts = new Map();
    if (seenHeader && HEADER_RULES.indexOf(selector) > -1) return;

    document.querySelectorAll(selector).forEach(function (el) {
      if (el.classList.contains('anim')) return;
      if (effect === 'letters') {
        var word = el.textContent.trim();
        el.setAttribute('aria-label', word);
        el.textContent = '';
        word.split('').forEach(function (ch, i) {
          var s = document.createElement('span');
          s.className = 'letter anim anim-rise';
          s.setAttribute('aria-hidden', 'true');
          s.style.setProperty('--delay', (0.1 + i * 0.08) + 's');
          s.textContent = ch;
          el.appendChild(s);
        });
        return;
      }

      var n = 0;
      if (stagger) {
        n = counts.get(el.parentNode) || 0;
        counts.set(el.parentNode, n + 1);
      }
      el.classList.add('anim', 'anim-' + effect);
      el.style.setProperty('--delay', (extra + Math.min(n * 0.1, 0.5)) + 's');
    });
  });
  var targets = document.querySelectorAll('.anim');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
})();

(function () {
  var loc = window.location;
  var local = loc.protocol === 'file:' || /^(localhost|[\d.]+|\[[\da-f:]+\])$/i.test(loc.hostname);
  if (!local) {
    if (/\.html$/.test(loc.pathname)) {
      var clean = loc.pathname.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
      window.history.replaceState(null, '', clean + loc.search + loc.hash);
    }
    return;
  }
  document.querySelectorAll('a[href]').forEach(function (a) {
    var parts = a.getAttribute('href').split('#');
    var path = parts[0];
    if (!path || /^[a-z]+:|^\/\//i.test(path)) return;
    if (/\/$/.test(path)) path += 'index.html';
    else if (!/\.[a-z0-9]+$/i.test(path)) path += '.html';
    parts[0] = path;
    a.setAttribute('href', parts.join('#'));
  });
})();

(function () {
  function page(path) {
    return path.split('#')[0].split('/').pop().replace(/\.html$/, '') || 'index';
  }
  var here = page(window.location.pathname);
  document.querySelectorAll('.menu-overlay a, .footer-menu a').forEach(function (a) {
    if (page(a.getAttribute('href') || '') === here) a.setAttribute('aria-current', 'page');
  });
})();

(function () {
  var items = document.querySelectorAll('.count-up');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function run(el) {
    var target = parseFloat(el.dataset.to);
    var start = null;
    var duration = 1600;
    el.textContent = (0).toFixed(1);
    function step(now) {
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(1);
      if (t < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        setTimeout(function () { run(entry.target); }, 400);
      }
    });
  }, { threshold: 0.5 });
  items.forEach(function (el) { observer.observe(el); });
})();

(function () {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&uarr;';
  document.body.appendChild(btn);

  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  });

  function check() { btn.classList.toggle('show', window.scrollY > 600); }
  window.addEventListener('scroll', check, { passive: true });
  check();
})();

(function () {
  var values = document.querySelector('.values');
  var words = document.querySelectorAll('.values-word');
  var dots = document.querySelectorAll('.values-dots i');
  if (!values || words.length < 2) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    values.classList.add('values-static');
    return;
  }

  var EVERY_MS = 2400;
  var i = 0, timer = null, onScreen = true;

  function next() {
    var old = words[i];
    old.classList.remove('is-current');
    old.classList.add('is-leaving');
    setTimeout(function () { old.classList.remove('is-leaving'); }, 600);
    i = (i + 1) % words.length;
    words[i].classList.add('is-current');
    dots.forEach(function (d, k) { d.classList.toggle('is-current', k === i); });
  }
  function start() { if (!timer && onScreen && !document.hidden) timer = setInterval(next, EVERY_MS); }
  function stop()  { clearInterval(timer); timer = null; }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else stop();
    }).observe(values);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  start();
})();

(function () {
  document.querySelectorAll('.team-row').forEach(function (row) {
    var cards = row.querySelectorAll('.team-card');

    function open(card) {
      cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });
    }
    function close() {
      cards.forEach(function (c) { c.classList.remove('is-active'); });
    }

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () { open(card); });
      card.addEventListener('focusin', function () { open(card); });
      card.addEventListener('focusout', function (e) {
        if (!card.contains(e.relatedTarget)) card.classList.remove('is-active');
      });
    });
    row.addEventListener('mouseleave', close);
  });
})();

(function () {
  document.querySelectorAll('.video-facade').forEach(function (btn) {
    var id = btn.getAttribute('data-video');

    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      frame.title = 'An Introduction to Neptune';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      btn.replaceWith(frame);
      frame.focus();
    });
  });
})();

(function () {
  var shots = document.querySelectorAll('.shot');
  if (!shots.length) return;

  function open(img) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', img.alt || 'Screenshot');
    box.innerHTML = '<button class="lightbox-close" type="button" aria-label="Close">&times;</button>';
    var big = document.createElement('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.appendChild(big);
    document.body.appendChild(box);
    document.body.style.overflow = 'hidden';
    var closeBtn = box.querySelector('.lightbox-close');
    closeBtn.focus();

    function close() {
      box.remove();
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      img.closest('.shot').focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
  }

  shots.forEach(function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'Enlarge: ' + img.alt);
    fig.addEventListener('click', function () { open(img); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });
})();

(function () {
  document.querySelectorAll('.shot-stack').forEach(function (stack) {
    var cards = stack.querySelectorAll('.shot');
    if (cards.length !== 2) return;
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timer = null, hover = false, onScreen = false;

    function swap() {
      cards.forEach(function (c) {
        var front = c.classList.contains('slot-front');
        c.classList.toggle('slot-front', !front);
        c.classList.toggle('slot-back', front);
      });
    }
    function start() { if (!calm && !timer && !hover && onScreen) timer = setInterval(swap, 4500); }
    function stop() { clearInterval(timer); timer = null; }

    stack.addEventListener('click', function (e) {
      var card = e.target.closest('.shot');
      if (card && card.classList.contains('slot-back')) {
        e.stopPropagation();
        stop(); swap(); start();
      }
    }, true);
    stack.addEventListener('mouseenter', function () { hover = true; stop(); });
    stack.addEventListener('mouseleave', function () { hover = false; start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) start(); else stop();
      }).observe(stack);
    } else { onScreen = true; start(); }
  });
})();
