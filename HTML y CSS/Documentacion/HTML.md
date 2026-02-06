# Raíz principal

## Elemento | Descripción

### `<html>`

El elemento HTML `<html>` (o elemento HTML raíz) representa la raíz de un documento HTML. El resto de elementos descienden de este elemento.

---

# Metadatos del documento

Los metadatos contienen información sobre la página. Esto incluye información sobre estilos, scripts y datos que ayudan al software (search engines, browsers, etc.) a usar y generar la página. Los metadatos de estilos y scripts pueden estar definidos en la página o estar enlazados a otro fichero que contiene la información. [file:1]

## Elemento | Descripción

### `<base>`

El elemento HTML `<base>` especifica la dirección URL base que se utilizará para todas las direcciones URL relativas contenidas dentro de un documento. Solo puede haber un elemento `<base>` en un documento. [file:1]

### `<head>`

El elemento HTML `<head>` provee información general (metadatos) acerca del documento, incluyendo su título y enlaces a scripts y hojas de estilos. [file:1]

### `<link>`

El elemento HTML `<link>` especifica la relación entre el documento actual y un recurso externo. Los usos posibles de este elemento incluyen la definición de un marco relacional para navegación. Este elemento es más frecuentemente usado para enlazar hojas de estilos. [file:1]

### `<meta>`

Sus etiquetas son: `<meta>` (solo tiene una). [file:1]

### `<style>`

Sus etiquetas son: `<style>` y `</style>` (ambas obligatorias). [file:1]

### `<title>`

El elemento `<title>` HTML define el título del documento que se muestra en un browser en la barra de título o la pestaña de una página. Solo contiene texto; las etiquetas dentro del elemento se ignoran. [file:1]

---

# Seccionamiento básico

## Elemento | Descripción

### `<body>`

El elemento `<body>` de HTML representa el contenido de un documento HTML. Solo puede haber un elemento `<body>` en un documento. [file:1]

---

# Seccionamiento del contenido

Los elementos de seccionamiento del contenido te permiten organizar los contenidos del documento en partes lógicas. Usa los elementos de seccionado para crear una descripción amplia de los contenidos de tu página, incluyendo el encabezado y pie de página y elementos para identificar secciones. [file:1]

## Elemento | Descripción

### `<address>`

El elemento HTML `<address>` aporta información de contacto para su `<article>` más cercano o ancestro `<body>`; en el último caso lo aplica a todo el documento. [file:1]

### `<article>`

El elemento de HTML `<article>` representa una composición auto-contenida en un documento, una página, una aplicación o en un sitio, que se quiere que sea distribuible y/o reutilizable de manera independiente, por ejemplo, en la redifusión. [file:1]  
Algunos ejemplos podrían ser un mensaje en un foro, un artículo de una revista o un periódico, una entrada de blog, el comentario de un usuario, un widget o gadget interactivo, o cualquier otro elemento de contenido independiente. [file:1]

### `<aside>`

El elemento HTML `<aside>` representa una sección de una página que consiste en contenido que está indirectamente relacionado con el contenido principal del documento. [file:1]  
Estas secciones son a menudo representadas como barras laterales o como inserciones y contienen una explicación al margen como una definición de glosario, elementos relacionados indirectamente como publicidad, la biografía del autor o, en aplicaciones web, la información de perfil o enlaces a blogs relacionados. [file:1]

### `<footer>`

El elemento HTML Footer (`<footer>`) representa un pie de página para el contenido de sección más cercano o el elemento raíz de sección (por ejemplo, su ancestro más cercano `<article>`, `<aside>`, `<nav>`, `<section>`, `<blockquote>`, `<body>`, `<details>`, `<fieldset>`, `<figure>`, `<td>`). [file:1]  
Un pie de página típicamente contiene información acerca del autor de la sección, datos de derechos de autor o enlaces a documentos relacionados. [file:1]

### `<header>`

El elemento de HTML Header (`<header>`) representa un grupo de ayudas introductorias o de navegación. Puede contener algunos elementos de encabezado, así como también un logo, un formulario de búsqueda, un nombre de autor y otros componentes. [file:1]

