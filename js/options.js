let titlesList = [];
let suggestionsList = [];
let dataRetriveStatus = {
  google: false,
  bing: false,
  amazon: false,
};
let searchedText = "";
let titleText = "";
let totalKeywordTriFourGrams = [];

const setDoneEngineValues = (senderUrl) => {
  for (const key of Object.keys(dataRetriveStatus)) {
    if (senderUrl.indexOf(key) !== -1) {
      dataRetriveStatus[key] = true;
    }
  }
};

const populateData = async () => {
  try {
    const allWebsitesStatusDone = Object.values(dataRetriveStatus).every((el) => el === true);
    if (allWebsitesStatusDone) {
      console.log(titlesList);

      const totalKeywords = [...suggestionsList, ...titlesList];

      const totalTrigrams = await getGrams(totalKeywords.join(" "), 3);
      const total4grams = await getGrams(totalKeywords.join(" "), 4);
      const total5grams = await getGrams(totalKeywords.join(" "), 5);

      totalKeywordTriFourGrams = [
        ...totalTrigrams,
        ...total4grams,
        ...total5grams,
        ...suggestionsList,
        // ...totalKeywords,
      ];

      // Remove empty items
      totalKeywordTriFourGrams = totalKeywordTriFourGrams.filter(function (el) {
        if (el) {
          /**
           * Remove exluded keywords
           */
          let found = false;
          for (const eKey of exludedKeywordsList) {
            if (el.indexOf(eKey) > -1) {
              found = true;
              break;
            }
          }

          if (!found) return el;
        }
        // return el;
      });

      console.log("Converted all keywords and title to Tri and 4 grams");
      console.log(totalKeywordTriFourGrams);

      /**
       * Sorted total keywords
       */
      const instances = arrToInstanceCountObj(totalKeywordTriFourGrams);
      console.log("All keywords instances");
      console.log(instances);
      const array = convertInstanceToArray(instances);

      // sortedMostToLeast
      const ML = array.sort(function (a, b) {
        return b.occurance - a.occurance;
      });

      const G1_MLContainsExactST = [];
      const G2_MLNotContainsExactST = [];
      const G3_MLNotContainsST = [];
      $("#G1_MLContainsExactST").empty();
      $("#G2_MLNotContainsExactST").empty();
      $("#G3_MLNotContainsST").empty();

      console.log($("#G1_MLContainsExactST").children().length);
      console.log($("#G2_MLNotContainsExactST").children().length);
      console.log($("#G3_MLNotContainsST").children().length);

      const revML = ML.reverse();

      function appendByGrams(grams) {
        // console.log("grams", grams);
        for (let i = revML.length - 1; i > 0; i--) {
          const item = revML[i];
          const tempST = searchedText.toUpperCase();
          const tempTitle = titleText.toUpperCase();
          const itemKey = item.key.toUpperCase();

          // Don't add anything less than 12 character & words less than gram
          // console.log("itemKey.split()", itemKey);
          // console.log("itemKey.split().length", itemKey.split(" ").length);
          if (itemKey.length < 12 || itemKey.split(" ").length !== grams) {
            continue;
          }

          if (itemKey.indexOf(tempST) !== -1) {
            G1_MLContainsExactST.push(item);
            $("<li/>").addClass("list-group-item").text(item.key.toLowerCase()).appendTo($("#G1_MLContainsExactST"));
            $("#G1_MLContainsExactST").append();
            revML.pop();
          } else if (tempST.split(" ").some((v) => itemKey.indexOf(v) >= 0)) {
            G2_MLNotContainsExactST.push(item);
            $("<li/>").addClass("list-group-item").text(item.key.toLowerCase()).appendTo($("#G2_MLNotContainsExactST"));
            $("#G2_MLNotContainsExactST").append();
            revML.pop();
          } else if (tempTitle.split(" ").every((v) => itemKey.indexOf(v) === -1)) {
            G3_MLNotContainsST.push(item);
            $("<li/>").addClass("list-group-item").text(item.key.toLowerCase()).appendTo($("#G3_MLNotContainsST"));
            $("#G3_MLNotContainsST").append();
            revML.pop();
          }
        }
      }

      appendByGrams(5);
      appendByGrams(4);
      appendByGrams(3);
      appendByGrams(2);

      function resetColsIfEmpty(colId) {
        if ($(colId).children().length === 0) {
          $("<li/>").addClass("list-group-item").text("No Data Available").appendTo($(colId));
        }
      }

      resetColsIfEmpty("#G1_MLContainsExactST");
      resetColsIfEmpty("#G2_MLNotContainsExactST");
      resetColsIfEmpty("#G3_MLNotContainsST");

      /**
       * Sorted oneGrams
       */
      const totalOnegrams = await getGrams(totalKeywords.join(" "), 1);
      const G4_MLOneGramNotInST = [];
      const instancesOneGram = arrToInstanceCountObj(totalOnegrams);
      const arrayOneGram = convertInstanceToArray(instancesOneGram);

      // sortedMostToLeast OneGram
      let MLOneGram = arrayOneGram.sort(function (a, b) {
        return b.occurance - a.occurance;
      });

      // Remove empty one grams items
      MLOneGram = MLOneGram.filter(function (el) {
        if (el.key) {
          /**
           * Remove exluded keywords
           */
          if (exludedKeywordsList.indexOf(el.key) === -1) {
            return el;
          }
        }
        // return el;
      });
      $("#G4_MLOneGramNotInST").empty();
      for (let item of MLOneGram) {
        const tempTitle = titleText.toUpperCase();
        const itemKey = item.key.toUpperCase();
        if (tempTitle.indexOf(itemKey) === -1 && itemKey.length > 3) {
          G4_MLOneGramNotInST.push(item);
          $("<li/>").addClass("list-group-item").text(item.key).appendTo($("#G4_MLOneGramNotInST"));
          $("#G4_MLOneGramNotInST").append();
        }
      }

      const groupSelectors = ["G1_MLContainsExactST", "G2_MLNotContainsExactST", "G3_MLNotContainsST", "G4_MLOneGramNotInST"];

      for (let item of groupSelectors) {
        if ($(item).children() === 0) {
          $("<li/>").addClass("list-group-item").text("No Data Available").appendTo($(item));
        }
      }

      let maxKeyWords = 7;
      let currentKeywords = [];

      for (let j = 0; j < maxKeyWords; j++) {
        if ($("#G3_MLNotContainsST").children().length && currentKeywords.length - 1 < j) {
          for (let i = 0; i < $("#G3_MLNotContainsST").children().length - 1; i++) {
            const keywordText = $("#G3_MLNotContainsST").children().eq(i).text();

            if (keywordText.length <= 45 && currentKeywords.indexOf(keywordText) === -1) {
              currentKeywords.push(keywordText);
              break;
            }
          }
        }

        if ($("#G2_MLNotContainsExactST").children().length && currentKeywords.length - 1 < j) {
          for (let i = 0; i < $("#G2_MLNotContainsExactST").children().length - 1; i++) {
            const keywordText = $("#G2_MLNotContainsExactST").children().eq(i).text();

            if (keywordText.length <= 45 && currentKeywords.indexOf(keywordText) === -1) {
              currentKeywords.push(keywordText);
              break;
            }
          }
        }
      }
      console.log("currentKeywords", currentKeywords);

      for (let i = 0; i < maxKeyWords; i++) {
        // console.log(`#keyword_${i + 1}`);
        // console.log($(`#keyword_${i + 1}`));
        // console.log($(`#keyword_${i + 1}`).val());
        $(`#keyword_${i + 1}`).val(currentKeywords[i]);
      }

      console.log("Col 1", G1_MLContainsExactST);
      console.log("Col 2", G2_MLNotContainsExactST);
      console.log("Col 3", G3_MLNotContainsST);
      console.log("Col 4", G4_MLOneGramNotInST);

      Swal.close();
    }
  } catch (e) {
    console.log(e);
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "Error processing data!",
      html: "Please try again.",
      // timer: 2000,
      // progressBar: true,
      showConfirmButton: true,
    });
  }
};

