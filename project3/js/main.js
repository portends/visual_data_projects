let line1, line2, line3, line4, line5, line6, bar1, bar2, bar3, bar4, map
let groupedData, groupedDataYear, data

let characterArray = ['spongebob', 'patrick', 'squidward', 'mr. krabs', 'plankton', 'karen', 'sandy', 'mrs. puff', 'pearl', 'gary'];
let characterArrayCapitalized = ['Spongebob', 'Patrick', 'Squidward', 'Mr. Krabs', 'Plankton', 'Karen', 'Sandy', 'Mrs. Puff', 'Pearl', 'Gary'];
let Seasons = ["Season 1", "Season 2", "Season 3", "Season 4", "Season 5", "Season 6", "Season 7", "Season 8", "Season 9", "Season 10", "Season 11", "Season 12"]
let seasonListArray = ['Season 1', 'Season 2', 'Season 3', 'Season 4', 'Season 5', 'Season 6', 'Season 7', 'Season 8', 'Season 9', 'Season 10', 'Season 11', 'Season 12'];

Promise.all([
	d3.json('data/episodeDictionary.json'),
	d3.json('data/test.json'),
]).then(data => {
	let fullEpisodesData = data[0];
  let sunburstData = data[1];
  
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
  populateSelection(episodeArr[1], "#episodeSelect")
  

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
  barData3[1] = calcCharAppearances(fullEpisodesData, 'pearl');

  barData4[0] = seasonListArray;
  barData4[1] = calcCharWords(fullEpisodesData, 'pearl');

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
  ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

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
  ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

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
  ["#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d", "#28a75d"]);

}).catch(error => {
  console.error(error);
});

function getCharSentenceData(data, speaker) {
  let charData = {name:`${speaker}: `, children:[]}
  data.forEach(d => {
    d.data.forEach(d2 => {
      if (d2.character == speaker){
        tmp = merge(charData.children, d2.sentences.children)
        charData.children = tmp
      }
    })
  })
  // return top 50 roots
  charData.children.sort(function(a,b) {
    return b.value - a.value
});
  charData.children = charData.children.slice(0, 20)
  return charData
}

function merge(arr1, arr2) {
  tmp1 = arr1
  delIdx = null
  arr1.forEach(d => {
    arr2.forEach((d2, i) => {
      if (d.name == d2.name) {
        d.value =+ d2.value
        d.children = merge(d.children, d2.children)
        delIdx = i
      } 
    })
    arr2.splice(delIdx, 1)
  })
  arr3 = arr1.concat(arr2)
  return arr3
}

function characterEpisodeDict(data) {
  characterArray = []
  charWordDicts = []
  data.forEach(d => {
    Object.entries(d.words).forEach(([key]) => {
      if (characterArray.includes(key)) {
        charWordDicts[characterArray.indexOf(key)].value++;
      } else {
        characterArray.push(key)
        charWordDicts.push({"character": key, "value": 1})
      }
   });
  })
  charWordDicts.sort(function(a,b) {
    return b.value - a.value
  });
  console.log("test5", charWordDicts.slice(0, 10))
}

function getEpisodesInSeasons(data) {
  episodeArr = []
  lastEpisode = 99

  data.forEach(d => {
    if (+d.episode < lastEpisode) {
      idx = d.season
      episodeArr[idx] = []
    }
    lastEpisode = +d.episode
    episodeArr[idx].push(d.episode)
  })

  return episodeArr
}

function formatSelectData(data) {
  // [{"patrick" : {"season 1": [1,2,3,4,5]}]
  // character, season, episode
  formatted = [{"all": {}}]
  let characters = ["all"]
  idx = null
  

  lastEpisode = 99
  data.forEach((d, i) => {
    Object.keys(d.words).forEach(name => {
      if (characters.indexOf(name) == -1){
        characters.push(name)
        formatted.push({[name]: {[`season ${d.season}`]: [d.episode]}})
      } else {
        formatIdx = characters.indexOf(name)
        if (formatted[formatIdx][name][`season ${d.season}`]){
          formatted[formatIdx][name][`season ${d.season}`].push(d.episode)
        } else {formatted[formatIdx][name][`season ${d.season}`] = [d.episode]}
      }
    })
    if (+d.episode < lastEpisode) {
      idx = d.season
      formatted[0].all[`season ${idx}`] = []
    }
    lastEpisode = +d.episode
    formatted[0].all[`season ${idx}`].push(d.episode)

  })

  console.log("format", formatted)
}


function populateSelection(data, id) {
  d3.select(id)
    .selectAll('option')
    .data(data)
    .enter()
    .append('option')
    .text( d => d) 
    .attr("value",  d => d) 
    // .property("selected", function(d){if (id == "1") {return d === value;}});
	
}

function calcCharAppearances(data, character) {
  charAppearancesData = [];
  
  let seasonEpisodeCountDict =  {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
  }

  data.forEach(d => {
    season = d.season
    Object.entries(d.words).forEach(([key]) => {
      if (key == character) {
        seasonEpisodeCountDict[season]++;
      }
   });
  });

  charAppearancesData = Object.values(seasonEpisodeCountDict)
  return charAppearancesData
};

function calcCharWords(data, character) {
  charWordsData = [];
  
  let seasonWordCountDict =  {
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
  }

  data.forEach(d => {
    season = d.season
    Object.entries(d.words).forEach(([key, value]) => {
      if (key == character) {
        arrSum = Object.values(value).reduce((a, b) => a + b, 0);
        seasonWordCountDict[season] += arrSum
      }
   });
  });
  console.log(seasonWordCountDict)

  charWordsData = Object.values(seasonWordCountDict)
  return charWordsData
};
