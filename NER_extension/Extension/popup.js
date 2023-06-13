// write function to get response from background.js and display it in popup.html

console.log('popup.js loaded');

// $(function() {
//     $('#search').click(function() {
//         console.log('clicked');

//         // Send a message to the background script to get the content of the active tab
//         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//             var activeTab = tabs[0];
//             chrome.runtime.sendMessage({ tabId: activeTab.id }, function(response) {
//                 // console.log(response);
//                 result = response.farewell;
//                 entities = result.entities;
//                 // console.log(entities);
//                 $('#result').val('');
//                 for (var i = 0; i < entities.length; i++) {
//                     $('#result').val(function(_, currentValue) {
//                         return currentValue + entities[i].value + " " + entities[i].entity + '\n';
//                     });
//                 }
//             });
//         });
//     });
// });

$(function() {
    $('#search').click(function() {
        console.log('clicked');

        // Send a message to the background script to get the content of the active tab and highlight named entities
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            chrome.runtime.sendMessage({ tabId: activeTab.id }, function(response) {
                // console.log(response);
                result = response.farewell;
                entities = result.entities;
                // console.log(entities);
                $('#result').val('');
                for (var i = 0; i < entities.length; i++) {
                    $('#result').val(function(_, currentValue) {
                        return currentValue + entities[i].value + " " + entities[i].entity + '\n';
                    });
                }
            });
        });
    });
});

