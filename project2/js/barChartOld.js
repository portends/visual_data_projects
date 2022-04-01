class BarChart {
    /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _recordedByNameArray, _recordedByCountArray) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth,
      containerHeight: _config.containerHeight,
      margin: {top: 10, right: 10, bottom: 30, left: 30},
    }
    this.data = _data;
    this.recordedByNameArray = _recordedByNameArray;
    this.recordedByCountArray = _recordedByCountArray;
    // this.columns = _columns;
    // this.percentageArray = _percentageArray;

    this.initVis();
  }
  
  initVis() {
   
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.xScale = d3.scaleBand()
        .range([0, vis.width])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    vis.yScale = d3.scaleLinear()
        .range([vis.height, 0]);
    
    vis.xAxis = d3.axisBottom(vis.xScale);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(6);

    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');
    
    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    vis.xScale.domain(vis.recordedByNameArray);
    vis.yScale.domain([0,3750]);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    // color palette
    const color = [
      '#754E24','#8B4800','#CD6A00','#DD984F','#ECC79D','#FCF5EC'];
    vis.recordedByNameArray.forEach((c, i) => {
        vis.chart.append('rect')
        .data(vis.data) 
        .attr('fill', color[i])
        .attr('height', d => {
          return vis.yScale(vis.recordedByCountArray[i])
          // return vis.height - vis.yScale(d[vis.recordedByCountArray][i])
        })
        .attr('width', vis.xScale.bandwidth())
        .attr('x', vis.xScale(c))
        .attr('y', d=> {
          return vis.recordedByCountArray[i]
          // return vis.yScale(d[vis.recordedByCountArray][i])
        }
        );
    })

    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
    }
}
