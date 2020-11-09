chrome.runtime.onMessage.addListener((request, sender) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let toUncheck = 0;
    let toCheck = 0;
    for (let i=0; i<request.operations.length; i++) {
      if (request.operations[i].action === 'checked') {
        toCheck++;
      } else if (request.operations[i].action === 'unchecked') {
        toUncheck++;
      }
    }
    chrome.browserAction.setBadgeText({
      //text: '+' + toCheck + '-' + toUncheck, // request.operations.length.toString(),
      text: toUncheck + '/' +  (toCheck + toUncheck),
      tabId: tabs[0].id,
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: toUncheck > 0 ? 'red' : (toCheck > 0 ? 'blue' : 'green'),
      tabId: tabs[0].id,
    });
    chrome.storage.sync.set({ [sender.url]: request.operations });
    setTimeout(() => {
      chrome.storage.sync.remove(sender.url);
    }, 300000);
  });
});

chrome.browserAction.setPopup({
  popup: 'src/popup.html',
});
