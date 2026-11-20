# HOSTING

## ¿Qué es un Hosting?

Un hosting es un servicio que permite almacenar los archivos de un sitio
web en un servidor conectado a internet 24/7 para que cualquier persona
pueda acceder a él mediante un navegador.

Cuando un usuario entra a un dominio: 1. El navegador consulta el DNS.
2. Obtiene la dirección IP del servidor. 3. Se conecta al servidor. 4.
El servidor responde enviando los archivos del sitio (HTML, CSS, JS,
imágenes, backend, etc.).

------------------------------------------------------------------------

## Conceptos Fundamentales

### Dominio

Es el nombre legible del sitio web (ej: midominio.com).\
Se conecta al hosting mediante registros DNS (A, CNAME, MX, TXT).

### Servidor

Es la máquina física o virtual donde se almacenan los archivos del
sitio.

### DNS

Sistema que traduce un dominio en una dirección IP.

### Recursos del Hosting

-   Espacio en disco (HDD, SSD, NVMe)
-   RAM
-   CPU
-   Transferencia mensual
-   Bases de datos
-   Correos electrónicos
-   Conexiones simultáneas

------------------------------------------------------------------------

# Tipos de Hosting

## 1. Hosting Compartido

Un servidor aloja múltiples sitios web.

Ventajas: - Bajo costo - Fácil de usar - Incluye panel gráfico (cPanel)

Desventajas: - Recursos compartidos - Menor rendimiento bajo alta carga

Ideal para: - Blogs - Portafolios - Pequeñas empresas

------------------------------------------------------------------------

## 2. VPS (Virtual Private Server)

Servidor virtual con recursos dedicados dentro de un servidor físico.

Ventajas: - Mayor control - Recursos asignados - Mejor rendimiento

Desventajas: - Requiere conocimientos técnicos - Costo mayor que
compartido

Ideal para: - Aplicaciones web - APIs - E-commerce

------------------------------------------------------------------------

## 3. Servidor Dedicado

Un servidor completo exclusivo para un solo cliente.

Ventajas: - Máximo rendimiento - Control total - Alta seguridad

Desventajas: - Alto costo - Administración avanzada

------------------------------------------------------------------------

## 4. Hosting en la Nube (Cloud Hosting)

Infraestructura distribuida en múltiples servidores.

Ventajas: - Alta disponibilidad - Escalable - Pago por uso

Desventajas: - Configuración más compleja - Costos variables

------------------------------------------------------------------------

## 5. Hosting WordPress

Optimizado específicamente para sitios WordPress.

Incluye: - Caché optimizada - Seguridad específica - Actualizaciones
automáticas

------------------------------------------------------------------------

## 6. Hosting Reseller

Permite revender servicios de hosting a terceros.

------------------------------------------------------------------------

## 7. Hosting Gratuito

Opciones sin costo, con limitaciones en rendimiento y profesionalismo.

------------------------------------------------------------------------

## 8. PaaS (Platform as a Service)

Plataformas que permiten desplegar aplicaciones sin administrar
servidores.

------------------------------------------------------------------------

## Características Clave a Evaluar

-   Tipo de disco (SSD/NVMe recomendado)
-   Uptime mínimo 99.9%
-   Certificado SSL incluido
-   Backups automáticos
-   Soporte 24/7
-   Ubicación del servidor

------------------------------------------------------------------------

# Conceptos Técnicos Avanzados

## cPanel

Panel gráfico para administrar hosting compartido.

## SSH

Acceso remoto por terminal al servidor.

## FTP

Protocolo para transferir archivos.

## Cron Jobs

Tareas programadas automáticas.

## Bases de Datos

MySQL y PostgreSQL principalmente.

## Escalabilidad

Capacidad de crecer sin migraciones complejas.

------------------------------------------------------------------------

# Hosting Moderno: Estático, Serverless y Edge (2024–2026)

Hoy en día la mayoría de proyectos frontend y fullstack modernos no usan FTP ni cPanel, sino **plataformas conectadas a Git** con CDN global y despliegue automático:

| Plataforma | Ideal para | Ventaja clave |
| :--- | :--- | :--- |
| **GitHub Pages** | Sitios estáticos (HTML/CSS/JS), portafolios, docs | Gratis, directo desde tu repositorio GitHub |
| **Cloudflare Pages** | Sitios estáticos y Edge Workers | Ancho de banda ilimitado y red global ultra rápida |
| **Netlify** | Sitios estáticos, Jamstack, formularios y Functions | Deploy Previews automáticos, Netlify Forms y Blobs |
| **Vercel** | Next.js, React, Astro, Vite y Frontend moderno | Optimización automática de imágenes, SSR y Edge |
| **Railway** | Backends persistentes (Node, Python, Postgres, Redis) | Despliegue simple de servidores, APIs y bases de datos |

---

# Infraestructura Web Esencial

## 1. Registros DNS Fundamentales

