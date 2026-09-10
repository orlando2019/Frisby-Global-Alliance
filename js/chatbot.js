/* =========================================================================
   chatbot.js · Asistente por coincidencia de palabras clave
   Portafolio Analitico · Frisby Global Alliance · Grupo 33 · CUN

   SIN IA y SIN llamadas a ninguna API. Toda respuesta sale, palabra por
   palabra, del anexo de CONTENIDO_PORTAFOLIO.md. Si no hay coincidencia se
   devuelve el texto de "no encontrado", nunca una respuesta inventada.
   ========================================================================= */
(function () {
  'use strict';

  /* --------------------------------------------------------------------- */
  /* Respaldo embebido. Es identico a data/qa.json y existe para que el      */
  /* sitio funcione al abrirlo con file://, donde fetch no puede leer nada.  */
  /* --------------------------------------------------------------------- */
  var DATOS = 
{
    "qa": [
      {
        "id": "caso",
        "preguntas": [
          "qué pasó con frisby",
          "caso frisby",
          "problema",
          "españa"
        ],
        "respuesta": "Frisby S.A. registró su marca ante la Unión Europea en 2005 pero nunca abrió operaciones en Europa. Al no usarla comercialmente, quedó expuesta a la caducidad. En abril de 2026 la OEPM canceló tres de sus marcas nacionales en España por falta de uso, y la empresa apeló.",
        "slide": 4
      },
      {
        "id": "caducidad",
        "preguntas": [
          "caducidad",
          "falta de uso",
          "articulo 58",
          "por qué se pierde una marca"
        ],
        "respuesta": "El artículo 58.1.a) del Reglamento (UE) 2017/1001 establece la caducidad de la marca de la Unión Europea por falta de uso efectivo. La solicitud de caducidad solo es admisible si la marca lleva más de cinco años registrada.",
        "slide": 4
      },
      {
        "id": "uso",
        "preguntas": [
          "qué es uso efectivo",
          "qué no cuenta como uso"
        ],
        "respuesta": "El uso efectivo exige presencia comercial real: ventas facturadas, campañas de conversión en el territorio y redes de franquicia activas. No cuentan la notoriedad entre la diáspora, las descargas de la app desde IP españolas, la publicidad en ferias sin oferta comercial, ni el apoyo en redes sociales.",
        "slide": 5
      },
      {
        "id": "programa",
        "preguntas": [
          "qué es frisby global alliance",
          "en qué consiste la propuesta"
        ],
        "respuesta": "Frisby Global Alliance es un programa de innovación abierta que convierte la protección y activación de la marca en una función permanente de la organización. Opera con aliados locales que aportan la infraestructura, mientras Frisby aporta marca, recetas y estándar de servicio.",
        "slide": 7
      },
      {
        "id": "vehiculo",
        "preguntas": [
          "qué vehículo eligieron",
          "innovación abierta",
          "por qué ese vehículo"
        ],
        "respuesta": "Se eligió un Programa de Innovación Abierta con operadores locales, bajo figura de máster franquicia y cocinas ocultas. Se descartaron el CVC porque invertir en capital no acredita uso de marca, la aceleradora por su tiempo de maduración, y el venture builder por costo y lentitud.",
        "slide": 7
      },
      {
        "id": "tipo",
        "preguntas": [
          "tipo de innovación",
          "alcance estratégico"
        ],
        "respuesta": "Innovación en modelo de negocio, con alcance intermedio entre la mejora y la disrupción. No cambia el producto, cambia la forma en que la empresa genera y sostiene valor fuera de Colombia.",
        "slide": 7
      },
      {
        "id": "bang",
        "preguntas": [
          "qué es bang",
          "comité bang",
          "los cinco frentes"
        ],
        "respuesta": "El comité BANG reúne cinco frentes: Crispi en operaciones, Cesia en riesgos, Cori en conexión organizacional, Carmel en el frente humano y Cristal en visión de largo plazo. Cada frente aporta una pieza sin la cual la propuesta no funciona.",
        "slide": 6
      },
      {
        "id": "crispi",
        "preguntas": [
          "crispi",
          "operaciones",
          "sergio"
        ],
        "respuesta": "Crispi, a cargo de Sergio Arcia, propone operar con un aliado que ya tiene cocinas y logística instaladas, con homologación previa a cada apertura, auditorías periódicas y arranque por piloto acotado.",
        "slide": 6
      },
      {
        "id": "cesia",
        "preguntas": [
          "cesia",
          "riesgos",
          "orlando"
        ],
        "respuesta": "Cesia, a cargo de Orlando Ospino, propone convertir el uso de la marca en obligación contractual verificable, montar un tablero de indicadores de alerta temprana y pactar un plan de reversión al terminar la alianza.",
        "slide": 6
      },
      {
        "id": "cori",
        "preguntas": [
          "cori",
          "conectora",
          "gobernanza",
          "lina"
        ],
        "respuesta": "Cori, a cargo de Lina Peña, propone el International Brand Governance Team: un equipo transversal con responsable por país, protocolo obligatorio de apertura de mercado y reporte periódico a la alta dirección.",
        "slide": 6
      },
      {
        "id": "carmel",
        "preguntas": [
          "carmel",
          "incentivos",
          "capital humano"
        ],
        "respuesta": "Carmel, también a cargo de Lina Peña, propone que los indicadores de gestión de marca pesen un 20% de la evaluación de desempeño, que se premie la gestión preventiva y que exista ruta de formación en el plan de carrera.",
        "slide": 6
      },
      {
        "id": "cristal",
        "preguntas": [
          "cristal",
          "sostenibilidad",
          "leidy"
        ],
        "respuesta": "Cristal, a cargo de Leidy Serrano, propone una matriz de riesgos socioambientales por país, una evaluación de impacto por cada apertura y un plan de contingencias ante riesgos climáticos y de cadena de suministro.",
        "slide": 6
      },
      {
        "id": "vesting",
        "preguntas": [
          "vesting",
          "cláusula de permanencia"
        ],
        "respuesta": "El aliado no adquiere derechos por firmar. Los consolida por etapas contra cumplimiento verificado: 25% al superar el piloto de doce meses, 25% en la etapa de expansión y 50% en la de consolidación. Sin acta de verificación no hay hito cumplido.",
        "slide": 9
      },
      {
        "id": "mya",
        "preguntas": [
          "m&a",
          "adquisición",
          "absorción",
          "compra del aliado"
        ],
        "respuesta": "Frisby tiene derecho de adquisición preferente y opción de compra al término de la consolidación o ante incumplimiento reiterado. El precio lo fija un tercero independiente y se ajusta por los derechos no consolidados. Ninguna operación puede interrumpir el uso comercial de la marca.",
        "slide": 9
      },
      {
        "id": "liquidacion",
        "preguntas": [
          "liquidación",
          "reversión",
          "qué pasa si se acaba el contrato"
        ],
        "respuesta": "Al terminar se levanta inventario de activos de marca, se devuelven datos y manuales, se certifica la eliminación de copias, se revocan accesos y se firma acta de cierre. El aliado cesa todo uso de la marca y se abstiene de registrar signos similares, obligaciones que sobreviven a la terminación.",
        "slide": 9
      },
      {
        "id": "cai",
        "preguntas": [
          "cai",
          "costo de adquisición de innovación",
          "inversión inicial"
        ],
        "respuesta": "El CAI es de 465.000 euros: scouting 45.000, estructuración legal 70.000, registro y defensa marcaria 60.000, adecuación de marca 80.000, capacitación 60.000 y montaje del equipo de gobierno 150.000. No incluye construcción ni nómina de los puntos, que asume el operador.",
        "slide": 8
      },
      {
        "id": "ltv",
        "preguntas": [
          "ltv",
          "valor de la alianza",
          "retorno"
        ],
        "respuesta": "El LTV corporativo es de 1.128.686 euros, valor presente de los flujos netos de cinco años. La relación LTV sobre CAI es de 2,43 veces.",
        "slide": 8
      },
      {
        "id": "roi",
        "preguntas": [
          "roi",
          "retorno sobre la inversión"
        ],
        "respuesta": "El ROI es de 364,4%, resultado de un beneficio neto acumulado de 1.694.403 euros sobre una inversión inicial de 465.000 euros.",
        "slide": 9
      },
      {
        "id": "van",
        "preguntas": [
          "van",
          "valor presente neto"
        ],
        "respuesta": "El VAN es de 663.686 euros con una tasa de descuento del 10,0%. El proyecto agrega ese valor presente al holding después de remunerar el costo de capital.",
        "slide": 9
      },
      {
        "id": "tir",
        "preguntas": [
          "tir",
          "tasa interna de retorno"
        ],
        "respuesta": "La TIR es de 35,99%, con una holgura de 25,99 puntos porcentuales sobre el WACC. El payback descontado es de 3,59 años.",
        "slide": 9
      },
      {
        "id": "wacc",
        "preguntas": [
          "wacc",
          "tasa de descuento",
          "costo de capital"
        ],
        "respuesta": "El WACC es del 10,0%. Se construye con el bono soberano español a 10 años de 3,79% más la prima de riesgo de mercado para España de 5,78%, con beta sectorial supuesta de 1,0. El resultado exacto es 9,57%, redondeado al alza de forma conservadora.",
        "slide": 9
      },
      {
        "id": "ods",
        "preguntas": [
          "ods",
          "sostenibilidad",
          "objetivo de desarrollo sostenible"
        ],
        "respuesta": "Se seleccionó el ODS 16, paz, justicia e instituciones sólidas. El programa mitiga un riesgo de gobernanza dentro del core business: la ausencia de una función institucional que proteja el activo marcario.",
        "slide": 9
      },
      {
        "id": "equipo",
        "preguntas": [
          "integrantes",
          "quiénes son",
          "grupo",
          "equipo"
        ],
        "respuesta": "El Grupo 33 lo integran Sergio Arcia como Líder de Estrategia y Operaciones, Orlando Ospino como Director de Riesgos y Cumplimiento, Lina Peña como Directora de Capital Humano y Cultura, Walfran Redondo como Director de Finanzas Corporativas y Leidy Serrano como Gerente de Sostenibilidad.",
        "slide": 10
      },
      {
        "id": "metricas",
        "preguntas": [
          "cuales son las metricas financieras",
          "metricas financieras",
          "metricas"
        ],
        "encadena": [
          "roi",
          "van",
          "tir"
        ],
        "slide": 9
      }
    ],
    "sinCoincidencia": "Esa información no está en la presentación. Puedes preguntarme por el problema del caso, el vehículo elegido, el comité BANG, las cláusulas del pacto de socios, las métricas financieras o el equipo.",
    "sugeridas": [
      {
        "t": "¿Qué pasó con Frisby en España?",
        "id": "caso"
      },
      {
        "t": "¿Qué es Frisby Global Alliance?",
        "id": "programa"
      },
      {
        "t": "¿Qué vehículo eligieron y por qué?",
        "id": "vehiculo"
      },
      {
        "t": "¿Cuáles son las métricas financieras?",
        "id": "metricas"
      },
      {
        "t": "¿Qué es el comité BANG?",
        "id": "bang"
      },
      {
        "t": "¿Quiénes integran el equipo?",
        "id": "equipo"
      }
    ]
  };

  var QA        = DATOS.qa;
  var SIN_MATCH = DATOS.sinCoincidencia;
  var SUGERIDAS = DATOS.sugeridas;

  /* ------------------------------------------------------------- nodos -- */
  var fab   = document.getElementById('fab');
  var panel = document.getElementById('chat');
  var log   = document.getElementById('chatLog');
  var form  = document.getElementById('chatForm');
  var input = document.getElementById('chatInput');
  var xBtn  = document.getElementById('chatClose');
  if (!fab || !panel || !log || !form || !input) { return; }

  var UMBRAL = 4;          // por debajo de esto se responde "no encontrado"
  var abierto = false;

  var VACIAS = {
    que: 1, es: 1, el: 1, la: 1, los: 1, las: 1, un: 1, una: 1, unos: 1,
    unas: 1, de: 1, del: 1, al: 1, a: 1, y: 1, o: 1, en: 1, con: 1, por: 1,
    para: 1, se: 1, su: 1, sus: 1, lo: 1, cual: 1, cuales: 1, quien: 1,
    quienes: 1, como: 1, cuando: 1, donde: 1, me: 1, mi: 1, tu: 1, sobre: 1,
    hay: 1, son: 1, esta: 1, este: 1, esto: 1, esa: 1, ese: 1, eso: 1
  };

  /* -------------------------------------------------------- normalizar -- */
  function norm(s) {
    return String(s === null || s === undefined ? '' : s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')     // quita tildes y la virgulilla
      .replace(/[^a-z0-9\s]/g, ' ')        // quita signos: ¿ ? & % . , €
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokens(s) {
    var t = norm(s);
    return t ? t.split(' ') : [];
  }

  /* ------------------------------------------------- motor de busqueda -- */
  /* Las claves de un solo token y <= 4 caracteres (van, uso, tir, roi, ods,
     cai, ltv, mya, caso, tipo) exigen igualdad de token y no subcadena: si no,
     "van" coincidiria dentro de "avanza" y el buscador mentiria.            */
  function puntuar(entrada, texto, toks) {
    var mejor = 0;
    var claves = entrada.preguntas || [];

    for (var i = 0; i < claves.length; i++) {
      var kn = norm(claves[i]);
      if (!kn) { continue; }
      var kt = kn.split(' ');
      var p = 0;

      if (kt.length === 1) {
        var w = kt[0];
        if (toks.indexOf(w) !== -1) {
          p = 6;
        } else if (w.length > 4 && texto.indexOf(w) !== -1) {
          p = 4;                            // tolera plurales y derivados
        }
      } else if (texto.indexOf(kn) !== -1) {
        p = 10 + kt.length;                 // la frase completa, literal
      } else {
        var sig = [], j;
        for (j = 0; j < kt.length; j++) {
          if (!VACIAS[kt[j]] && kt[j].length > 2) { sig.push(kt[j]); }
        }
        var hits = 0;
        for (j = 0; j < sig.length; j++) {
          if (toks.indexOf(sig[j]) !== -1 ||
             (sig[j].length > 4 && texto.indexOf(sig[j]) !== -1)) { hits++; }
        }
        if (sig.length && hits === sig.length) { p = 8; }
        else if (hits >= 2) { p = 4 + hits; }
      }

      if (p > mejor) { mejor = p; }
    }
    return mejor;
  }

  function buscar(pregunta) {
    var texto = norm(pregunta);
    if (!texto) { return null; }
    var toks = tokens(pregunta);

    var mejor = null, mejorP = 0;
    for (var i = 0; i < QA.length; i++) {
      var p = puntuar(QA[i], texto, toks);
      if (p > mejorP) { mejorP = p; mejor = QA[i]; }
    }
    return mejorP >= UMBRAL ? mejor : null;
  }

  function porId(id) {
    for (var i = 0; i < QA.length; i++) {
      if (QA[i].id === id) { return QA[i]; }
    }
    return null;
  }

  /* --------------------------------------------------------- pintado ---- */
  function burbuja(texto, quien) {
    var d = document.createElement('div');
    d.className = 'msg msg-' + quien;
    d.textContent = texto;               // textContent: nada se interpreta
    log.appendChild(d);
    return d;
  }

  function botonIr(slide) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'goto-btn';
    b.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path>' +
      '<path d="m12 5 7 7-7 7"></path></svg>';
    b.appendChild(document.createTextNode('Ver en la presentación'));
    b.addEventListener('click', function () {
      if (window.Deck && window.Deck.goTo) { window.Deck.goTo(slide); }
      if (window.matchMedia('(max-width: 640px)').matches) { cerrar(); }
    });
    log.appendChild(b);
    return b;
  }

  function sugerencias() {
    var wrap = document.createElement('div');
    wrap.className = 'sug';
    SUGERIDAS.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sug-btn';
      b.textContent = s.t;
      b.addEventListener('click', function () {
        burbuja(s.t, 'user');
        responder(porId(s.id));            // por id, no por el buscador
        alFinal();
      });
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
  }

  function alFinal() {
    window.requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; });
  }

  /* -------------------------------------------------------- responder --- */
  function responder(entrada) {
    if (!entrada) { burbuja(SIN_MATCH, 'bot'); return; }

    // Entrada encadenada: reune varias respuestas del anexo, verbatim.
    if (entrada.encadena && entrada.encadena.length) {
      var pintadas = 0;
      entrada.encadena.forEach(function (id) {
        var e = porId(id);
        if (e && e.respuesta) { burbuja(e.respuesta, 'bot'); pintadas++; }
      });
      if (!pintadas) { burbuja(SIN_MATCH, 'bot'); return; }
      botonIr(entrada.slide);
      return;
    }

    burbuja(entrada.respuesta, 'bot');
    if (entrada.slide) { botonIr(entrada.slide); }
  }

  /* ------------------------------------------------------ abrir/cerrar -- */
  function abrir() {
    if (abierto) { return; }
    abierto = true;
    panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true');
    fab.setAttribute('aria-label', 'Cerrar el asistente de la presentación');

    if (!log.childNodes.length) {
      burbuja('Hola. Respondo únicamente con el contenido de este portafolio. '
            + 'Elige una pregunta o escribe la tuya.', 'bot');
      sugerencias();
    }
    alFinal();
    window.setTimeout(function () { input.focus(); }, 60);
  }

  function cerrar() {
    if (!abierto) { return; }
    abierto = false;
    panel.hidden = true;
    fab.setAttribute('aria-expanded', 'false');
    fab.setAttribute('aria-label', 'Abrir el asistente de la presentación');
    fab.focus();
  }

  fab.addEventListener('click', function () { abierto ? cerrar() : abrir(); });
  if (xBtn) { xBtn.addEventListener('click', cerrar); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) { return; }
    burbuja(q, 'user');
    input.value = '';
    responder(buscar(q));
    alFinal();
  });

  /* ------------------------------------------------- carga de qa.json --- */
  /* Con file:// no se lanza el fetch: el navegador imprimiria un error de
     CORS en consola aunque se capturase el catch, y el encargo exige cero
     errores en consola. Servido por HTTP si se pide el archivo.            */
  if (window.location.protocol !== 'file:') {
    try {
      fetch('data/qa.json', { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (datos) {
          if (datos && datos.length) { QA = datos; }
        })
        .catch(function () { /* se conserva el respaldo embebido */ });
    } catch (e) { /* se conserva el respaldo embebido */ }
  }

  /* --------------------------------------------------------------- API -- */
  window.Chat = { open: abrir, close: cerrar, find: buscar };
})();
