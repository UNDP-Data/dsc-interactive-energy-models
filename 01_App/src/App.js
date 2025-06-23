import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const App = () => {
  const models = ["access001", "cost002", "pie003", "stack004", "multi005"];
  const [model, setModel] = useState(null);
  const [params, setParams] = useState({});
  const [option, setOption] = useState({});

  useEffect(() => {
    loadModel(models[0]);
  }, []);

  const loadModel = async (code) => {
    console.log("🔄 Loading model:", code);
    const res = await fetch(`/outputs/${code}.json`);
    const data = await res.json();
    setModel(data);
    const defaults = {};
    data.content.parameters.forEach(p => {
      defaults[p.symbol] = p.default;
    });
    console.log("📌 Default parameters:", defaults);
    setParams(defaults);
  };

useEffect(() => {
  if (!model) return;

  const fnName = model.content.functionName;
  const compute = window[fnName];

  if (!compute) {
    console.warn("⚠️ Compute function not found:", fnName);
    return;
  }

  console.log("📥 Calling compute function:", fnName, "with:", params);
  const result = compute(params);

  if (!result || !result.series || result.series.length === 0) {
    console.warn("⚠️ Compute result has invalid or empty series:", result);
  } else {
    console.log("✅ Compute result series:", result.series);
  }

  const type = result.series?.[0]?.type || "bar";
  let newOption = { ...model.content.option, series: result.series };

  if (result.xAxis && newOption.xAxis) {
    newOption.xAxis.data = result.xAxis;
  }

  if (type === "pie") {
    delete newOption.xAxis;
    delete newOption.yAxis;
  }

  console.log("📊 Final chart option to render:", newOption);
  setOption(newOption);
}, [model, params]);


  return (
    <div style={{ padding: 20 }}>
      <select onChange={e => loadModel(e.target.value)}>
        {models.map(m => <option key={m}>{m}</option>)}
      </select>

      {model && model.content.parameters.map(p => (
        <div key={p.symbol}>
          <label>{p.title}: {params[p.symbol]} {p.unit}</label>
          <input
            type="range"
            min={p.min}
            max={p.max}
            step={p.interval || 1}
            value={params[p.symbol]}
            onChange={e =>
              setParams({ ...params, [p.symbol]: parseFloat(e.target.value) })
            }
          />
        </div>
      ))}

      <ReactECharts option={option} style={{ height: 400 }} notMerge={true} />
    </div>
  );
};

export default App;
