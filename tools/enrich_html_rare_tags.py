# -*- coding: utf-8 -*-
"""
Tercer pase HTML: comentarios MUY específicos en español antes de la primera
aparición de etiquetas menos habituales (formularios, medios, tablas, ruby,
edits, etc.). Requiere «CURSO_WEB_DOC_HTML v1». Idempotente con
«CURSO_WEB_HTML_RARE v1». No modifica archivos .md (este script no los toca).
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

MARKER_HTML = "CURSO_WEB_DOC_HTML v1"
RARE_SENTINEL = "CURSO_WEB_HTML_RARE v1"
STRUCT_SENTINEL = "CURSO_WEB_HTML_STRUCT v1"

ROOT = Path(__file__).resolve().parent.parent

# Etiqueta (minúscula) -> comentario HTML (una sola línea; evita «--» dentro del texto)
# Descripciones orientadas a estándar HTML Living Standard / uso práctico en navegadores.
RARE_TAG_COMMENTS: list[tuple[str, str]] = [
    (
        "abbr",
        "<!-- abbr: marca una abreviatura o sigla; use el atributo title para dar la expansión o descripción larga al pasar el cursor o para tecnologías de apoyo. -->",
    ),
    (
        "address",
        "<!-- address: agrupa datos de contacto o autoria relacionados con el articulo o la pagina; el navegador suele renderizarlo en cursiva, pero el significado es semantico, no solo visual. -->",
    ),
    (
        "base",
        "<!-- base: fija la URL base y el destino por defecto de enlaces y formularios; solo puede haber uno por documento y debe ir dentro de head antes de URLs relativas que dependan de el. -->",
    ),
    (
        "bdi",
        "<!-- bdi: aisla un trozo de texto cuya direccionalidad (izquierda a derecha o derecha a izquierda) es desconocida; evita que numeros o textos en hebreo/arabe rompan el orden del parrafo circundante. -->",
    ),
    (
        "bdo",
        "<!-- bdo: fuerza la direccion de escritura del contenido interno con el atributo dir; no infiere del idioma, sobrescribe el algoritmo bidireccional del navegador. -->",
    ),
    (
        "blockquote",
        "<!-- blockquote: cita en bloque procedente de otra fuente; suele combinarse con cite o footer para atribucion; es contenido citado, no solo texto indentado. -->",
    ),
    (
        "cite",
        "<!-- cite: titulo de una obra (libro, pelicula, ensayo); no es la persona que habla, sino el nombre de la obra referenciada. -->",
    ),
    (
        "data",
        "<!-- data: vincula contenido visible con un valor maquina legible en value (precio, id, fecha interna) sin mostrar ese valor al usuario salvo que usted lo estilice. -->",
    ),
    (
        "del",
        "<!-- del: marca contenido borrado o invalidado en una revision de documento; util datetime para cuándo ocurrio el borrado. -->",
    ),
    (
        "ins",
        "<!-- ins: marca contenido insertado o añadido en una revision; complementa a del para mostrar diferencias aprobadas. -->",
    ),
    (
        "dfn",
        "<!-- dfn: indica el termino que se define en ese contexto; la definicion suele estar en el parrafo cercano; ayuda a glosarios accesibles. -->",
    ),
    (
        "kbd",
        "<!-- kbd: representa entrada de teclado o nombre de tecla; accesibilidad y guias de usuario distinguen kbd de texto normal. -->",
    ),
    (
        "samp",
        "<!-- samp: salida literal de un programa, consola o sistema; distingue lo que «imprime» la maquina de lo que escribe el usuario (kbd). -->",
    ),
    (
        "var",
        "<!-- var: nombres de variables o placeholders matematicos; no ejecuta codigo, solo semantica de variable en prosa tecnica. -->",
    ),
    (
        "sub",
        "<!-- sub: subindice para formulas, indices quimicos o notas al pie inline; el navegador reduce tamaño y baja la linea base. -->",
    ),
    (
        "sup",
        "<!-- sup: superindice para exponentes, marcas registradas o referencias; reduce tamaño y sube la linea base. -->",
    ),
    (
        "time",
        "<!-- time: fecha u hora legible con atributo datetime en formato ISO; permite a buscadores y agendas interpretar el instante exacto. -->",
    ),
    (
        "mark",
        "<!-- mark: resalta texto relevante en el contexto actual (resultado de busqueda, citas resaltadas); no es un simple color decorativo arbitrario. -->",
    ),
    (
        "ruby",
        "<!-- ruby: contenedor de anotaciones de pronunciacion tipicas de idiomas asiaticos; combina bases con rt/rp. -->",
    ),
    (
        "rt",
        "<!-- rt: texto de anotacion ruby (lectura) asociado al segmento base inmediato; suele mostrarse encima o al lado segun CSS. -->",
    ),
    (
        "rp",
        "<!-- rp: parentesis de respaldo cuando el motor no puede mostrar ruby; mejora degradacion en navegadores antiguos. -->",
    ),
    (
        "wbr",
        "<!-- wbr: oportunidad opcional de salto de linea dentro de una palabra larga (URL, DNA); no fuerza salto, solo lo permite. -->",
    ),
    (
        "details",
        "<!-- details: widget desplegable nativo; el contenido oculto se muestra al interactuar; no requiere JavaScript para abrir o cerrar. -->",
    ),
    (
        "summary",
        "<!-- summary: titulo visible y clicable del widget details; debe ser primer hijo directo o el comportamiento puede variar segun motor. -->",
    ),
    (
        "dialog",
        "<!-- dialog: cuadro modal o no modal nativo; showModal() crea capa superior y bloquea interaccion con el fondo hasta cerrar. -->",
    ),
    (
        "datalist",
        "<!-- datalist: lista de sugerencias enlazada a un input mediante list=id; no restringe valores, solo autocompleta opciones. -->",
    ),
    (
        "optgroup",
        "<!-- optgroup: agrupa opciones dentro de select con etiqueta label y posibilidad de deshabilitar todo el grupo con disabled. -->",
    ),
    (
        "fieldset",
        "<!-- fieldset: agrupa controles relacionados de un formulario; mejora accesibilidad y disposicion visual con legend obligatorio recomendado. -->",
    ),
    (
        "legend",
        "<!-- legend: titulo accesible del fieldset; lector de pantalla anuncia el grupo usando este texto. -->",
    ),
    (
        "output",
        "<!-- output: muestra resultado de calculos o validaciones asociadas a formulario con atributos for/name; no sustituye a un input. -->",
    ),
    (
        "progress",
        "<!-- progress: barra de progreso de tarea conocida o desconocida; value y max fijan fraccion completada cuando es determinada. -->",
    ),
    (
        "meter",
        "<!-- meter: valor escalar dentro de un rango conocido (p. ej. uso de disco); no es barra de progreso de tarea, sino medidor de magnitud. -->",
    ),
    (
        "picture",
        "<!-- picture: contenedor de imagen adaptativa con varios source y un img final; el navegador elige segun media, type y tamaño. -->",
    ),
    (
        "source",
        "<!-- source: origen candidato de audio, video o imagen; atributos srcset, sizes, media y type dirigen la seleccion del recurso. -->",
    ),
    (
        "track",
        "<!-- track: pistas de subtitulos, capitulos o descripciones para video; kind y srclang identifican el rol y el idioma. -->",
    ),
    (
        "template",
        "<!-- template: fragmento HTML inerte en el arbol hasta clonarlo con JavaScript; no carga imagenes ni ejecuta scripts internos hasta instanciarse. -->",
    ),
    (
        "canvas",
        "<!-- canvas: superficie de mapa de bits 2D o WebGL dibujada por scripts; no es SVG vectorial; requiere API Canvas para pintar. -->",
    ),
    (
        "svg",
        "<!-- svg: graficos vectoriales escalables con modelo DOM propio; admite formas, texto y animacion SMIL o CSS segun soporte. -->",
    ),
    (
        "map",
        "<!-- map: define regiones clicables sobre una imagen asociada por usemap; contiene elementos area con coords y shape. -->",
    ),
    (
        "area",
        "<!-- area: region hipervinculo dentro de map; shape rect/circle/poly y coords definen la zona sensible al clic. -->",
    ),
    (
        "iframe",
        "<!-- iframe: documento embebido de otro URL; sandbox, allow y referrerpolicy endurecen seguridad y permisos del contenido remoto. -->",
    ),
    (
        "noscript",
        "<!-- noscript: contenido alternativo solo cuando JavaScript esta desactivado o no disponible; no ejecuta scripts internos. -->",
    ),
    (
        "select",
        "<!-- select: control de eleccion entre opciones exclusivas o multiples segun multiple; size cambia presentacion lista o desplegable. -->",
    ),
    (
        "textarea",
        "<!-- textarea: entrada multilinea de texto plano; rows y cols sugieren dimension; wrap controla saltos al enviar. -->",
    ),
    (
        "label",
        "<!-- label: rotula un control; for enlaza por id o envuelve el input para ampliar zona clicable y mejorar accesibilidad. -->",
    ),
    (
        "caption",
        "<!-- caption: titulo o leyenda de una tabla; debe ser primer hijo de table; mejora comprension tabular para lectores de pantalla. -->",
    ),
    (
        "colgroup",
        "<!-- colgroup: agrupa columnas para aplicar estilos o anchos con col hijas sin repetir celdas td/th. -->",
    ),
    (
        "col",
        "<!-- col: describe atributos de una columna dentro de colgroup; span abarca varias columnas consecutivas. -->",
    ),
    (
        "thead",
        "<!-- thead: bloque de filas de cabecera de tabla; suele repetirse al imprimir o al hacer scroll segun CSS del motor. -->",
    ),
    (
        "tbody",
        "<!-- tbody: agrupa el cuerpo de filas de datos; permite separar semanticamente cabecera, cuerpo y pie. -->",
    ),
    (
        "tfoot",
        "<!-- tfoot: pie de tabla con totales o notas; el motor puede fijarlo al final visualmente incluso si el markup aparece antes del cuerpo. -->",
    ),
    (
        "figure",
        "<!-- figure: unidad autocontenida de figura o media con leyenda opcional figcaption; agrupa imagen, codigo o video con su explicacion. -->",
    ),
    (
        "figcaption",
        "<!-- figcaption: leyenda o descripcion de figure; puede ir al inicio o al final del grupo segun diseno deseado. -->",
    ),
]

# Eliminar duplicados de etiqueta conservando el primero (picture estaba duplicado a proposito arriba, quitar ultima entrada duplicada)
_seen: set[str] = set()
DEDUPED_RARE: list[tuple[str, str]] = []
for tag, comment in RARE_TAG_COMMENTS:
    if tag in _seen:
        continue
    _seen.add(tag)
    DEDUPED_RARE.append((tag, comment))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def insert_rare_sentinel(text: str) -> str:
    if RARE_SENTINEL in text[:8000]:
        return text
    anchor = f"<!-- {STRUCT_SENTINEL} -->"
    idx = text.find(anchor)
    insert_at: int | None = None
    if idx != -1:
        insert_at = idx + len(anchor)
    else:
        pos = text.find(MARKER_HTML)
        if pos == -1:
            return text
        close = text.find("-->", pos)
        if close == -1:
            return text
        insert_at = close + len("-->")
    return text[:insert_at] + f"\n<!-- {RARE_SENTINEL} -->" + text[insert_at:]


def enrich_rare(path: Path) -> str:
    text = read_text(path)
    if MARKER_HTML not in text[:6000]:
        return "sin_marca"
    if RARE_SENTINEL in text[:9000]:
        return "omitido"

    new = insert_rare_sentinel(text)
    for tag, comment in DEDUPED_RARE:
        if comment in new:
            continue
        pat = rf"(<{tag}\b[^>]*>)"
        new, n = re.subn(pat, rf"\1\n{comment}\n", new, count=1, flags=re.I)
    write_text(path, new)
    return "actualizado"


def main() -> int:
    html_paths = sorted(p for p in ROOT.rglob("*.html") if "node_modules" not in p.parts)
    stats: dict[str, int] = {}
    for p in html_paths:
        r = enrich_rare(p)
        stats[r] = stats.get(r, 0) + 1
    print(
        f"HTML etiquetas raras: {stats.get('actualizado', 0)} enriquecidos, "
        f"{stats.get('omitido', 0)} ya procesados, "
        f"{stats.get('sin_marca', 0)} sin marca del curso."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
