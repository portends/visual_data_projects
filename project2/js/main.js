let data, leafletMap, timeline1, timeline2, filteredData, barChartRecordedBy, total;

let mapData, timeData;

let recordedByNameArray = ['', '', '', '', ''];
let recordedByCountArray = [0, 0, 0, 0, 0];
let increment = 0;

var parseTime = d3.timeParse("%Y");

Promise.all([
  d3.csv('data/occurrences.csv'),
  d3.csv('data/timelineData.csv'),
  d3.csv('data/recordedBy.csv'),
  d3.csv('data/hierarchy.csv'),
]).then(data => {
    mapData = data[0];
    timeData = data[1];
    barData = data[2];
    path = data[3]
    mapData.forEach(d => {
      if (d.decimalLatitude == ''){
        d.decimalLatitude = 99999
      }
      if (d.decimalLongitude == ''){
        d.decimalLongitude = 99999
      }
      if (d.year == ''){
        d.year = NaN
      }
      if (d.startDayOfYear == ''){
        d.startDayOfYear = NaN
      }
      if (d.class == ''){
        d.class = NaN
      }

      d.latitude = +d.decimalLatitude; //make sure these are not strings
      d.longitude = +d.decimalLongitude; //make sure these are not strings
      d.year = +d.year
      d.startDayOfYear = +d.startDayOfYear
    });

    // console.log('leaflet data');
    // console.log(data);

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#map1'}, mapData);

    circlePack = new TreeMap({ parentElement: '#extra1'}, path);
    // circlePack = new TreeMap({ parentElement: '#extra2'}, path);

    d3.select("#typeMap").on("change", (event) => {
      leafletMap.base_layer.attribution = leafletMap.topoAttr
      leafletMap.base_layer.setUrl(leafletMap[event.target.value])
    })
    p1Data = calcEventDate(mapData)
    pi1 = new Pie({ parentElement: '#small1', title: "EventDate Degree of Accuracy"}, p1Data)

    p2Data = calcGPS(mapData)
    pi2 = new Pie({ parentElement: '#small2', title: "GPS Stuff"}, p2Data)

    total = d3.select("#smallTotal").text(`Total Number of Speciman:${total}`)

    timeData.forEach(d => {
        //d.year = +d.year;
        d.oldYear = +d.year;
        d.year = parseTime(d.year);
        d.count = +d.count;
      });

      data = timeData;
      //console.log(data);
  
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

    barData.forEach(d => {
      d.count = +d.count;

      recordedByNameArray[increment] = d.name;
      recordedByCountArray[increment] = d.count;

      increment++;
    })


    const barChartRecordedBy = new BarChart({
      'parentElement': '#bar1',
      'title': 'Recorded By: ',
      //'containerHeight': 250,
			//'containerWidth': 500,
      'y': recordedByCountArray,
      'y_domain': [0, 3750],
      'x': recordedByNameArray,
    }, 
    barData,
    ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);

    //barChartRecordedBy.updateVis();

    // bar1 = new Bar({
    //   'parentElement': '#bar1',
    //   'title': 'Percent of Levels of Health Concern in',
    //   // 'containerWidth': 500,
    //   'y': 'condition_percent',
    //   'y_domain': [0, 100],
    //   'x': ['Good', 'Moderate', 'Sensitive', 'Unhealty', 'Very Unhealthy', 'Hazardous'],
    // }, groupedDataYear.get("Ohio").get("Hamilton").get(2021), ["#238B45", "#FFFF00", "#FFA500", "#E31A1C", "#8F3F97", "#7E0023"]);
  

    

  })
  .catch(error => console.error(error));

  // d3.csv('data/timelineData.csv')
  // .then(_data => {
  //     _data.forEach(d => {
  //       //d.year = +d.year;
  //       d.oldYear = +d.year;
  //       d.year = parseTime(d.year);
  //       d.count = +d.count;
  //     });

  //     data = _data;
  //     console.log(data);
  
  //     //Initialize Timeline
  //   timeline2 = new LineChart2(
  //     {
  //       parentElement: '#timeline2',
  //       'containerHeight': 100,
  //       'containerWidth': 925,
  //       'yAxisTitle': 'Plant Classifications' ,
  //       'xAxisTitle': 'Year',
  //       'chartTitle': 'Timeline'
  //     },
  //     data);
  //   timeline2.updateVis();
  //   console.log(timeline2.dateRange);
  //   })
  //   .catch(error => console.error(error));

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
      minYear = timeline2.dateRange[0].getFullYear();
      maxYear = timeline2.dateRange[1].getFullYear();
      filteredData = mapData.filter(d => (d.year >= minYear) && (d.year <= maxYear));
      // console.log('before');
      // console.log(leafletMap.data);
      leafletMap.data = filteredData;
      // console.log('after');
      // console.log(leafletMap.data);
      // console.log('filteredData');
      // console.log(filteredData);

      leafletMap.updateVis();

    }

function calcEventDate(data) {
  // init
  day = 0
  month = 0
  year = 0
  none = 0
  total = 0

  //Add from data
  data.forEach(d => {
    if (d.eventDate.substring(8,10)=="00") {
      if (d.eventDate.substring(5,7)=="00"){year++; total++}
      else {month++; total++}
    } 
    else if (d.eventDate==""){none++; total++}
    else {day++; total++}
  })

  // Format data
  eventDateData = [
    {name:"Day" , percent: (100*day)/total, count: day},
    {name:"Month" , percent: (100*month)/total, count: month},
    {name:"Year" , percent: (100*year)/total, count: year},
    {name:"Missing" , percent: (100*none)/total, count: none},
  ]

  console.log(eventDateData)
  console.log(total)
  return eventDateData;
}

function calcGPS(data) {
  // init
  northwest = 0
  southwest = 0
  northeast = 0
  southeast = 0
  none = 0
  total = 0

  //Add from data
  data.forEach(d => {
    if (d.decimalLatitude > 0 && d.decimalLongitude > 0) {northeast++; total++}
    else if (d.decimalLatitude > 0 && d.decimalLongitude < 0) {northwest++; total++}
    else if (d.decimalLatitude < 0 && d.decimalLongitude > 0) {southeast++; total++}
    else if (d.decimalLatitude < 0 && d.decimalLongitude < 0) {southwest++; total++}
    else {none++; total++}
  })

  // Format data
  gpsData = [
    {name:"northwest" , percent: (100*northwest/total), count: northwest},
    {name:"southwest" , percent: (100*southwest/total), count: southwest},
    {name:"northeast" , percent: (100*northeast/total), count: northeast},
    {name:"southwest" , percent: (100*southwest/total), count: southwest},
    {name:"none" , percent: (100*none/total), count: none},
  ]

  return gpsData;
}
