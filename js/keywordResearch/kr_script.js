// Add event on analyze button
let searchedText = "",
  suggestionsList = [],
  dataRetriveStatus = {
    google: false,
    bing: false,
    amazon: false,
  },
  finalExtraction = false;
document.querySelector("#reset").addEventListener("click", function (e) {
  window.location.reload();
});

function getRowText(selector) {
  const item = document.querySelector(selector);
  if (!item) {
    return "";
  }
  const text = item.textContent.trim();
  return text === "undefined" ? "" : `"${text}"`;
}

document.querySelector("#download").addEventListener("click", function (e) {
  const selectedRowsIds = [];
  if (document.querySelectorAll("#scoreTable tbody > tr").length > 0) {
    document.querySelectorAll("#scoreTable tbody > tr").forEach(function (row) {
      if (row.querySelector(".checkboxes").checked) {
        selectedRowsIds.push(row.id.split("_")[1]);
      }
    });
  }

  if (selectedRowsIds.length === 0) {
    Swal.fire({
      title: "Download Fail...",
      html: "Please select rows to download.",
      allowOutsideClick: false,
    });
  } else {
    const csvFileData = [];
    selectedRowsIds.forEach(function (rowId) {
      const csvRow = [];
      csvFileDataHeaderIds.forEach((headerId) => {
        csvRow.push(getRowText(`#${headerId}${rowId}`));
      });
      csvFileData.push(csvRow);
    });
    console.log(csvFileData);
    download_csv_file(csvFileData);
  }
});

document.querySelector("#analyze").addEventListener("click", function (e) {
  /**
   * Reset search items
   */
  $("#scoreTable > tbody").remove();
  searchedText = "";
  suggestionsList = [];
  dataRetriveStatus = {
    google: false,
    bing: false,
    amazon: false,
  };
  finalExtraction = false;

  searchedText = $("#p_keyword").val().trim();
  // searchedText = "sudoku for kids";
  if (searchedText.length < 1) {
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

  dataRetriveStatus = {
    google: !$("#googleCheck").is(":checked"),
    bing: !$("#bingCheck").is(":checked"),
    amazon: !$("#amazonCheck").is(":checked"),
  };
  console.log(dataRetriveStatus);
  // Get related from google, bing, amz1, amz2
  getRelatedKeywords([searchedText]);
  // renderkeywords(keywordsArray);
});

async function getRelatedKeywords(searchedTextArray) {
  if (searchedText.length > 0) {
    /**
     * Reset for new search
     */
    // dataRetriveStatus = {
    //   google: false,
    //   bing: false,
    //   amazon: false,
    // };
    finalExtraction = false;
    suggestionsList = [];

    const googleLinks = [];
    const bingLinks = [];

    for (let i = 0; i < searchedTextArray.length; i++) {
      // keyCount.forEach(function (i) {
      if (!dataRetriveStatus.google) {
        const googleLink = `https://www.google.com/search?q=${encodeURI(searchedTextArray[i])}`;
        googleLinks.push(googleLink);
      }
      if (!dataRetriveStatus.bing) {
        const bingLink = `https://www.bing.com/search?q=${encodeURI(searchedTextArray[i])}`;
        bingLinks.push(bingLink);
      }
    }
    const promiseArr = [];

    if (!dataRetriveStatus.google) {
      promiseArr.push(
        await sendMessageSearchEngine({
          searcEngineURL: "https://www.google.com/",
          links: googleLinks,
        })
      );
    }
    if (!dataRetriveStatus.bing) {
      promiseArr.push(
        await sendMessageSearchEngine({
          searcEngineURL: "https://www.bing.com/",
          links: bingLinks,
        })
      );
    }

    if (!dataRetriveStatus.amazon) {
      promiseArr.push(
        await sendMessageSearchEngine(
          {
            searcEngineURL: "https://www.amazon.com/",
            links: [searchedText],
          },
          "js/keywordResearch/execScriptAmzAzHuge.js"
        )
      );
    }
    await Promise.all(promiseArr);
  }
}

const setDoneEngineValues = (senderUrl) => {
  for (const key of Object.keys(dataRetriveStatus)) {
    if (senderUrl.indexOf(key) !== -1) {
      dataRetriveStatus[key] = true;
    }
  }
};

async function messageListenerFunc(request, sender, sendResponse) {
  // console.log("request", request);
  // console.log("sender", sender);
  if (request.message === "suggestionsGoogleBingAmz") {
    const respData = JSON.parse(request.respData);
    // for (let i = 0; i < suggestions; i++){
    for (const item of respData.suggestions) {
      /**
       * Filter all suggestions which are more than 5 words from google bing
       */
      // let newItem = item;
      // if (sender.url.indexOf("google") !== -1 || sender.url.indexOf("bing") !== -1)
      //   newItem = item.filter(function (el) {
      //     if (el) {
      //       if (el.split(" ").length <= 5) {
      //         return el;
      //       }
      //     }
      //   });
      suggestionsList = suggestionsList.concat(item);
    }
    // console.log("Suggestions from ", sender.url);
    // console.log(respData);
    setDoneEngineValues(sender.url);
    const allWebsitesStatusDone = Object.values(dataRetriveStatus).every((el) => el === true);
    // console.log("allWebsitesStatusDone", allWebsitesStatusDone);
    if (allWebsitesStatusDone) {
      console.log("3 Done", suggestionsList);
      finalExtraction = true;
      dataRetriveStatus.amazon = false;

      /**
       * Clearn remove dups
       */
      const cleanedKeywords = suggestionsList.map((keyword) => {
        let cleaned = keyword.replace(/[^A-Za-z ]+/g, "").toLowerCase();
        cleaned = cleaned.replace(/\b\w{1}\b/gm, "").trim();
        return cleaned;
      });

      const noDupsArray = cleanedKeywords.filter((v, i) => cleanedKeywords.indexOf(v) === i);
      noDupsArray.unshift(searchedText);

      /**
       * Removed random words
       */
      const randomWordsList = ["press here", "see more"];
      const _words = noDupsArray.filter((v, i) => randomWordsList.indexOf(v) === -1);
      /**
       * Final extraction
       */
      await sendMessageSearchEngine(
        {
          searcEngineURL: "https://www.amazon.com/",
          links: _words,
        },
        "js/keywordResearch/execScriptAmzAzHuge.js",
        true
      );
    }
  } else if (request.message === "suggestionsGoogleBingAmzFinal") {
    // if (finalExtraction === true) {
    finalExtraction = false;
    console.log("4 done", request.respData);
    // }
    renderkeywords(request.respData);
  } else if (request.message === "bsrScoreData") {
    renderBsrScore(request.respData);
  }
  return true;
}

chrome.runtime.onMessage.addListener(messageListenerFunc);

function sendMessageSearchEngine(msg, scriptLoc = "js/execScript.js", fE = false) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url: msg.searcEngineURL, active: false }, function (tab) {
      chrome.tabs.executeScript(
        tab.id,
        {
          code: `const links = ${JSON.stringify(msg.links)};
					const finalExtraction = ${fE};`,
        },
        function () {
          chrome.tabs.executeScript(tab.id, { file: scriptLoc }, function () {
            chrome.tabs.executeScript(tab.id, { file: "js/jquery-3.3.1.min.js" }, function () {
              resolve(msg.searcEngineURL);
            });
          });
        }
      );
    });
  });
}
