# SolarÓptimo ☀️📉

Una aplicación web interactiva diseñada para calcular y optimizar la captación de irradiancia solar en distintas ciudades, aplicando conceptos fundamentales de cálculo diferencial.

Este proyecto nace como una demostración práctica de cómo las matemáticas aplicadas pueden integrarse en el desarrollo de software y la ingeniería para resolver problemas de eficiencia energética.

## 🚀 Características Principales

* **Optimización Matemática:** Utiliza derivadas para calcular el ángulo óptimo de inclinación de los paneles solares, maximizando la irradiancia captada.
* **Visualización de Datos:** Gráficos interactivos generados dinámicamente para ilustrar las curvas de rendimiento.
* **Datos Regionales:** Modelos de cálculo adaptados a diferentes ubicaciones y zonas geográficas.
* **100% Client-Side:** Arquitectura estática sin requerimientos de backend, garantizando velocidad y seguridad.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript Vanilla.
* **Librerías / Módulos:**
  * Algoritmos de cálculo matemático (`modelo.js`).
  * Renderizado de gráficos (`charts.js`).
* **Despliegue:** [Vercel](https://vercel.com/) (CI/CD).

## 📁 Estructura del Proyecto

El código está modularizado para mantener la escalabilidad y las buenas prácticas de desarrollo:

```text
solar-optimo/
├── index.html          # Interfaz principal de la aplicación
├── css/
│   └── styles.css      # Estilos y diseño responsivo
└── js/
    ├── main.js         # Lógica principal y manejo de eventos del DOM
    ├── modelo.js       # Modelos de cálculo y derivadas matemáticas
    ├── charts.js       # Generación de gráficos interactivos
    └── ciudades.js     # Base de datos local con parámetros de irradiancia