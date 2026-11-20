# Raíz principal

## Elemento | Descripción

### `<html>`

El elemento HTML `<html>` (o elemento HTML raíz) representa la raíz de un documento HTML. El resto de elementos descienden de este elemento.

---

# Metadatos del documento

Los metadatos contienen información sobre la página. Esto incluye información sobre estilos, scripts y datos que ayudan al software (search engines, browsers, etc.) a usar y generar la página. Los metadatos de estilos y scripts pueden estar definidos en la página o estar enlazados a otro fichero que contiene la información.

## Elemento | Descripción

### `<base>`

El elemento HTML `<base>` especifica la dirección URL base que se utilizará para todas las direcciones URL relativas contenidas dentro de un documento. Solo puede haber un elemento `<base>` en un documento.

### `<head>`

El elemento HTML `<head>` provee información general (metadatos) acerca del documento, incluyendo su título y enlaces a scripts y hojas de estilos.

### `<link>`

El elemento HTML `<link>` especifica la relación entre el documento actual y un recurso externo. Los usos posibles de este elemento incluyen la definición de un marco relacional para navegación. Este elemento es más frecuentemente usado para enlazar hojas de estilos.

### `<meta>`

Sus etiquetas son: `<meta>` (solo tiene una).

### `<style>`

Sus etiquetas son: `<style>` y `</style>` (ambas obligatorias).

### `<title>`

El elemento `<title>` HTML define el título del documento que se muestra en un browser en la barra de título o la pestaña de una página. Solo contiene texto; las etiquetas dentro del elemento se ignoran.

---

# Seccionamiento básico

## Elemento | Descripción

### `<body>`

El elemento `<body>` de HTML representa el contenido de un documento HTML. Solo puede haber un elemento `<body>` en un documento.

---

# Seccionamiento del contenido

Los elementos de seccionamiento del contenido te permiten organizar los contenidos del documento en partes lógicas. Usa los elementos de seccionado para crear una descripción amplia de los contenidos de tu página, incluyendo el encabezado y pie de página y elementos para identificar secciones.

## Elemento | Descripción

### `<address>`

El elemento HTML `<address>` aporta información de contacto para su `<article>` más cercano o ancestro `<body>`; en el último caso lo aplica a todo el documento.

### `<article>`

El elemento de HTML `<article>` representa una composición auto-contenida en un documento, una página, una aplicación o en un sitio, que se quiere que sea distribuible y/o reutilizable de manera independiente, por ejemplo, en la redifusión.  
Algunos ejemplos podrían ser un mensaje en un foro, un artículo de una revista o un periódico, una entrada de blog, el comentario de un usuario, un widget o gadget interactivo, o cualquier otro elemento de contenido independiente.

### `<aside>`

El elemento HTML `<aside>` representa una sección de una página que consiste en contenido que está indirectamente relacionado con el contenido principal del documento.  
Estas secciones son a menudo representadas como barras laterales o como inserciones y contienen una explicación al margen como una definición de glosario, elementos relacionados indirectamente como publicidad, la biografía del autor o, en aplicaciones web, la información de perfil o enlaces a blogs relacionados.

### `<footer>`

El elemento HTML Footer (`<footer>`) representa un pie de página para el contenido de sección más cercano o el elemento raíz de sección (por ejemplo, su ancestro más cercano `<article>`, `<aside>`, `<nav>`, `<section>`, `<blockquote>`, `<body>`, `<details>`, `<fieldset>`, `<figure>`, `<td>`).  
Un pie de página típicamente contiene información acerca del autor de la sección, datos de derechos de autor o enlaces a documentos relacionados.

### `<header>`

El elemento de HTML Header (`<header>`) representa un grupo de ayudas introductorias o de navegación. Puede contener algunos elementos de encabezado, así como también un logo, un formulario de búsqueda, un nombre de autor y otros componentes.

### `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

Los elementos de encabezado implementan seis niveles de encabezado del documento, `<h1>` es el más importante y `<h6>`, el menos importante.  
Un elemento de encabezado describe brevemente el tema de la sección que presenta. La información de encabezado puede ser usada por los agentes usuarios, por ejemplo, para construir una tabla de contenidos para un documento automáticamente.

### `<main>`

El elemento HTML `<main>` representa el contenido principal del `<body>` de un documento o aplicación.  
El área principal del contenido consiste en el contenido que está directamente relacionado o se expande sobre el tema central de un documento o la funcionalidad central de una aplicación.  
Este contenido debe ser único al documento, excluyendo cualquier contenido que se repita a través de un conjunto de documentos como barras laterales, enlaces de navegación, información de derechos de autor, logos del sitio y formularios de búsqueda (a menos que la función principal del documento sea un formulario de búsqueda).

### `<nav>`

El elemento HTML `<nav>` representa una sección de una página cuyo propósito es proporcionar enlaces de navegación, ya sea dentro del documento actual o a otros documentos.  
Ejemplos comunes de secciones de navegación son menús, tablas de contenido e índices.

