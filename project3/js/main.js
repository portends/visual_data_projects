let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4, map, sunBurst
let groupedData, groupedDataYear, data, sunburstData, fullEpisodesData

let characterArray = ['spongebob', 'patrick', 'squidward', 'mr. krabs', 'plankton', 'karen', 'sandy', 'mrs. puff', 'pearl', 'gary'];
let characterArrayCapitalized = ['SpongeBob', 'Patrick', 'Squidward', 'Mr. Krabs', 'Plankton', 'Karen', 'Sandy', 'Mrs. Puff', 'Pearl', 'Gary'];
let Seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8", "Season 9", "Season 10", "Season 11", "Season 12"]
let seasonListArray = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6', 'Season 7', 'Season 8', 'Season 9', 'Season 10', 'Season 11', 'Season 12'];

Promise.all([
	d3.json('data/episodeDictionary.json'),
	d3.json('data/test.json'),
]).then(data => {
	fullEpisodesData = data[0];
  groupSeason = d3.group(fullEpisodesData, d => d.season)
  console.log("tes", groupSeason)
  sunburstData = data[1];
  
  console.log('Data loading complete. Work with dataset.');

  console.log(fullEpisodesData);

  barData1 = [];
  barData2 = [];
  barData3 = [];
  barData4 = [];
  episodeCountArray = [];
  wordCountArray = [];
  let arrSum = 0;
  increment = 0;
  season = '';

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
    Object.entries(d.words).forEach(([key, value]) => {
      for (let i = 0; i < 10; i++) {
        if (key == characterArray[i]) {
          arrSum = Object.values(value).reduce((a, b) => a + b, 0);
          charWordCountDict[key] += arrSum
        }
      }
   });
  });
  characterEpisodeDict(fullEpisodesData)

  populateSelection(characterArrayCapitalized, "#characterSelect")
  populateSelection(Seasons, "#seasonSelect")
  episodeArr = getEpisodesInSeasons(fullEpisodesData)
  console.log(episodeArr)
  populateSelection(episodeArr[0], "#episodeSelect")
  

  episodeCountArray = [];

  // Split dictionary into arrays since D3 doesn't know what to do with a dictionary 
  let splitList1 = Object.entries(Object.entries(episodeCountDict));
  Object.keys(episodeCountDict).forEach((d, i) => {
    episodeCountArray[i] = splitList1[i][1][1]
  })

  let splitList2 = Object.entries(Object.entries(charWordCountDict));
  Object.keys(charWordCountDict).forEach((d, i) => {
    wordCountArray[i] = splitList2[i][1][1]
  })

  barData1[0] = characterArrayCapitalized;
  barData1[1] = episodeCountArray;
  data = getCharSentenceData(sunburstData, "SpongeBob")
  formatSelectData(fullEpisodesData)
  sunBurst = new SunBurst({ parentElement: '#extra1'}, data);

  barData2[0] = characterArrayCapitalized;
  barData2[1] = wordCountArray;

  barData3[0] = seasonListArray;
  barData3[1] = calcCharAppearances(fullEpisodesData, 'spongebob');

  barData4[0] = seasonListArray;
  barData4[1] = calcCharWords(fullEpisodesData, 'spongebob');

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
  ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]);

  barChartWordCount = new BarChart({
    'parentElement': '#bar2',
    'title': 'Total Word Count',
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData2[1],
    'y_domain': [0, d3.max(barData2[1])],
    'x': barData2[0],
  }, 
  barData2,
  ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]);

  barChartSeasonEpisodeAppearances = new BarChart({
    'parentElement': '#bar3',
    'title': 'Episode Appearances (In Each Season)',
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData3[1],
    'y_domain': [0, d3.max(barData3[1])],
    'x': barData3[0],
  }, 
  barData3,
  ["#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb"]);

  barChartCharacterWordsPerSeason = new BarChart({
    'parentElement': '#bar4',
    'title': 'Words Spoken (In Each Season)',
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData4[1],
    'y_domain': [0, d3.max(barData4[1])],
    'x': barData4[0],
  }, 
  barData3,
  ["#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb"]);

}).catch(error => {
  console.error(error);
});

d3.select("#characterSelect").on("change", function(d) {
	let selectedOption = d3.select(this).property("value")
  sunBurst.data = getCharSentenceData(sunburstData, selectedOption)
  character = characterArray[characterArrayCapitalized.indexOf(selectedOption)]
  console.log('charater: ', character)
  barChartSeasonEpisodeAppearances.y = calcCharAppearances(fullEpisodesData, character);
  barChartCharacterWordsPerSeason.y = calcCharWords(fullEpisodesData, character);

  barChartSeasonEpisodeAppearances.updateVis()
  barChartCharacterWordsPerSeason.updateVis()

  sunBurst.updateVis()
})
