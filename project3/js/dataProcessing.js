function getCharSentenceData(data, speaker) {
  // console.log("k", data)
  // console.log("o", speaker)
    let charData = {name:`${speaker}: `, children:[]}
    data.forEach(d => {
      d.data.forEach(d2 => {
        if (d2.character == speaker){
          // console.log("ok", d2.sentences.children)
          tmp = merge(charData.children, d2.sentences.children)
          // console.log(tmp)
          charData.children = tmp
        }
      })
    })
    // console.log("kk", charData)
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
    return charWordDicts.slice(0, 10)
  }

  function characterWordDict(data) {
    characterArray = []
    charWordDicts = []
    data.forEach(d => {
      Object.entries(d.words).forEach(([key, value]) => {
        if (characterArray.includes(key)) {
          arrSum = Object.values(value).reduce((a, b) => a + b, 0);
          charWordDicts[characterArray.indexOf(key)].value += arrSum;
        } else {
          characterArray.push(key)
          arrSum = Object.values(value).reduce((a, b) => a + b, 0);
          charWordDicts.push({"character": key, "value": arrSum})
        }
     });
    })
    charWordDicts.sort(function(a,b) {
      return b.value - a.value
    });
    return charWordDicts.slice(0, 10)
  }
  
  function getEpisodesInSeasons(data) {
    episodeArr = []
    lastEpisode = 99
  
    data.forEach(d => {
      if (+d.episode < lastEpisode) {
        idx = d.season - 1
        episodeArr[idx] = ["All"]
      }
      lastEpisode = +d.episode
      episodeArr[idx].push(d.episode)
    })
  
    return episodeArr
  }
  
  function formatSelectData(data, order=["character", "season", "episode"]) {
    // [{"patrick" : {"season 1": [1,2,3,4,5]}]
    // character, season, episode
    formatted = {}
    let first = []
    let second = {}
    idx = null
  
    data.forEach((d, i) => {
      evalDict = {"season": `Season ${d.season}`, "episode": d.episode}
      if (order[0] == "character"){
        Object.keys(d.words).forEach(name => {
          if (first.indexOf(name) == -1){
            first.push(name)
            formatted[name] = {[evalDict[order[1]]]: [evalDict[order[2]]]}
          } else {
            if (formatted[name][evalDict[order[1]]]){
              formatted[name][evalDict[order[1]]].push(evalDict[order[2]])
            } else {formatted[name][evalDict[order[1]]] = [evalDict[order[2]]]}
          }
        })
      }
      // start with season or episode
      else{
        if (first.indexOf(evalDict[order[0]]) == -1){
          first.push(evalDict[order[0]])
          formatted[evalDict[order[0]]] = {}
          second[formatted[evalDict[order[0]]]] = []
        }
        if (order[1] == "character"){
          Object.keys(d.words).forEach(name => {
            if (second[formatted[evalDict[order[0]]]].indexOf(name) == -1){
              second[formatted[evalDict[order[0]]]].push(name)
              formatted[evalDict[order[0]]][name] = [evalDict[order[2]]]
            } else {
              formatted[evalDict[order[0]]][name].push(d.episode)
            }
          })
        }else{
          if (second[formatted[evalDict[order[0]]]].indexOf(evalDict[order[1]]) == -1){
            second[formatted[evalDict[order[0]]]].push(evalDict[order[1]])
            formatted[evalDict[order[0]]][evalDict[order[1]]] = []
          } 
          Object.keys(d.words).forEach(name => {
            formatted[evalDict[order[0]]][evalDict[order[1]]].push(name)
          })
        }
          // formatted[evalDict[order[0]]] = {[evalDict[order[1]]]: [evalDict[order[2]]]}
      
    }
    })
    
    return formatted
  }
  
  
  function populateSelection(data, id) {
    d3.select(id).selectAll("option").remove()
    d3.select(id)
      .selectAll('option')
      .data(data)
      .enter()
      .append('option')
      .text( d => d) 
      .attr("value",  d => d) 
      .property("selected", function(d){if (id == "#characterSelect") {return d == "Spongebob";}});
      
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
    charWordsData = Object.values(seasonWordCountDict)
    return charWordsData
  };


  function barClickEvent(event, d, chart1, chart2) {
    eachBand = chart1.xScale.step();
      xPos = (d3.pointer(event, chart1)[0] - 108)
      indx = Math.floor(xPos/eachBand)
      value = d[indx]
  
      filterCharacter(value)
      chart1.highlightBar(indx)
      chart2.highlightBar(indx)
  }
  
  function arrDict2Arr(d, key) {
    CountArray = []; 
    d.forEach(object => {
      CountArray.push(object[key])
    })
    return CountArray
  }
  
  function capitalizeFirst(data) {
    newArr = []
    data.forEach(d =>{
      words = d.split(" ")
      word = ""
      words.forEach(w => {
        if (w != "and") {
          if (w == "spongebob"){
            word = "Spongebob "
          }else{
            if (w){
              word += w[0].toUpperCase() + w.substr(1) + " "
            }
          }
        } else{
          word += w + " "
        }
      })
      newArr.push(word.slice(0, -1))
    })
    return newArr
  }
  
  function generateColorMap(map, chars) {
    colors = []
    chars.forEach(d => {
      if (Object.keys(map).includes(d)) {
        colors.push(map[d])
      } else {
        colors.push("#845ccb")
      }
    })
    return colors
  }
  
  function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
  
    return a;
  }
  
  function mainCharCountApperance(data){
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
    console.log(data)
    data.forEach(d => {
      Object.entries(d.words).forEach(([key]) => {
        for (let i = 0; i < 10; i++) {
          if (key == characterArray[i]) {
            if (episodeCountDict[key]) episodeCountDict[key]++;
            else episodeCountDict[key] = 1
          }
        }
     });
    });
    console.log(episodeCountDict)
    return Object.values(episodeCountDict)
  }
  
  function mainCharCountWords(data){
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
    data.forEach(d => {
      Object.entries(d.words).forEach(([key, value]) => {
        for (let i = 0; i < 10; i++) {
          if (key == characterArray[i]) {
            if (charWordCountDict[key]) charWordCountDict[key] += Object.values(value).reduce((a, b) => a + b, 0);
            else charWordCountDict[key] = Object.values(value).reduce((a, b) => a + b, 0);
          }
        }
    });
    });
    return Object.values(charWordCountDict)
  }

  function perEachSeasonFormat(data) {
    let season = 0;
    console.log("data", data);

    arrayTitle = data.map(function(x) {
      return x[0];
    })
    console.log(arrayTitle);

    /*data.forEach(d => {
    arrayTitle = data.map(function(x) {
      return x[season];
    });
    season++
   })
   */

  };

    

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
  
