d3.csv('data/occurrences.csv')
.then(data => {
    data.forEach(d => {
      if (d.decimalLatitude == ''){
        d.decimalLatitude = 99999
      }
      if (d.decimalLongitude == ''){
        d.decimalLongitude = 99999
      }
      if (d.year == ''){
        d.year = null
      }
      if (d.startDayOfYear == ''){
        d.startDayOfYear = null
      }
      if (d.class == ''){
        d.class = null
      }

      d.latitude = +d.decimalLatitude; //make sure these are not strings
      d.longitude = +d.decimalLongitude; //make sure these are not strings
      d.year = +d.year
      d.startDayOfYear = +d.startDayOfYear
    });

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#map1'}, data);

    d3.select("#typeMap").on("change", (event) => {
      leafletMap.base_layer.attribution = leafletMap.topoAttr
      leafletMap.base_layer.setUrl(leafletMap[event.target.value])
      
    })


  })
  .catch(error => console.error(error));


