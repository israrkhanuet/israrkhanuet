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

function calculateScore(totalResult, avgBSR, avgReviews, avgPrice, keyword) {
  console.time("calculateScore");
  // Calculate total result score
  var totalResultScore = 0;
  totalResult = parseInt(totalResult);
  if (totalResult >= 10001) {
    totalResultScore = 4 * 1;
  } else if (totalResult >= 4001 && totalResult <= 10000) {
    totalResultScore = 4 * 2;
  } else if (totalResult >= 2501 && totalResult <= 4000) {
    totalResultScore = 4 * 3;
  } else if (totalResult >= 1001 && totalResult <= 2500) {
    totalResultScore = 4 * 4;
  } else if (totalResult >= 501 && totalResult <= 1000) {
    totalResultScore = 4 * 5;
  } else if (totalResult >= 76 && totalResult <= 400) {
    totalResultScore = 4 * 6;
  } else if (totalResult >= 0 && totalResult <= 75) {
    totalResultScore = 4 * 7;
  }

  // Calculate average bsr score
  var avgBSRScore = 0;
  avgBSR = parseInt(avgBSR);
  if (avgBSR >= 1000001) {
    avgBSRScore = 4 * 1;
  } else if (avgBSR >= 500000 && avgBSR <= 1000000) {
    avgBSRScore = 4 * 2;
  } else if (avgBSR >= 250001 && avgBSR <= 499999) {
    avgBSRScore = 4 * 3;
  } else if (avgBSR >= 150001 && avgBSR <= 250000) {
    avgBSRScore = 4 * 4;
  } else if (avgBSR >= 75001 && avgBSR <= 150000) {
    avgBSRScore = 4 * 5;
  } else if (avgBSR >= 25000 && avgBSR <= 75000) {
    avgBSRScore = 4 * 6;
  } else if (avgBSR >= 1 && avgBSR < 25000) {
    avgBSRScore = 4 * 7;
  }

  // Calculate average reviews score
  var avgReviewsScore = 0;
  avgReviews = parseInt(avgReviews);
  if (avgReviews >= 1000) {
    avgReviewsScore = 3 * 1;
  } else if (avgReviews >= 500 && avgReviews <= 999) {
    avgReviewsScore = 3 * 2;
  } else if (avgReviews >= 350 && avgReviews <= 499) {
    avgReviewsScore = 3 * 3;
  } else if (avgReviews >= 100 && avgReviews <= 349) {
    avgReviewsScore = 3 * 4;
  } else if (avgReviews >= 50 && avgReviews <= 99) {
    avgReviewsScore = 3 * 5;
  } else if (avgReviews >= 25 && avgReviews <= 49) {
    avgReviewsScore = 3 * 6;
  } else if (avgReviews >= 0 && avgReviews <= 24) {
    avgReviewsScore = 3 * 7;
  }

  // Calculate average reviews score
  var avgPriceScore = 0;
  avgPrice = parseFloat(avgPrice);
  if (avgPrice >= 0 && avgPrice <= 5.99) {
    avgPriceScore = 3 * 1;
  } else if (avgPrice >= 6 && avgPrice <= 6.99) {
    avgPriceScore = 3 * 2;
  } else if (avgPrice >= 7 && avgPrice <= 7.99) {
    avgPriceScore = 3 * 3;
  } else if (avgPrice >= 8 && avgPrice <= 8.99) {
    avgPriceScore = 3 * 4;
  } else if (avgPrice >= 9 && avgPrice <= 9.99) {
    avgPriceScore = 3 * 5;
  } else if (avgPrice >= 10 && avgPrice <= 10.99) {
    avgPriceScore = 3 * 6;
  } else if (avgPrice >= 11) {
    avgPriceScore = 3 * 7;
  }

  var totalScore = totalResultScore + avgBSRScore + avgReviewsScore + avgPriceScore;
  var maxScorePercent = 0.98;

  var finalScore = parseFloat(totalScore / maxScorePercent);
  // console.log("finalScore 1", finalScore);

  // New Rules Add Keyword Score algorithm -
  // keyword only has 1 space it gets minus 15 % of total score.
  // If keyword has 5 or more spaces it gets minus 20 % of total score

  // let keyword = $("#twotabsearchtextbox").val().trim();

  if (keyword.length > 0) {
    let spaces = keyword.split(" ").length - 1;
    if (spaces >= 6) {
      finalScore = finalScore - 10;
    } else if (spaces <= 1) {
      finalScore = finalScore - 10;
    }
  }

  if (totalResult > 10000) {
    finalScore = finalScore - finalScore * 0.3;
    // console.log("finalScore 2", finalScore);
  } else {
    /**
     *  New rules
     *  If less 250 results = 76% max score
     *  If less than 250 results = -10%
     *  If less than 200 results = -15%
     *  If less than 150 results = -20%
     *  If less than 100 results = -25%
     */

    if (totalResult < 100) {
      finalScore = finalScore - 25;
    } else if (totalResult < 150) {
      finalScore = finalScore - 20;
    } else if (totalResult < 200) {
      finalScore = finalScore - 15;
    } else if (totalResult < 250) {
      finalScore = finalScore - 10;
    }

    if (totalResult < 250 && finalScore > 76) {
      finalScore = 76;
    }
  }
  // New Rules for Avg BSR
  // 	500, 000 average BSR or more = -10 %,
  // 	750, 000 average BSR and more = -15 % ,
  // 	1, 000, 000 average BSR and more = -20 % ,
  // 	2, 000, 000 average BSR = -25 %
  //  If average BSR 500,000 or higher (worse) = 65% max score

  if (avgBSR >= 2000000) {
    finalScore = finalScore - 25;
  } else if (avgBSR >= 1000000) {
    finalScore = finalScore - 20;
  } else if (avgBSR >= 750000) {
    finalScore = finalScore - 15;
  } else if (avgBSR >= 500000) {
    finalScore = finalScore - 10;
  }

  if (finalScore > 65 && avgBSR > 500000) {
    finalScore = 65;
  }
  console.timeEnd("calculateScore");

  return finalScore.toFixed(1);
}