### `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`

Los elementos de encabezado implementan seis niveles de encabezado del documento, `<h1>` es el más importante y `<h6>`, el menos importante. [file:1]  
Un elemento de encabezado describe brevemente el tema de la sección que presenta. La información de encabezado puede ser usada por los agentes usuarios, por ejemplo, para construir una tabla de contenidos para un documento automáticamente. [file:1]

### `<main>`

El elemento HTML `<main>` representa el contenido principal del `<body>` de un documento o aplicación. [file:1]  
El área principal del contenido consiste en el contenido que está directamente relacionado o se expande sobre el tema central de un documento o la funcionalidad central de una aplicación. [file:1]  
Este contenido debe ser único al documento, excluyendo cualquier contenido que se repita a través de un conjunto de documentos como barras laterales, enlaces de navegación, información de derechos de autor, logos del sitio y formularios de búsqueda (a menos que la función principal del documento sea un formulario de búsqueda). [file:1]

### `<nav>`

El elemento HTML `<nav>` representa una sección de una página cuyo propósito es proporcionar enlaces de navegación, ya sea dentro del documento actual o a otros documentos. [file:1]  
Ejemplos comunes de secciones de navegación son menús, tablas de contenido e índices. [file:1]

### `<section>`

El elemento de HTML section (`<section>`) representa una sección genérica de un documento. Sirve para determinar qué contenido corresponde a qué parte de un esquema. [file:1]  
Piensa en el esquema como en el índice de contenido de un libro; un tema común y subsecciones relacionadas. Es, por lo tanto, una etiqueta semántica. [file:1]  
Su funcionalidad principal es estructurar semánticamente un documento a la hora de ser representado por parte de un agente usuario. [file:1]  
Por ejemplo, un agente de usuario que represente el documento en voz podría exponer al usuario el índice de contenido por niveles para navegar rápidamente por las distintas partes. [file:1]

---

# Contenido del texto

Utiliza los elementos HTML de contenido del texto para organizar bloques o secciones de contenido colocados entre los tags de apertura `<body>` y cierre. [file:1]  
Es importante para la accesibilidad y el SEO que estos elementos se identifiquen con el objetivo o la estructura de ese contenido. [file:1]

## Elemento | Descripción

### `<blockquote>`

Sus etiquetas son: `<blockquote>` y `</blockquote>` (ambas obligatorias). [file:1]

### `<dd>`

El elemento HTML `<dd>` provee detalles acerca de o la definición de un término precedente (`<dt>`) en una lista de descripciones (`<dl>`). [file:1]

### `<div>`

Sus etiquetas son: `<div>` y `</div>` (ambas obligatorias). [file:1]

### `<dl>`

El elemento HTML `<dl>` representa una lista descriptiva. [file:1]  
El elemento encierra una lista de grupos de términos (especificados con el uso del elemento `<dt>`) y de descripciones (proveídas con elementos `<dd>`). [file:1]  
Algunos usos comunes para este elemento son implementar un glosario o para desplegar metadatos (lista de pares llave-valor). [file:1]

### `<dt>`

El elemento HTML `<dt>` especifica un término en una descripción o lista de definiciones, y como tal debe utilizarse dentro de un elemento `<dl>`. [file:1]  
Es usualmente seguido por un elemento `<dd>`; sin embargo, múltiples elementos `<dt>` en un renglón indican diferentes términos los cuales todos son definidos por el siguiente elemento `<dd>`. [file:1]

### `<figcaption>`

El elemento HTML `<figcaption>` representa un subtítulo o leyenda asociado al contenido del elemento padre `<figure>`, pudiendo ser colocado como primer o último hijo. [file:1]  
Es importante destacar que el elemento `<figcaption>` es opcional. [file:1]

### `<figure>`

