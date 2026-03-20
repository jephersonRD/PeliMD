# 🎬 PeliMD

Tu plataforma de películas favorita inspirada en Cuevana y Netflix, con un diseño moderno y profesional.

## ✨ Características

- 🎨 **Diseño oscuro con rojo dominante** - Estilo Netflix/Cuevana
- 📱 **Totalmente responsive** - Funciona en móvil y PC
- 🔍 **Búsqueda en tiempo real** - Encuentra películas al instante
- 🎞️ **Carruseles interactivos** - Navega por categorías
- ⭐ **Información completa** - Rating, descripción, cast y más
- 🎬 **Trailers** - Modal para ver trailers
- 🌐 **API de TMDb** - Datos actualizados de películas

## 🛠️ Tecnologías

- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- React Router
- Lucide Icons

## 🚀 Despliegue en GitHub Pages

### Opción 1: Automático con GitHub Actions (Recomendado)

1. Crea un repositorio en GitHub llamado `PeliMD`

2. Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/PeliMD.git
   git push -u origin main
   ```

3. Ve a **Settings** → **Pages** en tu repositorio

4. En **Source**, selecciona **GitHub Actions**

5. El workflow se ejecutará automáticamente y desplegará tu sitio

6. Tu sitio estará en: `https://TU_USUARIO.github.io/PeliMD/`

### Opción 2: Manual con gh-pages

1. Instala dependencias:
   ```bash
   npm install
   ```

2. Construye el proyecto:
   ```bash
   npm run build
   ```

3. Despliega:
   ```bash
   npx gh-pages -d dist
   ```

## 💻 Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/PeliMD.git
   cd PeliMD
   ```

2. Instala dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre http://localhost:5173 en tu navegador

## 📁 Estructura del Proyecto

```
PeliMD/
├── src/
│   ├── components/
│   │   ├── Header.tsx        # Navegación y búsqueda
│   │   ├── Hero.tsx          # Banner principal
│   │   ├── MovieCard.tsx     # Tarjeta de película
│   │   ├── MovieSection.tsx  # Sección con carrusel
│   │   ├── LoadingSpinner.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── HomePage.tsx      # Página principal
│   │   ├── MovieDetailPage.tsx
│   │   └── SearchPage.tsx
│   ├── services/
│   │   └── api.ts            # Servicio TMDb
│   ├── types/
│   │   └── movie.ts          # Tipos TypeScript
│   ├── styles/
│   │   └── main.css          # Estilos personalizados
│   ├── App.tsx
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions
├── index.html
├── package.json
└── vite.config.ts
```

## 🔌 API

Este proyecto utiliza [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api):

- **Populares**: `/movie/popular`
- **Tendencias**: `/trending/movie/week`
- **Mejor valoradas**: `/movie/top_rated`
- **En cartelera**: `/movie/now_playing`
- **Búsqueda**: `/search/movie`
- **Detalles**: `/movie/{id}`

## 🎨 Personalización

### Cambiar colores

Edita `src/styles/main.css` para modificar los colores principales:

```css
:root {
  --color-primary: #e50914;    /* Rojo principal */
  --color-primary-dark: #b20710;
  --color-primary-light: #ff1f2a;
}
```

### Cambiar nombre

El nombre "PeliMD" aparece en:
- `index.html` (título)
- `src/components/Header.tsx` (logo)

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 🙏 Créditos

- Datos de películas proporcionados por [TMDb](https://www.themoviedb.org/)
- Diseño inspirado en Cuevana y Netflix

---

**¡Disfruta de PeliMD! 🍿**