function messageListenerFunc(request, sender, sendResponse) {
  // console.log("request", request);
  // console.log("sender", sender);
  if (request.message === "suggestionsGoogleBingAmz") {
    const respData = JSON.parse(request.respData);
    // for (let i = 0; i < suggestions; i++){
    for (const item of respData.suggestions) {
      /**
       * Filter all suggestions which are more than 5 words from google bing
       */
      let newItem = item;
      if (sender.url.indexOf("google") !== -1 || sender.url.indexOf("bing") !== -1)
        newItem = item.filter(function (el) {
          if (el) {
            if (el.split(" ").length <= 5) {
              return el;
            }
          }
        });
      suggestionsList = suggestionsList.concat(newItem);
    }
    console.log("Suggestions from ", sender.url);
    console.log(respData);
    setDoneEngineValues(sender.url);
    populateData();
  }
  return true;
}
chrome.runtime.onMessage.addListener(messageListenerFunc);

function textCounter(fieldId, labelId) {
  maxlimit = 45;
  console.log(maxlimit);
  let label = document.getElementById(labelId);
  let field = document.getElementById(fieldId);
  if (field.value.length > maxlimit) {
    field.value = field.value.substring(0, maxlimit);
    return false;
  } else {
    label.innerHTML = `${field.value.length}/45`;
  }
}