El elemento HTML `<figure>` representa contenido independiente, a menudo con un título. [file:1]  
Si bien se relaciona con el flujo principal, su posición es independiente de este. [file:1]  
Por lo general, se trata de una imagen, una ilustración, un diagrama, un fragmento de código o un esquema al que se hace referencia en el texto principal, pero que se puede mover a otra página o a un apéndice sin que afecte al flujo principal. [file:1]

### `<hr>`

Sus etiquetas son: `<hr/>` (solo tiene una). [file:1]

### `<li>`

Sus etiquetas son: `<li>` y `</li>` (la de cierre es opcional). [file:1]

### `<menu>`

Sus etiquetas son: `<menu>` y `</menu>` (ambas obligatorias). [file:1]

### `<ol>`

Sus etiquetas son: `<ol>` y `</ol>` (ambas obligatorias). [file:1]

### `<p>`

Sus etiquetas son: `<p>` y `</p>` (la de cierre es opcional). [file:1]

### `<pre>`

El elemento HTML `<pre>` (o Texto HTML Preformateado) representa texto preformateado. [file:1]  
El texto en este elemento típicamente se muestra en una fuente fija, no proporcional, exactamente como es mostrado en el archivo. [file:1]  
Los espacios dentro de este elemento también son mostrados como están escritos. [file:1]

### `<ul>`

Sus etiquetas son: `<ul>` y `</ul>` (ambas obligatorias). [file:1]

---

# Semántica del texto en línea

Utilice la semántica del texto en línea HTML para definir el significado, estructura o el estilo de una palabra, una línea o cualquier pieza arbitraria de texto. [file:1]

## Elemento | Descripción

### `<a>`

El elemento HTML Anchor `<a>` crea un enlace a otras páginas de internet, archivos o ubicaciones dentro de la misma página, direcciones de correo o cualquier otra URL. [file:1]

### `<abbr>`

El elemento HTML `<abbr>` (o Elemento de Abreviación HTML) representa una abreviación o acrónimo; el atributo opcional `title` puede ampliar o describir la abreviatura. [file:1]  
Si está presente, el atributo `title` debe contener la descripción completa y nada más. [file:1]

### `<b>`

`b` de bold = negrita. [file:1]

### `<bdi>`

El elemento HTML `<bdi>` (o elemento de aislamiento Bi-Direccional) aísla un trozo de texto para que pueda ser formateado con una dirección diferente al texto que hay fuera de él. [file:1]

### `<bdo>`

`bdo` Bi-Directional Overriding = Anulación de bidireccionalidad. [file:1]

### `<br>`

El elemento HTML line break `<br>` produce un salto de línea en el texto (retorno de carro). [file:1]  
Es útil para escribir un poema o una dirección, donde la división de las líneas es significante. [file:1]

### `<cite>`

Sus etiquetas son: `<cite>` y `</cite>` (ambas obligatorias). [file:1]

### `<code>`

Sus etiquetas son: `<code>` y `</code>` (ambas obligatorias). [file:1]

### `<data>`

El elemento HTML `<data>` vincula un contenido dado con una traducción legible por una máquina. [file:1]  
Si el contenido está relacionado con tiempo o fecha, debe usarse el elemento `<time>`. [file:1]

### `<dfn>`

Sus etiquetas son: `<dfn>` y `</dfn>` (ambas obligatorias). [file:1]

### `<em>`

El elemento HTML `<em>` es el apropiado para marcar con énfasis las partes importantes de un texto. [file:1]  
El elemento `<em>` puede ser anidado, con cada nivel de anidamiento indicando un mayor grado de énfasis. [file:1]

### `<i>`

Sus etiquetas son: `<i>` y `</i>` (ambas obligatorias). [file:1]

### `<kbd>`

Sus etiquetas son: `<kbd>` y `</kbd>` (ambas obligatorias). [file:1]

### `<mark>`

El elemento HTML Mark `<mark>` representa un texto marcado o resaltado como referencia o anotación, debido a su relevancia o importancia en un contexto particular. [file:1]

### `<q>`