### `<section>`

El elemento de HTML section (`<section>`) representa una sección genérica de un documento. Sirve para determinar qué contenido corresponde a qué parte de un esquema.  
Piensa en el esquema como en el índice de contenido de un libro; un tema común y subsecciones relacionadas. Es, por lo tanto, una etiqueta semántica.  
Su funcionalidad principal es estructurar semánticamente un documento a la hora de ser representado por parte de un agente usuario.  
Por ejemplo, un agente de usuario que represente el documento en voz podría exponer al usuario el índice de contenido por niveles para navegar rápidamente por las distintas partes.

---

# Contenido del texto

Utiliza los elementos HTML de contenido del texto para organizar bloques o secciones de contenido colocados entre los tags de apertura `<body>` y cierre.  
Es importante para la accesibilidad y el SEO que estos elementos se identifiquen con el objetivo o la estructura de ese contenido.

## Elemento | Descripción

### `<blockquote>`

Sus etiquetas son: `<blockquote>` y `</blockquote>` (ambas obligatorias).

### `<dd>`

El elemento HTML `<dd>` provee detalles acerca de o la definición de un término precedente (`<dt>`) en una lista de descripciones (`<dl>`).

### `<div>`

Sus etiquetas son: `<div>` y `</div>` (ambas obligatorias).

### `<dl>`

El elemento HTML `<dl>` representa una lista descriptiva.  
El elemento encierra una lista de grupos de términos (especificados con el uso del elemento `<dt>`) y de descripciones (proveídas con elementos `<dd>`).  
Algunos usos comunes para este elemento son implementar un glosario o para desplegar metadatos (lista de pares llave-valor).

### `<dt>`

El elemento HTML `<dt>` especifica un término en una descripción o lista de definiciones, y como tal debe utilizarse dentro de un elemento `<dl>`.  
Es usualmente seguido por un elemento `<dd>`; sin embargo, múltiples elementos `<dt>` en un renglón indican diferentes términos los cuales todos son definidos por el siguiente elemento `<dd>`.

### `<figcaption>`

El elemento HTML `<figcaption>` representa un subtítulo o leyenda asociado al contenido del elemento padre `<figure>`, pudiendo ser colocado como primer o último hijo.  
Es importante destacar que el elemento `<figcaption>` es opcional.

### `<figure>`

El elemento HTML `<figure>` representa contenido independiente, a menudo con un título.  
Si bien se relaciona con el flujo principal, su posición es independiente de este.  
Por lo general, se trata de una imagen, una ilustración, un diagrama, un fragmento de código o un esquema al que se hace referencia en el texto principal, pero que se puede mover a otra página o a un apéndice sin que afecte al flujo principal.

### `<hr>`

Sus etiquetas son: `<hr/>` (solo tiene una).

### `<li>`

Sus etiquetas son: `<li>` y `</li>` (la de cierre es opcional).

### `<menu>`

Sus etiquetas son: `<menu>` y `</menu>` (ambas obligatorias).

### `<ol>`

Sus etiquetas son: `<ol>` y `</ol>` (ambas obligatorias).

### `<p>`

Sus etiquetas son: `<p>` y `</p>` (la de cierre es opcional).

### `<pre>`

El elemento HTML `<pre>` (o Texto HTML Preformateado) representa texto preformateado.  
El texto en este elemento típicamente se muestra en una fuente fija, no proporcional, exactamente como es mostrado en el archivo.  
Los espacios dentro de este elemento también son mostrados como están escritos.

### `<ul>`

Sus etiquetas son: `<ul>` y `</ul>` (ambas obligatorias).

---

# Semántica del texto en línea

Utilice la semántica del texto en línea HTML para definir el significado, estructura o el estilo de una palabra, una línea o cualquier pieza arbitraria de texto.

## Elemento | Descripción

### `<a>`

El elemento HTML Anchor `<a>` crea un enlace a otras páginas de internet, archivos o ubicaciones dentro de la misma página, direcciones de correo o cualquier otra URL.

### `<abbr>`

El elemento HTML `<abbr>` (o Elemento de Abreviación HTML) representa una abreviación o acrónimo; el atributo opcional `title` puede ampliar o describir la abreviatura.  
Si está presente, el atributo `title` debe contener la descripción completa y nada más.

### `<b>`

`b` de bold = negrita.

### `<bdi>`

El elemento HTML `<bdi>` (o elemento de aislamiento Bi-Direccional) aísla un trozo de texto para que pueda ser formateado con una dirección diferente al texto que hay fuera de él.

### `<bdo>`

`bdo` Bi-Directional Overriding = Anulación de bidireccionalidad.

### `<br>`

El elemento HTML line break `<br>` produce un salto de línea en el texto (retorno de carro).  
Es útil para escribir un poema o una dirección, donde la división de las líneas es significante.

### `<cite>`

Sus etiquetas son: `<cite>` y `</cite>` (ambas obligatorias).