| Registro | Función | Ejemplo |
| :--- | :--- | :--- |
| `A` | Apunta un dominio a una dirección **IPv4** | `miweb.com → 93.184.216.34` |
| `AAAA` | Apunta un dominio a una dirección **IPv6** | `miweb.com → 2606:2800:220:1:...` |
| `CNAME` | Alias de un subdominio hacia otro nombre de dominio | `www.miweb.com → cname.vercel-dns.com` |
| `MX` | Define los servidores de correo electrónico del dominio | `10 mail.proveedor.com` |
| `TXT` | Verificación de dominio y seguridad de correo (SPF, DKIM, DMARC) | `"v=spf1 include:_spf.google.com ~all"` |
| `CAA` | Especifica qué autoridades pueden emitir certificados SSL/TLS | `0 issue "letsencrypt.org"` |

## 2. HTTPS, TLS 1.3 y Seguridad
- **HTTPS** cifra la comunicación entre navegador y servidor mediante **TLS 1.3** (sucesor moderno de SSL).
- Hoy es gratuito y automático gracias a **Let's Encrypt** en casi todos los hostings modernos.
- Es **obligatorio** para SEO, confianza del usuario, HTTP/2 y HTTP/3, y APIs del navegador (Geolocation, Camera, Clipboard, Service Workers).

## 3. CDN (Content Delivery Network) y Edge Computing
- **CDN:** Replica tus archivos estáticos (HTML, CSS, JS, imágenes) en cientos de servidores (*PoPs*) alrededor del mundo para servirlos desde el nodo más cercano al usuario, reduciendo la latencia y el **TTFB** (*Time To First Byte*).
- **Edge Computing:** Permite ejecutar lógica ligera (redirecciones, autenticación, geolocalización, A/B testing) directamente en el nodo del CDN cercano al usuario antes de llegar al servidor origen.

## 4. CI/CD (Integración y Despliegue Continuo)
1. Haces `git push` a GitHub/GitLab.
2. El hosting (o GitHub Actions) ejecuta automáticamente `npm run build`, pruebas y linters.
3. Genera una **Preview URL** única por cada Pull Request para validar cambios antes de pasar a producción.

## 5. Core Web Vitals y Rendimiento del Hosting
El hosting influye directamente en las métricas de experiencia de Google:
- **LCP (*Largest Contentful Paint*, < 2.5s):** Mejora con CDN rápido, HTTP/3 y compresión **Brotli/Gzip**.
- **INP (*Interaction to Next Paint*, < 200ms):** Depende del JS en el cliente y respuesta rápida de APIs.
- **CLS (*Cumulative Layout Shift*, < 0.1):** Evita saltos visuales reservando dimensiones de imágenes/fuentes.

---

# Errores Comunes al Publicar un Sitio

1. **Subir archivos por FTP manualmente en producción:** Propenso a errores y sin historial; usa Git + CI/CD.
2. **Olvidar `index.html` en la raíz o rutas con mayúsculas/minúsculas:** Los servidores Linux distinguen `Imagen.jpg` de `imagen.jpg` (causa error `404` aunque en Windows funcionara).
3. **Configurar rutas absolutas locales (`C:\Users\...` o `/carpeta` sin considerar subrutas):** Rompe CSS, imágenes y enlaces al subir a GitHub Pages.
4. **No configurar redirección SPA (`/* → /index.html` con status 200):** En apps React/Vue, recargar una ruta devuelve `404`.
5. **Dejar claves secretas (`.env`, API keys) en el código frontend:** Todo lo que llega al navegador es público.

---

# Buenas Prácticas de Despliegue

- Usa **Git + despliegues automáticos** (Preview Deploys en ramas y producción en `main`).
- Activa **HTTPS forzado**, compresión **Brotli** y cabeceras de caché (`Cache-Control`) para assets estáticos con hash.
- Configura una página `404.html` personalizada.
- Mantén todas las rutas de archivos relativas (`./css/styles.css`) o bien configuradas respecto a la raíz del sitio.
- Monitorea Core Web Vitals y accesibilidad con **PageSpeed Insights** o **Lighthouse** tras cada despliegue.

---

# Hoja de Trucos (Cheatsheet) — Hosting y Despliegue Web

| Concepto | Descripción |
| :--- | :--- |
| DNS (`A`, `AAAA`, `CNAME`, `TXT`, `CAA`) | Traduce dominios a IPs, verifica propiedad y autoriza SSL |
| HTTPS / TLS 1.3 | Cifra el tráfico; obligatorio para SEO y Web APIs modernas |
| CDN & Edge | Distribuye contenido cerca del usuario reduciendo el TTFB |
| CI/CD + Preview Deploys | Automatiza build, tests y publicación en cada `git push` |
| Core Web Vitals | LCP (< 2.5s), INP (< 200ms), CLS (< 0.1) |
| Archivo `index.html` | Punto de entrada por defecto servido en la raíz `/` |
| Plataformas modernas | GitHub Pages, Cloudflare Pages, Netlify, Vercel, Railway |
