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
  var MIN_SCALE = 0.55;          // suelo del escalado; por debajo, scroll interno
  var current = 1;
  var mqMobile = window.matchMedia('(max-width: 640px)');

  /* ----------------------------------------------------- indicadores ---- */
  var dots = [];
  slides.forEach(function (s, i) {
    var n = i + 1;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Ir al slide ' + n + ' de ' + TOTAL);
    b.addEventListener('click', function () { goTo(n); });
    dotsEl.appendChild(b);
    dots.push(b);
  });

  /* -------------------------------------------------------- escalado ---- */
  /* Las medidas de layout (offsetHeight/offsetWidth) no se ven afectadas por
     CSS transforms, asi que se pueden leer sin desmontar la escala vigente:
     no hay degradacion acumulada entre recalculos sucesivos. */
  function fitSlide(slide) {
    var inner = slide.querySelector('.slide-inner');
    if (!inner) { return; }

    if (mqMobile.matches || slide.classList.contains('is-scrollable')) {
      inner.style.removeProperty('--fit');
      slide.classList.remove('is-overflowing');
      return;
    }

    var cs = getComputedStyle(slide);
    var availH = slide.clientHeight
               - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    var availW = slide.clientWidth
               - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var natH = inner.offsetHeight;
    var natW = inner.offsetWidth;

    if (!natH || !natW || availH <= 0 || availW <= 0) { return; }

    var scale = Math.min(1, availH / natH, availW / natW);

    if (scale < MIN_SCALE) {
      scale = MIN_SCALE;
      slide.classList.add('is-overflowing');
    } else {
      slide.classList.remove('is-overflowing');
    }

    inner.style.setProperty('--fit', scale.toFixed(4));
  }

  function fitAll() { slides.forEach(fitSlide); }

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

    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(1); }
    else if (e.key === 'End')  { e.preventDefault(); goTo(TOTAL); }
  });

  /* ------------------------------------------------------------ swipe --- */
  var sx = 0, sy = 0, tracking = false;
  var THRESHOLD = 50;

  deck.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') { return; }
    tracking = true; sx = e.clientX; sy = e.clientY;
  }, { passive: true });

  deck.addEventListener('pointerup', function (e) {
    if (!tracking) { return; }
    tracking = false;
    var dx = e.clientX - sx;
    var dy = e.clientY - sy;
    // Exigir dominancia horizontal para no robarle el gesto al scroll
    // interno vertical de los slides 9 y 11.
    if (Math.abs(dx) < THRESHOLD || Math.abs(dx) <= Math.abs(dy)) { return; }
    if (dx < 0) { next(); } else { prev(); }
  }, { passive: true });

  deck.addEventListener('pointercancel', function () { tracking = false; },
                        { passive: true });

  /* ------------------------------------------ marcas de referencia ------ */
  var refTimer = null;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a.ref') : null;
    if (!a) { return; }
    e.preventDefault();

    goTo(TOTAL);                                   // el slide 11 es Referencias

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