### `<code>`

Sus etiquetas son: `<code>` y `</code>` (ambas obligatorias).

### `<data>`

El elemento HTML `<data>` vincula un contenido dado con una traducción legible por una máquina.  
Si el contenido está relacionado con tiempo o fecha, debe usarse el elemento `<time>`.

### `<dfn>`

Sus etiquetas son: `<dfn>` y `</dfn>` (ambas obligatorias).

### `<em>`

El elemento HTML `<em>` es el apropiado para marcar con énfasis las partes importantes de un texto.  
El elemento `<em>` puede ser anidado, con cada nivel de anidamiento indicando un mayor grado de énfasis.

### `<i>`

Sus etiquetas son: `<i>` y `</i>` (ambas obligatorias).

### `<kbd>`

Sus etiquetas son: `<kbd>` y `</kbd>` (ambas obligatorias).

### `<mark>`

El elemento HTML Mark `<mark>` representa un texto marcado o resaltado como referencia o anotación, debido a su relevancia o importancia en un contexto particular.

### `<q>`

El elemento HTML `<q>` indica que el texto adjunto es una cita corta en línea.  
La mayoría de los navegadores modernos implementan esto rodeando el texto entre comillas.  
Este elemento está destinado a citas breves que no requieren saltos de párrafo; para citas de bloque independiente, utiliza el elemento `<blockquote>`.

### `<rp>`

Se utiliza para proporcionar paréntesis alternativos para navegadores que no admiten la visualización de anotaciones Ruby mediante el elemento `<ruby>`.  
Un elemento `<rp>` debe incluir cada uno de los paréntesis de apertura y cierre que envuelven el elemento `<rt>` que contiene el texto de la anotación.

### `<rt>`

Especifica el componente de texto ruby de una anotación ruby, que se utiliza para proporcionar información de pronunciación, traducción o transliteración para la tipografía de Asia oriental.  
El elemento `<rt>` siempre debe estar contenido dentro de un elemento `<ruby>`.

### `<ruby>`

Representa pequeñas anotaciones que se muestran encima, debajo o al lado del texto base, generalmente utilizadas para mostrar la pronunciación de los caracteres de Asia oriental.  
También se puede usar para anotar otros tipos de texto, pero este uso es menos común.

### `<s>`

Sus etiquetas son: `<s>` y `</s>` (ambas obligatorias).

### `<samp>`

El elemento HTML Sample (`<samp>`) se utiliza para incluir texto en línea que representa una muestra (o cita) de la salida de un programa de ordenador.  
El contenido de esta etiqueta es renderizado generalmente usando la tipografía monoespaciada por defecto del navegador.

### `<small>`

El elemento HTML `<small>` hace el tamaño del texto una talla más pequeña (por ejemplo, de largo a mediano, o de pequeño a extra pequeño) que el tamaño mínimo de fuente del navegador.  
En HTML5, este elemento es reutilizado para representar comentarios laterales y letra pequeña, incluyendo derechos de autor y texto legal, independientemente de su estilo de presentación.

### `<span>`

Sus etiquetas son: `<span>` y `</span>` (ambas obligatorias).

### `<strong>`

Sus etiquetas son: `<strong>` y `</strong>` (ambas obligatorias).

### `<sub>`

El elemento HTML `<sub>` define un fragmento de texto que se debe mostrar, por razones tipográficas, más bajo y generalmente más pequeño que el tramo principal del texto, es decir, en subíndice.

### `<sup>`

El elemento HTML `<sup>` define un fragmento de texto que se debe mostrar, por razones tipográficas, más alto y generalmente más pequeño que el tramo principal del texto, es decir, en superíndice.

### `<time>`

El elemento HTML `<time>` representa un periodo específico en el tiempo.  
Puede incluir el atributo `datetime` para convertir las fechas en un formato interno legible por un ordenador, permitiendo mejores resultados en los motores de búsqueda o características personalizadas como recordatorios.

### `<u>`

Sus etiquetas son: `<u>` y `</u>` (ambas obligatorias).

### `<var>`

Sus etiquetas son: `<var>` y `</var>` (ambas obligatorias).

### `<wbr>`

El elemento HTML word break opportunity `<wbr>` representa una posición dentro del texto donde el explorador puede opcionalmente saltar una línea, aunque sus reglas de salto de línea de otra manera no crearían un salto en esa posición.  
En páginas codificadas en UTF-8, `<wbr>` se comporta como el punto de código U+200B ZERO-WIDTH SPACE.  
En particular se comporta como un punto de código Unicode bidi BN, significando esto que no tiene efecto en ordenamiento bidi: `<div dir=rtl>123,<wbr>456</div>` muestra, cuando no se rompa en dos líneas, `123, 456` y no `456, 123`.

---

# Imagen y multimedia

HTML soporta varios recursos multimedia como imágenes, audio y video.

## Elemento | Descripción

### `<area>`

