function draw(color, area, divName, subplot){
  let windowWidth = window.innerWidth;
  let chartWidth = windowWidth / 3;
  if(subplot == true){
    chartWidth *= 0.75;
  }

  let margin = {top: 10, right: 25, bottom: 30, left: 25},
  width = chartWidth - margin.left - margin.right - 50,
  height = chartWidth * 0.75 - margin.top - margin.bottom;

// append the svg object to the body of the page
  let svg2 = d3.select(divName)
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
  d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/4_ThreeNum.csv", function(data) {

// Add X axis
  let x = d3.scale.linear()
  .domain([0, 10000])
  .range([ 0, width ]);
  svg2.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.svg.axis().scale(x).orient("bottom"));

// Add Y axis
  let y = d3.scale.linear()
  .domain([35, 90])
  .range([ height, 0]);
  svg2.append("g")
  .call(d3.svg.axis().scale(y).orient("left"));

// Add a scale for bubble size
// scaleOrdinal()
  let z = d3.scale.linear()
  .domain([200000, 1310000000])
  .range([ 1, 40]);

  let myColor = d3.scale.ordinal()
    .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
    .range(["blue", "green", "yellow", "black", "grey", "darkgreen", "pink", "brown", "slateblue", "grey1", "orange"]);

    svg2.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.gdpPercap); } )
      .attr("cy", function (d) { return y(d.lifeExp); } )
      .attr("r", function (d) { return area? z(d.pop) : 10; } )
      .style("fill", function (d) { 
        return color? myColor(d.continent) : "#69b3a2"; } )
      .style("opacity", "0.7")
      .attr("stroke", "white")
      .style("stroke-width", "2px")
  })
  
}


function draw1(){
  d3.select("#multiple").selectAll("g").remove();

  draw(true, true, "#multiple");
  draw(false, true, "#multiple", true);
  draw(false, false, "#multiple", true);

}

function remove1(){
  d3.select("#multiple").selectAll("*").remove();
}