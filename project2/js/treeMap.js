// Source https://observablehq.com/@d3/zoomable-treemap



class TreeMap {

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
        this.height = 190;
        this.initVis();
    }
    
    zoomin(d) {
        let vis = this;
        let group0 = vis.group.attr("pointer-events", "none");
        let group1 = vis.group = vis.svg.append("g").call(vis.renderVis.bind(this), d);

        vis.x.domain([d.x0, d.x1]);
        vis.y.domain([d.y0, d.y1]);

        vis.svg.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
                .call(vis.position.bind(this), d.parent))
            .call(t => group1.transition(t)
                .attrTween("opacity", () => d3.interpolate(0, 1))
                .call(vis.position.bind(this), d));
    }

    zoomout(d) {
        let vis = this;
        let group0 = vis.group.attr("pointer-events", "none");
        let group1 = vis.group = vis.svg.insert("g", "*").call(vis.renderVis.bind(this), d.parent);
    
        vis.x.domain([d.parent.x0, d.parent.x1]);
        vis.y.domain([d.parent.y0, d.parent.y1]);
    
        vis.svg.transition()
            .duration(750)
            .call(t => group0.transition(t).remove()
              .attrTween("opacity", () => d3.interpolate(1, 0))
              .call(vis.position.bind(this), d))
            .call(t => group1.transition(t)
              .call(vis.position.bind(this), d.parent));
    }

    initVis() {
        let vis = this;

        let hierarchy = d3.stratify()
            .id(d => d.classification)
            .parentId(d => {
                if (d.classification == "root"){ return ""}
                if (d.classification.lastIndexOf("|") == -1){ return "root" };
                return d.classification.substring(0, d.classification.lastIndexOf("|"));
            })(vis.data)
            .sum(d => d.count)
            .sort((a, b) => b.count - a.count);
            
        vis.treemap = d3.treemap()
            .tile(vis.tile.bind(this))
            (hierarchy)

        vis.name = d => d.data.classification

        vis.format = d3.format(",d")

        vis.x = d3.scaleLinear().rangeRound([0, vis.width]);
        vis.y = d3.scaleLinear().rangeRound([0, vis.height]);

        vis.parentElement = d3.select(vis.config.parentElement)

        vis.svg = vis.parentElement.append("svg")
            .attr("viewBox", [0.5, -30.5, vis.width, vis.height + 30])
            .style("font", "10px sans-serif");

        vis.group = vis.svg.append("g")
            .call(vis.renderVis.bind(this), vis.treemap);
    }

    renderVis(group, root){
        let vis = this;

        let node = group
            .selectAll("g")
            .data(root.children.concat(root))
            .join("g");

        node.filter(d => d === root ? d.parent : d.children)
            .attr("cursor", "pointer")
            .on("click", (event, d) => d === root ? vis.zoomout(root) : vis.zoomin(d));

        node.append("rect")
            .attr("fill", d => d === root ? "#727272" : d.children ? "#28a75d" : "#aaa")
            .attr("stroke", "#fff");

        node.append("text")
            .attr("clip-path", d => d.clipUid)
            .attr("font-weight", d => d === root ? "bold" : null)
        .selectAll("tspan")
        .data(d => {console.log((d === root ? vis.name(d) : d.data.name).split(/(?=[A-Z][^A-Z][|])/g).concat(vis.format(d.value))); 
            return (d === root ? vis.name(d) : d.data.name).split(/(?=[A-Z][^A-Z][|])/g).concat(vis.format(d.value))})
        .join("tspan")
            .attr("x", 3)
            .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
            .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
            .attr("fill", "white")
            .text(d => d);
        group.call(vis.position.bind(this), root);
    }

    position(group, root) {
        let vis = this;
        group.selectAll("g")
            .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${vis.x(d.x0)},${vis.y(d.y0)})`)
          .select("rect")
            .attr("width", d => {console.log(d.x1); return d === root ? vis.width : vis.x(d.x1) - vis.x(d.x0)})
            .attr("height", d => d === root ? 30 : vis.y(d.y1) - vis.y(d.y0));
    }

    tile(node, x0, y0, x1, y1) {
        let vis = this;
        d3.treemapBinary(node, 0, 0, vis.width, vis.height);
        for (const child of node.children) {
          child.x0 = x0 + child.x0 / vis.width * (x1 - x0);
          child.x1 = x0 + child.x1 / vis.width * (x1 - x0);
          child.y0 = y0 + child.y0 / vis.height * (y1 - y0);
          child.y1 = y0 + child.y1 / vis.height * (y1 - y0);
        }
    }

    
}
