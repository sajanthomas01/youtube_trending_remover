let pollInterval = 3000;
let blockedList = [];
const hitURL = "https://www.youtube.com/feed/trending";
var intervalRunner;

// throttling taken from https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

const runDebouncer = () => {
  blockedList.length ? modifyDOM() : getBlockedList();
};

window.addEventListener("scroll", throttle(runDebouncer, 1000));

const getBlockedList = () => {
  try {
    chrome.storage.sync.get(["YTB_TRNDNG_BLK"], function (result) {
      if (result.YTB_TRNDNG_BLK) {
        blockedList = JSON.parse(result.YTB_TRNDNG_BLK);
        if (blockedList.length === 0) {
          return clearInterval(intervalRunner);
        }
        modifyDOM();
      } else {
        return clearInterval(intervalRunner);
      }
    });
  } catch (error) {
    clearInterval(intervalRunner);
  }
};

const modifyDOM = () => {
  $("yt-formatted-string.style-scope.ytd-channel-name.complex-string").each(
    function () {
      if (blockedList.indexOf($(this).text()) >= 0) {
        $(this).closest("ytd-video-renderer").remove();
      }
    }
  );
  console.log('Cleaned the trending shit')
  clearInterval(intervalRunner);
};

if (document.readyState === "ready" || document.readyState === "complete") {
  getBlockedList();
} else {
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      getBlockedList();
    }
  };
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  // here i believe some improvement is needed, i'm not getting status completed with url, so as a quick
  //workaround i wrapped in in settimeout
  // any better idea will be appreciated :)
  // console.log("Loc hit ==>", request);
  if (request.message === "UPDATE" && request.url.status === "complete") {
    if (window.location.href === hitURL) {
      clearInterval(intervalRunner);
      intervalRunner = setInterval(() => {
        getBlockedList();
      }, 3000);
    }
  }
});
