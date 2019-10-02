(function main() {

  var zfactor = 1 ; svgns = "http://www.w3.org/2000/svg"; 
  
  zcanvas.addEventListener('click', clickProcessing, false);

  getMenuChartData();
  
  async function getMenuChartData () {

    renderDataAsButtons(await getMenuData());

  }
  function getMenuData() {

    return new Promise(function (continueWith) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => { if (xhr.readyState === 4) continueWith(JSON.parse(xhr.responseText))};
      xhr.open("GET", "ncMenu.php");
      xhr.send();
    });
  }
  function renderDataAsButtons(choices) {

    zbuttons.appendChild(menuChartButtons(choices));

    newTransaction();

  }
  function menuChartButtons(choices) {

    var x = 30, y = -250;

    var buttons = document.createElementNS(svgns, 'g');
    buttons.setAttribute("fill", '#fff');
    buttons.setAttribute("font-size", 36);
    buttons.setAttribute("text-anchor", 'middle');
    
    choices.map((choice, ix) => {  
      if ((ix % 8 === 0) && ix > 0) {
        x = x + 450;
        y = 50;
      } else y = y + 300;
      buttons.appendChild(buttonRender(x, y, choice.name, choice.price, ix, "#fff"));
    })

    return buttons;

    function buttonRender(x, y, name, price, index, color) {

      var g = document.createElementNS(svgns, 'g');
      g.setAttribute("transform", "translate(" + x + "," + y + ")");

      var rect = document.createElementNS(svgns, 'rect');
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

      var text = document.createElementNS(svgns, 'text');
      text.setAttribute("x", 30);
      text.setAttribute("y", 50);
      text.setAttribute("text-anchor", 'start');
      text.textContent = name;

      g.appendChild(text);

      text = document.createElementNS(svgns, 'text');
      text.setAttribute("class", "quantity")
      text.setAttribute("x", 200);
      text.setAttribute("y", 144);
      text.setAttribute("font-size", 72);
      text.setAttribute("id", "c" + parseInt(index));
      text.setAttribute("text-anchor", 'middle');
      text.textContent = "";

      g.appendChild(text);

      text = document.createElementNS(svgns, 'text');
      text.setAttribute("x", 370);
      text.setAttribute("y", 220);
      text.setAttribute("text-anchor", 'end');
      text.textContent = index;

      g.appendChild(text);

      return g;
    }
  }
  function clickProcessing(scope) {

         if (scope.target.hasAttribute("zprice")) adjustOrder(scope)
    else if (scope.target.hasAttribute("zaddsub")) toogleFactor();
    else if (scope.target.hasAttribute("zsurvey")) historcalDates();
    else if (scope.target.hasAttribute("zclear")) newTransaction();
    else if (scope.target.hasAttribute("zfinal")) dispatchTransaction();
    else if (scope.target.hasAttribute("zdates")) presentCalendar();
    else if (scope.target.hasAttribute("zdate")) chooseDate(scope);
    else if (scope.target.hasAttribute("zclose")) closeWindow();
  }
  function newTransaction () {
  
    ztrx.textContent = new timerSeconds("zcounter").start().getTime();    
    zdate.textContent = date99XXX9999(new Date());

    document.querySelectorAll(".order").forEach((button) => button.setAttribute('opacity', 0.3))
    document.querySelectorAll(".quantity").forEach((order) => order.textContent = "");
    document.querySelectorAll(".order").forEach((order) => order.removeAttribute("zquantity"));

    mirrorOrderLines();
    
  }
  function chooseDate (what) {

    zdate.textContent = what.target.getAttribute("zdate");
    zdates.parentNode.removeChild(zdates);
    
  }
  function closeWindow () {

    zlog.parentNode.removeChild(zlog);

  }
  function adjustOrder (scope) {

    var ix = scope.target.getAttribute('zindex');
    var tally;

    (scope.target.hasAttribute('zquantity'))
      ?  tally = zfactor + parseInt(scope.target.getAttribute("zquantity"))
      :  tally = zfactor; 

    scope.target.setAttribute("zquantity", tally);
    var temp = document.getElementById("c" + ix);
    temp.textContent = tally;
    if (tally > 0) scope.target.setAttribute("opacity", 0.6);

    mirrorOrderLines();

  }
  function toogleFactor () {

    zfactor = zfactor * -1;

    (zfactor === -1)
      ? zblitz.setAttribute("fill", "#a00")
      : zblitz.setAttribute("fill", "#666")

    zaddsub.setAttribute("zfactor", temp);

  }
  function mirrorOrderLines () {

    if (typeof zsummary !== 'undefined') zsummary.parentNode.removeChild(zsummary);

    var g = document.createElementNS(svgns, 'g');
    g.setAttribute("id", 'zsummary');
    g.setAttribute("fill", '#fff');
    g.setAttribute("font-size", 54);

    var y = 134, zSum = 0;

    document.querySelectorAll(".order[zquantity]").forEach((order) => {

      var text = document.createElementNS(svgns, 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 2800);
      text.setAttribute("y", y);
      text.textContent = order.getAttribute('zquantity');

      g.appendChild(text);

      text = document.createElementNS(svgns, 'text');
      text.setAttribute("text-anchor", 'start');
      text.setAttribute("x", 2830);
      text.setAttribute("y", y);
      text.textContent = order.getAttribute('zproduct') + " (" + order.getAttribute('zindex') + ")";

      g.appendChild(text);

      text = document.createElementNS(svgns, 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 3950);
      text.setAttribute("y", y);
      slam = Number(parseInt(order.getAttribute('zquantity') * order.getAttribute('zprice')));
      text.textContent = slam.toFixed(2);

      g.appendChild(text);
      zSum = zSum + slam;
      y = y + 81;

    })
  
    var text = document.createElementNS(svgns, 'text');
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
  function dispatchTransaction() {

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

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        zmessage.textContent = xhr.responseText;
        newTransaction();
      }
    };
    xhr.open("POST", "ncTransaction.php");
    xhr.send(transaction);
  }
  function historcalDates() {

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (typeof zstatistic !== 'undefined') zstatistic.parentNode.removeChild(zstatistic);        
        var g = document.createElementNS(svgns, 'g');
        g.setAttribute("id", "zstatistic");
        g.innerHTML = xhr.responseText;
        zcanvas.appendChild(g);
      };
    }
    xhr.open("GET", "ncLog.php");
    xhr.send();
  }
  function presentCalendar() {

    var more = true, ix = 0, x = 0, y = 0;
    
    var zDate = new Date(); zDate.setMonth(0); zDate.setDate(1);

    var g = document.createElementNS(svgns, 'g');
    g.setAttribute("id", 'zdates');
    g.setAttribute("fill", '#fff');
    g.setAttribute("font-size", 28);
    g.setAttribute("text-anchor", 'middle');

    while (more) {
      ix++;

      zDate.setTime(zDate.getTime() - 864E5);

      x = (zDate.getMonth() * 333) + 1;
      y = (zDate.getDate() * 87) + 1;

      var thisDate = date99999999(zDate);

      var rect = document.createElementNS(svgns, 'rect');
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", 300);
      rect.setAttribute("height", 75);
      rect.setAttribute("rx", 15);
      rect.setAttribute("fill", "#fff");
      rect.setAttribute("opacity", 0.3);
      rect.setAttribute("zdate", date99XXX9999(zDate));

      g.appendChild(rect);

      var text = document.createElementNS(svgns, 'text');
      text.setAttribute("x", x + 150);
      text.setAttribute("y", y + 47);
      text.setAttribute("fill", '#fff');
      text.textContent = date99XXX9999(zDate);

      g.appendChild(text);

      if (ix > 365) more = false;
    }
    zcanvas.appendChild(g);
  }
  function date99999999 (d) {
    return parseInt((d.getFullYear() * 1E4) + ((d.getMonth() + 1) * 1E2) + d.getDate())
  }
  function date99XXX9999(dateO) {
    return dateO.getDate() 
    + "JANFEBMARAPRMAJJUNJULAUGSEPOCTNOVDEC".substr((dateO.getMonth() * 3), 3) 
    + dateO.getFullYear(); 
  }
})();
