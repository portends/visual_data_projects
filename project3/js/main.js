let barChartCharacterAppearances, barChartWordCount, bar3, bar4, map, sunBurst
let groupedData, groupedDataYear, data, sunburstData, fullEpisodesData, barData1, barData2
let bar3Title, bar4Title, pieChartCharacterAppearances, pieChartCharacterWords
let filteredData, formattedData, charColorMap, episodeArr

let characterArray = ['spongebob', 'patrick', 'squidward', 'mr. krabs', 'plankton', 'karen', 'sandy', 'mrs. puff', 'pearl', 'gary'];
let characterArrayCapitalized = ['Spongebob', 'Patrick', 'Squidward', 'Mr. Krabs', 'Plankton', 'Karen', 'Sandy', 'Mrs. Puff', 'Pearl', 'Gary'];
let Seasons = ["All", "Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8", "Season 9", "Season 10", "Season 11", "Season 12"]
let seasonListArray = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6', 'Season 7', 'Season 8', 'Season 9', 'Season 10', 'Season 11', 'Season 12'];

Promise.all([
  d3.json('data/test.json'),
	d3.json('data/episodeDictionary.json'),
]).then(data => {
	fullEpisodesData = data[1];
  sunburstData = data[0];
  
  console.log('Data loading complete. Work with dataset.');


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

  charColorMap = {
    'spongebob' : "#FCFB63", 
    'patrick' : "#FFA7AE", 
    'squidward' : "#9FCDC0", 
    'mr. krabs' : "#E41B12", 
    'plankton' : "#428985", 
    'karen' : "#4D5CAD", 
    'sandy': "#CE8656", 
    'mrs. puff' : "#EAE9A9", 
    'pearl': "#B9CCD5", 
    'gary': "#E0506F"
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

  populateSelection(characterArrayCapitalized, "#characterSelect")
  populateSelection(Seasons, "#seasonSelect")
  episodeArr = getEpisodesInSeasons(fullEpisodesData)
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

  data = getCharSentenceData(sunburstData, "Spongebob")
  console.log(sunburstData[72])
  formattedData = formatSelectData(fullEpisodesData)
  sunBurst = new SunBurst({ parentElement: '#extra1'}, data);
  
  barData1[0] = characterArrayCapitalized;
  barData1[1] = episodeCountArray;

  barData2[0] = characterArrayCapitalized;
  barData2[1] = wordCountArray;

  barData3[0] = seasonListArray;
  barData3[1] = calcCharAppearances(fullEpisodesData, 'spongebob');
  bar3Title = "'s Episode Appearances (In Each Season)"

  barData4[0] = seasonListArray;
  barData4[1] = calcCharWords(fullEpisodesData, 'spongebob');
  bar4Title = "'s Words Spoken (In Each Season)"

  //Placeholder showing off data conversion to fit project 2 pie charts
  pData1 = formatPieData(episodeCountArray);
  pData2 = formatPieData(wordCountArray);

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
    'title': characterArrayCapitalized[0] + bar3Title,
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
    'title': characterArrayCapitalized[0] + bar4Title,
    'containerHeight': 200,
    'containerWidth': 675,
    'y': barData4[1],
    'y_domain': [0, d3.max(barData4[1])],
    'x': barData4[0],
  }, 
  barData3,
  ["#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb", "#845ccb"]);


  add_rect_click()
  
  pData1 = formatPieData(episodeCountArray);
  pieChartCharacterAppearances = new Pie({
    'parentElement': '#small1',
    'title': 'Appearance Percentage (In Each Season)',
  },
  pData1,
  ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]);

  pieChartCharacterWords = new Pie({
    'parentElement': '#small2',
    'title': 'Spoken Words Percentage (In Each Episode)',
  },
  pData2,
  ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]);

  legend = d3.select("#legend")
  legend.append("g")
    .attr("class", "legendQuant")
    .attr("transform", `translate(10,0)`);

  legendElement= d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .title("Color Character Legend")
    .titleWidth(100)
    .scale(d3.scaleOrdinal()
              .domain(['Spongebob', 'Patrick', 'Squidward', 'Mr. Krabs', 'Plankton', 'Karen', 'Sandy', 'Mrs. Puff', 'Pearl', 'Gary', "Other"])
              .range(["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F", "#845ccb"]));

  legend.select(".legendQuant")
    .call(legendElement);

}).catch(error => {
  console.error(error);
});

d3.select("#characterSelect").on("change", function(d) {
	let selectedOption = d3.select(this).property("value")
  filterCharacter(selectedOption)
})

d3.select("#seasonSelect").on("change", function(d) {
  let selectedOption = d3.select(this).property("value")
  let season = seasonListArray.indexOf(selectedOption);
  console.log(season);
  pData1 = formatPieData(episodeCountArray);
  pieChartCharacterAppearances.updateVis();
  pieChartCharacterWords.updateVis();
  filterSeason(selectedOption)
})

