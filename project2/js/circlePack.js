// Source https://observablehq.com/@d3/zoomable-circle-packing

class CirclePack {

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
        this.width = 270;
        this.height = 270;
        this.initVis();
    }
    
    /**
     * We initialize scales/axes and append static elements, such as axis titles.
     */
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
            
        vis.root = d3.pack()
            .size([vis.width, vis.height])
            .padding(3)(hierarchy)

        
        vis.color = d3.scaleLinear()
            .domain([0, 5])
            .range(["#A3F5CF", "#475485"])

        vis.focus = vis.root;
        vis.view;

        vis.parentElement = d3.select(vis.config.parentElement)
        
        vis.svg = vis.parentElement.append("svg")
            .attr("viewBox", `-${vis.width / 2} -${vis.height / 2} ${vis.width} ${vis.height}`)
            .style("display", "block")
            .style("margin", "0 -14px")
            .style("background", vis.color(0))
            .style("cursor", "pointer")
            .on("click", (event) => vis.zoom(event, vis.root));
        
        vis.node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => d.children ? vis.color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => vis.focus !== d && (vis.zoom(event, d), event.stopPropagation()));
        
        vis.label = vis.svg.append("g")
            .style("font", "10px sans-serif")
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
            .selectAll("text")
            .data(vis.root.descendants())
            .join("text")
            .style("fill-opacity", d => d.parent === vis.root ? 1 : 0)
            .style("display", d => d.parent === vis.root ? "inline" : "none")
            .text(d => d.data.name);
        
        vis.zoomTo([vis.root.x, vis.root.y, vis.root.r * 2]);
        

        // vis.updateVis();
    }
    
    // updateVis() {

    // }

    zoom(event, d) {
        let vis = this
        const focus0 = vis.focus;
    
        vis.focus = d;
    
        const transition = vis.svg.transition()
            .duration(event.altKey ? 7500 : 750)
            .tween("zoom", d => {
            const i = d3.interpolateZoom(vis.view, [vis.focus.x, vis.focus.y, vis.focus.r * 2]);
            return t => vis.zoomTo(i(t));
            });
    
        vis.label
            .filter(function(d) { return d.parent === vis.focus || this.style.display === "inline"; })
            .transition(transition)
                .style("fill-opacity", d => d.parent === vis.focus ? 1 : 0)
                .on("start", function(d) { if (d.parent === vis.focus) this.style.display = "inline"; })
                .on("end", function(d) { if (d.parent !== vis.focus) this.style.display = "none"; });
    }

    zoomTo(v) {
        let vis = this
        const k = vis.width / v[2];
    
        vis.view = v;

        vis.label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        vis.node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
        vis.node.attr("r", d => d.r * k);
    }

    
}
