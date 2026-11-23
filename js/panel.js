async function retrieveInfo() {
  const storedData = (await chrome.storage.local.get("B08MXGHP6K"))["B08MXGHP6K"];
  const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
  const days = storedData.history.map(pair => formatter.format(new Date(pair.date)))
  const price = storedData.history.map(pair => pair.price)
  // console.log(days)
  // console.log(price)
  const myChart = new Chart('priceAction', {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Price Action',
          borderColor: 'green',
          data: price
        }
      ]
    },
    options: {
      responsive: true, 
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
}

retrieveInfo(); 