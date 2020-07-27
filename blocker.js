let pollInterval = 3000;
let blockedList = [];
const hitURL = "https://www.youtube.com/feed/trending";

// debounce taken from https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};

const runDebouncer = () => {
  blockedList.length ? modifyDOM() : getBlockedList();
};

$(window).on("scroll", debounce(runDebouncer, 1500));

const getBlockedList = () => {
  chrome.storage.sync.get(["YTB_TRNDNG_BLK"], function (result) {
    if (result.YTB_TRNDNG_BLK) {
      blockedList = JSON.parse(result.YTB_TRNDNG_BLK);
      console.log(blockedList.join());
      modifyDOM();
    }
  });
};

const modifyDOM = () => {
  $("yt-formatted-string.style-scope.ytd-channel-name.complex-string").each(
    function () {
      if (blockedList.indexOf($(this).text()) >= 0) {
        $(this).closest("ytd-video-renderer").remove();
      }
    }
  );
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
  if (request.message === "UPDATE") {
    if (request.url.url === hitURL) {
      setTimeout(() => {
        getBlockedList();
      }, 3000);
    }
  }
});
