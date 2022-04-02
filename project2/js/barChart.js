class BarChart {

  constructor(_config, _data, _colorScale) {
    this.config = {
      parentElement: _config.parentElement,
      title: _config.title,
      y: _config.y,
      y_domain: _config.y_domain,
      x: _config.x,
      containerWidth: _config.containerWidth || 350,
      containerHeight: _config.containerHeight || 165,
      margin: { top: 30, bottom: 30, right: 50, left: 50 }
    }

    this.data = _data;
    this.colorScale = _colorScale

    // Call a class function
    this.initVis();
  }

  initVis() {
      
    let vis = this;
    
    //set up the width and height of the area where visualizations will go- factoring in margins               
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;


    //setup scales
    if (typeof(vis.config.x) == 'string'){
      vis.xScale = d3.scaleBand()
          .domain( vis.data.map(d => d[vis.config.x]))
          .range([0, vis.width]);
    }else{
      vis.xScale = d3.scaleBand()
          .domain( vis.config.x)
          .range([0, vis.width]); 
    }
    vis.yScale = d3.scaleLinear()
        .domain( vis.config.y_domain )
        .range([vis.height, 0])
        .nice(); //this just makes the y axes behave nicely by rounding up


    // console.log('yScale')
    // console.log(vis.yScale);
    // // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat((d, i) => vis.config.x[i]);
    vis.yAxis = d3.axisLeft(vis.yScale).tickSize(-vis.width).tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight)
        .style("background-color", "#fcfcfc");

    // Append group element that will contain our actual chart (see margin convention)
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`)
        .call(vis.xAxis)
    
    // Append y-axis group
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis')
        .call(vis.yAxis); 

    vis.title = vis.chart.append("text")
        .attr("x", (vis.width / 2))             
        .attr("y", 0 - (vis.config.margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text(vis.config.title);

    vis.updateVis();           
  }

 updateVis() { 
      let vis = this;
      vis.chart.selectAll("rect").remove()
      vis.chart.selectAll("text.nodata").remove()
      vis.title.text(`No Data - ${vis.config.title}`)
      if (vis.data){
      vis.title.text(`${vis.config.title}`)

      vis.bisectYear = d3.bisector(d => d[vis.config.x]).left;

      vis.xScale.domain( vis.config.x)
      vis.yScale.domain( vis.config.y_domain )


      vis.config.x.forEach((element, index) => {
        vis.chart.append('rect').data(vis.data)
            .attr('x', (d,i) => vis.xScale(vis.config.x[index]))
            .attr('class', "rect" + index)
            .attr('width', vis.xScale.bandwidth())
            .attr('y', (d,i) => vis.yScale(0))
            .attr('height', (d,i) => vis.height-vis.yScale(0))
            .attr("fill", "#28a75d")
            .attr("stroke", "black")
            .on('mouseenter', function(event) {
              // See code snippets below
              let xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
              let year = vis.xScale(xPos);

              // Find nearest data point
              let ix = vis.bisectYear(vis.data, year, 1);
              let a = vis.data[ix - 1];
              let b = vis.data[ix];
              let d = b && (year - a.year > b.year - year) ? b : a; 

              let xIndex = vis.xScale(vis.config.x[1])
              let i = Math.floor(xPos/xIndex)

              // // Update tooltip
              d3.select('#tooltip')
              // show the event name, the event cost, the date.
                .style('display', 'block')
                .style('left', (event.pageX + 15) + 'px')   
                .style('top', (event.pageY + 15) + 'px')
                .html(`
                <div class="tooltip-title">${vis.config.x[index]}</div>
                <div><i>Count: ${vis.config.y[index]} Specimans</div>
                `);
            })
            .on('mouseleave', () => {
              d3.select('#tooltip').style('display', 'none');
            })
        vis.chart.selectAll(`.rect${index}`).transition().duration(800)
          .attr('y', (d,i) => vis.yScale(vis.config.y[index]))
          .attr('height', (d,i) => vis.height - vis.yScale(vis.config.y[index]))
      })
    }else{
      vis.chart.append("text")
        .attr("x", (vis.width / 2))             
        .attr("y", (vis.height / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .attr("class", "nodata")
        .text("No Data For this Year");
    }
      vis.xAxisG.call(vis.xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-15)");;
      vis.yAxisG.call(vis.yAxis);
    // }
 }


 //leave this empty for now...
 renderVis() { 

  }



}