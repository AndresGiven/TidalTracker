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
  const title = extractTitle();
  const asin = extractAsin();
  const price = extractPrice();
  const image = extractImage();
  const data = {"type": "track", "title": title,"asin": asin, "price": price, "image": image}
  const response = await chrome.runtime.sendMessage(data);
  console.log(response)
}

function extractAsin(){
  const asin = document.getElementById("ASIN")

  if (asin && asin.value) return asin.value

  //asin should always exist as an element but just in case URL fallback is handy, URL check may fail with shortened links
  const match = window.location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/);
  return match ? match[1] : null;
}

function extractPrice(){
  //extract the price from the page
  const desktopPrice = document.getElementById("corePrice_feature_div")?.querySelector(".a-offscreen");
  const mobilePrice = document.getElementById("apex-pricetopay-accessibility-label");
  const priceText = (desktopPrice ?? mobilePrice).textContent.replace(/[^0-9.]/g, "");
  //extremely sketchy OR operator but I think it should work in all contexts? false || false, not really sure why it works
  const priceFloat = (Number.parseFloat(priceText) || 0);
  //mobile price accessability class contains discount info muddling the final sale price, cutting decimals is hacky but effecitve
  // e.g. "$199.00 with 34 percent savings" becomes "199.0034"
  //this behavior seems predictable and thus truncating the price lgtm
  return Math.trunc(priceFloat * 100) / 100;
}

function extractImage(){

}

function extractTitle(){
  const desktopTitle = document.getElementById("productTitle")
  const mobileTitle = document.getElementById("title")
  const titleText = (desktopTitle ?? mobileTitle).textContent.trim()
  return titleText
}

function extractImage() {
  const img = document.querySelector("#landingImage, #imgBlkFront, #ebooksImgBlkFront, #main-image");
  if (!img) return null;

  const candidates = [img.getAttribute("data-old-hires"), img.getAttribute("src")];
  try {
    candidates.push(...Object.keys(JSON.parse(img.getAttribute("data-a-dynamic-image") || "{}")));
  } catch {}
  return candidates.find((url) => url && url.startsWith("https://")) ?? null;
}

const targetNode = document.getElementById("ppd");
const config = {attributes: true, childList: true, subtree: true, characterData: true};

const observer = new MutationObserver(renderTrackButton)
observer.observe(targetNode, config);


renderTrackButton()