for (let i = 1; i <= 7; i++) {
  document.querySelector(`#keyword_${i}`).addEventListener("keyup", function (e) {
    textCounter(`keyword_${i}`, `keyword_${i}_label`);
  });

  document.querySelector(`#keyword_${i}_label`).innerHTML = "0/45";
}

document.querySelector("#analyze").addEventListener("click", function (e) {
  // console.log(chrome.runtime.getURL("options.html"));

  searchedText = $("#p_keyword").val().trim();
  titleText = $("#p_title").val().trim();
  if (searchedText.length < 1 && titleText.length < 1) {
    Swal.fire({
      icon: "error",
      title: "Error processing data!",
      html: "Please enter a valid Keyword and Title, then try again.",
      // timer: 2000,
      // progressBar: true,
      showConfirmButton: true,
    });
    return;
  }
  Swal.fire({
    title: "Processing...",
    html: "Please don't close the tab.",
    allowOutsideClick: false,
    // timer: 2000,
    showConfirmButton: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    },
  });

  $.get(`https://www.amazon.com/s?k=${searchedText.split(" ").join("+")}`, function (html) {
    $.get(`https://www.amazon.com/s?k=${searchedText.split(" ").join("+")}&page=2`, function (html2) {
      processData(`${html} ${html2}`, searchedText);
    }).fail(function (error) {
      console.log("error2", error);
    });
    // processData(html, searchedText);
  }).fail(function (error) {
    console.log("error1", error);
  });
});
// })();

processData = async (html, searchedText) => {
  const amzTitlesList = getProductTitlesString($(html));

  // const amzTitlesList = [
  //   "Funster 1,000+ Sudoku Puzzles Easy to Hard: Sudoku puzzle book for adults",
  //   "Sudoku Free Puzzle Book for Adults: 3000 Medium to Hard Sudoku Puzzles with Solutions - Vol. 1",
  //   "1000 Sudoku Puzzles 500 Medium & 500 Hard: Medium Free to Hard Sudoku Puzzle Book for Adults with Answers",
  //   "Big Free Book of (Sudoku): Over 500 Puzzles & Solutions, movie Easy to Hard Puzzles for Adults",
  //   "The Ultimate++ Brain Health Puzzle Book marker for Adults: Crosswords, Sudoku, Cryptograms, Word Searches, and More!",
  //   "Brain Free Games - Large Print Sudoku Puzzles (Green)",
  // ];

  console.log("amzTitlesList:", amzTitlesList);
  if (amzTitlesList.length > 0) {
    /**
     * Reset for new search
     */
    titlesList = [];
    dataRetriveStatus = {
      google: false,
      bing: false,
      amazon: false,
    };
    totalKeywordTriFourGrams = [];
    suggestionsList = [];
    //-------------------------

    titlesList = amzTitlesList;
    console.log("Amazon titles:", titlesList);
    const trigrams = await getGrams(titlesList.join(" "), 3);
    const titleTrigrams = trigrams.filter(function (el) {
      return el;
    });
    console.log("Trigrams from amazon titles:", titleTrigrams);
    const instances = arrToInstanceCountObj(titleTrigrams);
    console.log("Instances of each Trigrams", instances);
    const keyCount = getKeyCount(instances, 2);
    console.log("Keys going to google bing", keyCount);

    const googleLinks = [];
    const bingLinks = [];

    for (let i = 0; i < keyCount.length; i++) {
      // keyCount.forEach(function (i) {
      const googleLink = `https://www.google.com/search?q=${encodeURI(keyCount[i])}`;
      googleLinks.push(googleLink);
      const bingLink = `https://www.bing.com/search?q=${encodeURI(keyCount[i])}`;
      bingLinks.push(bingLink);
    }
    const sEngines = await Promise.all([
      await sendMessageSearchEngine({
        searcEngineURL: "https://www.google.com/",
        links: googleLinks,
      }),
      await sendMessageSearchEngine({
        searcEngineURL: "https://www.bing.com/",
        links: bingLinks,
      }),
      await sendMessageSearchEngine(
        {
          searcEngineURL: "https://www.amazon.com/",
          links: searchedText,
        },
        "js/execScriptAMZ.js"
      ),
    ]);
  } else {
    Swal.fire({
      icon: "error",
      title: "Failed to fetch keyword data!",
      html: "Please enter another Keyword and Title, then try again.",
      // timer: 2000,
      // progressBar: true,
      showConfirmButton: true,
    });
  }
};

