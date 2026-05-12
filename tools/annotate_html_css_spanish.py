# -*- coding: utf-8 -*-
"""
Añade comentarios didácticos en español a todos los .html y .css del curso.
Idempotente: si ya existe la marca del curso al inicio, no vuelve a modificar el archivo.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

MARKER_CSS = "CURSO_WEB_DOC_CSS v1"
MARKER_HTML = "CURSO_WEB_DOC_HTML v1"

ROOT = Path(__file__).resolve().parent.parent


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def css_header(rel: str, parent: str, stem: str) -> str:
    return (
        f"/*\n"
        f" * {MARKER_CSS}\n"
        f" * Archivo: {rel}\n"
        f" * Carpeta del tema: «{parent}». Hoja: «{stem}».\n"
        f" * Propósito: define la apariencia (colores, tipografía, cajas, disposición) de la página enlazada.\n"
        f" * Cómo leerlo: cada bloque `selector {{ ... }}` aplica estilos a los elementos del HTML que cumplan el selector.\n"
        f" */\n\n"
    )


def annotate_css(path: Path) -> str:
    text = read_text(path)
    if MARKER_CSS in text[:1200]:
        return "omitido"
    rel = path.relative_to(ROOT).as_posix()
    parent = path.parent.name
    stem = path.stem
    header = css_header(rel, parent, stem)

    lines = text.splitlines(keepends=True)
    out: list[str] = []
    prev_sig = ""
    for line in lines:
        s = line.strip()
        if s.startswith("@media") and "Consultas de medio" not in prev_sig:
            out.append("\n/* --- Consultas de medio (@media) --- */\n")
        elif s.startswith("@keyframes") and "Animación (@keyframes" not in prev_sig:
            name = ""
            parts = s.split()
            if len(parts) > 1:
                name = parts[1].split("{")[0].strip()
            out.append(f"\n/* --- Animación (@keyframes {name}) --- */\n")
        elif s.startswith("@font-face") and "Fuente web" not in prev_sig:
            out.append("\n/* --- Fuente web (@font-face) --- */\n")
        elif s.startswith("@supports") and "@supports" not in prev_sig:
            out.append("\n/* --- Capacidades del navegador (@supports) --- */\n")
        elif s.startswith("@import") and "Importación" not in prev_sig:
            out.append("\n/* --- Importación de otro CSS (@import) --- */\n")
        elif s.startswith("@layer") and "@layer" not in prev_sig:
            out.append("\n/* --- Capas en cascada (@layer) --- */\n")
        out.append(line)
        if s and not s.startswith("//"):
            prev_sig = s[:120]
    write_text(path, header + "".join(out))
    return "actualizado"


def html_doc_block(rel: str, title: str) -> str:
    return (
        f"<!-- {MARKER_HTML}\n"
        f"     Archivo: {rel}\n"
        f"     Título: {title}\n"
        f"     Propósito: estructura semántica y contenido; el navegador interpreta estas etiquetas para mostrar la página.\n"
        f"     Relación: clases e IDs enlazan con archivos .css y .js de esta misma carpeta o rutas indicadas.\n"
        f"-->\n\n"
    )


def annotate_html(path: Path) -> str:
    text = read_text(path)
    if MARKER_HTML in text[:2000]:
        return "omitido"
    rel = path.relative_to(ROOT).as_posix()
    m = re.search(r"<title>\s*(.*?)\s*</title>", text, re.I | re.S)
    title = (m.group(1).strip() if m else "") or path.stem.replace("_", " ").replace("-", " ")
    block = html_doc_block(rel, title)

    m2 = re.search(r"<!doctype[^>]*>", text, re.I)
    if m2:
        insert_at = m2.end()
        new_text = text[:insert_at] + "\n" + block + text[insert_at:]
    else:
        new_text = block + text

    if re.search(r"<head[^>]*>", new_text, re.I) and "Cabecera (head)" not in new_text[:3500]:
        new_text = re.sub(
            r"(<head[^>]*>)",
            r"\1\n<!-- Cabecera (head): metadatos, título y enlaces a CSS, JS o fuentes -->\n",
            new_text,
            count=1,
            flags=re.I,
        )

    if re.search(r"<body[^>]*>", new_text, re.I) and "Cuerpo (body)" not in new_text[:6000]:
        new_text = re.sub(
            r"(<body[^>]*>)",
            r"\1\n<!-- Cuerpo (body): contenido visible en la ventana del navegador -->\n",
            new_text,
            count=1,
            flags=re.I,
        )

    if re.search(r"</html\s*>", new_text, re.I) and "Cierre del documento HTML" not in new_text[-800:]:
        new_text = re.sub(
            r"</html\s*>",
            "<!-- Cierre del documento HTML -->\n</html>",
            new_text,
            count=1,
            flags=re.I,
        )

    write_text(path, new_text)
    return "actualizado"


def main() -> int:
    css_paths = sorted(p for p in ROOT.rglob("*.css") if "node_modules" not in p.parts)
    html_paths = sorted(p for p in ROOT.rglob("*.html") if "node_modules" not in p.parts)

    stats = {"css": {"actualizado": 0, "omitido": 0}, "html": {"actualizado": 0, "omitido": 0}}

    for p in css_paths:
        r = annotate_css(p)
        stats["css"][r] = stats["css"].get(r, 0) + 1

    for p in html_paths:
        r = annotate_html(p)
        stats["html"][r] = stats["html"].get(r, 0) + 1

    print(f"CSS: {stats['css']['actualizado']} actualizados, {stats['css']['omitido']} ya documentados.")
    print(f"HTML: {stats['html']['actualizado']} actualizados, {stats['html']['omitido']} ya documentados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
