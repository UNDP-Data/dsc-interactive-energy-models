import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

const models = ["access001", "cost002", "pie003", "stack004", "multi005"];

const App = () => {
  const [model, setModel] = useState(null);
  const [params, setParams] = useState({});
  const [option, setOption] = useState({});

  useEffect(() => {
    loadModel(models[0]);
  }, []);

  const loadModel = async (code) => {
    const res = await fetch(`/outputs/${code}.json`);
    const data = await res.json();
    setModel(data);
    setParams(Object.fromEntries(data.content.parameters.map(p => [p.symbol, p.default])));
  };

  useEffect(() => {
    if (!model) return;
    const compute = window[model.content.functionName];
    if (!compute) return;

    const result = compute(params);
    if (!result?.series?.length) return;

    const isPie = result.series[0].type === "pie";
    const newOption = {
      ...model.content.option,
      series: result.series,
      ...(result.xAxis && !isPie ? { xAxis: { ...model.content.option.xAxis, data: result.xAxis } } : {}),
    };

    if (isPie) {
      delete newOption.xAxis;
      delete newOption.yAxis;
    }

    setOption(newOption);
  }, [model, params]);

  return (
    <div style={{ padding: 20 }}>
      <select onChange={e => loadModel(e.target.value)}>
        {models.map(m => <option key={m}>{m}</option>)}
      </select>

      {model?.content.parameters.map(p => (
        <div key={p.symbol}>
          <label>{p.title}: {params[p.symbol]} {p.unit}</label>
          <input
            type="range"
            min={p.min}
            max={p.max}
            step={p.interval || 1}
            value={params[p.symbol]}
            onChange={e => setParams({ ...params, [p.symbol]: parseFloat(e.target.value) })}
          />
        </div>
      ))}

      <ReactECharts option={option} style={{ height: 400 }} notMerge />
    </div>
  );
};

export default App;
