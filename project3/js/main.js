let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4, map
let groupedData, groupedDataYear, data

let characterArray = ['spongebob', 'pearl', 'sandy'];

Promise.all([
	d3.json('data/episodeDictionary.json'),
	//d3.csv('data/processed_aqi.csv'),
]).then(data => {
	let fullEpisodesData = data[0];
  // let data1 = data[1];
  console.log('Data loading complete. Work with dataset.');

  console.log(fullEpisodesData);

  increment = 0;
  barData1 = Array(400);
  let characterCount =  {
    'spongebob': 0,
    'pearl': 0,
    'sandy': 0
  }
  console.log('characterArray:')
  console.log(characterArray)
  fullEpisodesData.forEach(d => {
    Object.entries(d.words).forEach(([key, value]) => {
      for (let i = 0; i < 3; i++) {
        if (key == characterArray[i]) {
          characterCount[key]++;
        }
      }
      console.log('characterCount')
      console.log(characterCount)
   });
    // for (let i = 0; i < 3; i++) {
    //   if (d.words.contains(characterArray[i])) {
    //     characterCount[i]++;
    //   }
    //   if(d.words.some(e => e.key1 == 'value1')) {

    //   }
    // }
  })

  console.log("characterCount")
  console.log(characterCount)

  barChartCharacterAppearances = new BarChart({
    'parentElement': '#bar1',
    'title': 'Character Appearances (# of Episodes)',
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData1[1],
    'y_domain': [0, d3.max(barData1[1])],
    'x': barData1[0],
  }, 
  barData1,
  ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

}).catch(error => {
  console.error('Error loading the data');
console.error(error);
});

