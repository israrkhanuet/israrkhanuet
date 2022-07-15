function stringGen(len) {
  var text = "";

  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
    text += Math.floor(Math.random() * charset.length);
  }

  return text;
}

function retrieveWindowVariables(variables) {
  var ret = {};

  var scriptContent = "";
  for (var i = 0; i < variables.length; i++) {
    var currVariable = variables[i];
    scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" + currVariable + "', " + currVariable + ");\n";
  }

  var script = document.createElement("script");
  script.id = "tmpScript";
  script.appendChild(document.createTextNode(scriptContent));
  (document.body || document.head || document.documentElement).appendChild(script);

  for (var i = 0; i < variables.length; i++) {
    var currVariable = variables[i];
    ret[currVariable] = document.getElementsByTagName("body")[0].getAttribute("tmp_" + currVariable);
    document.getElementsByTagName("body")[0].removeAttribute("tmp_" + currVariable);
  }

  document.getElementById("tmpScript").remove();

  return ret;
}

function processData(html, keywordText) {
  const resJson = {
    uId: stringGen(8),
    noResults: 1,
    noResultsFirstPage: 1,
    lowReviews: 0,
    avgReviews: 0,
    highReviews: 0,
    lowPrice: 0,
    avgPrice: 0,
    highPrice: 0,
    titleText: [],
    urls: [],
    keywordText: keywordText,
  };

  const selectors = {
    url: {
      first: ".a-link-normal",
      second: ".a-link-normal",
    },
    titleText: {
      first: ".a-link-normal > span.a-size-base-plus",
      second: "span.a-size-medium.a-color-base.a-text-normal",
    },
    reviews: {
      first: "div.a-section.a-spacing-none div.a-row.a-size-small > span > a > span",
      second: "div.a-section.a-spacing-none div.a-row.a-size-small > span > a > span",
    },
    price: {
      first: ".a-offscreen",
      second: ".a-offscreen",
    },
    noResults: {
      first: "#search > span > div > h1 > div > div.sg-col-14-of-20.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 > div > div > span:nth-child(1)",
      second: "#search > span > div > span > h1 > div > div.sg-col-14-of-20.sg-col.s-breadcrumb.sg-col-10-of-16.sg-col-6-of-12 > div > div > span:nth-child(1)",
    },
  };
  var nodes = html.find(".s-main-slot.s-result-list [data-component-type=s-search-result]");

  const noResultsText = html.find(selectors.noResults.first).text();
  if (noResultsText) {
    const ofExists = noResultsText.split("of")[1];
    if (ofExists) {
      resJson.noResults = noResultsText
        .split("of")[1]
        .split("results")[0]
        .replace(/[^0-9.]/g, "");
    } else {
      resJson.noResults = noResultsText.split("results")[0].replace(/[^0-9.]/g, "");
    }
  }

  const noResultsFirstPage = html.find(selectors.noResults.first).text();
  if (noResultsFirstPage) {
    const ofExists = noResultsText.split("of")[1];
    if (ofExists) {
      resJson.noResultsFirstPage = Number(
        noResultsText
          .split("of")[0]
          .split("-")[1]
          .replace(/[^0-9.]/g, "")
      );
    }
    //  else {
    //   resJson.noResultsFirstPage = Number(noResultsText.split("results")[0].replace(/[^0-9.]/g, ""));
    // }
  }

  var totalReviews = 0,
    totalPrice = 0,
    firstPageItems = nodes.length,
    priceArr = [],
    reviewsArr = [];

  $(nodes).each(function (i) {
    // var isSponsored = item.find("[data-component-type=sp-sponsored-result]");
    var title = $(this).find(selectors.titleText.first);
    if (title.length === 0) {
      title = $(this).find(selectors.titleText.second);
    }
    resJson.titleText.push(title.text());

    var url = $(this).find(selectors.url.first);
    if (url.length === 0) {
      url = $(this).find(selectors.url.second);
    }
    resJson.urls.push(url.attr("href"));

    const currentPrice = $(this)
      .find(selectors.price.first)
      .eq(0)
      .text()
      .replace(/[^0-9.]/g, "");
    totalPrice += currentPrice ? Number(currentPrice) : 0;
    priceArr.push(currentPrice ? Number(currentPrice) : 0);

    const currentReview = $(this)
      .find(selectors.reviews.first)
      .text()
      .replace(/[^0-9.]/g, "");

    totalReviews += currentReview ? Number(currentReview) : 0;
    reviewsArr.push(currentReview ? Number(currentReview) : 0);

    // titles.push({
    //   title: node.text(),
    //   index: index,
    //   // isSponsored: isSponsored == null ? false : true,
    // });
  });
  resJson.lowPrice = Math.min(...priceArr).toFixed(0);
  resJson.avgPrice = (totalPrice / firstPageItems).toFixed(2);
  resJson.highPrice = Math.max(...priceArr).toFixed(0);

  resJson.lowReviews = Math.min(...reviewsArr)
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  resJson.avgReviews = (totalReviews / firstPageItems)
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  resJson.highReviews = Math.max(...reviewsArr)
    .toFixed()
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // console.log(resJson);
  return resJson;
}

