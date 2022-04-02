class Pie {

    constructor(_config, _data, _colorScale) {
      this.config = {
        parentElement: _config.parentElement,
        title: _config.title,
        containerWidth: _config.containerWidth || 200,
        containerHeight: _config.containerHeight || 200,
        margin: { top: 20, bottom: 30, right: 20, left: 20 }
      }
  
      this.data = _data;

      this.initVis();
    }
  
    initVis() {
        
        let vis = this;

        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.radius = Math.max(vis.width, vis.height) / 2 - 10; 

        vis.color = d3.scaleOrdinal()
            .range(['#28A75D',
                '#003300',
                '#00767E',
                '#7B8657',
                '#DEB887']);

        vis.pie = d3.pie();

        vis.pie.value(function (d) {
            return d.percent;
        });
        vis.pieData = vis.pie(vis.data);

        vis.arc = d3.arc()
            .outerRadius(vis.radius)
            .innerRadius(0)

        // We'll want a path and a text label for each slice, so first, we'll
        // create a group element:
        vis.parent = d3.select(vis.config.parentElement)
        vis.svg = vis.parent
            .append("g")
            .attr("transform", `translate(${vis.config.containerWidth/2}, ${vis.config.containerHeight/2})`)

        vis.groups = vis.svg.selectAll("g").data(vis.pieData)
            .enter()
            .append("g")

        vis.legendG = vis.parent.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
            .data(vis.pieData)
            .enter().append("g")
            .attr("transform", (d,i) => {return "translate(" + (120 * (i%2)) + "," + (vis.config.containerHeight - 30 + (15 * Math.floor((i+.1)/2))) + ")"})
            .attr("class", "legend");   

        console.log('piedata')
        console.log(vis.legendG)
        
        vis.legendG.append("rect") // make a matching color rect
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", (d) => vis.color(d.data.name));
        
        vis.legendG.append("text") // add the text
            .text((d) => d.data.name)
            .style("font-size", 12)
            .style("fill", "#fff")
            .attr("y", 10)
            .attr("x", 11);

        // Add the path, and use the arc generator to convert the pie data to
        // an SVG shape
        vis.tooltip = d3.select("#tooltip")
        vis.groups.selectAll("path").data(vis.pieData).join("path")
            .attr("d", vis.arc)
            // .attr("stroke", "black")
            // .attr("stroke-width", "1px")
            .style("fill", d => vis.color(d.data.name))
            .style('opacity', 1)
            .on('mouseenter', () => {
                vis.tooltip.style('display', 'block');
            })
            
            .on('mouseleave', () => {
                vis.tooltip.style('display', 'none');
            })
            .on('mousemove', function(event, d) {
                vis.tooltip
                .style('z-index', 1000000)
                .style('left', (event.pageX + 10) + 'px')   
                .style('top', (event.pageY + 10) + 'px')
                .html(`
                    <div class="tooltip-title">${d.data.name}</div>
                    <div><i>Percentage: ${d.data.percent.toFixed(2)} %</i></div>
                    <div><i>Count: ${d.data.count}</i></div>`
                    );
            });

        vis.title = vis.parent.append("text")
            .attr("x", (vis.width / 2))             
            .attr("y", 0 + (vis.config.margin.top / 2) + 5)
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("fill", "#fff")
            .text(vis.config.title);
    
        vis.updateVis();           
    }
  
   updateVis() { 
        let vis = this;

        // vis.groups.select("path").remove()
        vis.pieData = vis.pie(vis.data)
        // vis.groups.data = vis.pieData
        vis.groups.selectAll("path").data(vis.pieData).join("path")
            .transition().duration(1000)
            .attr("d", vis.arc);
   }
  
  
   //leave this empty for now...
   renderVis() { 
  
    }
  }