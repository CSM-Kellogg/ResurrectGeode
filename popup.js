// document.getElementById("RetrievePage").addEventListener("click", () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//           target: { tabId: tabs[0].id },
//           function: getPageText
//       }, (result) => {
//           if (result && result[0]) {
//               alert("Page content: " + result[0].result.substring(0, 100) + "...");
//               saveTextToFile(result[0].result);
//           }
//       });
//   });
// });


// The path that this executes from: https://reg-prod.mines.elluciancloud.com:8118/StudentRegistrationSsb/ssb/classSearch/classSearch
document.getElementById("DownloadCatalog").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['searchCourses.js']
    });
  });
});

// Gets the main body of the web page (may need tweaking)
function getPageText() {
  return document.body.innerText;
}

// Saves some list to a file
function saveTextToFile(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "out.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}