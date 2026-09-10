/* =========================================================================
   slides.js · Navegacion de la presentacion horizontal
   Portafolio Analitico · Frisby Global Alliance · Grupo 33 · CUN
   Sin dependencias.
   ========================================================================= */
(function () {
  'use strict';

  var deck   = document.getElementById('deck');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var dotsEl = document.getElementById('dots');
  var curEl  = document.getElementById('cur');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var btnHome = document.getElementById('btnHome');

  if (!deck || !slides.length) { return; }

  var TOTAL = slides.length;
  var current = 1;
  var mqMobile = window.matchMedia('(max-width: 640px)');

  /* ----------------------------------------------------- indicadores ---- */
  var dots = [];
  slides.forEach(function (s, i) {
    var n = i + 1;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('aria-controls', s.id);
    b.setAttribute('aria-label', 'Ir al slide ' + n + ' de ' + TOTAL);
    b.addEventListener('click', function () { goTo(n); });
    dotsEl.appendChild(b);
    dots.push(b);
  });

  /* Centrar solo cuando cabe. El texto conserva su tamaño y, si necesita
     más espacio, se lee mediante scroll desde el comienzo del slide. */
  function fitSlide(slide) {
    var inner = slide.querySelector('.slide-inner');
    if (!inner) { return; }

    var cs = getComputedStyle(slide);
    var availH = slide.clientHeight
               - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    slide.classList.toggle('is-overflowing', inner.offsetHeight > availH);
  }

  function showCurrentDot() {
    var activeDot = dots[current - 1];
    if (!activeDot) { return; }
    dotsEl.scrollLeft = activeDot.offsetLeft - dotsEl.offsetLeft
                     - (dotsEl.clientWidth - activeDot.offsetWidth) / 2;
  }
  function fitAll() { slides.forEach(fitSlide); showCurrentDot(); }

  /* -------------------------------------------------------- navegacion -- */
  function goTo(n, opts) {
    n = Math.min(TOTAL, Math.max(1, n | 0));
    current = n;

    deck.style.setProperty('--i', n - 1);

    slides.forEach(function (s, i) {
      var active = (i + 1) === n;
      // inert impide que el foco caiga en un slide fuera de pantalla, que es
      // lo que provoca que el navegador desplace por su cuenta el contenedor.
      if (active) { s.removeAttribute('inert'); }
      else        { s.setAttribute('inert', ''); }
    });

    dots.forEach(function (d, i) {
      d.setAttribute('aria-current', (i + 1) === n ? 'true' : 'false');
    });
    showCurrentDot();

    curEl.textContent = n < 10 ? '0' + n : String(n);
    btnPrev.disabled = (n === 1);
    btnNext.disabled = (n === TOTAL);

    if (!opts || !opts.silent) {
      var hash = '#slide-' + n;
      if (window.location.hash !== hash) {
        try { history.replaceState(null, '', hash); }
        catch (e) { window.location.hash = hash; }
      }
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnHome.addEventListener('click', function () { goTo(1); });

  /* ---------------------------------------------------------- teclado --- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (window.Chat && typeof window.Chat.close === 'function') {
        window.Chat.close();
      }
      return;
    }

    if (e.altKey || e.ctrlKey || e.metaKey) { return; }

    // No secuestrar las flechas mientras se escribe en el chat.
    // Se comprueba nodeType 1 porque e.target puede ser el propio document,
    // que no implementa closest() y haria estallar el manejador entero.
    var t = e.target;
    if (t && t.nodeType === 1 &&
        (t.closest('#chat') || t.tagName === 'INPUT' ||
         t.tagName === 'TEXTAREA' || t.isContentEditable)) { return; }
    // Las tablas con scroll conservan sus flechas de desplazamiento.
    if (t && t.nodeType === 1 && t.closest('.tbl-wrap')) { return; }

    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(1); }
    else if (e.key === 'End')  { e.preventDefault(); goTo(TOTAL); }
  });

  /* ------------------------------------------------------------ swipe --- */
  var sx = 0, sy = 0, tracking = false;
  var THRESHOLD = 50;

  // Conservar el desplazamiento nativo de las tablas y el zoom con dos dedos.
  deck.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1 || e.target.closest('a, button, .tbl-wrap')) {
      tracking = false; return;
    }
    tracking = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive: true });

  deck.addEventListener('touchmove', function (e) {
    if (!tracking || e.touches.length !== 1) { tracking = false; return; }
    var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
    if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) {
      tracking = false; return;
    }
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) && e.cancelable) {
      e.preventDefault();
    }
  }, { passive: false });

  deck.addEventListener('touchend', function (e) {
    if (!tracking) { return; }
    tracking = false;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    // Exigir dominancia horizontal para no robarle el gesto al scroll
    // interno vertical de los slides 12 y 14.
    if (Math.abs(dx) < THRESHOLD || Math.abs(dx) <= Math.abs(dy)) { return; }
    if (dx < 0) { next(); } else { prev(); }
  }, { passive: true });

  deck.addEventListener('touchcancel', function () { tracking = false; },
                        { passive: true });

  /* ------------------------------------------ marcas de referencia ------ */
  var refTimer = null;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a.ref') : null;
    if (!a) { return; }
    e.preventDefault();

    goTo(TOTAL);                                   // el slide 14 es Referencias

    var n = a.getAttribute('data-ref');
    var target = n ? document.getElementById('ref-' + n) : null;
    if (!target) { return; }

    window.clearTimeout(refTimer);
    document.querySelectorAll('.ref-item.is-target').forEach(function (el) {
      el.classList.remove('is-target');
    });

    // Esperar a que termine el desplazamiento del deck antes de centrar
    window.setTimeout(function () {
      target.classList.add('is-target');
      try { target.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      catch (err) { target.scrollIntoView(); }
      refTimer = window.setTimeout(function () {
        target.classList.remove('is-target');
      }, 2600);
    }, 480);
  });

  /* ------------------------------------------------------------- hash --- */
  function fromHash(silent) {
    var m = /^#slide-(\d+)$/.exec(window.location.hash || '');
    if (m) { goTo(parseInt(m[1], 10), { silent: !!silent }); return true; }
    return false;
  }
  window.addEventListener('hashchange', function () { fromHash(true); });

  /* ------------------------------------------------ guardas de layout --- */
  // Si el navegador desplaza el contenedor por su cuenta, se devuelve a cero.
  deck.addEventListener('scroll', function () {
    if (deck.scrollLeft !== 0) { deck.scrollLeft = 0; }
    if (deck.scrollTop !== 0)  { deck.scrollTop = 0; }
  });

  var rafId = null;
  function onResize() {
    if (rafId) { cancelAnimationFrame(rafId); }
    rafId = requestAnimationFrame(function () { rafId = null; fitAll(); });
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  if (mqMobile.addEventListener) { mqMobile.addEventListener('change', onResize); }

  /* ------------------------------------------------------------ inicio -- */
  document.querySelectorAll('.tbl-wrap').forEach(function (wrap) {
    wrap.tabIndex = 0;
    wrap.setAttribute('role', 'region');
    var heading = wrap.parentElement.querySelector('h3, h4');
    wrap.setAttribute('aria-label', (heading ? heading.textContent.trim() : 'Tabla')
      + '. Desplazamiento horizontal disponible cuando sea necesario.');
  });
  fitAll();
  if (!fromHash(true)) { goTo(1, { silent: true }); }

  // La metrica de la fuente del sistema puede cambiar la altura medida.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitAll).catch(function () {});
  }
  window.addEventListener('load', fitAll);

  /* ------------------------------------------------------------- API ---- */
  window.Deck = {
    goTo: goTo,
    next: next,
    prev: prev,
    total: TOTAL,
    current: function () { return current; },
    refit: fitAll
  };
})();
