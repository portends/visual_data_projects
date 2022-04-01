class LeafletMap {

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
    this.initVis();
  }
  
  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;

    //ESRI
    vis.esriUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    vis.esriAttr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    //TOPO
    vis.topoUrl ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    vis.topoAttr = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

    //Stamen Terrain
    vis.stUrl = 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}';
    vis.stAttr = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    //this is the base map layer, where we are showing the map background
    vis.base_layer = L.tileLayer(vis.esriUrl, {
      id: 'esri',
      attribution: vis.esriAttr,
      ext: 'png'
    });

    vis.base_layer2 = L.tileLayer(vis.topoUrl, {
      id: 'topo',
      attribution: vis.topoAttr,
      ext: 'png'
    });

    vis.base_layer3 = L.tileLayer(vis.stUrl, {
      id: 'stamen',
      attribution: vis.stAttr,
      ext: 'png'
    });

    vis.theMap = L.map('map1', {
      center: [30, 0],
      zoom: 2,
      layers: [vis.base_layer]
    });

     vis.baseLayers = {
      "Aerial": vis.base_layer,
      "Elevation": vis.base_layer2,
      "Political": vis.base_layer3
    };

    L.control.layers(vis.baseLayers).addTo(vis.theMap);

    L.Control.Radio = L.Control.extend({
      onAdd: function(map) {
          let form = L.DomUtil.create('div');
          form.innerHTML = `<form class="form" id="colorMap" data-toggle="buttons">
                              <section class="plan">
                                  <h2>Color By</h2>
                                  <input type="radio" name="radio1" id="year" value="year" checked><label class="four col" for="year">Year</label>
                                  <input type="radio" name="radio1" id="dayYear" value="dayYear"><label class="four col" for="dayYear">Day of Year</label>
                                  <input type="radio" name="radio1" id="class" value="class"><label class="four col" for="class">Class</label>
                              </section>
                          </form>`

        L.DomUtil.setPosition(form, L.point(160, -430))

          return form;
      },
  
      onRemove: function(map) {
          // Nothing to do here
      }
  });
  
  L.control.radio = function() {
      return new L.Control.Radio({ position: 'bottomleft' });
  }
  
  L.control.radio().addTo(vis.theMap);

    vis.colorScale = d3.scaleQuantile()
        .range(["#003f5c", "#005a80", "#00779a", "#0095a5", "#00b29f", "#00ce88", "#00e860", "#4aff00"])
        .domain(d3.map(vis.data, (d) => d.year));

    vis.yearColorScale = vis.colorScale;

    vis.color = "year"

    vis.dayYearColorScale = d3.scaleQuantile()
        .range(["#16065c", "#370a70", "#560e82", "#761194", "#9712a5", "#b813b4", "#db11c1", "#ff0fcd"])
        .domain(d3.map(vis.data, (d) => d.startDayOfYear));

    vis.classColorScale = d3.scaleOrdinal()
        .domain(d3.map(vis.data, (d) => d.phylum ).keys())
        .range(["#e60049", "#0bb4ff", "#50e991", "#e6d800", "#9b19f5", "#ffa300", "#dc0ab4", "#b3d4ff"])



    // vis.linearScale = d3.scaleLinear()
    //     .domain(d3.extent(vis.data, (d) => d.year))
    //     .range([200, 600]);

    // vis.timething = d3.select('#timeline1')
    //     .selectAll('circle')
    //     .data(vis.data)
    //     .join('circle')
    //     .attr('r', 3)
    //     .attr('cx', function(d) {
    //       return vis.linearScale(d.year);
    //     })
    //     .style('fill', function(d) {
    //       return vis.colorScale(d.year);
    //     });


    //initialize svg for d3 to add to map
    L.svg({clickable:true}).addTo(vis.theMap)// we have to make the svg layer clickable
    vis.overlay = d3.select(vis.theMap.getPanes().overlayPane)
    vis.svg = vis.overlay.select('svg').attr("pointer-events", "auto")

    vis.theMap.on('click', (event, d) => { 
      d3.select('#tooltip').style('opacity', 0);
    })

    //these are the city locations, displayed as a set of dots 
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", d => vis.colorScale(d.year)) 
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", "red") //change the fill
                              .attr('r', 4); //change radius

                            //create a tool tip
                            d3.select('#tooltip')
                                .style('display', 'block')
                                .style('opacity', 1)
                                .style('z-index', 1000000)

                                .html(`
                                <div class="tooltip-title">Speciman ${d.id}: ${d.scientificName}</div>
                                <div>Date Collected: ${d.verbatimEventDate}</div>
                                <div>Collected By: ${d.recordedBy}</div>
                                <div>Family: ${d.family}</div>
                                <div>Habitat Notes: ${d.habitat}</div>
                                <div>Subtrate Notes: ${d.substrate}</div>
                                <div><a href="${d.references}" target="_blank" rel="noopener noreferrer">Entry in Database</a></div>
                                `);

                          })
                        .on('mousemove', (event) => {
                            //position the tooltip
                            d3.select('#tooltip')
                             .style('left', (event.pageX + 10) + 'px')   
                              .style('top', (event.pageY + 10) + 'px');
                         })              
                        .on('mouseleave', function() { //function to add mouseover event
                            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                              .duration('150') //how long we are transitioning between the two states (works like keyframes)
                              .attr("fill", d => vis.colorScale(d.year)) //change the fill
                              .attr('r', 3) //change radius
                          })
                        ;

    d3.select("#colorMap").on("change", (event) => {
      if (event.target.matches("#class")) {
        vis.colorScale = vis.classColorScale
        vis.color = "class"
      }
      if (event.target.matches("#dayYear")) {
        vis.colorScale = vis.dayYearColorScale
        vis.color = "startDayOfYear"
      }
      if (event.target.matches("#year")) {
        vis.colorScale = vis.yearColorScale
        vis.color = "year"
      }
      vis.updateVis()
    })
    
    //handler here for updating the map, as you zoom in and out           
    vis.theMap.on("zoomend", function(){
      vis.updateVis();
    });

  }

  updateVis() {
    let vis = this;
    vis.svg.selectAll('circle').remove()

    //want to see how zoomed in you are? 
    // console.log(vis.map.getZoom()); //how zoomed am I
    
    //want to control the size of the radius to be a certain number of meters? 
    vis.radiusSize = 3; 
    // if( vis.theMap.getZoom > 15 ){
    //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
    //   desiredMetersForPoint = 100; //or the uncertainty measure... =) 
    //   radiusSize = desiredMetersForPoint / metresPerPixel;
    // }
   
   //redraw based on new zoom- need to recalculate on-screen position
    //  vis.Dots
    //     .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
    //     .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y)
    //     .attr("r", vis.radiusSize) 
    //     .attr("fill", d => vis.colorScale(d.year));
    vis.Dots = vis.svg.selectAll('circle')
                    .data(vis.data) 
                    .join('circle')
                        .attr("fill", d => vis.colorScale(d.year)) 
                        .attr("stroke", "black")
                        //Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
                        //leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
                        //Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
                        .attr("cx", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).x)
                        .attr("cy", d => vis.theMap.latLngToLayerPoint([d.latitude,d.longitude]).y) 
                        .attr("r", 3)
                        .on('mouseover', function(event,d) { //function to add mouseover event
                          d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                            .duration('150') //how long we are transitioning between the two states (works like keyframes)
                            .attr("fill", "red") //change the fill
                            .attr('r', 4); //change radius

                          //create a tool tip
                          d3.select('#tooltip')
                              .style('display', 'block')
                              .style('opacity', 1)
                              .style('z-index', 1000000)

                              .html(`
                              <div class="tooltip-title">Speciman ${d.id}: ${d.scientificName}</div>
                              <div>Date Collected: ${d.verbatimEventDate}</div>
                              <div>Collected By: ${d.recordedBy}</div>
                              <div>Family: ${d.family}</div>
                              <div>Habitat Notes: ${d.habitat}</div>
                              <div>Subtrate Notes: ${d.substrate}</div>
                              <div><a href="${d.references}" target="_blank" rel="noopener noreferrer">Entry in Database</a></div>
                              `);

                        })
                      .on('mousemove', (event) => {
                          //position the tooltip
                          d3.select('#tooltip')
                           .style('left', (event.pageX + 10) + 'px')   
                            .style('top', (event.pageY + 10) + 'px');
                       })              
                      .on('mouseleave', function() { //function to add mouseover event
                          d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                            .duration('150') //how long we are transitioning between the two states (works like keyframes)
                            .attr("fill", d => vis.colorScale(d.year)) //change the fill
                            .attr('r', 3) //change radius
                        })
      // vis.linearScale.domain(d3.extent(vis.data, (d) => d[vis.color]))

      // vis.timething
      //   .attr('cx', function(d) {
      //     return vis.linearScale(d[vis.color]);
      //   })
      //   .style('fill', function(d) {
      //     return vis.colorScale(d[vis.color]);
      //   });
  }


  renderVis() {
    let vis = this;

    //not using right now... 
 
  }
}