d3.select("#episodeSelect").on("change", function(d) {
	let selectedOption = d3.select(this).property("value")
  filterEpisode(selectedOption)
})

d3.select("#charToggle").on("change", d => {
  inputState = d3.select("#char2toggle").property('checked')
  if (inputState){
    top10 = characterEpisodeDict(fullEpisodesData)
    top10Vals = arrDict2Arr(top10, "value")
    top10Keys = arrDict2Arr(top10, "character")
    colorMap = generateColorMap(charColorMap, top10Keys)
    top10chars = capitalizeFirst(top10Keys)

    top10Words = characterWordDict(fullEpisodesData)
    bar2Words = arrDict2Arr(top10Words, "value")
    top10WordsKeys = arrDict2Arr(top10Words, "character")
    colorMapWords = generateColorMap(charColorMap, top10WordsKeys)
    top10charsWords = capitalizeFirst(top10WordsKeys)

    barChartCharacterAppearances.config.x = top10chars
    barChartCharacterAppearances.config.y = top10Vals
    barChartCharacterAppearances.colorScale = colorMap
    barChartCharacterAppearances.config.y_domain = [0, d3.max(top10Vals)]

    barChartWordCount.config.x = top10charsWords
    barChartWordCount.config.y = bar2Words
    barChartWordCount.colorScale = colorMapWords
    barChartWordCount.config.y_domain = [0, d3.max(bar2Words)]
    
    combinedCharacters = arrayUnique(top10chars.concat(top10charsWords))
    populateSelection(combinedCharacters, "#characterSelect")
    filterCharacter(combinedCharacters[0])
    // populateSelection(Seasons, "#seasonSelect")
  }
  else{
    barChartCharacterAppearances.config.x = barData1[0]
    barChartCharacterAppearances.config.y = barData1[1]
    barChartCharacterAppearances.colorScale = ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]
    barChartCharacterAppearances.config.y_domain = [0, d3.max(barData1[1])]

    barChartWordCount.config.x = barData2[0]
    barChartWordCount.config.y = barData2[1]
    barChartWordCount.colorScale = ["#FCFB63", "#FFA7AE", "#9FCDC0", "#E41B12", "#428985", "#4D5CAD", "#CE8656", "#EAE9A9", "#B9CCD5", "#E0506F"]
    barChartWordCount.config.y_domain = [0, d3.max(barData2[1])]
    populateSelection(characterArrayCapitalized, "#characterSelect")
    filterCharacter("Spongebob")
  }
  barChartCharacterAppearances.updateVis()
  barChartWordCount.updateVis()
  add_rect_click()


})

function formatPieData(data){

  //init
  const spongebob = data[0];
  const patrick = data[1];
  const squidward = data[2];
  const krabs = data[3];
  const plankton = data[4];
  const karen = data[5];
  const sandy = data[6];
  const puff = data[7];
  const pearl = data[8];
  const gary = data[9];
  let total = 0;

  data.forEach(d => total += d);


  const appearanceData = [
    {name:"Spongebob" , percent: (100*spongebob/total) , count: spongebob},
    {name:"Patrick" , percent: (100*patrick/total) , count: patrick},
    {name:"Squidward" , percent: (100*squidward/total) , count: squidward},
    {name:"Mr. Krabs" , percent: (100*krabs/total) , count: krabs},
    {name:"Plankton" , percent: (100*plankton/total) , count: plankton},
    {name:"Karen" , percent: (100*karen/total) , count: karen},
    {name:"Sandy" , percent: (100*sandy/total) , count: sandy},
    {name:"Mrs. Puff" , percent: (100*puff/total) , count: puff},
    {name:"Pearl" , percent: (100*pearl/total) , count: pearl},
    {name:"Gary" , percent: (100*gary/total) , count: gary},
  ];

  return appearanceData;
}

function filterCharacter(filterChar, filteredSunBurstdata=sunburstData) {
  sunBurst.data = getCharSentenceData(filteredSunBurstdata, filterChar)
  character = filterChar.toLowerCase()
  barChartSeasonEpisodeAppearances.config.y = calcCharAppearances(fullEpisodesData, character);
  barChartCharacterWordsPerSeason.config.y = calcCharWords(fullEpisodesData, character);

  barChartSeasonEpisodeAppearances.config.title = filterChar + bar3Title
  barChartCharacterWordsPerSeason.config.title = filterChar + bar4Title

  barChartCharacterWordsPerSeason.config.y_domain = [0, d3.max(calcCharWords(fullEpisodesData, character))]

  barChartSeasonEpisodeAppearances.updateVis()
  barChartCharacterWordsPerSeason.updateVis()

  barChartCharacterAppearances.highlightBar(characterArrayCapitalized.indexOf(filterChar))
  barChartWordCount.highlightBar(characterArrayCapitalized.indexOf(filterChar))

  sunBurst.updateVis()
}

