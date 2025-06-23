# 🌐 Interactive Energy Models Pipeline

This project enables dynamic generation of chart-ready, parametric visualizations for sustainable energy education. The backend pipeline takes structured CSV inputs and generates:

- **Model JSON files** (`/public/outputs/*.json`) for each model
- A single `functions.js` script containing JavaScript `compute_*()` functions for frontend use

These are rendered dynamically in a chart-agnostic React frontend using [ECharts](https://echarts.apache.org/).

---

## 🧠 Overview

The system allows you to define simple mathematical models through two inputs:

- **Parameter CSV**: defines user-adjustable variables
- **Function CSV**: defines output expressions and chart usage

The Python pipeline then compiles these into frontend-ready visualizations with sliders, tooltips, and annotations.

---

## 📁 File Structure

```
interactive-models/
│
├── 01_Inputs/
│   ├── models.csv                # Registry of all models
│   ├── parameters/<code>.csv     # Parameters per model
│   └── functions/<code>.csv      # Output expressions per model
│
├── 02_Processing/
│   └── generate.py               # Main processing pipeline
│
├── 01_App/
│   └── public/
│       ├── functions.js          # All compute_* functions
│       └── outputs/*.json        # Chart metadata + config per model
```

---

## 🔧 Input Format

### 🟢 `models.csv`

| code      | title                 | summary                             |
|-----------|-----------------------|-------------------------------------|
| access001 | Energy Access Model   | Shows relationship between electrification and hours of supply |

---

### 🟦 `<code>-parameters.csv`

This defines all **user inputs** for the model.

| symbol | title          | type        | min | max | default | interval | description         | unit |
|--------|----------------|-------------|-----|-----|---------|----------|---------------------|------|
| A      | Access %       | discrete    | 0   | 100 | 60      | 10       | % population access | %    |
| B      | Hours/Day      | discrete    | 0   | 24  | 10      | 1        | Daily supply        | hrs  |

Supported `type` values:
- `discrete`: Single slider with steps
- `continuous`: Slider with fine control
- `range`: Defines both `symbol_min` and `symbol_max`
- `x-axis`: Used as domain in line/multiline charts (automatically generates an array of values)

---

### 🟨 `<code>-functions.csv`

This defines each **output equation** and how it is visualized.

| output_symbol | title              | js_equation                                  | chart_usage         | unit | target | direction | description               |
|---------------|--------------------|----------------------------------------------|----------------------|------|--------|-----------|---------------------------|
| AI            | Access Index       | (A / 100) * (B / 24)                          | bar_category         | 0-1  | 0.8    | above     | Combined access metric    |
| RI            | Reliability Index  | Math.min(1, B / 12)                           | bar_category         | 0-1  | 0.75   | above     | Supply regularity         |

Valid `chart_usage` options:
- `bar_category`: Single bar per value
- `bar_stack_component`: Stacked bar chart
- `y_value`: Generates line chart over x-axis
- `segment_value`: For pie charts

---

## 🧾 Output Format

### 📘 JSON (`/outputs/<code>.json`)

```json
{
  "template_id": "model",
  "color_scheme": "dark",
  "content": {
    "functionName": "compute_access001",
    "title": "Energy Access Model",
    "description": "Shows relationship between electrification and hours of supply",
    "latex-functions": ["AI = \frac{A}{100} \cdot \frac{B}{24}"],
    "option": {
      "xAxis": { "type": "category" },
      "yAxis": { "type": "value" },
      "tooltip": { "trigger": "axis" },
      "series": []
    },
    "parameters": [ ... ],
    "outputs": [ ... ]
  }
}
```

### 📘 JavaScript (`/functions.js`)

```js
function compute_access001(params) {
  const series = [];
  series.push({ name: 'Access Index', type: 'bar', data: [ (params.A / 100) * (params.B / 24) ] });
  series.push({ name: 'Reliability Index', type: 'bar', data: [ Math.min(1, params.B / 12) ] });
  return { series, annotation: "Energy Access Model" };
}
```

Line or multiline models with an `x-axis` input generate:

```js
const xs = [0, 5, 10, ..., 100];
const y_Access = xs.map(x => [x, (params.A / 100) * Math.sin(Math.PI * x / 100)]);
```

---

## ⚙️ Frontend Usage

- Renders dropdown to choose model
- Dynamically builds sliders from parameter list
- Runs `compute_<code>()` from `functions.js` on parameter change
- Injects returned series and `xAxis` (if present) into ECharts config

---

## 🧱 Scalability Notes

- Add new models by simply creating CSVs for parameters and functions and registering them in `models.csv`
- `functions.js` is fully regenerated on pipeline run — no manual edits needed
- Expression parsing uses `substitute_js_vars()` to safely convert variable names to `params.<symbol>`

---

## 🚀 Run the Pipeline

```Open the notebook and run the main cell
```


---

## 🧪 Sample Models

- `access001`: Basic bar chart
- `multi005`: Multiline chart with 2 expressions over `x`
- `pie003`: Pie chart showing energy mix
- `stack004`: Stacked bar components

---
