class LineChart2 {

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
        margin: _config.margin || {top: 25, right: 30, bottom: 30, left: 50},
        contextMargin: {top: 280, right: 10, bottom: 20, left: 45}
    }
      this.data = _data;
      //this.columns = _columns;
      this.initVis();
    }
    
    /**
     * Initialize scales/axes and append static chart elements
     */
     initVis() {
        let vis = this;
        //vis.xValue = d => d.year;
        //vis.yValue = d => d.maxAQI;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        // this is extra
        vis.yAxisTitle = vis.config.yAxisTitle;
        vis.xAxisTitle = vis.config.xAxisTitle;

        //
        const containerWidth = vis.width;
        const containerHeight = vis.height;
        //

        vis.xScaleFocus = d3.scaleTime()
        .range([0, vis.width]);

        vis.xScaleContext = d3.scaleTime()
            .range([0, vis.width]);

        vis.yScaleFocus = d3.scaleLinear()
            .range([vis.height, 0])
            .nice();

        vis.yScaleContext = d3.scaleLinear()
            .range([vis.height, 0])
            .nice();

        //

        // vis.xValue = d => d.year;
        // vis.yValue = d => d.count;

        // vis.xScale = d3.scaleTime()
        //     //.domain(d3.extent(vis.data, vis.xValue))

        //     //.range([0, vis.width]);
        //     .range([0, vis.width]);
        // vis.yScale = d3.scaleLinear()
        //     //.domain([0,330])
        //     .range([vis.height, 0])
        //     .nice();

        // vis.xAxis = d3.axisBottom(vis.xScale)
        //     .ticks(15)
        //     .tickSizeOuter(0)
        //     .tickPadding(10)
        //     //.tickFormat(d3.format('d'));

        // vis.yAxis = d3.axisLeft(vis.yScale)
        //     .ticks(2)
        //     .tickSizeOuter(0)
        //     .tickPadding(10);
        // // Define size of svg drawwing area

        // Initialize axes
        vis.xAxisFocus = d3.axisBottom(vis.xScaleFocus).tickSizeOuter(0);
        vis.xAxisContext = d3.axisBottom(vis.xScaleContext).tickSizeOuter(0);
        vis.yAxisFocus = d3.axisLeft(vis.yScaleFocus)
            .ticks(2)
            .tickSizeOuter(0)
            .tickPadding(10);

        //maybe at some point fix these container widths to use vis.containerWidth
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);
            
        // // Append group elememt
        // vis.chart = vis.svg.append('g')
        //     .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.focus = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        vis.focus.append('defs').append('clipPath')
            .attr('id', 'clip')
                .append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height);

        vis.focusLinePath = vis.focus.append('path')
            .attr('class', 'chart-line');
        //vis.chart = vis.svg.append('g')
        vis.xAxisFocusG = vis.focus.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);

        vis.yAxisFocusG = vis.focus.append('g')
        .attr('class', 'axis y-axis');

        vis.tooltipTrackingArea = vis.focus.append('rect')
            .attr('width', vis.width)
            .attr('height', vis.height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all');

        // Empty tooltip group (hidden by default)
        vis.tooltip = vis.focus.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');

        vis.tooltip.append('circle')
            .attr('r', 4);

        vis.tooltip.append('text');

        vis.context = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.contextMargin.left},${vis.config.contextMargin.top})`);

        vis.contextAreaPath = vis.context.append('path')
            .attr('class', 'chart-area');

        vis.xAxisContextG = vis.context.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);

        vis.brushG = vis.context.append('g')
            .attr('class', 'brush x-brush');
        // vis.xAxisG = vis.chart.append('g')
        //     .attr('class', 'axis x-axis')
        //     .attr('transform', `translate(0,${vis.height})`);

        // vis.yAxisG = vis.chart.append('g')
        //     //.call(vis.yAxis)
        //     .attr('class', 'axis y-axis')

        // vis.yAxisG
        //     .style('font-size', '.8rem')
        //     .style('font-family', 'inherit')
        //     .style('color', '#000000')

        // vis.xAxisG
        //     .style('font-size', '.8rem')
        //     .style('font-family', 'inherit')
        //     .style('color', '#000000')

        // vis.yAxisTitle = vis.chart.append('text')
        //     .attr('class', 'axis-label')
        //     .attr('y', -18)
        //     .attr('x', -50)
        //     .attr('dy', '0.35em')
        //     .text(vis.yAxisTitle)
        //     .style('font-size', '.8rem');

        // vis.xAxisTitle = vis.chart.append('text')
        //     .attr('class', 'axis-label')
        //     .attr('y', 62)
        //     .attr('x', 840)
        //     .attr('dx', '0.35em')
        //     .text(vis.xAxisTitle)
        //     .style('font-size', '.8rem');

        // vis.marks = vis.chart.append('g');

        // vis.trackingArea = vis.chart.append('rect')
        //     .attr('width', vis.width)
        //     .attr('height', vis.height)
        //     .attr('fill', 'none')
        //     .attr('pointer-events', 'all');

        //(event,d) => {

        // Empty tooltip group (hidden by default)
        // vis.tooltip = vis.chart.append('g')
        //     .attr('class', 'tooltip')
        //     .style('display', 'none');

        // vis.tooltip.append('circle')
        //     .attr('r', 4);

        // vis.tooltip.append('text');

        vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height]])
        .on('brush', function({selection}) {
          if (selection) vis.brushed(selection);
        })
        .on('end', function({selection}) {
          if (!selection) vis.brushed(null);
        });
        

        // vis.axisTitle = vis.chartContainer.append('text')
        //     .attr('class', 'axis-label')
        //     .attr('y', -18)
        //     .attr('x', -25)
        //     .attr('dy', '0.35em')
        //     .text(vis.axisTitle);
      }
    
      updateVis() {
        let vis = this;
        
        vis.xValue = d => d.year;
        vis.yValue = d => d.count;

        vis.line = d3.line()
            .x(d => vis.xScaleFocus(vis.xValue(d)))
            .y(d => vis.yScaleFocus(vis.yValue(d)));

        vis.area = d3.area()
            .x(d => vis.xScaleContext(vis.xValue(d)))
            .y1(d => vis.yScaleContext(vis.yValue(d)))
            .y0(vis.height);

        // Set the scale input domains
        // vis.xScale.domain(d3.extent(vis.data, vis.xValue));
        // vis.yScale.domain(d3.extent(vis.data, vis.yValue));

        vis.xScaleFocus.domain(d3.extent(vis.data, vis.xValue));
        vis.yScaleFocus.domain(d3.extent(vis.data, vis.yValue));
        vis.xScaleContext.domain(vis.xScaleFocus.domain());
        vis.yScaleContext.domain(vis.yScaleFocus.domain());

        vis.bisectDate = d3.bisector(vis.xValue).left;

        vis.renderVis();
      }
    
      /**
       * Bind data to visual elements
       */
      renderVis() {
        let vis = this;

        
        // console.log(vis.data);
        // const color = [
        //     '#754E24','#8B4800','#CD6A00','#DD984F','#ECC79D','#FCF5EC'];

        // Add line path
        // vis.marks.selectAll('.chart-line')
        //     .data([vis.data])
        //     .join('path')
        //         .attr('class', 'chart-line')
        //         .attr('d', vis.line);
        // console.log('mouse entered')
        // vis.trackingArea
        //     .on('mouseenter', () => {
        //         vis.tooltip.style('display', 'block');
        //     })
            
        //     .on('mouseleave', () => {
        //         vis.tooltip.style('display', 'none');
        //     })
        //     .on('mousemove', function(event) {
        //     // Get date that corresponds to current mouse x-coordinate
        //         const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
        //         const date = vis.xScale.invert(xPos);

        //         // Find nearest data point
        //         const index = vis.bisectDate(vis.data, date, 1);
        //         const a = vis.data[index - 1];
        //         const b = vis.data[index];
        //         const d = b && (date - a.date > b.date - date) ? b : a; 

        //     // Update tooltip
        //     vis.tooltip.select('circle')
        //         .attr('transform', `translate(${vis.xScale(d.year)},${vis.yScale(d.count)})`);
            
        //     vis.tooltip.select('text')
        //         .attr('transform', `translate(${vis.xScale(d.year)},${(vis.yScale(d.count) - 15)})`)
        //         .text(Math.round(d.count));
        // });

        
        //vis.columns.forEach((c, i) => {
        // vis.chart.append('path')
        //     .data([vis.data])
        //     .attr('stroke', color[i])
        //     .attr('stroke-width', 2)
        //     .attr('fill', 'none')
        //     .attr('d', d3.line()
        //         .x(d => vis.xScale(vis.xValue(d)))
        //         .y(d => vis.yScale(d[c])));    
        //})
        // vis.xAxisG.call(vis.xAxis);
        // vis.yAxisG.call(vis.yAxis);
        vis.focusLinePath
            .datum(vis.data)
            .attr('d', vis.line);

        vis.contextAreaPath
            .datum(vis.data)
            .attr('d', vis.area);

        vis.tooltipTrackingArea
            .on('mouseenter', () => {
            vis.tooltip.style('display', 'block');
            })
            .on('mouseleave', () => {
            vis.tooltip.style('display', 'none');
            })
            .on('mousemove', function(event) {
            // Get date that corresponds to current mouse x-coordinate
            const xPos = d3.pointer(event, this)[0]; // First array element is x, second is y
            const date = vis.xScaleFocus.invert(xPos);

            // Find nearest data point
            const index = vis.bisectDate(vis.data, date, 1);
            const a = vis.data[index - 1];
            const b = vis.data[index];
            const d = b && (date - a.date > b.date - date) ? b : a; 

            // Update tooltip
            vis.tooltip.select('circle')
                .attr('transform', `translate(${vis.xScaleFocus(d.year)},${vis.yScaleFocus(d.count)})`);
            
            vis.tooltip.select('text')
                .attr('transform', `translate(${vis.xScaleFocus(d.year)},${(vis.yScaleFocus(d.count) - 15)})`)
                .text(Math.round(d.count));
            });
    
        // Update the axes
        vis.xAxisFocusG.call(vis.xAxisFocus);
        vis.yAxisFocusG.call(vis.yAxisFocus);
        vis.xAxisContextG.call(vis.xAxisContext);

        // Update the brush and define a default position
        const defaultBrushSelection = [vis.xScaleFocus(new Date('1859-01-01')), vis.xScaleContext.range()[1]];
        vis.brushG
            .call(vis.brush)
            .call(vis.brush.move, defaultBrushSelection);
        
        
    }

    brushed(selection) {
        let vis = this;
    
        // Check if the brush is still active or if it has been removed
        if (selection) {
          // Convert given pixel coordinates (range: [x0,x1]) into a time period (domain: [Date, Date])
          const selectedDomain = selection.map(vis.xScaleContext.invert, vis.xScaleContext);
    
          // Update x-scale of the focus view accordingly
          vis.xScaleFocus.domain(selectedDomain);
        } else {
          // Reset x-scale of the focus view (full time period)
          vis.xScaleFocus.domain(vis.xScaleContext.domain());
        }
    
        // Redraw line and update x-axis labels in focus view
        vis.focusLinePath.attr('d', vis.line);
        vis.xAxisFocusG.call(vis.xAxisFocus);
      }
}