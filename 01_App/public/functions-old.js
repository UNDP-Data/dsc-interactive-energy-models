// === access001 ===
function compute_access001(params) {
  return {
    series: [
      {
        name: 'Access Index',
        type: 'bar',
        data: [(params.E / 100) * (params.H / 24)]
      },
      {
        name: 'Reliability Index',
        type: 'bar',
        data: [Math.min(1, params.H / 12)]
      }
    ],
    annotation: 'Access vs Reliability'
  };
}

// === cost002 ===
function compute_cost002(params) {
  const xs = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return {
    series: [
      {
        name: 'Total Cost',
        type: 'line',
        data: xs.map(x => [x, params.F * (100 / params.T)])
      }
    ],
    xAxis: xs,
    annotation: 'Clean Cooking Cost Curve'
  };
}

// === pie003 ===
function compute_pie003(params) {
  return {
    series: [
      {
        name: 'Energy Mix',
        type: 'pie',
        data: [
          { name: 'Renewables', value: params.R },
          { name: 'Fossils', value: params.F },
          { name: 'Nuclear', value: params.N }
        ]
      }
    ],
    annotation: 'Energy Mix Share'
  };
}

// === stack004 ===
function compute_stack004(params) {
  return {
    series: [
      {
        name: 'Solar',
        type: 'bar',
        stack: 'total',
        data: [params.S]
      },
      {
        name: 'Wind',
        type: 'bar',
        stack: 'total',
        data: [params.W]
      }
    ],
    annotation: 'Investment Stacks by Sector'
  };
}

// === multi005 ===
function compute_multi005(params) {
  const xs = Array.from({ length: 21 }, (_, i) => i * 5); // x from 0 to 100
  return {
    series: [
      {
        name: 'Sine Impact',
        type: 'line',
        data: xs.map(x => [x, (params.A / 100) * Math.sin(Math.PI * x / 100) * 10])
      },
      {
        name: 'Logarithmic Growth',
        type: 'line',
        data: xs.map(x => [x, (params.B / 100) * Math.log(x + 1)])
      }
    ],
    xAxis: xs,
    annotation: 'Multiline Test'
  };
}
