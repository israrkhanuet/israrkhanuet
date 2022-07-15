// const fetchSuggetions = (url) => {

// };

const promiseArray = [];
// const googleLinks = ["https://www.google.com/search?q=What%27s%20the%20Best"];

let selector1 = "#botstuff";
let selector2 = "a div";
if (location.host === "www.bing.com") {
  selector1 = ".b_ans div.b_rs ul.b_vList.b_divsec";
  selector2 = "a";
}
for (let i = 0; i < links.length; i++) {
  console.log(links[i]);
  promiseArray.push(
    new Promise((resolve, reject) => {
      fetch(links[i])
        .then(function (response) {
          // The API call was successful!
          return response.text();
        })
        .then(function (html) {
          // Convert the HTML string into a document object
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, "text/html");

          // Get the image file
          var botstuff = doc.querySelector(selector1);

          if (botstuff) {
            function get42(doc) {
              // if()
              var tds = doc.querySelectorAll(selector2);
              return Array.prototype.map.call(tds, function (t) {
                return t.innerText;
              });
            }

            var filtered = get42(botstuff).filter(function (el) {
              return el != null && el != "";
            });
            resolve(filtered);
          } else {
            resolve([]);
          }
        })
        .catch(function (err) {
          // There was an error
          console.warn("Something went wrong.", err);
          reject(err);
        });
    })
  );
}

// let data = JSON.stringify({ title: "page_title", h1: "page_h1_tag" });
// chrome.runtime.sendMessage(null, data);

Promise.all(promiseArray).then(function (promiseData) {
  console.log("promiseData", promiseData);
  const data2 = JSON.stringify({ suggestions: promiseData });
  chrome.runtime.sendMessage({
    message: "suggestionsGoogleBingAmz",
    respData: data2,
  });
  // chrome.runtime.sendMessage(null, data2);
  window.close();
});
