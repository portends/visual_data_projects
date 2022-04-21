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

  barData1 = [];
  barData2 = [];
  episodeCountArray = [];
  wordCountArray = [];
  let arrSum = 0;
  increment = 0;

  let episodeCountDict =  {
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

  let charWordCountDict = {
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
          episodeCountDict[key]++;
        }
      }
   });
  });

  fullEpisodesData.forEach(d => {
    console.log('new episode')
    Object.entries(d.words).forEach(([key, value]) => {
      for (let i = 0; i < 10; i++) {
        if (key == characterArray[i]) {
          arrSum = Object.values(value).reduce((a, b) => a + b, 0);
          charWordCountDict[key] += arrSum
          // charWordCountDict[key]++;
        }
      }
   });
  });

  // Split dictionary into arrays since D3 doesn't know what to do with a dictionary 
  let splitList1 = Object.entries(Object.entries(episodeCountDict));
  console.log(splitList1[3][1])
  Object.keys(episodeCountDict).forEach((d, i) => {
    episodeCountArray[i] = splitList1[i][1][1]
  })

  let splitList2 = Object.entries(Object.entries(charWordCountDict));
  console.log(splitList2[3][1])
  Object.keys(charWordCountDict).forEach((d, i) => {
    wordCountArray[i] = splitList2[i][1][1]
  })

  barData1[0] = characterArrayCapitalized;
  barData1[1] = episodeCountArray;

  barData2[0] = characterArrayCapitalized;
  barData2[1] = wordCountArray;

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

  barChartCharacterAppearances = new BarChart({
    'parentElement': '#bar2',
    'title': 'Total Word Count',
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData2[1],
    'y_domain': [0, d3.max(barData2[1])],
    'x': barData2[0],
  }, 
  barData2,
  ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

}).catch(error => {
  console.error('Error loading the data');
console.error(error);
});