`area` de area = área.

### `<audio>`

El elemento `<audio>` se usa para insertar contenido de audio en un documento HTML o XHTML.  
El elemento `<audio>` se agregó como parte de HTML5.

### `<img>`

El elemento de imagen HTML `<img>` representa una imagen en el documento.

### `<map>`

Sus etiquetas son: `<map>` y `</map>` (ambas obligatorias).

### `<track>`

El elemento HTML `<track>` se utiliza como elemento hijo de los elementos multimedia `<audio>` y `<video>`.  
Le permite especificar pistas de texto cronometradas (o datos basados en el tiempo), por ejemplo, para manejar subtítulos automáticamente.  
Las pistas están formateadas en formato WebVTT (archivos `.vtt`): Web Video Text Tracks.

### `<video>`

El elemento `<video>` se utiliza para incrustar vídeos en un documento HTML o XHTML.

---

# Contenido incrustado

Además de los contenidos multimedia habituales, HTML puede incluir otra variedad de contenidos, aunque no siempre es fácil de interactuar con ellos.

## Elemento | Descripción

### `<embed>`

El elemento HTML Embed (`<embed>`) representa un punto de integración para una aplicación externa o de contenido interactivo (en otras palabras, un plug-in).

### `<iframe>`

El elemento HTML `<iframe>` (de inline frame) representa un contexto de navegación anidado, el cual permite incrustar otra página HTML en la página actual.

### `<object>`

El elemento HTML `<object>` representa un recurso externo, que puede ser tratado como una imagen, un contexto de navegación anidado o como un recurso que debe ser manejado por un plugin.

### `<picture>`

El elemento HTML `<picture>` es un contenedor usado para especificar múltiples elementos `<source>` y un elemento `<img>` contenido en él para proveer versiones de una imagen para diferentes escenarios de dispositivos.  
Si no hay coincidencias con los elementos `<source>`, el archivo especificado en los atributos `src` del elemento `<img>` es utilizado.  
La imagen seleccionada es entonces presentada en el espacio ocupado por el elemento `<img>`.

### `<portal>`

Habilita la incrustación de otra página HTML en la actual con el fin de permitir una navegación más fluida en nuevas páginas.

### `<source>`

El elemento HTML `<source>` especifica recursos de medios múltiples para los elementos `<picture>`, `<audio>` o `<video>`.  
Es un elemento vacío. Normalmente se utiliza para servir el mismo contenido multimedia en varios formatos soportados por diferentes navegadores.

---

# SVG y MathML

Puede incrustar contenido SVG y MathML directamente en documentos HTML, usando los elementos `<svg>` y `<math>`.

## Elemento | Descripción

### `<svg>`

El elemento `<svg>` es un contenedor que define un nuevo sistema de coordenadas y viewport.  
Es usado como el elemento más externo de cualquier documento SVG, pero también puede ser usado para agregar un fragmento de un SVG dentro de un documento SVG o HTML.

### `<math>`

`<math>` es el elemento superior en MathML.  
Cada instancia válida de MathML debe estar rodeada de etiquetas `<math>`.  
Además, no debes anidar un segundo elemento `<math>` dentro de un primero, pero puedes tener un número arbitrario de otros elementos hijos en él.

---

# Scripting

Con el fin de crear contenido dinámico y aplicaciones web, HTML soporta el uso de lenguajes de scripting, el más prominente es JavaScript.  
Ciertos elementos soportan esta capacidad.

## Elemento | Descripción

### `<canvas>`

El elemento HTML canvas (`<canvas>`) se puede utilizar para dibujar gráficos a través de secuencias de comandos (por lo general JavaScript).  
Por ejemplo, puede usarse para dibujar gráficos, hacer composiciones de fotos o incluso realizar animaciones.

### `<noscript>`

Sus etiquetas son: `<noscript>` y `</noscript>` (ambas obligatorias).

### `<script>`

Se utiliza para incrustar código ejecutable o datos; esto generalmente se usa para incrustar o hacer referencia al código JavaScript.  
El elemento `<script>` también se puede usar con otros lenguajes, como el lenguaje de programación de sombreado GLSL de WebGL y JSON.

---

# Ediciones demarcadas

Estos elementos permiten proporcionar indicios de que determinadas partes del texto han sido alteradas.

## Elemento | Descripción

### `<del>`

Sus etiquetas son: `<del>` y `</del>` (ambas obligatorias).

### `<ins>`

Sus etiquetas son: `<ins>` e `</ins>` (ambas obligatorias).

---

# Tablas

Estos elementos son usados para crear y manejar datos tabulados.

## Elemento | Descripción

### `<caption>`

Sus etiquetas son: `<caption>` y `</caption>` (ambas obligatorias).

### `<col>`

Sus etiquetas son: `<col>` (solo tiene una).

### `<colgroup>`

Sus etiquetas son: `<colgroup>` y `</colgroup>` (la de cierre es opcional).

### `<table>`

