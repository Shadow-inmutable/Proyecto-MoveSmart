# Arquitectura del sistema

## Enfoque
El sistema utiliza una arquitectura monolítica modular basada en el patrón MVC, con posibilidad de migración futura a microservicios.

## Arbol de directorios
/Proyecto-MoveSmart
│
├── /backend
│   ├── /config          # Conexión DB
│   ├── /controllers     # Lógica de negocio (Cálculos)
│   ├── /models          # Consultas SQL
│   ├── /routes          # Endpoints API
│   ├── /utils           # Funciones de ayuda (Matemáticas)
│   ├── .env             # Datos sensibles (Ignorado por Git)
│   └── server.js        # Inicio del servidor
│
├── /frontend
│   ├── /public          # Imágenes y assets
│   ├── /src
│   │   ├── /components  # UI (Interfaz de Usuario)
│   │   ├── /map         # Leaflet logic
│   │   ├── /services    # Conexión con Backend (Fetch/Axios)
│   │   ├── /hooks       # Lógica de estado compartida
│   │   └── App.js       # Componente raíz
│
├── docs/
│   ├── introduccion.md  / problema-solucion.md  / objetivos-alcance.md 
│   ├── arquitectura.md
│   ├── backlog.md  / scrum.md 
└── README.md

## Backend
- Entonrno de ejecucion Node.js
- Express
- API REST

## Frontend
- React JS (Web)
- React Native (futuro)
- Libreria de mapa leafflet.js

## Control de versionamiento
- Git/Gitub

## Base de datos
- MySQL

## Comunicación
El frontend consume la API REST para obtener datos simulados y visualizarlos mediante gráficos y mapas conceptuales.

## Estandares
- clean code
- SOLID

## Requerimientos
- Visualización de Red Vial
- Gestión de Paradas
- Simulación de Optimización
- Panel de Métricas:
- Identificación de Zonas Críticas
- Gestión de Usuarios