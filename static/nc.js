(function main() {

  var zfactor = 1;
  var now = new timerSeconds("zcounter"); 

  zdate.textContent = ddMMMyyyy(now);    
  zcanvas.addEventListener('click', handleClick, false);

  getMenuChartData();
  newTransaction();

  return;

  async function getMenuChartData() {
    renderDataAsButtons(await xhrServer());
  }

  function xhrServer() {
    return new Promise(function (continueWith) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => { if (xhr.readyState === 4) continueWith(JSON.parse(xhr.responseText))};
      xhr.open("GET", "ncMenu.php");
      xhr.send();
    });
  }

  function renderDataAsButtons(choices) {
    document.getElementById('zbuttons').appendChild(menuChartButtons(choices));
  }

  function menuChartButtons(choices) {

    var x = 30, y = -250;

    var buttons = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    buttons.setAttribute("fill", '#fff');
    buttons.setAttribute("font-size", 36);
    buttons.setAttribute("text-anchor", 'middle');

    for (ix = 0; ix < choices.length; ix++) {
      if ((ix % 8 === 0) && ix > 0) {
        x = x + 450;
        y = 50;
      } else y = y + 300;
      buttons.appendChild(buttonRender(x, y, choices[ix].name, choices[ix].price, ix, "#fff"));
    }

    return buttons;

    function buttonRender(x, y, name, price, index, color) {

      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("transform", "translate(" + x + "," + y + ")");

      var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      rect.setAttribute("class", "order")
      rect.setAttribute("x", 0);
      rect.setAttribute("y", 0);
      rect.setAttribute("width", 400);
      rect.setAttribute("height", 250);
      rect.setAttribute("rx", 50);
      rect.setAttribute("opacity", 0.3);
      rect.setAttribute("fill", color);
      rect.setAttribute("zproduct", name);
      rect.setAttribute("zprice", price);
      rect.setAttribute("zindex", index);

      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("x", 30);
      text.setAttribute("y", 50);
      text.setAttribute("text-anchor", 'start');
      text.textContent = name;

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("class", "quantity")
      text.setAttribute("x", 200);
      text.setAttribute("y", 144);
      text.setAttribute("font-size", 72);
      text.setAttribute("id", "c" + parseInt(index));
      text.setAttribute("text-anchor", 'middle');
      text.textContent = "";

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("x", 370);
      text.setAttribute("y", 220);
      text.setAttribute("text-anchor", 'end');
      text.textContent = index;

      g.appendChild(text);

      return g;
    }
  }


  function handleClick(evt) {

    var scope = evt.target;

    if (scope.hasAttribute("zprice")) adjustItem(scope)
    else if (scope.hasAttribute("zfactor")) toogleFactor(scope);
    else if (scope.hasAttribute("zlog")) viewLog();
    else if (scope.hasAttribute("znew")) newTransaction();
    else if (scope.hasAttribute("zfinal")) wrapUp();
    else if (scope.hasAttribute("zdates")) subDates();
    else if (scope.hasAttribute("zdate")) datePick(scope);
    else if (scope.hasAttribute("zclose")) closeW(scope);
  }


  function newTransaction() {
    ztrx.textContent = (new Date()).toISOString();
    document.querySelectorAll(".quantity").forEach((button) => button.textContent = "");
  }


  function datePick(what) {
    zdate.textContent = what.getAttribute("zdate");
    zdates.parentNode.removeChild(zdates);
  }


  function closeW(scope) {
    var name = scope.getAttribute("zclose");
    var id = document.getElementById(name);
    id.parentNode.removeChild(id);
  }


  function adjustItem(scope) {
    scope.setAttribute("opacity", 0.6);
    var ix = scope.getAttribute('zindex');
    var tally;

    (scope.hasAttribute('zquantity'))
      ?  tally = parseInt(scope.getAttribute("zquantity"))
      :  tally = 0; 

    scope.setAttribute("zquantity", tally = tally + zfactor);
    var temp = document.getElementById("c" + ix);
    temp.textContent = tally;
    rebuildList();
  }


  function toogleFactor() {
    var temp = zaddsub.getAttribute("zfactor") * -1;

    (temp === -1)
      ? zblitz.setAttribute("fill", "#a00")
      : zblitz.setAttribute("fill", "#666")

    zaddsub.setAttribute("zfactor", temp);
  }


  function rebuildList() {
    var execute = document.getElementById('zsummary');
    if (execute) execute.parentNode.removeChild(execute);

    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", 'zsummary');
    g.setAttribute("fill", '#fff');
    g.setAttribute("font-size", 54);

    var y = 134, zSum = 0;

    document.querySelectorAll(".order[zquantity]").forEach((order) => {

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 2800);
      text.setAttribute("y", y);
      text.textContent = order.getAttribute('zquantity');

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'start');
      text.setAttribute("x", 2830);
      text.setAttribute("y", y);
      text.textContent = order.getAttribute('zproduct') + " (" + order.getAttribute('zindex') + ")";

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 3950);
      text.setAttribute("y", y);
      slam = Number(parseInt(order.getAttribute('zquantity') * order.getAttribute('zprice')));
      text.textContent = slam.toFixed(2);

      g.appendChild(text);
      zSum = zSum + slam;
      y = y + 81;

    })
  
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute("text-anchor", 'end');
    text.setAttribute("font-weight", 900);
    text.setAttribute("font-size", 96);
    text.setAttribute("x", 3950);
    text.setAttribute("y", 1550);
    slam = Number(zSum);
    text.textContent = slam.toFixed(2);

    g.appendChild(text);
    zcanvas.appendChild(g);
  }


  function wrapUp() {

    var transaction = document.implementation.createDocument("", "", null);

    var zDay = transaction.createElement("dayquantum");
    zDay.setAttribute("date", zdate.textContent);
    zDay.setAttribute("transaction", ztrx.textContent);


    document.querySelectorAll(".order[zquantity]").forEach((order) => {
      var zSlot = transaction.createElement("item");
      zSlot.setAttribute("value", order.getAttribute('zquantity'));
      zSlot.setAttribute("product", order.getAttribute('zproduct'));
      zDay.appendChild(zSlot);
    })

    transaction.appendChild(zDay);

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
      if (xmlhttp.readyState === 4) {
        zmessage.textContent = xmlhttp.responseText;
        newTransaction();
      }
    };
    xmlhttp.open("POST", "ncTransaction.php");
    xmlhttp.send(transaction);
  }


  function viewLog() {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        zstatistic.parentNode.removeChild(zstatistic);
        var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        g.setAttribute("id", "zstatistic");
        g.innerHTML = xhr.responseText;
        zcanvas.appendChild(g);
      };
    }
    xhr.open("GET", "ncLog.php");
    xhr.send();
  }


  function subDates() {

    var more = true, ix = 0, x = 0, y = 0;
    var zDate = new Date(); zDate.setFullYear(zDate.getFullYear() + 1); zDate.setMonth(0); zDate.setDate(1);

    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("id", 'zdates');
    g.setAttribute("fill", '#fff');
    g.setAttribute("font-size", 28);
    g.setAttribute("text-anchor", 'middle');

    while (more) {
      ix++;

      zDate.setTime(zDate.getTime() - 864E5);

      x = (zDate.getMonth() * 333) + 1;
      y = (zDate.getDate() * 87) + 1;
      var thisDate = parseInt((zDate.getFullYear() * 1E4) + ((zDate.getMonth() + 1) * 1E2) + zDate.getDate());

      var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", 300);
      rect.setAttribute("height", 75);
      rect.setAttribute("rx", 15);
      rect.setAttribute("fill", "#fff");
      rect.setAttribute("opacity", 0.3);
      rect.setAttribute("zdate", ddMMMyyyy(thisDate.toString()));

      g.appendChild(rect);

      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("x", x + 150);
      text.setAttribute("y", y + 47);
      text.setAttribute("fill", '#fff');
      text.textContent = ddMMMyyyy(thisDate.toString());

      g.appendChild(text);

      if (ix > 365) more = false;
    }
    zcanvas.appendChild(g);
  }


  function ddMMMyyyy(dateO) {
    return dateO.getDate() 
    + "JANFEBMARAPRMAJJUNJULAUGSEPOCTNOVDEC".substr((dateO.getMonth() * 3), 3) 
    + dateO.getFullYear(); 
  }
})();
