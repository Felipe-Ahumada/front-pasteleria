# 🍰 Pastelería Mil Sabores - Frontend

Aplicación web desarrollada con **React + TypeScript + Bootstrap** que permite a los usuarios navegar, seleccionar y comprar productos de la pastelería “Mil Sabores”. Forma parte del proyecto académico de **Duoc UC**.

## 📝 Descripción General
Este proyecto corresponde al **frontend** de la aplicación **Pastelería Mil Sabores**, desarrollado como parte de la asignatura *Diseño y Construcción de Soluciones Nativas en Nube*.

El sistema permite:
- Visualizar catálogo de productos (tortas, pasteles, promociones).
- Gestionar carrito de compras.
- Registrar y autenticar usuarios.
- Panel de administración para gestión de productos, usuarios y pedidos.
- Blog de noticias y comentarios.


## 🧱 Tecnologías Utilizadas
- ⚛️ React 18 + TypeScript
- 🎨 Bootstrap 5.3 + Bootstrap Icons
- ⚡ Vite
- 📦 Node.js + npm
- 📡 Axios (Comunicación HTTP)

[![Programming Skills](https://skillicons.dev/icons?i=html,css,bootstrap,react,typescript)](https://skillicons.dev)

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v18 o superior)
- npm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/felruizrojas/front-pasteleria.git
   cd front-pasteleria
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Backend**
   Asegúrate de que el backend esté ejecutándose en `http://localhost:8080`.
   La configuración de la URL base se encuentra en `src/config/axiosConfig.ts`.

4. **Ejecutar el proyecto**
   ```bash
   npm run dev
   ```

5. **Acceder a la aplicación**
   👉 http://localhost:5173

## 📜 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Compila la aplicación para producción.
- `npm run lint`: Ejecuta el linter para buscar errores de código.
- `npm run preview`: Vista previa de la build de producción.

## ✨ Funcionalidades

### Cliente
- **Catálogo**: Ver productos por categorías.
- **Carrito**: Agregar/eliminar productos, ver total.
- **Checkout**: Proceso de compra (simulado).
- **Perfil**: Ver y editar datos personales, ver historial de pedidos.
- **Blog**: Leer noticias y dejar comentarios.

### Administración (Admin/SuperAdmin)
- **Dashboard**: Resumen de ventas y estadísticas.
- **Gestión de Productos**: Crear, editar y eliminar productos.
- **Gestión de Usuarios**: Ver usuarios, cambiar roles, desactivar cuentas.
- **Gestión de Pedidos**: Ver pedidos y cambiar estados.

## 📂 Estructura del Proyecto

```text
front-pasteleria/
├── public/
└── src/
    ├── assets/             # Imágenes y recursos estáticos
    ├── components/         # Componentes reutilizables
    │   ├── common/         # Botones, Inputs, Modales, etc.
    │   └── menu/           # Componentes del menú
    ├── config/             # Configuraciones (Axios, etc.)
    ├── context/            # Contextos de React (Auth, Theme, Cart)
    ├── data/               # Datos estáticos (si aplica)
    ├── hooks/              # Custom Hooks
    ├── layouts/            # Layouts de páginas (Main, Admin, Auth)
    ├── pages/              # Vistas de la aplicación
    │   ├── admin/          # Panel de administración
    │   ├── auth/           # Login, Registro, Recuperar contraseña
    │   ├── blog/           # Blog y detalle
    │   ├── cart/           # Carrito de compras
    │   ├── checkout/       # Proceso de pago
    │   ├── home/           # Página de inicio
    │   ├── menu/           # Catálogo de productos
    │   ├── orders/         # Historial de pedidos
    │   └── profile/        # Perfil de usuario
    ├── routes/             # Definición de rutas y protección
    ├── service/            # Servicios de API (UserService, ProductService, etc.)
    ├── types/              # Definiciones de tipos TypeScript
    └── utils/              # Utilidades y validaciones
```

## 🎨 Paleta de Colores

| Color             | Hex       | Uso principal |
| ---               | ---       | --- |
| Rosa frutilla     | `#f7b7d1` | Botones, acentos primarios |
| Verde menta       | `#bfe2d5` | Botones secundarios, detalles suaves |
| Título principal  | `#D67BA8` | Encabezados y marca |
| Título secundario | `#5AA58D` | Subtítulos y enlaces destacados |

## 👨‍💻 Autores
- Felipe Ahumada
- Felipe Ruiz

## 📜 Licencia
Este proyecto fue desarrollado con fines académicos para Duoc UC.