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
  const price = extractPrice();
  if (!price) return;
  const title = extractTitle();
  const asin = extractAsin();
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
function extractPrice() {

  const selectors = [
    "#corePriceDisplay_desktop_feature_div .priceToPay .a-offscreen",
    "#corePriceDisplay_desktop_feature_div .priceToPay .aok-offscreen",
    "#corePrice_feature_div .a-offscreen",
    "#corePriceDisplay_desktop_feature_div .a-offscreen",
    "#apex_desktop .a-offscreen",
    "#apex-pricetopay-accessibility-label",
    "#price_inside_buybox",
    "#kindle-price",
  ];

  for (const selector of selectors) {
    const price = parsePrice(document.querySelector(selector)?.textContent);
    if (price) return price;
  }

  // some layouts only render the visible whole/fraction spans
  const whole = document.querySelector(".priceToPay .a-price-whole");
  if (whole) {
    const fraction = document.querySelector(".priceToPay .a-price-fraction");
    const digits = (el) => (el?.textContent ?? "").replace(/\D/g, "");
    return parsePrice(`${digits(whole)}.${digits(fraction) || "00"}`);
  }
  return null;
}

function parsePrice(text) {
  if (!text) return null;
  const match = text.replace(/,/g, "").match(/\d+(?:\.\d{1,2})?/);
  const price = match ? Number(match[0]) : NaN;
  return Number.isFinite(price) && price > 0 ? price : null;
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