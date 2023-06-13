
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log("here");
//   var serverhost = 'http://127.0.0.1:8000';

//   // Check if the request contains the tabId
//   if (request.tabId) {
//       // Fetch the web page content from the active tab
//       chrome.scripting.executeScript({
//           target: { tabId: request.tabId },
//           function: getPageContent,
//       }, function(results) {
//           // Check if the execution was successful
//           if (chrome.runtime.lastError) {
//               console.error(chrome.runtime.lastError);
//               sendResponse({ farewell: null });
//               return true;
//           }

//           var content = results[0];  // Assuming the content is returned directly
//           console.log(content);

//           // Construct the URL without the content as a parameter
//           var url = serverhost + '/NER_backend/get_NER/';
//           console.log(url);

//           // Send the content as the request body
//           fetch(url, {
//               method: 'POST',
//               headers: {
//                   'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({ sentence: content })
//           })
//           .then(response => response.json())
//           .then(response => {
//               sendResponse({ farewell: response });
//               return true; // Respond asynchronously
//           })
//           .catch(error => console.log(error));
//       });
//   }

//   return true; // Keep the return statement here
// });

// // Function to retrieve the page content
// function getPageContent() {
//   var content = document.body.innerText;
//   console.log(content);
//   return content;
// }


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("here");
  var serverhost = 'http://127.0.0.1:8000';

  // Check if the request contains the tabId
  if (request.tabId) {
      // Fetch the web page content from the active tab
      chrome.scripting.executeScript({
          target: { tabId: request.tabId },
          function: getPageContent,
      }, function(results) {
          // Check if the execution was successful
          if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              sendResponse({ farewell: null });
              return true;
          }

          var content = results[0];  // Assuming the content is returned directly
          console.log(content);

          // Construct the URL without the content as a parameter
          var url = serverhost + '/NER_backend/get_NER/';
          console.log(url);

          // Send the content as the request body
          fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sentence: content })
          })
          .then(response => response.json())
          .then(response => {
              // Include the entities in the message sent to the content script
              chrome.tabs.sendMessage(request.tabId, {
                  highlightEntities: true,
                  entities: response.entities
              }, function(response) {
                  console.log(response);
              });

              // Send the response to the popup script
              sendResponse({ farewell: response });
          })
          .catch(error => console.log(error));
      });
  }

  return true; // Keep the return statement here
});

// Function to retrieve the page content
function getPageContent() {
  var pElements = document.getElementsByTagName('p');
  var content = '';

  for (var i = 0; i < pElements.length; i++) {
    var pElement = pElements[i];
    content += pElement.innerText + ' ';
  }

  console.log(content);
  return content;
}

