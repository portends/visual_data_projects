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