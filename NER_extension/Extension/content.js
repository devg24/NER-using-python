// // Load jQuery library
// var script = document.createElement('script');
// script.src = chrome.runtime.getURL('jquery-3.7.0.min.js');
// document.head.appendChild(script);

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.highlightEntities && request.entities) {
        var entities = request.entities;
        // Highlight the named entities on the web page
        highlightEntities(entities);
        sendResponse({ success: true });
    }
});


  
function highlightEntities(entities) {
    entities.forEach(function (entity) {
      var entityText = entity.value;
      var regex = new RegExp('\\b' + entityText + '\\b', 'gi');
      var textNodes = getTextNodes(document.body);
  
      textNodes.forEach(function (node) {
        var parent = node.parentNode;
        var highlightedText = node.textContent.replace(regex, function (match) {
          return '<span style="background-color: yellow; font-weight: bold;">' + match + '</span>';
        });
  
        var tempElement = document.createElement('div');
        tempElement.innerHTML = highlightedText;
  
        var highlightedNodes = Array.from(tempElement.childNodes);
        highlightedNodes.forEach(function (highlightedNode) {
          parent.insertBefore(highlightedNode, node);
        });
  
        parent.removeChild(node);
      });
    });
  
    removeDuplicateSpans();
  }
  
  function removeDuplicateSpans() {
    var highlightedSpans = document.querySelectorAll('span[style="background-color: yellow; font-weight: bold;"]');
    highlightedSpans.forEach(function (span) {
      if (span.parentNode.nodeName === 'SPAN' && span.parentNode.style.backgroundColor === 'yellow' && span.parentNode.style.fontWeight === 'bold') {
        var parent = span.parentNode.parentNode;
        parent.replaceChild(span, span.parentNode);
      }
    });
  }
  
  
  