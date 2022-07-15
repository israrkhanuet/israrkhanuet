(function () {
  function messageListenerFunc(request, sender, sendResponse) {
    if (request.message === "getGoogleSearchData") {
      console.log("authFailed");
    }
  }
  chrome.runtime.onMessage.addListener(messageListenerFunc);
})();