El elemento de tabla HTML (`<table>`) representa datos en dos o más dimensiones.

### `<tbody>`

Encapsula un conjunto de filas de una tabla (elementos `<tr>`), lo que indica que abarcan el cuerpo de la tabla (`<table>`).

### `<td>`

El elemento HTML celda de tabla (`<td>`) define la celda de una tabla que contiene datos. Esta participa en el modelo de tablas.

### `<tfoot>`

Define un conjunto de filas que resumen las columnas de la tabla.

### `<th>`

El elemento HTML `<th>` define una celda como encabezado de un grupo de celdas en una tabla.  
La naturaleza exacta de este grupo está definida por los atributos `scope` y `headers`.

### `<thead>`

Define un conjunto de filas que definen el encabezado de las columnas de la tabla.

### `<tr>`

El elemento HTML fila de tabla (`<tr>`) define una fila de celdas en una tabla.  
Estas pueden ser una mezcla de elementos `<td>` y `<th>`.

---

# Formularios

HTML provee un número de elementos que pueden usarse conjuntamente para crear formularios los cuales el usuario puede completar y enviar al sitio web o a una aplicación.

## Elemento | Descripción

### `<button>`

`button` = botón.

### `<datalist>`

El elemento HTML `<datalist>` contiene un conjunto de elementos `<option>` que representan los valores disponibles para otros controles.

### `<fieldset>`

Sus etiquetas son: `<fieldset>` y `</fieldset>` (ambas obligatorias).

### `<form>`

El elemento HTML form (`<form>`) representa una sección de un documento que contiene controles interactivos que permiten a un usuario enviar información a un servidor web.

### `<input>`

El elemento HTML `<input>` se usa para crear controles interactivos para formularios basados en la web con el fin de recibir datos del usuario.  
Hay disponible una amplia variedad de tipos de datos de entrada y widgets de control, que dependen del dispositivo y el agente de usuario (user agent).  
El elemento `<input>` es uno de los más potentes y complejos en todo HTML debido a la gran cantidad de combinaciones de tipos y atributos de entrada.

### `<label>`

El elemento HTML `<label>` representa una etiqueta para un elemento en una interfaz de usuario.  
Este puede estar asociado con un control ya sea mediante la utilización del atributo `for`, o ubicando el control dentro del elemento `label`.  
Tal control es llamado "el control etiquetado" del elemento `label`.

### `<legend>`

Sus etiquetas son: `<legend>` y `</legend>` (ambas obligatorias).

### `<meter>`

Representa un valor escalar dentro de un rango conocido o un valor fraccionario.

### `<optgroup>`

Crea una agrupación de opciones dentro de un elemento `<select>`.

### `<option>`

En un formulario web, el elemento HTML `<option>` se usa para representar un ítem dentro de un `<select>`, un `<optgroup>` o un elemento HTML5 `<datalist>`.

### `<output>`

Elemento contenedor en el que un sitio o aplicación puede inyectar los resultados de un cálculo o el resultado de una acción del usuario.

### `<progress>`

La etiqueta HTML `<progress>` se utiliza para visualizar el progreso de una tarea.  
Aunque los detalles de cómo se muestra dependen del navegador del cliente, básicamente aparece una barra de progreso.

### `<select>`

El elemento select (`<select>`) de HTML representa un control que muestra un menú de opciones.  
Las opciones contenidas en el menú son representadas por elementos `<option>`, los cuales pueden ser agrupados por elementos `<optgroup>`.  
La opción puede estar preseleccionada por el usuario.

### `<textarea>`

El elemento HTML `<textarea>` representa un control para la edición multilínea de texto sin formato.

---

# Elementos interactivos

HTML ofrece una selección de elementos que pueden ayudar a crear objetos de interfaz de usuario interactivos.

## Elemento | Descripción

### `<details>`

El elemento HTML Details (`<details>`) es usado como un widget de revelación a través del cual el usuario puede obtener información adicional.

### `<dialog>`

El elemento HTML `<dialog>` representa una caja de diálogo u otro componente interactivo, como inspector o ventana.

### `<summary>`

Especifica un resumen, un título o una leyenda para el cuadro de información de un elemento de detalles.  
Al hacer clic en el elemento `<summary>`, el estado del elemento principal `<details>` se abre y se cierra.

---

# Componentes web

Los componentes web son una tecnología relacionada con HTML que hacen posible crear y personalizar elementos como si fueran HTML normal.  
Además, pueden crear versiones personalizadas de los elementos HTML estándar.

## Elemento | Descripción

### `<slot>`

El elemento HTML `<slot>` —parte de la suite tecnológica Web Components— es un placeholder en un componente que puedes llenar con tu propio marcado, que te permite crear árboles DOM por separado y presentarlos juntos.

### `<template>`

El elemento HTML `<template>` es un mecanismo para mantener el contenido HTML del lado del cliente que no se renderiza cuando se carga una página, pero que posteriormente puede ser instanciado durante el tiempo de ejecución empleando JavaScript.

