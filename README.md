# Portafolio Analítico · Frisby Global Alliance

Sitio web de una sola página que funciona como presentación horizontal de
**11 slides**, con un asistente de consulta por palabras clave.

**Actividad de Construcción Aplicada** · Espíritu Emprendedor y Estrategia
Corporativa: Consultoría de Alta Gerencia · Corporación Unificada Nacional de
Educación Superior (CUN) · **Grupo 33** · Septiembre de 2026.

> **Ejercicio académico.** Este sitio no es una comunicación oficial de
> Frisby S.A. BIC ni está afiliado a la empresa.

---

## Integrantes · Grupo 33

| Integrante | Cargo directivo | Frente BANG |
|---|---|---|
| Sergio Arcia | Líder de Estrategia y Operaciones | Crispi |
| Orlando Manuel Ospino Hernández | Director de Riesgos y Cumplimiento | Cesia |
| Lina Peña | Directora de Capital Humano y Cultura | Cori y Carmel |
| Walfran Redondo | Director de Finanzas Corporativas | Modelado CAI y LTV |
| Leidy Serrano | Gerente de Sostenibilidad | Cristal |

---

## Cómo verlo

**Opción 1 — doble clic.** Abre `index.html` en el navegador. Funciona completo,
asistente incluido: los datos del chat van embebidos en `js/chatbot.js` como
respaldo para el modo `file://`.

**Opción 2 — servidor local.** Desde esta carpeta:

```bash
python3 -m http.server 8000
```

Luego abre <http://localhost:8000>. Servido por HTTP el asistente lee
`data/qa.json`; abierto con `file://` usa el respaldo embebido.

---

## Publicar en GitHub Pages

Esta carpeta ya es un repositorio git apuntando a
`https://github.com/orlando2019/Frisby-Global-Alliance.git`, rama `main`.

1. Sube los archivos nuevos (`index.html` debe quedar en la **raíz** del
   repositorio, no dentro de una subcarpeta):

   ```bash
   git add .nojekyll README.md index.html css js data
   git commit -m "Portafolio Analítico web · 11 slides y asistente"
   git push origin main
   ```

2. En el repositorio entra en **Settings › Pages**.
3. En **Source** elige **Deploy from a branch**.
4. En **Branch** elige `main` y la carpeta `/ (root)`. Pulsa **Save**.
5. Espera uno o dos minutos. La URL queda en:

   **<https://orlando2019.github.io/Frisby-Global-Alliance/>**

El archivo `.nojekyll` ya está incluido: sin él, GitHub Pages procesa el sitio
con Jekyll e **ignora las carpetas que empiezan por guion bajo**. Todas las rutas
del sitio son relativas, así que funciona igual en la raíz del dominio que bajo
`/<repositorio>/`.

---

## Estructura

```
index.html        los 11 slides, la navegación y el panel del asistente
css/styles.css    tokens de color, escala tipográfica fluida, 3 cortes responsive
js/slides.js      navegación, teclado, swipe, ajuste de altura, referencias
js/chatbot.js     normalización, motor de coincidencia y respaldo embebido
data/qa.json      las 24 entradas del asistente
.nojekyll         desactiva el procesado con Jekyll en GitHub Pages
CONTENIDO_PORTAFOLIO.md   fuente única de todo el texto del sitio
```

---

## Navegación

| Acción | Cómo |
|---|---|
| Avanzar / retroceder | Flechas laterales, `→` `←`, o swipe horizontal |
| Ir a un slide | Clic en los indicadores de la barra inferior |
| Volver al inicio | Botón de casa, o tecla `Home` |
| Ir al final | Tecla `End` |
| Cerrar el asistente | Tecla `Esc` |
| Reiniciar el chat | Botón «Reiniciar conversación»: borra mensajes y borrador, y restaura las preguntas sugeridas |
| Enlace directo | `index.html#slide-9` abre directamente ese slide |

Las marcas **Ref. N** que aparecen junto a las cifras llevan al slide 11 y
resaltan la referencia correspondiente.

El cuerpo conserva al menos 18 px en escritorio. Cuando el contenido no cabe,
la diapositiva permite desplazamiento vertical. Las tablas anchas tienen su
propio desplazamiento horizontal; ese gesto no cambia de diapositiva.
En pantallas estrechas, la tira de indicadores también se puede desplazar.
El chat ocupa la pantalla móvil y mantiene el foco en sus controles hasta cerrarlo.

Para imprimir o guardar como PDF, usa la impresión del navegador. Las once
secciones se incluyen completas; las más extensas pueden ocupar varias páginas.

---

## Sobre el contenido

El contenido académico y las respuestas salen de `CONTENIDO_PORTAFOLIO.md`.
La diapositiva 9 añade una aclaración de auditoría sobre la diferencia de VAN,
sin reemplazar las cifras originales. `data/qa.json` y el respaldo del chat se
regeneran desde las 23 respuestas del anexo, más el agrupador de métricas.

Dos cosas que conviene saber al revisar el sitio:

- **El slide 9 muestra dos cifras distintas de VAN**: `663.686 €` en el tablero
  de decisión y `682.574 €` en la fila de carga fiscal 0% de la tabla de
  sensibilidad. Ambas vienen así del archivo de contenido y **se reproducen tal
  cual, por decisión expresa**. La diapositiva muestra ahora la diferencia de
  18.888 € como pendiente de conciliación con el modelo de flujos.
- **La palabra clave "sostenibilidad" está declarada en dos entradas del anexo**
  (`cristal` y `ods`). La consulta literal conserva la respuesta `cristal`.
  Las otras consultas con empate no seleccionan automáticamente la primera
  entrada. La entrada `ods` sigue siendo accesible escribiendo
  "ods" u "objetivo de desarrollo sostenible".

## Archivos de trabajo y revisión local

`output/`, `.playwright-cli/`, `tmp/` y `local-tools/` están excluidos de Git.
Los informes, capturas, PDF de prueba y herramientas privadas no se publican.
El documento fuente también permanece fuera del repositorio público.

En el paquete de trabajo local, la herramienta sin dependencias permite:

```bash
python3 local-tools/sincronizar_chat.py --write
python3 local-tools/sincronizar_chat.py
```

El primer comando regenera JSON y respaldo; el segundo comprueba su igualdad
con el anexo. Un clon del repositorio público necesita el paquete privado de
fuente y herramienta para reproducir esa generación.

Antes de publicar, revisar en local y comprobar `git status --short` y
`git diff`. La revisión local debe aprobarse antes del push.

---

## Stack

HTML5, CSS3 y JavaScript vanilla. Sin frameworks, sin build, sin npm y sin CDN:
no hay ninguna petición a un servidor externo. El asistente **no usa IA ni llama
a ninguna API**; es coincidencia por palabras clave contra un archivo local, y
cuando no encuentra coincidencia lo dice en lugar de improvisar una respuesta.
