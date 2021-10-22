var setInnerHTML = function(elm, html) {
    elm.innerHTML = html;
    Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}
function appendHtml(el, str) {
  var tpl = document.createElement('template');
  // tpl.innerHTML = str;
  // setInnerHTML(tpl, str)
  // el.appendChild(tpl.content);
  setInnerHTML(el, el.innerHTML + str)
}

function appendLoader(parent) {
  var el = document.createElement('div')
  el.id="loader"
  el.className="fr-my-4w"
  el.style="text-align: center; width: 100%;"
  el.innerHTML = '<i class="ri-loader-4-fill rotating" style="font-size: 2em; display: inline-block;"></i>'
  parent.appendChild(el)
}

function removeLoader(parent) {
  parent.removeChild(parent.querySelector('#loader'))
}

function httpGet(url, callback) {
  var xhr = new XMLHttpRequest();
  // we defined the xhr
  xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
          callback(this.responseText)
          // var data = JSON.parse(this.responseText);
          // we get the returned data
      }
      // end of state change: it can be after some time (async)
  };
  xhr.open('GET', url, true);
  xhr.send();
}

var listElm = document.querySelector('#infinite-list');
var loadMoreButton = document.querySelector('#loadmore');


// Add 20 items.
var nextItem = 1;
var loadMore = function() {
  appendLoader(listElm)
  window.lastCursor = window.nextCursor
    httpGet(
      window.location.protocol + "//" + window.location.host + `/annonces?start_cursor=${window.nextCursor}`,
      (htmlContent) => {
        removeLoader(listElm)
        appendHtml(listElm, htmlContent); // "body" has two more children -
      }
    )
}

loadMoreButton.addEventListener('click', function () {
    loadMore()
});

// Detect when scrolled to bottom.
// window.addEventListener('scroll', function() {
//   var nextCursor = window.nextCursor
//     console.log(listElm.clientHeight <= window.scrollY + window.innerHeight);
//   if (window.hasMore && listElm.clientHeight <= window.scrollY + window.innerHeight && window.lastCursor != nextCursor) {
//     loadMore();
//   }
// });
