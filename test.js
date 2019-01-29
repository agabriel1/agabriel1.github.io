chart = {
  const root = pack(data);

  const svg = d3.select(DOM.svg(width, height))
      .style("font", "10px sans-serif")
      .style("width", "100%")
      .style("height", "auto")
      .attr("text-anchor", "middle");

  const node = svg.selectAll("g")
    .data(root.descendants())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => color(d.height));

  const leaf = node.filter(d => !d.children);
  
  leaf.select("circle")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("stroke", "#000");

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d);

  node.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
  return svg.node();
} 
