// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";var a=document.createElement("div");a.id="fps";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";for(a.appendChild(c);200>c.children.length;){var j=document.createElement("span");c.appendChild(j)}var d=document.createElement("div");d.id="ms";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";for(d.appendChild(e);200>e.children.length;)j=document.createElement("span"),e.appendChild(j);var t=function(b){s=b;};return{REVISION:11,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(40,40-40*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(40,40-40*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};