El elemento HTML `<q>` indica que el texto adjunto es una cita corta en línea. [file:1]  
La mayoría de los navegadores modernos implementan esto rodeando el texto entre comillas. [file:1]  
Este elemento está destinado a citas breves que no requieren saltos de párrafo; para citas de bloque independiente, utiliza el elemento `<blockquote>`. [file:1]

### `<rp>`

Se utiliza para proporcionar paréntesis alternativos para navegadores que no admiten la visualización de anotaciones Ruby mediante el elemento `<ruby>`. [file:1]  
Un elemento `<rp>` debe incluir cada uno de los paréntesis de apertura y cierre que envuelven el elemento `<rt>` que contiene el texto de la anotación. [file:1]

### `<rt>`

Especifica el componente de texto ruby de una anotación ruby, que se utiliza para proporcionar información de pronunciación, traducción o transliteración para la tipografía de Asia oriental. [file:1]  
El elemento `<rt>` siempre debe estar contenido dentro de un elemento `<ruby>`. [file:1]

### `<ruby>`

Representa pequeñas anotaciones que se muestran encima, debajo o al lado del texto base, generalmente utilizadas para mostrar la pronunciación de los caracteres de Asia oriental. [file:1]  
También se puede usar para anotar otros tipos de texto, pero este uso es menos común. [file:1]

### `<s>`

Sus etiquetas son: `<s>` y `</s>` (ambas obligatorias). [file:1]

### `<samp>`

El elemento HTML Sample (`<samp>`) se utiliza para incluir texto en línea que representa una muestra (o cita) de la salida de un programa de ordenador. [file:1]  
El contenido de esta etiqueta es renderizado generalmente usando la tipografía monoespaciada por defecto del navegador. [file:1]

### `<small>`

El elemento HTML `<small>` hace el tamaño del texto una talla más pequeña (por ejemplo, de largo a mediano, o de pequeño a extra pequeño) que el tamaño mínimo de fuente del navegador. [file:1]  
En HTML5, este elemento es reutilizado para representar comentarios laterales y letra pequeña, incluyendo derechos de autor y texto legal, independientemente de su estilo de presentación. [file:1]

### `<span>`

Sus etiquetas son: `<span>` y `</span>` (ambas obligatorias). [file:1]

### `<strong>`

Sus etiquetas son: `<strong>` y `</strong>` (ambas obligatorias). [file:1]

### `<sub>`

El elemento HTML `<sub>` define un fragmento de texto que se debe mostrar, por razones tipográficas, más bajo y generalmente más pequeño que el tramo principal del texto, es decir, en subíndice. [file:1]

### `<sup>`

El elemento HTML `<sup>` define un fragmento de texto que se debe mostrar, por razones tipográficas, más alto y generalmente más pequeño que el tramo principal del texto, es decir, en superíndice. [file:1]

### `<time>`

El elemento HTML `<time>` representa un periodo específico en el tiempo. [file:1]  
Puede incluir el atributo `datetime` para convertir las fechas en un formato interno legible por un ordenador, permitiendo mejores resultados en los motores de búsqueda o características personalizadas como recordatorios. [file:1]

### `<u>`

Sus etiquetas son: `<u>` y `</u>` (ambas obligatorias). [file:1]

### `<var>`

Sus etiquetas son: `<var>` y `</var>` (ambas obligatorias). [file:1]

### `<wbr>`

El elemento HTML word break opportunity `<wbr>` representa una posición dentro del texto donde el explorador puede opcionalmente saltar una línea, aunque sus reglas de salto de línea de otra manera no crearían un salto en esa posición. [file:1]  
En páginas codificadas en UTF-8, `<wbr>` se comporta como el punto de código U+200B ZERO-WIDTH SPACE. [file:1]  
En particular se comporta como un punto de código Unicode bidi BN, significando esto que no tiene efecto en ordenamiento bidi: `<div dir=rtl>123,<wbr>456</div>` muestra, cuando no se rompa en dos líneas, `123, 456` y no `456, 123`. [file:1]

---

# Imagen y multimedia

HTML soporta varios recursos multimedia como imágenes, audio y video. [file:1]

