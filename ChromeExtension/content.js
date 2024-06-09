// content.js

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrollToBottom(stopScroll) {
  let pageHeight = document.body.scrollHeight;
  let currentScroll = 0;

  while (currentScroll < stopScroll && currentScroll < pageHeight) {
    currentScroll += 200; // Adjust the scroll step as needed
    console.log(currentScroll);
    window.scrollTo(0, currentScroll);
    await wait(200); // Adjust the delay as needed
  }
}


async function clickAndWait(element, delay, totalData) {
    element.click();
    await wait(delay);

    //await scrollToBottom(1000000);
    tempread = document.querySelector('.ds-data-view-list');
    if (tempread == null) {
      tempread = document.querySelector('.data-column-container');
    }
    
    totalData.push(tempread.innerHTML);
    
    // Assuming you have defined `backButton` somewhere in your code
    let backButton = document.querySelector('.BackLink__StyledAnalyticsLink-sc-lwkkwt-0.fLqBgh');
    if (backButton == null) {
      backButton = document.querySelector('.BackLink__StyledAnalyticsLink-sc-4mjsfd-0.dqpKiA');
    }
    if (backButton == null) {
      backButton = document.querySelector('.DsBackLink__StyledBackButton-sc-199cylr-3.bbvPFH');
    }
    await wait(delay);
    backButton.click();
    await wait(delay);
}


async function fetchData() {
  var totalData = [];
  var backButton;
  var tempread;
  let onePage = false;

  // selector for property cards
  const selector_cards = '.StyledPropertyCardDataWrapper-c11n-8-84-3__sc-1omp4c3-0.bKpguY.property-card-data';

  // selector for next button at bottom of page
  let selector_nextButton_prefix = '#grid-search-results > div.search-pagination > nav > ul > li:nth-child(';
  let selector_nextButton_suffix = ') > a';

  var selector_nextButton = 'notrealjustfill';
  for (let i = 0; i < 1000; i++) {
    let try_selector = selector_nextButton_prefix + i.toString() + selector_nextButton_suffix;
    if (document.querySelector(try_selector) != null) {
      if (document.querySelector(try_selector).title == 'Next page') {
        selector_nextButton = try_selector;
        break;
    }
    }
  }
  console.log(selector_nextButton);
  var nextButton = document.querySelector(selector_nextButton);

  while (true) { // loop through pages for this location
    // Scroll gradually to the bottom
    let stopScroll = 100000;
    if (!onePage) {
      stopScroll = nextButton.offsetTop;
    }
    await scrollToBottom(stopScroll);

    // Wait for a short period to allow content to load
    await wait(2000); // Adjust the delay as needed

    const elements = document.querySelectorAll(selector_cards);
    //const data = Array.from(elements).map(element => element.innerHTML.replace(/,/g, ''));
    //totalData = totalData.concat(data);

    // Iterate over each property and click it
    for (const element of elements) {
        await clickAndWait(element, 3000,totalData);
    }

    if (onePage) {
      break;
    }

    // update nextButton
    if (nextButton.ariaDisabled == 'true') {
      break;
    } 
    else {
      nextButton.click();
      await wait(2000);
      nextButton = document.querySelector(selector_nextButton);
    }
  }
  console.log('Here')

  return totalData;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'initiateScraping') {
    console.log('herea')
    // Fetch data and send a message to the background script
    fetchData().then((data) => {
      console.log('hereb')
      chrome.runtime.sendMessage({ action: 'dataFetched', data: data });
      console.log('hereb2')
    }).catch((error) => {
      console.log('herec')
      console.error(error);
    });

  }
});