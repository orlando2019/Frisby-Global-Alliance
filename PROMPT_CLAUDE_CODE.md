# Prompt para Claude Code — Portafolio Analítico web · Grupo 33

> Pegar tal cual. Versión 2, del 08-sep-2026.
> La v1 quedó obsoleta porque apuntaba a varios archivos fuente.

---

Vas a construir un sitio web de una sola página que funciona como presentación
horizontal tipo slides. Es el Portafolio Analítico de un trabajo académico de
posgrado y se publica en GitHub Pages.

## 1. Única fuente de contenido

**Todo el texto del sitio está en este archivo y solo en este archivo:**

```
./CONTENIDO_PORTAFOLIO.md
```

Léelo completo antes de escribir código.

**Reglas absolutas sobre el contenido:**

- **No agregues información que no esté en ese archivo.** Ni un dato, ni una
  cifra, ni un ejemplo, ni un texto de relleno.
- **No reformules las cifras ni los nombres propios.** Van tal cual.
- **No consultes internet ni otros archivos del disco.** Ese archivo es
  autosuficiente y ya está verificado.
- Si algo te falta para armar un slide, **detente y pregúntale al usuario**. No
  lo completes por tu cuenta.
- Puedes ajustar la redacción para que quepa en pantalla, pero sin cambiar el
  sentido, las cifras ni las citas textuales.

## 2. Stack

HTML5, CSS3 y JavaScript vanilla. Sin frameworks, sin build, sin npm, sin CDN.
Debe funcionar abriendo `index.html` directamente y servido desde GitHub Pages.

```
index.html
css/styles.css
js/slides.js
js/chatbot.js
data/qa.json
README.md
.nojekyll
```

## 3. Slides

**11 slides**, en el orden exacto del archivo de contenido:

1. Portada
2. Contexto empresarial y del mercado
3. Mapa de procesos y análisis de riesgos
4. Análisis del problema
5. Diagnóstico del usuario
6. Proceso de ideación: el Comité BANG
7. El vehículo estratégico
8. Lean Canvas Corporativo II
9. Sostenibilidad y métricas financieras
10. Dictamen del consultor y equipo
11. Referencias

Los slides 2 a 9 cubren las siete secciones obligatorias exigidas por la
docente, en ese orden.

**Slide 3:** el flujo de siete etapas va dibujado como diagrama, con HTML y CSS
o con SVG inline. Nada de librerías.

**Slide 9:** las tres métricas del tablero (ROI, VAN, TIR) van como tarjetas
grandes y destacadas. Es el slide con más peso visual.

**Marcas de referencia:** donde el archivo de contenido dice "Ref. N", pon un
superíndice o una marca visible que enlace al slide 11.

**Pie de todos los slides:** el aviso de ejercicio académico que está en el
slide 1, en cuerpo pequeño pero legible.

## 4. Navegación

- Desplazamiento horizontal con transición suave.
- Botón de inicio que regresa al slide 1 desde cualquier punto.
- Flechas adelante y atrás, fijas en pantalla.
- Indicadores de posición clicables para saltar a cualquier slide.
- Teclado: flechas izquierda y derecha, Home para el inicio, Escape para cerrar
  el chatbot.
- Swipe horizontal en móvil y tablet.
- Número de slide actual y total, siempre visibles.
- Sin scroll vertical del slide en escritorio. Los slides 9 y 11 pueden llevar
  scroll interno si el contenido no cabe.

## 5. Chatbot

Botón flotante abajo a la derecha que abre un panel de chat.

**Sin IA y sin llamadas a ninguna API.** Es un sistema de coincidencia por
palabras clave contra `data/qa.json`, construido con las 22 entradas del anexo
del archivo de contenido:

```json
[
  {
    "id": "van",
    "preguntas": ["van", "valor presente neto"],
    "respuesta": "El VAN es de 663.686 euros con una tasa de descuento del 10,0%...",
    "slide": 9
  }
]
```

Comportamiento:

1. Al abrir muestra un saludo y **las seis preguntas sugeridas como botones**.
2. Si el usuario escribe, normaliza el texto (minúsculas, sin tildes, sin
   signos) y busca coincidencia por palabras clave.
3. Al encontrar coincidencia responde y muestra un botón "Ver en la
   presentación" que navega al slide del campo `slide`.
4. **Si no hay coincidencia responde exactamente el texto de "Respuesta cuando
   no hay coincidencia" del archivo de contenido. Nunca inventes una respuesta.**
5. Historial visible con burbujas diferenciadas.

Carga `qa.json` con fetch y deja el mismo objeto embebido en el JS como
respaldo, para que funcione al abrir con `file://`.

## 6. Diseño

Paleta basada en los colores de Frisby, que son rojo y amarillo.
**Estos valores son aproximados. Antes de fijarlos, pídele al usuario que
confirme los códigos exactos tomándolos del logo oficial.**

```css
:root{
  --rojo:        #E30613;  /* aproximado, confirmar */
  --rojo-oscuro: #B00410;
  --amarillo:    #FFCB05;  /* aproximado, confirmar */
  --crema:       #FFF8E7;
  --carbon:      #1A1A1A;
  --gris:        #6B6B6B;
  --blanco:      #FFFFFF;
}
```

Fondo claro y texto oscuro. El rojo para títulos, acentos y el chatbot. El
amarillo para resaltar cifras. Usar el rojo con medida: bloques grandes de rojo
saturado cansan en proyección.

Tipografía del sistema: `system-ui, -apple-system, "Segoe UI", Roboto,
sans-serif`. Cuerpo mínimo de 18px en escritorio, porque esto se proyecta en un
salón. Cada slide ocupa el 100% del alto y ancho de la ventana. Íconos en SVG
inline.

## 7. Responsive

Tres cortes: móvil hasta 640px, tablet hasta 1024px, escritorio por encima. En
móvil las cuadrículas pasan a una columna, el chatbot ocupa la pantalla completa
y las flechas se agrandan para el dedo.

## 8. Publicación

Deja listo `README.md` con el nombre del proyecto, los integrantes y los pasos
para activar GitHub Pages. Archivo `.nojekyll` en la raíz. Todas las rutas
relativas, ninguna absoluta, para que funcione bajo
`usuario.github.io/repositorio/`.

## 9. Verificación antes de entregar

- [ ] Ninguna cifra del sitio difiere de `CONTENIDO_PORTAFOLIO.md`.
- [ ] No se agregó ningún dato que no estuviera en el archivo de contenido.
- [ ] Todas las cifras financieras están en euros.
- [ ] Los 11 slides existen y están en el orden indicado.
- [ ] El aviso de ejercicio académico aparece en el pie de todos los slides.
- [ ] Las marcas "Ref. N" enlazan al slide 11.
- [ ] La navegación funciona con teclado, con clic y con swipe.
- [ ] El chatbot responde la frase de "no encontrado" cuando no hay coincidencia.
- [ ] El sitio abre bien con `file://` y con un servidor local.
- [ ] Cero errores en la consola del navegador.
