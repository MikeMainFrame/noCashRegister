class timerSeconds {
  constructor(anchor) {
    this.name = 'timerSecondsByMikey';
    this.anchor = anchor;
    this.iid = 0;
    this.fill = "#666";
    this.counter = 1;
    this.elapsed = 0;

    var toogle = 1, jx = 1, ix = 1, X = 0, Y = 0, d="", ry = 900, rx = 1000, rz = 1003;

    var group = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
 
    while (ix < 360) {      
      var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');    
       X = Math.cos(ix * Math.PI / 180);  
       Y = Math.sin(ix * Math.PI / 180); 
      d = "M"  + parseInt(1000 + (X * ry)) + ', '  + parseInt(1000 + (Y * ry));                   
      d+= " L" + parseInt(1000 + (X * rx)) + ', ' + parseInt(1000 + (Y * rx));
       X = Math.cos((ix + 2.5) * Math.PI / 180);
       Y = Math.sin((ix + 2.5) * Math.PI / 180);       
      d+= " Q" + parseInt(1000 + (X * rz)) + ', ' + parseInt(1000 + (Y * rz));  
       X = Math.cos((ix + 5) * Math.PI / 180);
       Y = Math.sin((ix + 5) * Math.PI / 180); 
      d+= "  " + parseInt(1000 + (X * rx)) + ', ' + parseInt(1000 + (Y * rx));     
      d+= " L" + parseInt(1000 + (X * ry)) + ', '  + parseInt(1000 + (Y * ry));                
          
      path.setAttribute("id", 's' + jx);
      path.setAttribute("fill", this.fill);
      path.setAttribute("d", d + ' Z');    
      
      group.appendChild(path);  

      toogle = toogle * -1;
      rx = rx + (toogle * 120); ry = ry + (toogle * 120); rz = rz + (toogle * 120);  
      ix = ix + 6;
      jx = jx + 1;
    } 
  
    var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    text.setAttribute("id", 'zseconds');  
    text.setAttribute("fill", this.fill);  
    text.setAttribute("font-size", 256);  
    text.setAttribute("text-anchor", 'middle');  
    text.setAttribute("x", 1000);
    text.setAttribute("y", 1000);
    text.textContent = 0;

    group.appendChild(text);    
    document.getElementById(anchor).appendChild(group);    
  }
  motion() {
    document.getElementById("s" + parseInt(this.counter)).setAttribute("fill", this.fill);
    (this.counter === 60) ? this.counter = 1 : this.counter++;
    document.getElementById("s" + parseInt(this.counter)).setAttribute("fill", '#fff');
    document.getElementById("zseconds").textContent = this.elapsed++;
  }
  start() {
    this.iid = setInterval(this.motion.bind(this), 1000);
    return new Date();
  }
  stop() {
    clearInterval(this.iid);
    return new Date();
  }
}