function getDataForEachKeyword(keywords) {
  /**
   * Clearn remove dups
   */
  const cleanedKeywords = keywords.map((keyword) => {
    let cleaned = keyword.replace(/[^A-Za-z ]+/g, "").toLowerCase();
    cleaned = cleaned.replace(/\b\w{1}\b/gm, "").trim();
    return cleaned;
  });
  const noDupsArray = cleanedKeywords.filter((v, i) => cleanedKeywords.indexOf(v) === i);

  // console.log(noDupsArray);

  let promiseArray = [];

  for (const sQuery of noDupsArray) {
    promiseArray.push(
      // HTTP request to get product details
      new Promise(async (resolve, reject) => {
        const url = `https://www.amazon.com/s?k=${sQuery.split(" ").join("+")}`;
        fetch(url)
          .then(function (response) {
            // The API call was successful!
            return response.text();
          })
          .then(async function (html) {
            const itemProcessed = await processData($(html), sQuery);

            resolve(itemProcessed);
            return;
          })
          .catch(function (error) {
            console.log("Error", error);
            reject(error);
          });
      })
    );
  }

  // Done all promise
  Promise.all(promiseArray).then(function (promiseData) {
    // const data2 = JSON.stringify({ suggestions: allKeywords });

    // console.log(promiseData);

    chrome.runtime.sendMessage({
      message: "suggestionsGoogleBingAmzFinal",
      respData: promiseData,
    });
    window.close();
  });
}
// const fullData = ["trivia books", "book for trivia", "Trivia books", "5 books for trivia"];
// getDataForEachKeyword(fullData);

// const links = "trivia book";
// const finalExtraction = true;

if (links.length > 0) {
  let promiseArray = [];
  var variables = retrieveWindowVariables(["ue_mid", "ue_id", "ue_sid"]);
  let allKeywords = [];
  const mid = variables.ue_mid;
  const requestId = variables.ue_id;
  const sessionId = variables.ue_sid;
  const alias = "aps";
  const limit = 11;

  if (!finalExtraction) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
    // console.log(links[0]);
    for (let i = 0; i <= chars.length; i++) {
      // const prefix = `${"Sudoku puzzle book"} ${chars[i]}`;
      const prefix = `${links[0]} ${chars[i]}`;

      let link = `https://completion.${location.hostname.replace(
        "www.",
        ""
      )}/api/2017/suggestions?session-id=${sessionId}&request-id=${requestId}&mid=${mid}&alias=${alias}&prefix=${prefix}&limit=${limit}`;

      promiseArray.push(
        // HTTP request to get product details
        new Promise((resolve, reject) => {
          fetch(link)
            .then(function (response) {
              // The API call was successful!
              return response.json();
            })
            .then(function (res) {
              // console.log("res", res);
              const keywords = res.suggestions.map((keyword) => {
                return keyword.value;
              });

              allKeywords = allKeywords.concat(keywords);

              resolve(keywords);
              return;
            })
            .catch(function (error) {
              console.log("Error", error);
              // reject(error);
            });
        })
      );
    }
  }

  /**
   * Huge expander
   */
  for (let l = 0; l < links.length; l++) {
    const prefix2 = `${links[l]}`;
    let linkHuge = `https://completion.${location.hostname.replace(
      "www.",
      ""
    )}/api/2017/suggestions?session-id=${sessionId}&request-id=${requestId}&mid=${mid}&alias=${alias}&prefix=${prefix2}&limit=${limit}`;

    promiseArray.push(
      // HTTP request to get product details
      new Promise((resolve, reject) => {
        fetch(linkHuge)
          .then(function (response) {
            // The API call was successful!
            return response.json();
          })
          .then(function (res) {
            // console.log("res", res);
            const keywords = res.suggestions.map((keyword) => {
              return keyword.value;
            });

            allKeywords = allKeywords.concat(keywords);

            resolve(keywords);
            return;
          })
          .catch(function (error) {
            console.log("Error", error);
            // reject(error);
          });
      })
    );
  }

  // Done all promise
  Promise.all(promiseArray).then(function (promiseData) {
    const data2 = JSON.stringify({ suggestions: allKeywords });

    if (finalExtraction) {
      let fullData = links;
      for (const item of allKeywords) {
        fullData = fullData.concat(item);
      }
      getDataForEachKeyword(fullData);
    } else {
      chrome.runtime.sendMessage({
        message: "suggestionsGoogleBingAmz",
        respData: data2,
      });
      window.close();
    }
    // chrome.runtime.sendMessage(null, data2);
  });
}
