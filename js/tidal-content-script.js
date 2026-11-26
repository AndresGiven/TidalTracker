function renderTrackButton(){

  //do not render a button if one already exists
  if (document.querySelector(".tidal-button")){
    return;
  }

  //create button, ensure it does not submit forms when applicable
  const button = document.createElement("button");
  button.textContent = `Track Price`;
  button.classList.add("tidal-button");
  button.type = `button`;
  button.addEventListener("click", onTrackPrice)

  //identify a suitable position to place the button
  const buyNow = document.getElementById("buyNow_feature_div");
  const addToCart = document.getElementById("addToCart_feature_div");
  const addToAutoBuy = document.getElementById("digital-dash-create-high-prominence");
  (buyNow ?? addToCart ?? addToAutoBuy )?.insertAdjacentElement("afterend", button);
}

async function onTrackPrice(){
  const price = extractPrice(document);
  if (!price) return;
  const title = extractTitle(document);
  const asin = extractAsin(document);
  const image = extractImage(document);
  const data = {"type": "track", "title": title,"asin": asin, "price": price, "image": image}
  const response = await chrome.runtime.sendMessage(data);
  console.log(response)
}


const targetNode = document.getElementById("ppd");
const config = {attributes: true, childList: true, subtree: true, characterData: true};

const observer = new MutationObserver(renderTrackButton)
observer.observe(targetNode, config);


renderTrackButton()