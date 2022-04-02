class LineChart {

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _columns) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 800,
        containerHeight: _config.containerHeight || 240,
        yAxisTitle: _config.yAxisTitle || 'Axis',
        xAxisTitle: _config.xAxisTitle || 'Axis',
        margin: _config.margin || {top: 25, right: 30, bottom: 30, left: 50}
      }
      this.data = _data;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
     initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        vis.yAxisTitle = vis.config.yAxisTitle;
        vis.xAxisTitle = vis.config.xAxisTitle;

        vis.xValue = d => d.year;
        vis.yValue = d => d.count;

        vis.xScale = d3.scaleTime()
            .range([0, vis.width]);
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0])
            .nice();

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(15)
            .tickSizeOuter(0)
            .tickPadding(10)

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(2)
            .tickSizeOuter(0)
            .tickPadding(10);
        // Define size of svg drawwing area

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
            
        // Append group elememt
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisG = vis.chart.append('g')
            //.call(vis.yAxis)
            .attr('class', 'axis y-axis')

        vis.yAxisG
            .style('font-size', '.8rem')
            .style('font-family', 'inherit')
            .style('color', '#000000')

        vis.xAxisG
            .style('font-size', '.8rem')
            .style('font-family', 'inherit')
            .style('color', '#000000')

        vis.yAxisTitle = vis.chart.append('text')
            .attr('class', 'axis-label')
            .attr('y', -18)
            .attr('x', -50)
            .attr('dy', '0.35em')
            .text(vis.yAxisTitle)
            .style('font-size', '.8rem');

        vis.xAxisTitle = vis.chart.append('text')
            .attr('class', 'axis-label')
            .attr('y', 62)
            .attr('x', 840)
            .attr('dx', '0.35em')
            .text(vis.xAxisTitle)
            .style('font-size', '.8rem');

        vis.marks = vis.chart.append('g');

        vis.trackingArea = vis.chart.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        // Empty tooltip group (hidden by default)
        vis.tooltip = vis.chart.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        vis.tooltip.append('circle')
            .attr('r', 4);

        vis.tooltip.append('text');

      }
    
      updateVis() {
        let vis = this;
        
        vis.xValue = d => d.year;
        vis.yValue = d => d.count;

        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)));

        // Set the scale input domains
        vis.xScale.domain(d3.extent(vis.data, vis.xValue));
        vis.yScale.domain(d3.extent(vis.data, vis.yValue));

        vis.bisectDate = d3.bisector(vis.xValue).left;

        vis.renderVis();
      }
    
      /**
       * Bind data to visual elements
       */
      renderVis() {
        let vis = this;

        // Add line path
        vis.marks.selectAll('.chart-line')
            .data([vis.data])
            .join('path')
                .attr('class', 'chart-line')
                .attr('d', vis.line);
        vis.trackingArea
            .on('mouseenter', () => {
                vis.tooltip.style('display', 'block');
            })
            
            .on('mouseleave', () => {
                vis.tooltip.style('display', 'none');
            })
            .on('mousemove', function(event) {
            // Get date that corresponds to current mouse x-coordinate
                const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
                const date = vis.xScale.invert(xPos);

                // Find nearest data point
                const index = vis.bisectDate(vis.data, date, 1);
                const a = vis.data[index - 1];
                const b = vis.data[index];
                const d = b && (date - a.date > b.date - date) ? b : a; 

            // Update tooltip
            vis.tooltip.select('circle')
                .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.count)})`);
            
            vis.tooltip.select('text')
                .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.count) - 15)})`)
                .text(Math.round(d.count));
        });

        vis.xAxisG.call(vis.xAxis);
        vis.yAxisG.call(vis.yAxis);
    }
}