function filterSeason(filterSeason) {
  if (filterSeason == "All"){
    seasonNum = 1
    data = fullEpisodesData
  } else {
    seasonNum = filterSeason.match(/[0-9]+$/)
    data = fullEpisodesData.filter(d => {return d.season == seasonNum})
  }
  episodeList = []
  data.forEach(d => {
    episodeList.push(d.title)
  })
  filteredsunburstData = sunburstData.filter(d => {return episodeList.includes(d.title)})

  inputState = d3.select("#char2toggle").property('checked')
  if (inputState){
    top10 = characterEpisodeDict(data)
    top10Vals = arrDict2Arr(top10, "value")
    top10Keys = arrDict2Arr(top10, "character")
    colorMap = generateColorMap(charColorMap, top10Keys)
    top10chars = capitalizeFirst(top10Keys)

    top10Words = characterWordDict(data)
    bar2Words = arrDict2Arr(top10Words, "value")
    top10WordsKeys = arrDict2Arr(top10Words, "character")
    colorMapWords = generateColorMap(charColorMap, top10WordsKeys)
    top10charsWords = capitalizeFirst(top10WordsKeys)

    // top 2 bar charts
    barChartCharacterAppearances.config.x = top10chars
    barChartCharacterAppearances.config.y = top10Vals
    barChartCharacterAppearances.colorScale = colorMap
    barChartCharacterAppearances.config.y_domain = [0, d3.max(top10Vals)]

    barChartWordCount.config.x = top10charsWords
    barChartWordCount.config.y = bar2Words
    barChartWordCount.colorScale = colorMapWords
    barChartWordCount.config.y_domain = [0, d3.max(bar2Words)]

    // pie charts
    pieChartCharacterAppearances.data = formatPieData(top10Vals);
    pieChartCharacterAppearances.colorScale = colorMap;

    pieChartCharacterWords.data = formatPieData(bar2Words);
    pieChartCharacterWords.colorScale = colorMapWords
    
    combinedCharacters = arrayUnique(top10chars.concat(top10charsWords))
    populateSelection(combinedCharacters, "#characterSelect")
    filterCharacter("Spongebob", filteredsunburstData)
  } else {
    apperance = mainCharCountApperance(data)
    words = mainCharCountWords(data)
    barChartCharacterAppearances.config.y = apperance
    barChartCharacterAppearances.config.y_domain = [0, d3.max(apperance)]
    barChartWordCount.config.y = words
    barChartWordCount.config.y_domain = [0, d3.max(words)]
    pieChartCharacterAppearances.data = formatPieData(apperance);
    pieChartCharacterWords.data = formatPieData(words);
  }
  populateSelection(episodeArr[seasonNum-1], "#episodeSelect")
  barChartCharacterAppearances.updateVis()
  barChartWordCount.updateVis()
  pieChartCharacterAppearances.updateVis()
  pieChartCharacterWords.updateVis()
  add_rect_click()
}

function filterEpisode(filterEpsode) {
  seasonNum= d3.select("#seasonSelect").property("value").match(/[0-9]+$/)
  if (seasonNum == null){
    dataSeason = fullEpisodesData
  } else {
    dataSeason = fullEpisodesData.filter(d => {return d.season == seasonNum})
  }

  if (filterEpsode == "All"){
    data = dataSeason
  } else {
    data = dataSeason.filter(d => {return d.episode == filterEpsode})
  }
  inputState = d3.select("#char2toggle").property('checked')
  if (inputState){
    top10Words = characterWordDict(data)
    bar2Words = arrDict2Arr(top10Words, "value")
    top10WordsKeys = arrDict2Arr(top10Words, "character")
    colorMapWords = generateColorMap(charColorMap, top10WordsKeys)
    top10charsWords = capitalizeFirst(top10WordsKeys)

    barChartWordCount.config.x = top10charsWords
    barChartWordCount.config.y = bar2Words
    barChartWordCount.colorScale = colorMapWords
    barChartWordCount.config.y_domain = [0, d3.max(bar2Words)]

    pieChartCharacterWords.data = formatPieData(bar2Words);
    pieChartCharacterWords.colorScale = colorMapWords
  } else {
    words = mainCharCountWords(data)
    barChartWordCount.config.y = words
    barChartWordCount.config.y_domain = [0, d3.max(words)]
    pieChartCharacterWords.data = formatPieData(words);
  }
  barChartWordCount.updateVis()
  pieChartCharacterWords.updateVis()
}

function add_rect_click(){
  barChartCharacterAppearances.chart.selectAll("rect").on("click", function(event, d) {
    barClickEvent(event, d, barChartCharacterAppearances, barChartWordCount)
  })

  barChartWordCount.chart.selectAll("rect").on("click", function(event, d) {
    barClickEvent(event, d, barChartWordCount, barChartCharacterAppearances)
  })

  barChartCharacterAppearances.highlightBar(0)
  barChartWordCount.highlightBar(0)
}


