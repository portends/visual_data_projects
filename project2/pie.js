class Pie {

    constructor(_config, _data, _colorScale) {
      this.config = {
        parentElement: _config.parentElement,
        title: _config.title,
        containerWidth: _config.containerWidth || 350,
        containerHeight: _config.containerHeight || 165,
        margin: { top: 30, bottom: 30, right: 50, left: 50 }
      }
  
      this.data = _data;

      this.initVis();
    }
  
    initVis() {
        
        let vis = this;

        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.radius = Math.min(width, height) / 2 - 10; 

        vis.color = d3.scaleOrdinal()
            .range(['#b3e2cd',
                '#fdcdac',
                '#cbd5e8',
                '#f4cae4',
                '#e6f5c9']);

        vis.pie = d3.pie();

        vis.pie.value(function (d) {
            return d.share;
        });
        // You can customize the generator further...
        // Add padding between the slices:
        // pie.padAngle(0.05);
        // Set the start and end angles:
        // pie.startAngle(-Math.PI/2)
        // pie.endAngle(Math.PI/2);

        // Now that we've set up our generator, let's give it our data:
        let pieData = pie(data);
        // We'll log it to the console to see how it transformed the data:
        console.log('pieData:', pieData);
    
    
        vis.updateVis();           
    }
  
   updateVis() { 
        let vis = this;
        
   }
  
  
   //leave this empty for now...
   renderVis() { 
  
    }
  
  
  
  }