---

# Elementos obsoletos y en desuso

Advertencia: Estos son elementos HTML viejos los cuales están obsoletos y no deben usarse.  
Nunca deberías usarlos en un nuevo proyecto y deberías reemplazarlos en proyectos viejos tan pronto como sea posible.  
Se listan aquí solo con propósitos informativos.

## Elemento | Descripción

### `<acronym>`

Permite a los autores indicar claramente una secuencia de caracteres que componen un acrónimo o abreviatura de una palabra.

### `<bgsound>`

El elemento HTML de sonido de fondo (`<bgsound>`) es un elemento de Internet Explorer que asocia un sonido de fondo con una página.

### `<big>`

`big` de big = grande.

### `<center>`

Sus etiquetas son: `<center>` y `</center>` (ambas obligatorias).

### `<content>`

El elemento HTML `<content>` es usado dentro de un Shadow DOM como un punto de inserción.  
No está pensado para ser usado en HTML ordinario. Es usado con Web Components.

### `<dir>`

Sus etiquetas son: `<dir>` y `</dir>` (ambas obligatorias).

### `<font>`

Sus etiquetas son: `<font>` y `</font>` (ambas obligatorias).

### `<frame>`

Sus etiquetas son: `<frame>` (solo tiene una).

### `<frameset>`

Sus etiquetas son: `<frameset>` y `</frameset>` (ambas obligatorias).

### `<image>`

El elemento HTML `<image>` fue un elemento experimental diseñado para mostrar imágenes.  
Nunca fue implementado y el elemento estándar `<img>` debe ser usado.

### `<marquee>`

La etiqueta HTML `<marquee>` se utiliza para insertar un área de texto en movimiento.  
También se la conoce como marquesina.

### `<menuitem>`

Representa un comando que un usuario puede invocar a través de un menú emergente.  
Esto incluye menús contextuales, así como menús que pueden adjuntarse a un botón de menú.

### `<nobr>`

El elemento HTML `<nobr>` previene que una línea de texto se divida en una nueva línea, así, se presentará en una línea larga por lo que puede ser necesario hacer un desplazamiento de pantalla.  
Esta etiqueta no es un estándar HTML y no debería ser usada; en su lugar usa la propiedad CSS `white-space`.

### `<noembed>`

Proporciona contenido para ser presentado en navegadores que no admiten (o han desactivado la compatibilidad) con el elemento `<frame>`.  
Aunque los navegadores más utilizados admiten marcos, existen excepciones, incluidos ciertos navegadores de uso especial, incluidos algunos navegadores móviles, así como navegadores en modo texto.

### `<noframes>`

Sus etiquetas son: `<noframes>` y `</noframes>` (ambas obligatorias).

### `<param>`

Sus etiquetas son: `<param>` (solo tiene una).

### `<plaintext>`

Muestra todo lo que sigue a la etiqueta de inicio como texto sin formato, ignorando cualquier código HTML siguiente.  
No hay una etiqueta de cierre, ya que todo lo que sigue se considera texto sin formato.

### `<rb>`

Se utiliza para delimitar el componente de texto base de una anotación Ruby, es decir, el texto que se está anotando.  
Un elemento `<rb>` debe envolver cada segmento atómico separado del texto base.

### `<rtc>`

Adopta anotaciones semánticas de caracteres presentados en un rubí de elementos `<rb>` utilizados dentro del elemento `<ruby>`.  
Los elementos `<rb>` pueden tener anotaciones de pronunciación (`<rt>`) y semánticas (`<rtc>`).

### `<shadow>`

Una parte obsoleta de la suite de tecnología de Componentes Web que estaba pensada para ser utilizada como un punto de inserción en el shadow DOM.  
Es posible que lo hayas utilizado si has creado varias raíces ocultas en un host oculto.

### `<spacer>`

Permite la inserción de espacios vacíos en las páginas.  
Fue diseñado por Netscape para lograr el mismo efecto que una imagen de diseño de un solo píxel.  
Sin embargo, `<spacer>` ya no es compatible con ninguno de los principales navegadores y ahora se pueden lograr los mismos efectos usando CSS simple.

### `<strike>`

Coloca un tachado (línea horizontal) sobre el texto.

### `<tt>`

Sus etiquetas son: `<tt>` y `</tt>` (ambas obligatorias).

### `<xmp>`

Muestra el texto entre las etiquetas de inicio y finalización sin interpretar el HTML intermedio y utilizando una fuente monoespaciada.  
La especificación HTML2 recomendaba que se representara lo suficientemente ancho como para permitir 80 caracteres por línea.

---

# Estándares Modernos (HTML Living Standard 2024-2026)

## 1. `<dialog>` — Ventanas Modales y Diálogos Nativos

`<dialog>` permite crear modales y cuadros de diálogo nativos con gestión automática de foco, tecla `Escape` y capa superior (*Top Layer*, por encima de cualquier `z-index`).