function renderkeywords(keywordsArray) {
  const instances = arrToInstanceCountObj(keywordsArray);
  // console.log("All keywords instances");
  const array = convertInstanceToArray(instances);
  // console.log(array);

  // Populate total keywords
  $("#totalKeywords").html(`(${keywordsArray.length})`);
  $("#selectAll").change(function () {
    if ($("#selectAll").prop("checked")) {
      // checkboxes
      $(".checkboxes").prop("checked", true);
    } else {
      $(".checkboxes").prop("checked", false);
    }
  });

  const table = $("#scoreTable");
  const tbody = $("<tbody>");
  for (const item of keywordsArray) {
    let competetiveness = "Low";
    if (Number(item.noResults) > 5000) {
      competetiveness = "High";
    } else if (Number(item.noResults) > 1000) {
      competetiveness = "Medium";
    }
    const trhtml = `
    <tr id="row_${item.uId}">
			<td><input class="form-check-input checkboxes" type="checkbox" value="" id="selectRow_${item.uId}"></td>
			<td id="keywordText_${item.uId}">${item.keywordText}</td>
			<td class="colSeperator" id="competetiveness_${item.uId}">${competetiveness}</td>
			<td id="noResults_${item.uId}">${item.noResults.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
			<td id="onFirstPage_${item.uId}">${item.noResultsFirstPage}</td>
			<td id="avgReviews_${item.uId}">${item.avgReviews}</td>
			<td id="highReviews_${item.uId}">${item.highReviews}</td>
			<td id="lowReviews_${item.uId}">${item.lowReviews}</td>
			<td id="avgPrice_${item.uId}">${item.avgPrice}</td>
			<td id="highPrice_${item.uId}">${item.highPrice}</td>
			<td id="lowPrice_${item.uId}">${item.lowPrice}</td>
			<td class="colSeperator"><button class="btn btn-success" id="searchVol_${item.uId}">Get</button></td>
			<td><a href=https://trends.google.co.in/trends/explore?date=all&q='${encodeURI(item.keywordText)}' target='_blank'>See</a></td>
			<td class="colSeperator" id="monthlySales_${item.uId}">Monthly Sales</td>
			<td id="indp_${item.uId}">Independ Pub</td>
			<td id="bsr_${item.uId}">Avg. BSR</td>
			<td id="highbsr_${item.uId}">High. BSR</td>
			<td id="lowbsr_${item.uId}">Low BSR</td>
			<td id="score_${item.uId}">Score</td>
      <td id="scoreColor_${item.uId}">
          <span style="
              width: 20px;
              height: 20px;
              display:table; 
              background: #c3c3c3;
              border-radius: 100px;">
          </span>
      </td>
			<td><button class="btn btn-success" id="${item.uId}">Analyze</button></td>
  	</tr>`;
    tbody.append($(trhtml));
    tbody.find(`#${item.uId}`)[0].addEventListener("click", function (e) {
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

      // renderBsrScore(productDataSample);
      /**
       * createTabAndExtracData
       */
      createTabAndExtractData(
        {
          searcEngineURL: "https://www.amazon.com/",
          data: item,
        },
        "js/keywordResearch/execScriptAmzBsrScore.js",
        true
      );
    });

    tbody.find(`#searchVol_${item.uId}`)[0].addEventListener("click", function (e) {
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

      $.getJSON(
        `https://keywordseverywhere.com/service/2/getKeywordData.php?apiKey=6c469b875c73d74c19b3&country=&currency=&dataSource=cli&source=bulktd&version=10.12&kw%5B%5D=${item.keywordText}&t=1637410048489`
      ).then((json) => {
        Swal.close();
        if (json.data[0].vol >= 0) {
          $(`#searchVol_${item.uId}`).replaceWith(json.data[0].vol.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
          $(`#searchVol_${item.uId}`).parent().attr("id", `searchVolText_${item.uId}`);
        }
      });
    });
  }
  table.append(tbody);
  Swal.close();
}

function renderBsrScore(respData) {
  const lowBsr = Math.min(...respData.productsData.map((item) => Number(item.bsr)));
  const avgBsr = respData.productsData.map((item) => Number(item.bsr)).reduce((a, b) => a + b, 0) / respData.productsData.length;
  const highBsr = Math.max(...respData.productsData.map((item) => Number(item.bsr)));

  var score = calculateScore(respData.noResults, avgBsr, Number(respData.avgReviews), Number(respData.avgPrice), respData.keywordText);
  var ScoreColor = "#ddd";
  if (score >= 87.6 && score <= 100) {
    ScoreColor = "#3dff2c";
  } else if (score >= 75.1 && score <= 87.5) {
    ScoreColor = "#48ff00";
  } else if (score >= 65.1 && score <= 87.5) {
    ScoreColor = "#48ff00";
  } else if (score >= 62.6 && score <= 75) {
    ScoreColor = "#aeff00";
  } else if (score >= 60.0 && score <= 65.0) {
    ScoreColor = "#aeff00";
  } else if (score >= 50.1 && score <= 62.5) {
    ScoreColor = "#f4ff00";
  } else if (score >= 50.1 && score <= 59.9) {
    ScoreColor = "#D5EA69";
  } else if (score >= 37.6 && score <= 50) {
    ScoreColor = "#f7f400";
  } else if (score >= 25.1 && score <= 37.5) {
    ScoreColor = "#ffc700";
  } else if (score >= 12.6 && score <= 25) {
    ScoreColor = "#ff7c00";
  } else if (score >= 0 && score <= 12.5) {
    ScoreColor = "#ff0002";
  }
  // console.log("ScoreColor", ScoreColor);

  let monthlySales = 0;
  if (avgBsr > 0 && avgBsr < 3000000) {
    for (let index = 0; index < USMapper.length; index++) {
      if (avgBsr <= USMapper[index][0] && avgBsr >= USMapper[index + 1][0] && (index > 0 || index < USMapper.length - 2)) {
        const diffInBSR = USMapper[index + 1][1] - USMapper[index][1];
        const diffA = avgBsr - USMapper[index + 1][0];
        const diffB = USMapper[index][0] - USMapper[index + 1][0];
        monthlySales = USMapper[index + 1][1] - (diffA / diffB) * diffInBSR;
      }
    }
  }

  var indSellers = respData.productsData.filter(function (item) {
    return item.seller.indexOf("Independently published") !== -1;
  }).length;

  $(`#monthlySales_${respData.uId}`).text(monthlySales.toFixed());
  $(`#indp_${respData.uId}`).text(indSellers);
  $(`#lowbsr_${respData.uId}`).text(
    lowBsr
      .toFixed()
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  $(`#bsr_${respData.uId}`).text(
    avgBsr
      .toFixed()
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  $(`#highbsr_${respData.uId}`).text(
    highBsr
      .toFixed()
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
  $(`#score_${respData.uId}`).text(score.split(".")[0]);
  $(`#scoreColor_${respData.uId}`).html(`<span style="
    width: 20px;
    height: 20px;
    display:table; 
    background: ${ScoreColor};
    border-radius: 100px;">
  </span>`);
  Swal.close();
}

function createTabAndExtractData(msg, scriptLoc = "js/execScript.js") {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url: msg.searcEngineURL, active: false }, function (tab) {
      chrome.tabs.executeScript(
        tab.id,
        {
          code: `const keywordData = ${JSON.stringify(msg.data)};`,
        },
        function () {
          chrome.tabs.executeScript(tab.id, { file: "js/jquery-3.3.1.min.js" }, function () {
            chrome.tabs.executeScript(tab.id, { file: scriptLoc }, function () {
              resolve(msg.searcEngineURL);
            });
          });
        }
      );
    });
  });
}
