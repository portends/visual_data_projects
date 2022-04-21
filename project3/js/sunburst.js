// Source: https://observablehq.com/@d3/zoomable-sunburst

class SunBurst {

    /**
     * Class constructor with basic configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
        this.config = {
        parentElement: _config.parentElement,
        }
        this.data = _data;
        this.width = 925;
        this.radius = this.width/6;
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.partition = data => {
            const root = d3.hierarchy(data)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])
            (root);
        }
        console.log("children", vis.data.children.length)
        vis.color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, vis.data.children.length + 1))

        vis.format = d3.format(",d")

        vis.arc = d3.arc()
          .startAngle(d => d.x0)
          .endAngle(d => d.x1)
          .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
          .padRadius(vis.radius * 1.5)
          .innerRadius(d => d.y0 * vis.radius)
          .outerRadius(d => Math.max(d.y0 * vis.radius, d.y1 * vis.radius - 1))

        vis.root = vis.partition(vis.data);
  
        vis.root.each(d => d.current = d);

        console.log(vis.root)
      
        vis.svg = d3.select(vis.config.parentElement)
      
        vis.g = vis.svg.append("g")
            .attr("transform", `translate(${vis.width / 2},${vis.width / 2})`);
      
        vis.path = vis.g.append("g")
          .selectAll("path")
          .data(vis.root.descendants().slice(1))
          .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return vis.color(d.data.name); })
            // .attr("fill", "red")
            .attr("fill-opacity", d => vis.arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => vis.arcVisible(d.current) ? "auto" : "none")
      
            .attr("d", d => vis.arc(d.current));
      
        vis.path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", vis.clicked.bind(this));
      
        vis.path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${vis.format(d.value)}`);
      
        vis.label = vis.g.append("g")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .style("user-select", "none")
          .selectAll("text")
          .data(vis.root.descendants().slice(1))
          .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +vis.labelVisible(d.current))
            .attr("transform", d => vis.labelTransform(d.current))
            .text(d => d.data.name);
      
        vis.parent = vis.g.append("circle")
            .datum(vis.root)
            .attr("r", vis.radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", vis.clicked.bind(this));
    }

    updateVis() {
        let vis = this;
    }

    clicked(event, p) {
      let vis = this;
      console.log(p)
      console.log("root", vis.root)
      vis.parent.datum(p.parent || vis.root);
  
      vis.root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });
  
      const t = vis.g.transition().duration(750);
  
      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      vis.path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || vis.arcVisible(d.target);
        })
          .attr("fill-opacity", d => vis.arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attr("pointer-events", d => vis.arcVisible(d.target) ? "auto" : "none") 
  
          .attrTween("d", d => () => vis.arc(d.current));
  
      vis.label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || vis.labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +vis.labelVisible(d.target))
          .attrTween("transform", d => () => vis.labelTransform(d.current));
    }
    
    arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }
  
    labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }
  
    labelTransform(d) {
      let vis = this;
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2 * vis.radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
}
    // return svg.node();