```html
<button id="abrirModal">Abrir configuración</button>

<dialog id="modalConfig" aria-labelledby="tituloModal">
  <h2 id="tituloModal">Configuración de cuenta</h2>
  <p>¿Deseas guardar los cambios realizados?</p>
  <form method="dialog">
    <button value="cancel">Cancelar</button>
    <button value="confirm">Guardar</button>
  </form>
</dialog>

<script>
  const modal = document.getElementById('modalConfig');
  document.getElementById('abrirModal').addEventListener('click', () => {
    modal.showModal(); // Abre como modal bloqueando el fondo con ::backdrop
  });
  modal.addEventListener('close', () => {
    console.log('Resultado:', modal.returnValue);
  });
</script>
```

- `showModal()`: abre en modo modal (bloquea interacción externa, activa `::backdrop`, cierra con `Esc`).
- `show()`: abre en modo no modal (sin `::backdrop`).
- `method="dialog"` en un `<form>` cierra el diálogo automáticamente al enviar y guarda el `value` del botón en `dialog.returnValue`.

---

## 2. Popover API (`popover`, `popovertarget`)

La **Popover API** nativa permite crear menús flotantes, tooltips, toasts y paneles sin JavaScript:

```html
<button popovertarget="menu-usuario" popovertargetaction="toggle">
  Perfil
</button>

<div id="menu-usuario" popover="auto">
  <p>Sesión iniciada como <strong>Ana</strong></p>
  <button popovertarget="menu-usuario" popovertargetaction="hide">Cerrar</button>
</div>
```

- `popover="auto"` (por defecto): se cierra automáticamente al hacer clic fuera (*light dismiss*) o al presionar `Esc`, y cierra otros popovers `auto` abiertos.
- `popover="manual"`: requiere cierre explícito mediante botón o JS (`el.hidePopover()`), ideal para notificaciones persistentes.
- En CSS puedes estilizar el estado abierto con `:popover-open` y su fondo con `::backdrop`.

---

## 3. `<search>` y el atributo `inert`

### `<search>`
Elemento semántico (landmark ARIA `role="search"` implícito) que agrupa controles de búsqueda o filtrado:

```html
<search>
  <form action="/buscar" method="get">
    <label for="q">Buscar artículos:</label>
    <input id="q" name="q" type="search" placeholder="CSS Grid, Flexbox...">
    <button type="submit">Buscar</button>
  </form>
</search>
```

### `inert`
Atributo booleano global que desactiva un subárbol del DOM por completo: el usuario no puede hacer clic, enfocar con `Tab`, seleccionar texto ni los lectores de pantalla pueden navegar por él.

```html
<main inert>
  <!-- Contenido bloqueado mientras un drawer o tutorial está activo -->
</main>
```

---

## 4. Rendimiento en Imágenes: `loading="lazy"`, `fetchpriority` y `<picture>`

```html
<!-- Imagen crítica (Hero / LCP): prioridad alta y carga inmediata -->
<img
  src="hero-1200.avif"
  alt="Panel de control moderno"
  width="1200"
  height="675"
  fetchpriority="high"
  decoding="sync"
>

<!-- Imagen secundaria fuera de pantalla: carga diferida -->
<img
  src="galeria-01.webp"
  alt="Detalle del producto"
  width="600"
  height="400"
  loading="lazy"
  decoding="async"
  fetchpriority="low"
>
```

### `<picture>` con formatos modernos (AVIF / WebP) y Dirección de Arte

```html
<picture>
  <source media="(max-width: 640px)" srcset="portada-mobile.avif" type="image/avif">
  <source srcset="portada-desktop.avif" type="image/avif">
  <source srcset="portada-desktop.webp" type="image/webp">
  <img src="portada-desktop.jpg" alt="Portada del curso" width="1200" height="600">
</picture>
```

> **Tip:** Siempre incluye `width` y `height` en `<img>` para que el navegador reserve el espacio antes de descargarla y evitar **CLS (Cumulative Layout Shift)**.

---

## 5. `<template>` para Plantillas Reutilizables

El contenido dentro de `<template>` no se renderiza ni ejecuta scripts al cargar la página; se clona bajo demanda con JavaScript:

```html
<template id="tpl-tarjeta">
  <article class="card">
    <h3 class="card__title"></h3>
    <p class="card__desc"></p>
  </article>
</template>

<script>
  const tpl = document.getElementById('tpl-tarjeta');
  const clon = tpl.content.cloneNode(true);
  clon.querySelector('.card__title').textContent = 'HTML Moderno';
  clon.querySelector('.card__desc').textContent = 'Usando template de forma segura.';
  document.body.appendChild(clon);
</script>
```

---

## 6. ARIA y Accesibilidad Moderna (a11y)

**Primera regla de ARIA:** Si existe un elemento HTML nativo semántico (`<button>`, `<nav>`, `<main>`, `<dialog>`), úsalo en lugar de un `<div>` con roles ARIA.

