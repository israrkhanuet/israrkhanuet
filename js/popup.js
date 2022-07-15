(function () {
  let userPackage = null;
  chrome.runtime.sendMessage({ message: 'userStatus' },function(response) {
    console.log("RespObject",response);
     userPackage =response?.userPackage;

    if (!response.userStatus) { 
        window.location.replace('./pop-up-sign-in.html');
    }

    document.querySelector('#pkg').innerHTML = `you have ${userPackage} Package`;

  });
  document.querySelector("#analyze").addEventListener("click", function (e) {
    console.log(chrome.runtime.getURL("options.html"));
    chrome.tabs.create({ url: chrome.extension.getURL("options.html") });
  });
  document.querySelector("#keywordResearchTool").addEventListener("click", function (e) {
    console.log(chrome.runtime.getURL("js/keywordResearch/kr.html"));
    chrome.tabs.create({ url: chrome.extension.getURL("js/keywordResearch/kr.html") });
  });

  document.querySelector("#logout").addEventListener("click", function (e) {
    chrome.runtime.sendMessage({message:"logout",payload: {}},function(response){
      if(response == 'success') window.location.replace('./pop-up-sign-in.html');
  });
  });
})();
