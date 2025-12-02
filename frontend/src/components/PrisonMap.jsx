import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function PrisonMap({ events, running, onEventLog }) {
  const ref = useRef();

  useEffect(() => {
    const el = d3.select(ref.current);
    el.selectAll("*").remove();
    const width = ref.current.clientWidth || 800;
    const height = ref.current.clientHeight || 600;

    const svg = el.append("svg")
      .attr("width", "100%")
      .attr("height", height);

    const zones = svg.selectAll("g.zone")
      .data(events)
      .enter().append("g")
      .attr("class", "zone")
      .attr("transform", (d,i) => `translate(${50 + i*100}, ${height/2 - 30})`);

    zones.append("rect")
      .attr("width", 80)
      .attr("height", 60)
      .attr("rx", 8)
      .attr("ry",8)
      .attr("fill", "#fff")
      .attr("stroke","#333");

    zones.append("text")
      .attr("x",40).attr("y",30)
      .attr("text-anchor","middle")
      .text(d => `L${d.layer}`)
      .style("font-weight","700");

    // animation: create a token that moves along zones
    let token = svg.append("circle").attr("r",10).attr("fill","#c53030").attr("cx",50).attr("cy", height/2);

    if (!running) return;

    // step through events sequentially
    (async function run() {
      for (let i=0;i<events.length;i++) {
        const targetX = 50 + i*100 + 40;
        await token.transition().duration(900).attr("cx", targetX).end();
        // emit a log for evaluation (mock latency & mapping flag)
        onEventLog({
          id: events[i].id,
          layer: events[i].layer,
          timestamp: new Date().toISOString(),
          latency: Math.random() * 200 + 50,
          mappedCorrect: true
        });
        await new Promise(r => setTimeout(r, 200));
      }
    })();

  }, [events, running, onEventLog]);

  return <div ref={ref} style={{width:"100%", height:"100%"}} />;
}