- **Landmarks semánticos:** `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<search>`.
- **`aria-label` / `aria-labelledby`:** Dan nombre accesible a controles sin texto visible (por ejemplo, un botón con solo un ícono SVG).
- **`aria-expanded="true|false"`:** Indica si un menú desplegable o acordeón está abierto.
- **`aria-live="polite|assertive"`:** Anuncia cambios dinámicos (notificaciones, errores de formulario) a lectores de pantalla.
- **`aria-hidden="true"`:** Oculta íconos decorativos de la tecnología asistiva.
- **Skip link:** Enlace oculto visualmente que aparece al tabular para saltar directamente a `<main id="contenido">`.

---

## 7. SEO Técnico, Open Graph y Datos Estructurados

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Guía de Desarrollo Web Moderno | Curso</title>
  <meta name="description" content="Aprende HTML Living Standard, CSS moderno y JavaScript desde cero.">
  <link rel="canonical" href="https://tusitio.com/guia-web">

  <!-- Open Graph (Facebook, LinkedIn, WhatsApp, Discord) -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="Guía de Desarrollo Web Moderno">
  <meta property="og:description" content="Estándares actuales de HTML, CSS y accesibilidad.">
  <meta property="og:image" content="https://tusitio.com/og-cover.jpg">
  <meta property="og:url" content="https://tusitio.com/guia-web">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">

  <!-- Datos estructurados JSON-LD para Google Rich Results -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Guía de Desarrollo Web Moderno",
      "inLanguage": "es"
    }
  </script>
</head>
```

---

## 8. `<script>`: `type="module"` vs `defer` vs `async`

| Atributo | Descarga | Ejecución | Orden garantizado | Modo estricto / Scope |
| :--- | :--- | :--- | :--- | :--- |
| `<script src="...">` (normal) | Bloquea el parser HTML | Inmediata al descargar | Sí | Global, no estricto |
| `<script defer src="...">` | En paralelo al HTML | Tras parsear el HTML (antes de `DOMContentLoaded`) | Sí (en orden de aparición) | Global |
| `<script async src="...">` | En paralelo al HTML | Apenas termina de descargar (pausa el HTML) | No (el primero que llegue) | Global |
| `<script type="module" src="...">` | En paralelo (como `defer` por defecto) | Tras parsear el HTML | Sí (respeta grafo `import`/`export`) | Ámbito de módulo + `'use strict'` automático |

---

# Errores Comunes en HTML

1. **Usar `<div>` o `<span>` para botones y enlaces:** Pierden navegación por teclado (`Enter`/`Space`), foco y semántica; usa `<button type="button">` o `<a href="...">`.
2. **Saltar niveles de encabezado (`<h1>` → `<h4>`):** Rompe la jerarquía para lectores de pantalla y SEO.
3. **Omitir `alt` en imágenes:** Si la imagen es informativa, describe su contenido; si es puramente decorativa, usa `alt=""` (nunca omitas el atributo).
4. **No declarar `width` y `height` en `<img>`:** Provoca saltos visuales (CLS) al cargar la página.
5. **Formularios sin `<label>`:** Usar solo `placeholder` perjudica la usabilidad y la accesibilidad.

---

# Buenas Prácticas Profesionales

- Declarar siempre `<!DOCTYPE html>` y `<html lang="es">`.
- Mantener un único `<h1>` principal por página y una jerarquía lógica (`<h2>`, `<h3>`).
- Preferir elementos nativos (`<dialog>`, `<details>`, `popover`, `<search>`) antes de reimplementarlos con JavaScript.
- Optimizar medios con `<picture>`, formatos AVIF/WebP, `loading="lazy"` para imágenes secundarias y `fetchpriority="high"` para la imagen principal (LCP).
- Validar el HTML periódicamente con el [W3C Markup Validation Service](https://validator.w3.org/) y auditar accesibilidad con Lighthouse.

---

# Hoja de Trucos (Cheatsheet) — HTML Moderno

| Elemento / Atributo | Propósito |
| :--- | :--- |
| `<dialog>` + `.showModal()` | Modal nativo con `::backdrop`, Top Layer y cierre con `Esc` |
| `popover` + `popovertarget` | Menús y tooltips flotantes declarativos sin JavaScript |
| `<search>` | Landmark semántico para formularios de búsqueda o filtrado |
| `inert` | Deshabilita interacción, foco y lectura asistiva en un bloque |
| `loading="lazy"` / `fetchpriority` | Controla cuándo y con qué prioridad se descargan las imágenes |
| `<picture>` + `<source>` | Sirve AVIF/WebP o distintos recortes según el viewport |
| `<template>` | Fragmento HTML inerte listo para clonar desde JavaScript |
| `<script type="module">` | Carga ES Modules en paralelo con ejecución diferida y scope propio |
| `aria-label` / `aria-live` | Mejora accesibilidad en controles sin texto y regiones dinámicas |