## Elemento | Descripción

### `<area>`

`area` de area = área. [file:1]

### `<audio>`

El elemento `<audio>` se usa para insertar contenido de audio en un documento HTML o XHTML. [file:1]  
El elemento `<audio>` se agregó como parte de HTML5. [file:1]

### `<img>`

El elemento de imagen HTML `<img>` representa una imagen en el documento. [file:1]

### `<map>`

Sus etiquetas son: `<map>` y `</map>` (ambas obligatorias). [file:1]

### `<track>`

El elemento HTML `<track>` se utiliza como elemento hijo de los elementos multimedia `<audio>` y `<video>`. [file:1]  
Le permite especificar pistas de texto cronometradas (o datos basados en el tiempo), por ejemplo, para manejar subtítulos automáticamente. [file:1]  
Las pistas están formateadas en formato WebVTT (archivos `.vtt`): Web Video Text Tracks. [file:1]

### `<video>`

El elemento `<video>` se utiliza para incrustar vídeos en un documento HTML o XHTML. [file:1]

---

# Contenido incrustado

Además de los contenidos multimedia habituales, HTML puede incluir otra variedad de contenidos, aunque no siempre es fácil de interactuar con ellos. [file:1]

## Elemento | Descripción

### `<embed>`

El elemento HTML Embed (`<embed>`) representa un punto de integración para una aplicación externa o de contenido interactivo (en otras palabras, un plug-in). [file:1]

### `<iframe>`

El elemento HTML `<iframe>` (de inline frame) representa un contexto de navegación anidado, el cual permite incrustar otra página HTML en la página actual. [file:1]

### `<object>`

El elemento HTML `<object>` representa un recurso externo, que puede ser tratado como una imagen, un contexto de navegación anidado o como un recurso que debe ser manejado por un plugin. [file:1]

### `<picture>`

El elemento HTML `<picture>` es un contenedor usado para especificar múltiples elementos `<source>` y un elemento `<img>` contenido en él para proveer versiones de una imagen para diferentes escenarios de dispositivos. [file:1]  
Si no hay coincidencias con los elementos `<source>`, el archivo especificado en los atributos `src` del elemento `<img>` es utilizado. [file:1]  
La imagen seleccionada es entonces presentada en el espacio ocupado por el elemento `<img>`. [file:1]

### `<portal>`

Habilita la incrustación de otra página HTML en la actual con el fin de permitir una navegación más fluida en nuevas páginas. [file:1]

### `<source>`

El elemento HTML `<source>` especifica recursos de medios múltiples para los elementos `<picture>`, `<audio>` o `<video>`. [file:1]  
Es un elemento vacío. Normalmente se utiliza para servir el mismo contenido multimedia en varios formatos soportados por diferentes navegadores. [file:1]

---

# SVG y MathML

Puede incrustar contenido SVG y MathML directamente en documentos HTML, usando los elementos `<svg>` y `<math>`. [file:1]

## Elemento | Descripción

### `<svg>`

El elemento `<svg>` es un contenedor que define un nuevo sistema de coordenadas y viewport. [file:1]  
Es usado como el elemento más externo de cualquier documento SVG, pero también puede ser usado para agregar un fragmento de un SVG dentro de un documento SVG o HTML. [file:1]

### `<math>`

`<math>` es el elemento superior en MathML. [file:1]  
Cada instancia válida de MathML debe estar rodeada de etiquetas `<math>`. [file:1]  
Además, no debes anidar un segundo elemento `<math>` dentro de un primero, pero puedes tener un número arbitrario de otros elementos hijos en él. [file:1]

---

# Scripting

Con el fin de crear contenido dinámico y aplicaciones web, HTML soporta el uso de lenguajes de scripting, el más prominente es JavaScript. [file:1]  
Ciertos elementos soportan esta capacidad. [file:1]

## Elemento | Descripción

### `<canvas>`

El elemento HTML canvas (`<canvas>`) se puede utilizar para dibujar gráficos a través de secuencias de comandos (por lo general JavaScript). [file:1]  
Por ejemplo, puede usarse para dibujar gráficos, hacer composiciones de fotos o incluso realizar animaciones. [file:1]

