let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4, map
let groupedData, groupedDataYear, data

let characterArray = ['spongebob', 'patrick', 'squidward', 'mr. krabs', 'plankton', 'karen', 'sandy', 'mrs. puff', 'pearl', 'gary'];
let characterArrayCapitalized = ['Spongebob', 'Patrick', 'Squidward', 'Mr. Krabs', 'Plankton', 'Karen', 'Sandy', 'Mrs. Puff', 'Pearl', 'Gary'];

Promise.all([
	d3.json('data/episodeDictionary.json'),
	//d3.csv('data/processed_aqi.csv'),
]).then(data => {
	let fullEpisodesData = data[0];
  // let data1 = data[1];
  console.log('Data loading complete. Work with dataset.');

  console.log(fullEpisodesData);

  barData1 = [
    [],
  ];
  increment = 0;
  let charWordDict =  {
    'spongebob': 0,
    'patrick': 0,
    'squidward': 0,
    'mr. krabs': 0,
    'plankton': 0,
    'karen': 0,
    'sandy': 0,
    'mrs. puff': 0,
    'pearl': 0,
    'gary': 0
  }
  fullEpisodesData.forEach(d => {
    Object.entries(d.words).forEach(([key]) => {
      for (let i = 0; i < 10; i++) {
        if (key == characterArray[i]) {
          charWordDict[key]++;
        }
      }
   });
  })

  episodeCountArray = [];

  // Split dictionary into arrays since D3 doesn't know what to do with a dictionary 
  let splitList = Object.entries(Object.entries(charWordDict));
  console.log('splitList')
  console.log(splitList[3][1])
  Object.keys(charWordDict).forEach((d, i) => {
    episodeCountArray[i] = splitList[i][1][1]
  })

  barData1[0] = characterArrayCapitalized;
  barData1[1] = episodeCountArray;

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
