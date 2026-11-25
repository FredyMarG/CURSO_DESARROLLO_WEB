# GUÍA COMPLETA — Instalación y Entorno de Node.js

> **Nivel:** Principiante → Intermedio  
> **Módulo:** 02 — Instalación y Entorno de Desarrollo  
> **Objetivo:** Instalar Node.js correctamente en Windows, comprender la diferencia entre versiones **LTS** y **Current**, administrar múltiples versiones con `nvm-windows`, resolver errores comunes de `PATH` y PowerShell, y configurar Visual Studio Code para trabajar en `la plataforma`.

---

## 1. Versiones de Node.js: LTS vs Current

Antes de descargar Node.js, verás dos botones principales en el sitio oficial (`nodejs.org`):

| Característica | **LTS (Long Term Support)** | **Current (Actual)** |
| :--- | :--- | :--- |
| Estabilidad | Muy alta, probada en producción | Incluye las últimas novedades experimentales |
| Soporte | Largo plazo (aprox. 30 meses) | Corto plazo (se actualiza con frecuencia) |
| Recomendado para | **Cursos, proyectos reales y producción** | Probar características muy recientes |

> **Regla práctica:** Para aprender y trabajar en proyectos estables, instala siempre la versión **LTS** (números pares, como `20.x`, `22.x` o `24.x`).

---

## 2. Métodos de instalación en Windows

### Opción A: Instalador oficial `.msi` (la más directa)
1. Ingresa a [https://nodejs.org](https://nodejs.org) y descarga el instalador **LTS** para Windows (64-bit).
2. Ejecuta el archivo `.msi` y sigue el asistente (*Next → Aceptar licencia → Next*).
3. Asegúrate de mantener marcada la opción **Add to PATH** (viene marcada por defecto).
4. Finaliza la instalación y **cierra y vuelve a abrir** tu terminal o VS Code.

### Opción B: Con `winget` desde PowerShell
Si tienes el gestor de paquetes de Windows (`winget`), puedes instalar Node.js LTS con un solo comando:

```powershell
winget install OpenJS.NodeJS.LTS
```

### Opción C: Con `nvm-windows` (recomendado si necesitas varias versiones)
**nvm-windows** (*Node Version Manager*) te permite tener varias versiones de Node.js instaladas y cambiar entre ellas sin conflictos:

```powershell
# Ver versiones disponibles para instalar
nvm list available

# Instalar la última versión LTS
nvm install lts

# Activar la versión instalada (ejemplo: 22.14.0)
nvm use 22.14.0

# Ver qué versiones tienes instaladas y cuál está activa (*)
nvm list
```

---

## 3. Verificar la instalación y el `PATH`

Abre una nueva terminal en PowerShell o en VS Code y ejecuta:

```powershell
node -v
npm -v
where.exe node
```

**Resultados esperados:**
- `node -v` → muestra algo como `v22.x.x` (o superior).
- `npm -v` → muestra la versión de `npm` (ej. `10.x.x`).
- `where.exe node` → muestra la ruta del ejecutable (ej. `C:\Program Files\nodejs\node.exe`).

---

## 4. Solución de errores comunes en Windows

### Error 1: `'node' no se reconoce como un comando interno o externo`
**Causa:** La terminal se abrió antes de instalar Node.js o el directorio de instalación no está en la variable de entorno `PATH`.  
**Solución:**
1. Cierra completamente VS Code / PowerShell y vuelve a abrirlo.
2. Si persiste, verifica en Windows: **Editar las variables de entorno del sistema → Variables de entorno → Path**, y confirma que exista `C:\Program Files\nodejs\`.

### Error 2: `No se puede cargar el archivo ... porque la ejecución de scripts está deshabilitada`
**Causa:** La política de seguridad de PowerShell (`ExecutionPolicy`) bloquea scripts `.ps1` como `npm.ps1`.  
**Solución:** Ejecuta en PowerShell (solo afecta a tu usuario actual):

```powershell
Get-ExecutionPolicy -Scope CurrentUser
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Error 3: Conflictos entre instalaciones previas
Si instalaste Node.js con `.msi` y luego quieres usar `nvm-windows`, desinstala primero Node.js desde **Configuración → Aplicaciones** para evitar que el sistema apunte a un binario antiguo.

---

## 5. Configurar el entorno en Visual Studio Code

1. Abre la carpeta de tu proyecto en VS Code (`Archivo → Abrir carpeta...`).
2. Abre la terminal integrada con **Ctrl + Ñ** (o `Terminal → Nuevo terminal`).
3. Inicializa un proyecto nuevo con:

```powershell
mkdir mi-primer-proyecto
cd mi-primer-proyecto
npm init -y
```

4. Revisa el `package.json` generado y agrega scripts útiles:

```json
{
  "name": "mi-primer-proyecto",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

> **Tip moderno:** Desde Node.js 18.11+, el flag `--watch` reinicia automáticamente tu archivo cada vez que guardas cambios, sin necesidad de instalar herramientas externas como `nodemon`. Y desde Node.js 20.6+ puedes cargar variables de entorno de forma nativa con `node --env-file=.env index.js` o `process.loadEnvFile()` dentro de tu código (sin instalar `dotenv`).

5. Crea un archivo `.gitignore` para no subir carpetas pesadas ni credenciales a Git:

```text
node_modules/
.env
```

---

## 6. Buenas prácticas del entorno

- **Usa siempre versión LTS** para proyectos de curso y producción.
- **Nunca subas `node_modules/` ni `.env`** a un repositorio Git.
- **Reinicia la terminal** después de instalar o cambiar de versión de Node.js.
- **Verifica `node -v` y `process.cwd()`** antes de ejecutar scripts que leen o escriben archivos.

---

## 7. Ejercicios por niveles y solucionario

### Nivel 1 — Verificación
1. Ejecuta `node -v`, `npm -v` y `where.exe node` en PowerShell.
2. Comprueba cuál es tu política de ejecución con `Get-ExecutionPolicy -Scope CurrentUser`.

### Nivel 2 — Proyecto inicial
1. Crea una carpeta `entorno-node`, inicializa `package.json` con `npm init -y` y agrega el script `"dev": "node --watch app.js"`.
2. Crea `app.js` que imprima la versión de Node.js (`process.version`) y la arquitectura (`process.arch`).

### Solucionario

```javascript
// app.js
console.log("Entorno listo para trabajar");
console.log("Versión de Node.js:", process.version);
console.log("Arquitectura:", process.arch);
console.log("Plataforma:", process.platform);
```

Ejecuta con:

```powershell
npm run dev
```

---

## 8. Hoja de trucos (Cheatsheet)

| Comando | Propósito |
| :--- | :--- |
| `node -v` | Muestra la versión activa de Node.js |
| `npm -v` | Muestra la versión activa de npm |
| `where.exe node` | Muestra la ruta exacta del ejecutable `node.exe` |
| `winget install OpenJS.NodeJS.LTS` | Instala Node.js LTS desde PowerShell |
| `nvm install lts` / `nvm use <ver>` | Instala y cambia versiones con `nvm-windows` |
| `npm init -y` | Crea `package.json` con valores por defecto |
| `node --watch index.js` | Ejecuta y reinicia al guardar cambios |
| `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` | Permite ejecutar scripts locales/npm en PowerShell |
