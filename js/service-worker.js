chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true})
  .catch((error) => console.error(error));


function handleMessage(message, sender, sendResponse){

  console.log(sender)
  const trackDate = Date.now();
  const storedData = (chrome.storage.local.get(message.asin))[message.asin]

  if((new Date(trackDate)).toDateString() == (new Date(storedData?.history.at(-1).date))?.toDateString()) storedData.history.pop();


  chrome.storage.local.set({
    [message.asin]: {
      "title": message.asin,
      "history": [...(storedData?.history ?? []), {"date": trackDate, "price": message.price}]
    }
  })
    .then(() =>{
      sendResponse(200)
    })
    .catch((e) => {
      sendResponse(400)
    });

  return true;
}

chrome.runtime.onMessage.addListener(handleMessage)

// chrome.offscreen.createDocument({

// })