### `<noscript>`

Sus etiquetas son: `<noscript>` y `</noscript>` (ambas obligatorias). [file:1]

### `<script>`

Se utiliza para incrustar código ejecutable o datos; esto generalmente se usa para incrustar o hacer referencia al código JavaScript. [file:1]  
El elemento `<script>` también se puede usar con otros lenguajes, como el lenguaje de programación de sombreado GLSL de WebGL y JSON. [file:1]

---

# Ediciones demarcadas

Estos elementos permiten proporcionar indicios de que determinadas partes del texto han sido alteradas. [file:1]

## Elemento | Descripción

### `<del>`

Sus etiquetas son: `<del>` y `</del>` (ambas obligatorias). [file:1]

### `<ins>`

Sus etiquetas son: `<ins>` e `</ins>` (ambas obligatorias). [file:1]

---

# Tablas

Estos elementos son usados para crear y manejar datos tabulados. [file:1]

## Elemento | Descripción

### `<caption>`

Sus etiquetas son: `<caption>` y `</caption>` (ambas obligatorias). [file:1]

### `<col>`

Sus etiquetas son: `<col>` (solo tiene una). [file:1]

### `<colgroup>`

Sus etiquetas son: `<colgroup>` y `</colgroup>` (la de cierre es opcional). [file:1]

### `<table>`

El elemento de tabla HTML (`<table>`) representa datos en dos o más dimensiones. [file:1]

### `<tbody>`

Encapsula un conjunto de filas de una tabla (elementos `<tr>`), lo que indica que abarcan el cuerpo de la tabla (`<table>`). [file:1]

### `<td>`

El elemento HTML celda de tabla (`<td>`) define la celda de una tabla que contiene datos. Esta participa en el modelo de tablas. [file:1]

### `<tfoot>`

Define un conjunto de filas que resumen las columnas de la tabla. [file:1]

### `<th>`

El elemento HTML `<th>` define una celda como encabezado de un grupo de celdas en una tabla. [file:1]  
La naturaleza exacta de este grupo está definida por los atributos `scope` y `headers`. [file:1]

### `<thead>`

Define un conjunto de filas que definen el encabezado de las columnas de la tabla. [file:1]

### `<tr>`

El elemento HTML fila de tabla (`<tr>`) define una fila de celdas en una tabla. [file:1]  
Estas pueden ser una mezcla de elementos `<td>` y `<th>`. [file:1]

---

# Formularios

HTML provee un número de elementos que pueden usarse conjuntamente para crear formularios los cuales el usuario puede completar y enviar al sitio web o a una aplicación. [file:1]

## Elemento | Descripción

### `<button>`

`button` = botón. [file:1]

### `<datalist>`

El elemento HTML `<datalist>` contiene un conjunto de elementos `<option>` que representan los valores disponibles para otros controles. [file:1]

### `<fieldset>`

Sus etiquetas son: `<fieldset>` y `</fieldset>` (ambas obligatorias). [file:1]

### `<form>`

El elemento HTML form (`<form>`) representa una sección de un documento que contiene controles interactivos que permiten a un usuario enviar información a un servidor web. [file:1]

### `<input>`

El elemento HTML `<input>` se usa para crear controles interactivos para formularios basados en la web con el fin de recibir datos del usuario. [file:1]  
Hay disponible una amplia variedad de tipos de datos de entrada y widgets de control, que dependen del dispositivo y el agente de usuario (user agent). [file:1]  
El elemento `<input>` es uno de los más potentes y complejos en todo HTML debido a la gran cantidad de combinaciones de tipos y atributos de entrada. [file:1]

### `<label>`

El elemento HTML `<label>` representa una etiqueta para un elemento en una interfaz de usuario. [file:1]  
Este puede estar asociado con un control ya sea mediante la utilización del atributo `for`, o ubicando el control dentro del elemento `label`. [file:1]  
Tal control es llamado "el control etiquetado" del elemento `label`. [file:1]

