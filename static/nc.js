(function main (canvas) {

  var products = [], prices = [], values = [], zFactor = 1;
  var zTminus = new timerSeconds("zcounter");
  canvas.addEventListener('click', handleClick, false);
  const now = new Date();
  const toDay = parseInt((now.getFullYear() * 1E4) + ((now.getMonth() + 1) * 1E2) + now.getDate(), 10);
  document.getElementById('zdate').textContent =  formatT(toDay.toString());
  
  getMenuChartData();

async function getMenuChartData () {
  renderDataAsButtons(await xhrServer());   
}
function xhrServer () {
  return new Promise(function (continueWith) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {if (xhr.readyState === 4) continueWith(JSON.parse(xhr.responseText));};
    xhr.open("GET", "ncMenu.php");
    xhr.send();
  });
}
function renderDataAsButtons (choices) {
  document.getElementById('buttons').appendChild(menuChartButtons(choices));
}
function handleClick(evt) {

  var scope = evt.target;

  if (scope.getAttribute("zprice")) adjustItem(scope)    
  else if (scope.getAttribute("zfactor")) toogleFactor(scope);
  else if (scope.getAttribute("zlog")) viewLog();  
  else if (scope.getAttribute("znew")) newTransaction();
  else if (scope.getAttribute("zfinal")) wrapUp();
  else if (scope.getAttribute("zdates")) subDates();
  else if (scope.getAttribute("zdate")) datePick(scope);  
  else if (scope.getAttribute("zclose")) closeW(scope);
}
function newTransaction () {
  var t0 = zTminus.start();  
  products = [];
  document.getElementById('ztrx').textContent = t0.now();
  document.querySelectorAll(".quantity").forEach((button) => button.textContent = "");
  rebuildList();
}
function datePick(scope) {
  document.getElementById('zdate').textContent = scope.getAttribute("zdate");
  var execute = document.getElementById('dates');
  if (execute) execute.parentNode.removeChild(execute);    
}
function closeW(scope) {
  var name = scope.getAttribute("zclose");
  var id = document.getElementById(name);
  id.parentNode.removeChild(id);    
}
function adjustItem (scope) {
  scope.setAttribute("opacity", 0.6);
  ix = parseInt(scope.getAttribute("zindex"), 10);
  products[ix] = scope.getAttribute("zproduct");
  values[ix] = values[ix] + zFactor;
  document.getElementById("c" + ix).textContent = values[ix];
  rebuildList();
}
function toogleFactor(toogle) {
  zFactor = toogle.getAttribute("zfactor") * -1;
  
  toogle.setAttribute("zfactor", zFactor);
  
  (zFactor ===  -1) 
  ? document.getElementById("zblitz").setAttribute("fill","#a00") 
  : document.getElementById("zblitz").setAttribute("fill","#666") 
}
function wrapUp() {

  var transaction = document.implementation.createDocument ("", "", null);

  var zDay = transaction.createElement("dayquantum");
  zDay.setAttribute("date",document.getElementById('zdate').textContent);  
  zDay.setAttribute("transaction",document.getElementById('ztrx').textContent);

  for (ix = 0; ix < products.length; ix++) {
    if (parseInt(values[ix], 10) > 0) {
      var zSlot = transaction.createElement("item");
      zSlot.setAttribute("value",values[ix]);
      zSlot.setAttribute("product",products[ix]);
      zDay.appendChild(zSlot);
      values[ix] = 0;
    }
  }

  transaction.appendChild(zDay);

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === 4) {
      document.getElementById('zmessage').textContent = xmlhttp.responseText;
      newTransaction();
    }
  };
  xmlhttp.open("POST","ncTransaction.php",true);
  xmlhttp.send(transaction);
}
function rebuildList() {
  var execute = document.getElementById('todie');
  if (execute) execute.parentNode.removeChild(execute);

  var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("id", 'todie');
      g.setAttribute("fill", '#fff');
      g.setAttribute("font-size", 54);

  var y = 134, zSum = 0;

  for (var ix = 0; ix < products.length; ix++) {
    var jx = ix + 1;
    if (parseInt(values[jx], 10) > 0) {
      var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 2800);
      text.setAttribute("y", y);
      text.textContent = values[jx];

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'start');
      text.setAttribute("x", 2830);
      text.setAttribute("y", y);
      text.textContent = products[jx] + " (" + jx + ")";

      g.appendChild(text);

      text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
      text.setAttribute("text-anchor", 'end');
      text.setAttribute("x", 3950);
      text.setAttribute("y", y);
      slam = Number(parseInt(values[jx] * prices[jx], 10));
      text.textContent = slam.toFixed(2);

      g.appendChild(text);
      zSum = zSum + slam;
      y = y + 81;
    }
  }

  text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
  text.setAttribute("text-anchor", 'end');
  text.setAttribute("font-weight", 900);
  text.setAttribute("font-size", 96);
  text.setAttribute("x", 3950);
  text.setAttribute("y", 1550);
  slam = Number(zSum);
  text.textContent = slam.toFixed(2);

  g.appendChild(text);
  canvas.appendChild(g);
}
function viewLog() {

  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      var execute = document.getElementById('statistic');
      if (execute) execute.parentNode.removeChild(execute);
      var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      g.setAttribute("id", "statistic");
      g.innerHTML = xhr.responseText;
      canvas.appendChild(g);      
    };
  }
  xhr.open("GET", "ncLog.php");
  xhr.send();    
  
}
function subDates() {

   var more = true, ix = 0, x = 0, y = 0;
   var zDate = new Date();  zDate.setFullYear(zDate.getFullYear()+1);  zDate.setMonth(0);  zDate.setDate(1);

   var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
       g.setAttribute("id", 'dates');
       g.setAttribute("fill", '#fff');
       g.setAttribute("font-size", 28);
       g.setAttribute("text-anchor", 'middle');       

   while (more) {
     ix++;

     zDate.setTime(zDate.getTime() - 864E5);

     x = (zDate.getMonth() * 333) + 1;
     y = (zDate.getDate() * 87) + 1;
     var thisDate = parseInt((zDate.getFullYear() * 1E4) + ((zDate.getMonth() + 1) * 1E2) + zDate.getDate(), 10);

     var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
     rect.setAttribute("x", x);
     rect.setAttribute("y", y);
     rect.setAttribute("width", 300);
     rect.setAttribute("height", 75);
     rect.setAttribute("rx", 15);
     rect.setAttribute("fill", "#fff");     
     rect.setAttribute("opacity", 0.3);
     rect.setAttribute("zdate", formatT(thisDate.toString()));

     g.appendChild(rect);

     var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
     text.setAttribute("x", x + 150);
     text.setAttribute("y", y + 47);
     text.setAttribute("fill", '#fff');
     text.textContent = formatT(thisDate.toString());

     g.appendChild(text);

     if (ix > 365) more = false;
   }
   canvas.appendChild(g);
}
function menuChartButtons (choices) {

  var x = 30, y = -250;

  var buttons = document.createElementNS("http://www.w3.org/2000/svg", 'g');
      buttons.setAttribute("fill", '#fff');
      buttons.setAttribute("font-size", 36);
      buttons.setAttribute("text-anchor", 'middle'); 

  for (ix = 0; ix < choices.length; ix++) {
    values[ix + 1] = 0 ;
    prices[ix + 1] = choices[ix].price;
    if ((ix % 8 === 0) && ix > 0) {
      x = x + 450;
      y = 50;
    } else y = y + 300;
    buttons.appendChild(buttonRender(x, y, choices[ix].name, choices[ix].price, ix, "#fff"));
  }  

  return buttons;

  function buttonRender (x, y, name, price, index, color) {
    
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    g.setAttribute("transform", "translate(" + x + "," + y + ")");

    var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rect.setAttribute("x", 0);
    rect.setAttribute("y", 0);
    rect.setAttribute("width", 400);
    rect.setAttribute("height", 250);
    rect.setAttribute("rx", 50);    
    rect.setAttribute("opacity",  0.3);    
    rect.setAttribute("fill",  color);    
    rect.setAttribute("zproduct", name);
    rect.setAttribute("zprice", price);
    rect.setAttribute("zindex", index + 1);

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
    text.setAttribute("id", "c" + parseInt(index + 1, 10));
    text.setAttribute("text-anchor", 'middle');
    text.textContent = "";

    g.appendChild(text);

    text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute("x", 370);
    text.setAttribute("y", 220);
    text.setAttribute("text-anchor", 'end');
    text.textContent = index + 1;

    g.appendChild(text);

    return g;
  }
}
function formatT(base) {
  var i = parseInt(base.substr(4,2) * 3, 10);
  return base.substr(6,2) + "   JANFEBMARAPRMAJJUNJULAUGSEPOCTNOVDEC".substr(i, 3) + base.substr(0,4);
}
})(document.getElementById('zcanvas'));
