# Banca 360 — Nexo Bank

Plataforma de banca en línea desarrollada como proyecto académico para la asignatura **Programación Orientada a la Web** de la Universidad Católica Andrés Bello (UCAB), Semestre 2-2025.

🌐 **Sitio en vivo:** [https://andresgbe.github.io/Nexo-Bank/](https://andresgbe.github.io/Nexo-Bank/)

---
## ✨ Funcionalidades

### 🔐 Autenticación y seguridad
- **Registro de usuarios** con validación estricta:
  - Cédula con formato venezolano (V-, E-, J-)
  - Contraseña de exactamente 6 dígitos numéricos
  - Confirmación de contraseña
  - Pregunta de seguridad obligatoria
- **Inicio de sesión** con spinner de carga de 2 segundos
- **Recuperación de contraseña** mediante pregunta de seguridad (flujo de 3 pasos)
- **Cierre de sesión** con pantalla de confirmación "Sesión finalizada"
- **Protección de rutas:** las páginas internas requieren sesión activa

### 🏦 Dashboard
- Visualización de **saldo actual** con funcionalidad de ocultar/mostrar
- Menú de navegación principal
- Resumen de las **últimas 3 transacciones** (clickeables)
- Accesos rápidos a transferencias, pago móvil y depósitos

### 💸 Operaciones bancarias
- **Transferencias** entre cuentas
- **Pago móvil** mediante datos telefónicos
- **Depósitos** para simular entrada de dinero
- Actualización automática del saldo y registro de cada operación

### 📊 Historial de movimientos
- Vista completa de todas las transacciones
- **Filtros rápidos:** Todos / Solo entradas / Solo salidas
- **Detalle individual** de cada transacción con información completa:
  - Referencia
  - ID de transacción
  - Tipo de operación
  - Dirección (entrada/salida)
  - Monto
  - Fecha y hora completa
  - Origen/Destino
  - Descripción

### 👤 Perfil y configuración
- Vista de perfil con avatar generado a partir de iniciales
- Edición de datos personales (nombre y correo)
- Cambio de contraseña con verificación de la actual
- Cierre de sesión seguro

### 🎨 Experiencia de usuario
- **Modo claro y modo oscuro** con persistencia entre sesiones
- Diseño limpio, profesional y responsive
- Animaciones sutiles y feedback visual en todas las interacciones

---

## 🛠️ Tecnologías utilizadas

- **HTML5** — Estructura semántica
- **CSS3** — Estilos con variables CSS para tematización
- **JavaScript (ES6+)** — Lógica de la aplicación sin frameworks
- **localStorage** — Persistencia client-side
---

## 📁 Estructura del proyecto

```
Nexo-Bank/
├── index.html                    # Login
├── pages/
│   ├── dashboard.html            # Dashboard principal
│   ├── transfer.html             # Transferencias
│   ├── mobile-payment.html       # Pago móvil
│   ├── deposit.html              # Depósitos
│   ├── history.html              # Historial de movimientos
│   ├── transaction-detail.html   # Detalle individual de transacción
│   ├── profile.html              # Perfil de usuario
│   ├── register.html             # Registro de usuarios
│   ├── recover.html              # Recuperación de contraseña
│   └── logout.html               # Pantalla de sesión finalizada
├── js/
│   ├── storage.js                # Capa de persistencia (localStorage)
│   ├── auth.js                   # Lógica de inicio de sesión
│   ├── auth-guard.js             # Protección de páginas internas
│   ├── theme.js                  # Modo claro/oscuro
│   ├── dashboard.js              # Lógica del dashboard
│   ├── transfer.js               # Lógica de transferencias
│   ├── mobile-payment.js         # Lógica de pago móvil
│   ├── deposit.js                # Lógica de depósitos
│   ├── history.js                # Lógica del historial
│   ├── transaction-detail.js     # Lógica del detalle
│   ├── profile.js                # Lógica del perfil
│   ├── register.js               # Lógica del registro
│   └── recover.js                # Lógica de recuperación
├── styles/
│   ├── main.css                  # Variables, reset y componentes globales
│   ├── auth.css                  # Estilos de páginas de autenticación
│   └── dashboard.css             # Estilos del dashboard y páginas internas
├── CHANGELOG.md                  # Registro de cambios
├── AI_USAGE.md                   # Documentación de uso de IA
└── README.md                     # Este archivo
```

---
## 🚀 Cómo ejecutar el proyecto

### Opción 1: Versión en vivo (recomendado)
Simplemente abre el siguiente enlace en tu navegador:

👉 **[https://andresgbe.github.io/Nexo-Bank/](https://andresgbe.github.io/Nexo-Bank/)**

### Opción 2: Ejecutar localmente
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Andresgbe/Nexo-Bank.git
   ```
2. Abre la carpeta del proyecto en tu editor.
3. Abre `index.html` en el navegador (o utiliza la extensión **Live Server** de VS Code).
---

## 👤 Usuario de prueba

Para probar el sistema rápidamente, puedes usar el usuario demo precargado:

| **Cédula** | `V-123456789 |
| **Contraseña** | `123456` |
| **Respuesta de seguridad** | `caracas` |
**Correo** | `samuelhermes@gmail.com` |

También puedes registrarte desde cero usando la opción **"Regístrate aquí"** en el login.

## 📌 Notas
- Toda la información se guarda en el `localStorage` del navegador. Si limpias los datos del navegador, perderás los usuarios y transacciones creadas.
- El proyecto es completamente del lado del cliente: no hay servidor ni base de datos.
- La aplicación está desplegada en **GitHub Pages**, por lo que está disponible 24/7 sin necesidad de servidor propio.