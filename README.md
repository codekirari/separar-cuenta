# División de Cuenta (Separar Cuenta)

Aplicación web desarrollada en **Next.js** para dividir cuentas de restaurantes o reuniones entre varias personas de forma rápida, transparente y sin errores, replicando la lógica de una hoja de cálculo colaborativa con soporte especial para **invitados** (personas cuyo consumo es cubierto por los demás asistentes).

---

## Características Principales

- **Gestión de Personas e Invitados:**
  - Agrega o elimina participantes en la mesa de forma dinámica.
  - Marca con un clic a uno o varios participantes como **Invitado** (por ejemplo, un cumpleañero). Su total a pagar será `$ 0` y su consumo (incluyendo impuestos y propina) se distribuirá automáticamente entre los anfitriones.
- **Matriz de Consumos tipo Excel:**
  - Edita productos, cantidades y precios unitarios en tiempo real.
  - Selecciona individualmente quiénes compartieron cada plato o bebida, o utiliza el botón **Todos** para dividir un ítem entre toda la mesa.
  - Alerta visual automática si algún ítem con valor mayor a `$ 0` no tiene consumidores asignados.
- **Cálculo de Impuestos, Propinas y Reglas de Reparto:**
  - Configura porcentajes personalizados o usa accesos rápidos para impuestos (`0%`, `8%` INC, `19%` IVA) y propina (`0%`, `10%`, `15%`).
  - Elige cómo repartir el gasto de los invitados entre quienes pagan:
    - **Partes iguales:** divide el total de los invitados equitativamente entre los anfitriones.
    - **Proporcional:** reparte el costo de los invitados según el porcentaje de consumo de cada anfitrión.
- **Liquidación y Compartir por WhatsApp:**
  - Desglose detallado por persona (consumo propio, impuestos/propina y aporte para invitados).
  - Botón para copiar un resumen formateado listo para pegar en WhatsApp o cualquier chat.

---

## Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Iconografía:** [Lucide React](https://lucide.dev/)

---

## Requisitos Previos

- **Node.js** 18.18 o superior
- **npm**, **yarn**, **pnpm** o **bun**

---

## Instalación y Ejecución Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/codekirari/separar-cuenta.git
   cd separar-cuenta

```

2. **Instala las dependencias:**
```bash
npm install

```


*(Asegúrate de tener instalado `lucide-react`; si no lo está, ejecútalo con `npm install lucide-react`).*
3. **Inicia el servidor de desarrollo:**
```bash
npm run dev

```


4. **Abre la aplicación en tu navegador:**
Visita [http://localhost:3000](http://localhost:3000).

---

## Estructura del Proyecto

La aplicación está organizada de forma modular para facilitar su mantenimiento y escalabilidad:

```text
app/
├── page.tsx                  # Estado principal, lógica de cálculo y vista general
└── components/               # (Opcional si separaste los componentes exportados)
    ├── BillHeader.tsx        # Encabezado con total general y botón de copiar resumen
    ├── PeopleManager.tsx     # Gestión de asistentes y estado de Invitado / Paga
    ├── ItemsTable.tsx        # Tabla interactiva de productos y asignación por persona
    ├── TaxTipSettings.tsx    # Configuración de impuestos, propinas y regla de reparto
    └── SettlementBreakdown.tsx # Liquidación individual detallada por participante

```

---

## Ejemplo de Uso

1. **Agrega a los asistentes** en la sección *Personas en la mesa* y marca como **Invitado** a quienes no vayan a pagar.
2. **Registra los productos** en la tabla *Detalle de Consumos* indicando cantidad, valor unitario y marcando las casillas de quienes consumieron cada ítem.
3. **Ajusta el impuesto y la propina** en el panel inferior izquierdo y selecciona si el consumo de los invitados se divide en partes iguales o de forma proporcional.
4. **Comparte el resultado** haciendo clic en **Copiar resumen** o **Compartir por WhatsApp** para enviar el desglose final al grupo.
