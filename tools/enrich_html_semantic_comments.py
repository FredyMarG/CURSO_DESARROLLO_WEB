# -*- coding: utf-8 -*-
"""
Segundo pase HTML: comentarios en español antes de la primera aparición de
etiquetas semánticas (header, nav, main, section, article, aside, footer, form).
Solo aplica si existe «CURSO_WEB_DOC_HTML v1» y aún no «CURSO_WEB_HTML_STRUCT v1».
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

MARKER_HTML = "CURSO_WEB_DOC_HTML v1"
STRUCT_SENTINEL = "CURSO_WEB_HTML_STRUCT v1"

ROOT = Path(__file__).resolve().parent.parent

TAG_COMMENTS: list[tuple[str, str]] = [
    ("header", "<!-- Cabecera de página o bloque (header): logo, título o accesos -->"),
    ("nav", "<!-- Menú o enlaces de navegación (nav) -->"),
    ("main", "<!-- Contenido principal del documento (main) -->"),
    ("section", "<!-- Sección temática de contenido (section) -->"),
    ("article", "<!-- Contenido autocontenido, p. ej. artículo o tarjeta (article) -->"),
    ("aside", "<!-- Contenido complementario (aside), barras laterales o notas -->"),
    ("footer", "<!-- Pie de página o de sección (footer) -->"),
    ("form", "<!-- Formulario de envío de datos (form) -->"),
]


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def insert_struct_sentinel(text: str) -> str:
    """Inserta una marca corta justo después del bloque de comentario inicial del curso."""
    pos = text.find(MARKER_HTML)
    if pos == -1:
        return text
    close = text.find("-->", pos)
    if close == -1:
        return text
    insert_at = close + len("-->")
    return text[:insert_at] + f"\n<!-- {STRUCT_SENTINEL} -->" + text[insert_at:]


def enrich(path: Path) -> str:
    text = read_text(path)
    if MARKER_HTML not in text[:4000]:
        return "sin_marca"
    if STRUCT_SENTINEL in text[:5000]:
        return "omitido"

    new = insert_struct_sentinel(text)
    for tag, comment in TAG_COMMENTS:
        if comment in new:
            continue
        pat = rf"(<{tag}\b[^>]*>)"
        new, _ = re.subn(pat, rf"\1\n{comment}\n", new, count=1, flags=re.I)

    write_text(path, new)
    return "actualizado"


def main() -> int:
    html_paths = sorted(p for p in ROOT.rglob("*.html") if "node_modules" not in p.parts)
    stats: dict[str, int] = {}
    for p in html_paths:
        r = enrich(p)
        stats[r] = stats.get(r, 0) + 1
    print(
        f"HTML estructural: {stats.get('actualizado', 0)} enriquecidos, "
        f"{stats.get('omitido', 0)} ya procesados, "
        f"{stats.get('sin_marca', 0)} sin marca del curso."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
