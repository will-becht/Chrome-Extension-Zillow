// background.js

console.log('Background service worker is running');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'dataFetched') {
    console.log('hered')
    // Process the fetched data
    const data = message.data;

    // Convert data to CSV string
    const csvString = data.join(',');

    // Create a Blob
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a data URL for the Blob using chrome.runtime.getURL
    const blobUrl = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvString);

    // Use the chrome.downloads API to initiate the download
    chrome.downloads.download({
      url: blobUrl,
      filename: 'scraped_data.csv',
      saveAs: true,
    });
  }
});
