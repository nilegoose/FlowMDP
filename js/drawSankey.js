



var opacity_pick;
var dataObj = DataObj.getData();  


var margin = {top: 20, right: 50, bottom: 100, left: 50},
width = window.innerWidth - margin.left - margin.right - 20,
height = window.innerHeight - margin.top - margin.bottom -120;

var formatNumber = d3.format(",.0f"),
format = function(d) { return formatNumber(d) + "  "; };

var svg = d3.select("#chart").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.attr("id", "chartSVG")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


drawSankey(dataObj.getData(), svg);

function resetSankey() {

drawSankey(dataObj.getData(), svg);
FunState.default();

}


var resetBtn = document.getElementById("reset_icon");
resetBtn.addEventListener("click", resetBtnEvent);
var printBtn = document.getElementById("print-icon");
printBtn.addEventListener("click", downloadSVG);


d3.select("#fun_compa").on("click", toggleCompa); 
d3.select("#fun_rel").on("click", toggleRel); 



