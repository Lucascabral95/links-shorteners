<p align="center">
  <img src="https://nestjs.com/img/logo_text.svg" alt="NestJS Logo" width="320"/>
</p>

# Link Shortener API

## Descripción general

Link Shortener API es una aplicación robusta y escalable desarrollada con [NestJS](https://nestjs.com/) y TypeScript para acortar, gestionar y analizar enlaces. Permite a los usuarios transformar URLs largas en enlaces cortos y manejables, con funcionalidades avanzadas como alias personalizados, protección por contraseña, seguimiento de clics y autenticación segura de usuarios.

---

## ⚙️ Características Principales

- **Gestión de Usuarios y Autenticación:** Registro de usuarios local (email/password) o mediante Google (OAuth 2.0). Autenticación segura basada en JWT.
- **Sistema de Roles:** Roles de usuario (ADMIN, PREMIUM, FREE) para gestionar permisos y acceso a funcionalidades.
- **Acortamiento de Enlaces:** Genera enlaces cortos con códigos únicos o permite el uso de alias personalizados.
- **Funcionalidades Avanzadas de Enlaces:**
  - **Protección con Contraseña:** Asegura tus enlaces para que solo usuarios autorizados puedan acceder.
  - **Fecha de Expiración:** Configura enlaces para que dejen de funcionar después de una fecha específica.
  - **Edición y Gestión:** Modifica el título, la descripción y la URL original de tus enlaces.
- **Analíticas de Clics:** Rastreo detallado de cada clic, capturando dirección IP, agente de usuario, país, ciudad, dispositivo y navegador.
- **Recuperación de Contraseña:** Flujo seguro para el reseteo de contraseñas a través de correo electrónico con un link que espira en 5 minutos.
- **Documentación Interactiva:** API completamente documentada y testeable mediante Swagger (OpenAPI).
- **Validación de Datos:** Uso de `class-validator` y `class-transformer` para DTOs robustos y seguros.

---

## 🚀 Tecnologías Utilizadas

- **Backend:** [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **Autenticación:** [JWT (jsonwebtoken)](https://jwt.io/), [Passport](http://www.passportjs.org/) (`passport-jwt`, `passport-google-oauth20`), [bcrypt](https://www.npmjs.com/package/bcrypt)
- **API Docs:** [Swagger](https://swagger.io/)
- **Testing:** [Jest](https://jestjs.io/), [Supertest](https://www.npmjs.com/package/supertest)
- **Contenerización:** [Docker](https://www.docker.com/)
- **Manejo de Emails:** [Nodemailer](https://nodemailer.com/)
- **Análisis de User-Agent:** [ua-parser-js](https://www.npmjs.com/package/ua-parser-js)
- **Variables de Entorno:** [dotenv](https://www.npmjs.com/package/dotenv), [Joi](https://joi.dev/)
- **Linting & Formatting:** [ESLint](https://eslint.org/), [Prettier](https://prettier.io/)

---

## Tabla de contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/Lucascabral95/links-shorteners.git
   cd links-shorteneres
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Copia el archivo `.env.template` a `.env`.
   - Completa todas las variables requeridas, como la URL de la base de datos y las credenciales de Google.

4. **Configura la base de datos:**
   - Asegúrate de que tu instancia de PostgreSQL esté en funcionamiento.
   - Ejecuta las migraciones de Prisma para crear las tablas:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```

5. **Compila el proyecto:**
   ```bash
   npm run build
   ```

---

## Uso

### Modo Desarrollo

```bash
npm run start:dev
```

### Modo Producción

```bash
npm run start:prod
```

### Documentación de la API

Una vez que la aplicación esté en funcionamiento, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:PORT/api
```

(Reemplaza `PORT` con el puerto que configuraste en tu archivo `.env`)

---

## Estructura del proyecto

```
links-shorteneres/
│
├── src/                   # Código fuente principal de la aplicación
│   ├── auth/              # Lógica de autenticación (JWT, Google, Guards)
│   ├── links/             # Módulo para la gestión de enlaces
│   ├── clicks/            # Módulo para la gestión de clics
│   ├── users/             # Módulo para la gestión de usuarios
│   ├── analytics/         # Módulo para la gestión de analíticas avanzadas del proyecto
│   ├── config/            # Gestión avanzada de variables de entorno y configuración
│   └── utils/             # Módulo para la gestión avanzada de errores provienientes de Prisma
│
├── prisma/                # Esquema y migraciones de base de datos
│   ├── schema.prisma
│   └── migrations/
│
├── .env.template          # Plantilla de variables de entorno
├── package.json           # Dependencias y scripts de npm
├── Dockerfile             # Configuración para construir la imagen Docker
├── docker-compose.yml     # Orquestación de contenedores Docker
├── .gitignore             # Archivos ignorados por Git
├── README.md              # Este archivo
└── ...otros archivos de configuración
```

---

## Contribuciones

¡Las contribuciones son bienvenidas!

1. Haz un fork del repositorio.
2. Crea una rama para tu feature o fix (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y escribe pruebas si es necesario.
4. Haz commit y push a tu rama (`git commit -m "Agrega nueva funcionalidad"`).
5. Abre un Pull Request describiendo tus cambios.

---

## Licencia

Este proyecto está bajo la licencia UNLICENSED.

---

## 📬 Contacto

- **Autor:** Lucas Cabral
- **LinkedIn:** [https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/](https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/)
- **Portfolio:** [https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/](https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/)
- **Github:** [https://github.com/Lucascabral95](https://github.com/Lucascabral95/)
