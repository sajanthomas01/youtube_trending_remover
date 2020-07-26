$(function () {
  // get data from storage and prefill in input if exist
  chrome.storage.sync.get(["YTB_TRNDNG_BLK"], function (result) {
    console.log("Value currently is " + result.YTB_TRNDNG_BLK);
    if (result.YTB_TRNDNG_BLK) {
      const blockedList = JSON.parse(result.YTB_TRNDNG_BLK);
      $("#blocklist").val(blockedList.join());
    }
  });

  $(document).on("click", "#save", () => {
    try {
      const blockedList = $("#blocklist").val().split(",");
      console.log(JSON.stringify(blockedList));
      // Save it using the Chrome extension storage API.
      chrome.storage.sync.set(
        { YTB_TRNDNG_BLK: JSON.stringify(blockedList) },
        function () {
          console.log("Blocked list saved");
          alert("Saved, Please refresh the page to see blocker in action");
          window.close();
        }
      );
    } catch (error) {
      alert("Oops some error occured");
    }
  });
});