### `<legend>`

Sus etiquetas son: `<legend>` y `</legend>` (ambas obligatorias). [file:1]

### `<meter>`

Representa un valor escalar dentro de un rango conocido o un valor fraccionario. [file:1]

### `<optgroup>`

Crea una agrupación de opciones dentro de un elemento `<select>`. [file:1]

### `<option>`

En un formulario web, el elemento HTML `<option>` se usa para representar un ítem dentro de un `<select>`, un `<optgroup>` o un elemento HTML5 `<datalist>`. [file:1]

### `<output>`

Elemento contenedor en el que un sitio o aplicación puede inyectar los resultados de un cálculo o el resultado de una acción del usuario. [file:1]

### `<progress>`

La etiqueta HTML `<progress>` se utiliza para visualizar el progreso de una tarea. [file:1]  
Aunque los detalles de cómo se muestra dependen del navegador del cliente, básicamente aparece una barra de progreso. [file:1]

### `<select>`

El elemento select (`<select>`) de HTML representa un control que muestra un menú de opciones. [file:1]  
Las opciones contenidas en el menú son representadas por elementos `<option>`, los cuales pueden ser agrupados por elementos `<optgroup>`. [file:1]  
La opción puede estar preseleccionada por el usuario. [file:1]

### `<textarea>`

El elemento HTML `<textarea>` representa un control para la edición multilínea de texto sin formato. [file:1]

---

# Elementos interactivos

HTML ofrece una selección de elementos que pueden ayudar a crear objetos de interfaz de usuario interactivos. [file:1]

## Elemento | Descripción

### `<details>`

El elemento HTML Details (`<details>`) es usado como un widget de revelación a través del cual el usuario puede obtener información adicional. [file:1]

### `<dialog>`

El elemento HTML `<dialog>` representa una caja de diálogo u otro componente interactivo, como inspector o ventana. [file:1]

### `<summary>`

Especifica un resumen, un título o una leyenda para el cuadro de información de un elemento de detalles. [file:1]  
Al hacer clic en el elemento `<summary>`, el estado del elemento principal `<details>` se abre y se cierra. [file:1]

---

# Componentes web

Los componentes web son una tecnología relacionada con HTML que hacen posible crear y personalizar elementos como si fueran HTML normal. [file:1]  
Además, pueden crear versiones personalizadas de los elementos HTML estándar. [file:1]

## Elemento | Descripción

### `<slot>`

El elemento HTML `<slot>` —parte de la suite tecnológica Web Components— es un placeholder en un componente que puedes llenar con tu propio marcado, que te permite crear árboles DOM por separado y presentarlos juntos. [file:1]

### `<template>`

El elemento HTML `<template>` es un mecanismo para mantener el contenido HTML del lado del cliente que no se renderiza cuando se carga una página, pero que posteriormente puede ser instanciado durante el tiempo de ejecución empleando JavaScript. [file:1]

---

# Elementos obsoletos y en desuso

Advertencia: Estos son elementos HTML viejos los cuales están obsoletos y no deben usarse. [file:1]  
Nunca deberías usarlos en un nuevo proyecto y deberías reemplazarlos en proyectos viejos tan pronto como sea posible. [file:1]  
Se listan aquí solo con propósitos informativos. [file:1]

## Elemento | Descripción

### `<acronym>`

Permite a los autores indicar claramente una secuencia de caracteres que componen un acrónimo o abreviatura de una palabra. [file:1]

### `<bgsound>`

El elemento HTML de sonido de fondo (`<bgsound>`) es un elemento de Internet Explorer que asocia un sonido de fondo con una página. [file:1]

### `<big>`

`big` de big = grande. [file:1]

### `<center>`

Sus etiquetas son: `<center>` y `</center>` (ambas obligatorias). [file:1]

### `<content>`

El elemento HTML `<content>` es usado dentro de un Shadow DOM como un punto de inserción. [file:1]  
No está pensado para ser usado en HTML ordinario. Es usado con Web Components. [file:1]

