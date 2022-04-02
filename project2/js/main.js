let data, leafletMap, timeline1, timeline2, barChartRecordedBy, barChartPylum, total, pi1, pi2, treeMap;

let mapData, timeData, filteredData;

let recordedByNameArray = ['', '', '', '', ''];
let recordedByCountArray = [0, 0, 0, 0, 0];
let increment = 0;

let monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var parseTime = d3.timeParse("%Y");

Promise.all([
  d3.csv('data/occurrences.csv'),
  d3.csv('data/timelineData.csv'),
  d3.csv('data/recordedBy.csv'),
]).then(data => {
    mapData = data[0];
    timeData = data[1];
    barData = data[2];
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

    // Initialize chart and then show it
    leafletMap = new LeafletMap({ parentElement: '#map1'}, mapData);

    p = calcHierarchy(mapData)
    treeMap = new TreeMap({ parentElement: '#extra1'}, p);
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
    barData.forEach(d => {
      d.count = +d.count;

      recordedByNameArray[increment] = d.name;
      recordedByCountArray[increment] = d.count;

      increment++;
    })

    recordedByData = calcRecordedBy(mapData)
    barChartRecordedBy = new BarChart({
      'parentElement': '#bar1',
      'title': 'Recorded By: ',
      'containerHeight': 200,
			'containerWidth': 625,
      'y': recordedByData[1],
      'y_domain': [0, d3.max(recordedByData[1])],
      'x': recordedByData[0],
    }, 
    barData,
    ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

    phylumData = calcSpecimanPhylum(mapData)
    
    barChartPylum = new BarChart({
      'parentElement': '#bar2',
      'title': 'Phylums: ',
      'containerHeight': 200,
			'containerWidth': 625,
      'y': phylumData[1],
      'y_domain': [0, d3.max(phylumData[1])],
      'x': phylumData[0],
    }, 
    barData,
    ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);


    monthData = calcMonthCollected(mapData)

    barChartMonthly = new BarChart({
      'parentElement': '#bar3',
      'title': 'Monthly Breakdown: ',
      'containerHeight': 200,
			'containerWidth': 625,
      'y': monthData[1],
      'y_domain': [0, 2000],
      'x': monthData[0],
    }, 
    barData,
    ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d","#28a75d","#28a75d",]);

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

    // barChartRecordedBy.updateVis();
  })
  .catch(error => console.error(error));

let updateDateRange = () => {
  minYear = timeline2.dateRange[0].getFullYear();
  maxYear = timeline2.dateRange[1].getFullYear();
  filteredData = mapData.filter(d => (d.year >= minYear) && (d.year <= maxYear));
  
  leafletMap.data = filteredData;
  recordedByData = calcRecordedBy(filteredData)
  phylumData = calcSpecimanPhylum(filteredData)
  monthData = calcMonthCollected(filteredData)
  p1Data = calcEventDate(filteredData)
  console.log(p1Data)
  p2Data = calcGPS(filteredData)

  barChartRecordedBy.config.y = recordedByData[1]
  barChartRecordedBy.config.x = recordedByData[0]
  barChartRecordedBy.config.y_domain[1] = d3.max(recordedByData[1])
  barChartPylum.config.y = phylumData[1]
  barChartPylum.config.x = phylumData[0]
  barChartPylum.config.y_domain[1] = d3.max(phylumData[1])
  barChartMonthly.config.y = monthData[1]
  barChartMonthly.config.x = monthData[0]
  pi1.data = p1Data
  pi2.data = p2Data
  treeMap.data = calcHierarchy(filteredData)

  treeMap.updateVis()
  pi1.updateVis()
  pi2.updateVis()
  barChartRecordedBy.updateVis()
  barChartPylum.updateVis()
  barChartMonthly.updateVis()
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

function calcSpecimanPhylum(data) {
  // init
  pylums = {}
  let nameArray = []
  let countArray = []

  //Add from data
  data.forEach(d => {
    if (d.phylum == ""){d.phylum = "Missing"}
    if (d.phylum in pylums){
      pylums[d.phylum] = ++pylums[d.phylum]
    }else{
      pylums[d.phylum] = 0
    }
  })

  // Format data
  Object.keys(pylums).forEach((d, i) => {
    nameArray[i] = d;
    countArray[i] = pylums[d];
  })

  return [nameArray, countArray];
}

function calcRecordedBy(data) {
  // init
  by = {}
  let nameArray = []
  let countArray = []

  //Add from data
  data.forEach(d => {
    if (d.recordedBy == ""){d.recordedBy = "Missing"}
    if (d.recordedBy in by){
      by[d.recordedBy] = ++by[d.recordedBy]
    }else{
      by[d.recordedBy] = 0
    }
  })

  // get top 10
  
  top10 = pickHighest(by, 5)
  // console.log(top10)

  // Format data
  Object.keys(top10).forEach((d, i) => {
    nameArray[i] = d;
    countArray[i] = top10[d];
  })

  return [nameArray, countArray];
}

function pickHighest(obj, num = 1) {
  requiredObj = {};
  Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) =>
  {
     if(ind < num){
        requiredObj[key] = obj[key];
     }
  });
  return requiredObj;
}

function calcMonthCollected(data) {
  // init
  monthDict = {};
  let monthArray = [];
  let countArray = [];
  abbr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Missing'];

  //Add from data
  data.forEach(d => {
    d.month = +d.month;
    if (d.month == 0){
      month = "Missing"
    }
    else {
      month = abbr[d.month - 1]
    }

    if (month in monthDict) {
      monthDict[month] = ++monthDict[month];
    }
    else {
      monthDict[month] = 0;
    }
      
  })


  // Format data
  abbr.forEach((d, i) => {
    countArray[i] = monthDict[d];
  })

  return [abbr, countArray];
}

function calcHierarchy(data) {
  // init
  classification = {}
  let nameArray = []
  let countArray = []
  let final = [["root", "", 0]]
  let hierarchy = {"root": 0}

  //Add from data
  data.forEach(d => {
    if (d.higherClassification == ""){d.higherClassification = "Missing"}
    if (d.higherClassification in classification){
      classification[d.higherClassification] = ++classification[d.higherClassification]
    }else{
      classification[d.higherClassification] = 1
    }
  })
  classification = Object.keys(classification).sort().reduce((r, k) => (r[k] = classification[k], r), {})

  Object.keys(classification).forEach((d, i) => {
    nameArray[i] = d;
    countArray[i] = classification[d];
    output = addPath(d, classification[d], hierarchy, final)
    final = output[0]
    hierarchy = output[1]
  })

  formatted = []
  // Format
  final.forEach((d) => {
    formatted.push({"classification": d[0], "name": d[1], "count": d[2]})
  })
  return formatted
}

function addPath(path, count, heirarchy, data) {
  let parent = getParent(path);
  let child = getChild(path);
  if (parent == "root"){
    data.push([path, child, count])
    heirarchy[path] = count
    return [data, heirarchy]
  }
  if (!(parent in heirarchy)){
     result = addPath(parent, 0, heirarchy, data)
     data = result[0]
     heirarchy = result[1]
  }
  data.push([path, child, count])
  heirarchy[path] = count
  return [data, heirarchy]
}


function getChild(path) {
  index = path.lastIndexOf('|')
  if (index == -1) return path
  else return path.substring(index+1)
}


function getParent(path) {
  index = path.lastIndexOf('|')
  if (index == -1){parent = "root"}
  else {parent = path.substring(0, index)}
  return parent
}
