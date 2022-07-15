function retrieveWindowVariables(variables) {
  var ret = {};

  var scriptContent = "";
  for (var i = 0; i < variables.length; i++) {
    var currVariable = variables[i];
    scriptContent +=
      "if (typeof " +
      currVariable +
      " !== 'undefined') document.getElementsByTagName('body')[0].setAttribute('tmp_" +
      currVariable +
      "', " +
      currVariable +
      ");\n";
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

// const links = "trivia book";

if (links.length > 0) {
  let promiseArray = [];
  var variables = retrieveWindowVariables(["ue_mid", "ue_id", "ue_sid"]);
  let allKeywords = [];

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  for (let i = 0; i <= chars.length; i++) {
    const mid = variables.ue_mid;
    const requestId = variables.ue_id;
    const sessionId = variables.ue_sid;
    const alias = "aps";
    // const prefix = `${"Sudoku puzzle book"} ${chars[i]}`;
    const prefix = `${links} ${chars[i]}`;
    const limit = 11;
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
            console.log("res", res);
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
    chrome.runtime.sendMessage({
      message: "suggestionsGoogleBingAmz",
      respData: data2,
    });
    // chrome.runtime.sendMessage(null, data2);
    window.close();
  });
}