### `<dir>`

Sus etiquetas son: `<dir>` y `</dir>` (ambas obligatorias). [file:1]

### `<font>`

Sus etiquetas son: `<font>` y `</font>` (ambas obligatorias). [file:1]

### `<frame>`

Sus etiquetas son: `<frame>` (solo tiene una). [file:1]

### `<frameset>`

Sus etiquetas son: `<frameset>` y `</frameset>` (ambas obligatorias). [file:1]

### `<image>`

El elemento HTML `<image>` fue un elemento experimental diseñado para mostrar imágenes. [file:1]  
Nunca fue implementado y el elemento estándar `<img>` debe ser usado. [file:1]

### `<marquee>`

La etiqueta HTML `<marquee>` se utiliza para insertar un área de texto en movimiento. [file:1]  
También se la conoce como marquesina. [file:1]

### `<menuitem>`

Representa un comando que un usuario puede invocar a través de un menú emergente. [file:1]  
Esto incluye menús contextuales, así como menús que pueden adjuntarse a un botón de menú. [file:1]

### `<nobr>`

El elemento HTML `<nobr>` previene que una línea de texto se divida en una nueva línea, así, se presentará en una línea larga por lo que puede ser necesario hacer un desplazamiento de pantalla. [file:1]  
Esta etiqueta no es un estándar HTML y no debería ser usada; en su lugar usa la propiedad CSS `white-space`. [file:1]

### `<noembed>`

Proporciona contenido para ser presentado en navegadores que no admiten (o han desactivado la compatibilidad) con el elemento `<frame>`. [file:1]  
Aunque los navegadores más utilizados admiten marcos, existen excepciones, incluidos ciertos navegadores de uso especial, incluidos algunos navegadores móviles, así como navegadores en modo texto. [file:1]

### `<noframes>`

Sus etiquetas son: `<noframes>` y `</noframes>` (ambas obligatorias). [file:1]

### `<param>`

Sus etiquetas son: `<param>` (solo tiene una). [file:1]

### `<plaintext>`

Muestra todo lo que sigue a la etiqueta de inicio como texto sin formato, ignorando cualquier código HTML siguiente. [file:1]  
No hay una etiqueta de cierre, ya que todo lo que sigue se considera texto sin formato. [file:1]

### `<rb>`

Se utiliza para delimitar el componente de texto base de una anotación Ruby, es decir, el texto que se está anotando. [file:1]  
Un elemento `<rb>` debe envolver cada segmento atómico separado del texto base. [file:1]

### `<rtc>`

Adopta anotaciones semánticas de caracteres presentados en un rubí de elementos `<rb>` utilizados dentro del elemento `<ruby>`. [file:1]  
Los elementos `<rb>` pueden tener anotaciones de pronunciación (`<rt>`) y semánticas (`<rtc>`). [file:1]

### `<shadow>`

Una parte obsoleta de la suite de tecnología de Componentes Web que estaba pensada para ser utilizada como un punto de inserción en el shadow DOM. [file:1]  
Es posible que lo hayas utilizado si has creado varias raíces ocultas en un host oculto. [file:1]

### `<spacer>`

Permite la inserción de espacios vacíos en las páginas. [file:1]  
Fue diseñado por Netscape para lograr el mismo efecto que una imagen de diseño de un solo píxel. [file:1]  
Sin embargo, `<spacer>` ya no es compatible con ninguno de los principales navegadores y ahora se pueden lograr los mismos efectos usando CSS simple. [file:1]

### `<strike>`

Coloca un tachado (línea horizontal) sobre el texto. [file:1]

### `<tt>`

Sus etiquetas son: `<tt>` y `</tt>` (ambas obligatorias). [file:1]

### `<xmp>`

Muestra el texto entre las etiquetas de inicio y finalización sin interpretar el HTML intermedio y utilizando una fuente monoespaciada. [file:1]  
La especificación HTML2 recomendaba que se representara lo suficientemente ancho como para permitir 80 caracteres por línea. [file:1]
