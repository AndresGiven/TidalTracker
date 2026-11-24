chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true})
  .catch((error) => console.error(error));

function handleMessage(message, sender, sendResponse){
  const TYPES = ["track"]
  const type = message?.type
  if (!(TYPES.includes(type))){
    return false;
  }
  switch (type) {
    case "track":
      track(message, sendResponse)
        .then((result) => sendResponse({"ok": true, ...result}))
        .catch((e) => sendResponse({"ok": false, "error": e.message}));
      return true
  }
}

async function track(message, sendResponse) {
  const trackDate = Date.now();
  const storedData = (chrome.storage.local.get(message.asin))[message.asin]

  if((new Date(trackDate)).toDateString() == (new Date(storedData?.history.at(-1).date))?.toDateString()) storedData.history.pop();


  chrome.storage.local.set({
    [message.asin]: {
      "title": message.asin,
      "history": [...(storedData?.history ?? []), {"date": trackDate, "price": message.price}]
    }
  })

  return true;
}

chrome.runtime.onMessage.addListener(handleMessage)