function sendMessageSearchEngine(msg, scriptLoc = "js/execScript.js") {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url: msg.searcEngineURL, active: false }, function (tab) {
      chrome.tabs.executeScript(
        tab.id,
        {
          code: "const links = " + JSON.stringify(msg.links),
        },
        function () {
          chrome.tabs.executeScript(tab.id, { file: scriptLoc }, function () {
            resolve(msg.searcEngineURL);
          });
        }
      );
    });
  });
}

function getProductTitlesString(html) {
  var nodes = html.find(".s-main-slot.s-result-list [data-component-type=s-search-result]");
  var titles = [];
  $(nodes).each(function (i) {
    // var isSponsored = item.find("[data-component-type=sp-sponsored-result]");
    var node = $(this).find(".a-link-normal > span.a-size-base-plus");
    if (node.length === 0) {
      node = $(this).find("span.a-size-medium.a-color-base.a-text-normal");
    }
    var index = $(this).attr("data-index");
    // titles += ` ${node.text()}`;
    titles.push(node.text());
    // titles.push({
    //   title: node.text(),
    //   index: index,
    //   // isSponsored: isSponsored == null ? false : true,
    // });
  });
  return titles;
}

function getGrams(str, grams) {
  return new Promise((resolve, reject) => {
    // Remove special characters
    let cleaned = str.replace(/[^A-Za-z ]+/g, "").toLowerCase();
    cleaned = cleaned.replace(/\b\w{1}\b/gm, "");
    let words = cleaned.split(" ").filter(function (el) {
      return el;
    });
    if (grams === 1) {
      resolve(words);
    }
    let finalArray = [];

    words.forEach(function myFunction(item, i) {
      // for (var i = 0; i < words.length; i++) {
      // validate that the next words exists
      let pairedWords = "";

      if (grams === 2) {
        if (words[i + 1]) {
          pairedWords += words[i] + " " + words[i + 1];
        }
        // else break;
      }
      if (grams === 3) {
        if (words[i + 1] && words[i + 2]) {
          pairedWords += `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
        }
        // else break;
      }
      if (grams === 4) {
        if (words[i + 1] && words[i + 2] && words[i + 3]) {
          pairedWords += `${words[i]} ${words[i + 1]} ${words[i + 2]} ${words[i + 3]}`;
        }
        // else break;
      }
      if (grams === 5) {
        if (words[i + 1] && words[i + 2] && words[i + 3] && words[i + 4]) {
          pairedWords += `${words[i]} ${words[i + 1]} ${words[i + 2]} ${words[i + 3]}  ${words[i + 4]}`;
        }
        // else break;
      }
      pairedWords = pairedWords.toLowerCase();
      finalArray.push(pairedWords);
      if (i === words.length - 1) {
        resolve(finalArray);
      }
      // }
    });
  });
}

const arrToInstanceCountObj = (arr) =>
  arr.reduce((obj, e) => {
    obj[e] = (obj[e] || 0) + 1;
    return obj;
  }, {});

const convertInstanceToArray = (instance) => {
  const arr = [];
  for (let key of Object.keys(instance)) {
    arr.push({ key, occurance: instance[key] });
  }
  return arr;
};

function getKeyCount(list, count) {
  const arr = [];
  // const obj = ;
  for (var x of Object.keys(list)) {
    if (list[x] > count) {
      arr.push(x);
    }
  }
  return arr;
}
