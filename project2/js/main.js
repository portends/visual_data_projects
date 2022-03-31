let data, leafletMap, timeline1, timeline2, filteredData;

var parseTime = d3.timeParse("%Y");

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

    // console.log('leaflet data');
    // console.log(data);

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#map1'}, data);

    d3.select("#typeMap").on("change", (event) => {
      leafletMap.base_layer.attribution = leafletMap.topoAttr
      leafletMap.base_layer.setUrl(leafletMap[event.target.value])
      
    })

  })
  .catch(error => console.error(error));

  d3.csv('data/timelineData.csv')
  .then(_data => {
      _data.forEach(d => {
        //d.year = +d.year;
        d.oldYear = +d.year;
        d.year = parseTime(d.year);
        d.count = +d.count;
      });

      data = _data;
      console.log(data);
  
      //Initialize Timeline
    timeline2 = new LineChart2(
      {
        parentElement: '#timeline2',
        'containerHeight': 100,
        'containerWidth': 925,
        'yAxisTitle': 'Plant Classifications' ,
        'xAxisTitle': 'Year',
        'chartTitle': 'Timeline'
      },
      data);
    timeline2.updateVis();
    console.log(timeline2.dateRange);
    })
    .catch(error => console.error(error));

    /**
    * Input field event listener
    */
    // d3.select('#start-year-input').on('change', function() {
    //   // Get selected year
    //   const minYear = parseInt(d3.select(this).property('value'));
    //   console.log(data);
    //   // Filter dataset accordingly
    //   filteredData = data.filter(d => d.oldYear >= minYear);
    //   console.log(filteredData);

    //   // Update chart
    //   timeline1.data = filteredData;
    //   timeline1.updateVis();
    //   console.log('brushing');
      
    // });

    let updateDateRange = () => {
      console.log(timeline2.dateRange);
      minYear = timeline2.dateRange[0].getFullYear();
      maxYear = timeline2.dateRange[1].getFullYear();
      console.log('minYear, maxYear');
      console.log(minYear, maxYear);
      filteredData = data.filter(d => (d.year >= minYear) && (d.year <= maxYear));
      console.log('leafletMap');
      console.log(leafletMap);
      leafletMap.data = filteredData;
      leafletMap.updateVis();

    }

    
 
