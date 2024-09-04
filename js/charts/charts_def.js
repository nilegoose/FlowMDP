const functionsMap = {
    1: draw2dDensity,
    2: drawLineplot,
    3: drawDensity,
    4: drawArea,
    5: drawStackedArea,
  };



function draw2dDensity(data, svg){
    let x = d3.scaleLinear()
      .domain([5, 20])
      .range([ 0, width2 ]);
    svg.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    let y = d3.scaleLinear()
      .domain([5, 22])
      .range([ height2, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // compute the density data
    var densityData = d3.contourDensity()
      .x(function(d) { return x(d.x); })   // x and y = column name in .csv input data
      .y(function(d) { return y(d.y); })
      .size([width2, height2])
      .bandwidth(20)    // smaller = more precision in lines = more lines
      (data)
  
    // Add the contour: several "path"
    svg
      .selectAll("path")
      .data(densityData)
      .enter()
      .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-linejoin", "round")


    
        svg.append("text")
        .attr("x", (width2 / 2))             
        .attr("y", 0 + (margin2.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Density 2D plot");
  }

function drawLineplot(data, svg) {
  
    // Add X axis --> it is a date format
    let x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width2 ]);
    svg.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height2, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

    svg.append("text")
        .attr("x", (width2 / 2))             
        .attr("y", 0 + (margin2.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Lineplot");

};

//------------------------------------density plot-------------------------------------------------------

function drawDensity(data, svg) {

    // add the x Axis
    let x = d3.scaleLinear()
              .domain([0, 1000])
              .range([0, width2]);
    svg.append("g")
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x));
  
    // add the y Axis
    let y = d3.scaleLinear()
              .range([height2, 0])
              .domain([0, 0.01]);
    svg.append("g")
    .call(d3.axisLeft(y));
  
    // Compute kernel density estimation
    let kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
    let density =  kde( data.map(function(d){  return d.price; }) )
  
    // Plot the area
    svg.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line().curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        );

        svg.append("text")
        .attr("x", (width2 / 2))             
        .attr("y", 0 + (margin2.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Densityplot");
  
  };
  
  
  // Function to compute density
  function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  function kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
  }
//-------------------------------------------------------------area
function drawArea(data, svg) {
  
    // Add X axis --> it is a date format
    let x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width2 ]);
    svg.append("g")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height2, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the area
    svg.append("path")
      .datum(data)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return x(d.date) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
        )

        svg.append("text")
        .attr("x", (width2 / 2))             
        .attr("y", 0 + (margin2.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Area plot");

}

function drawStackedArea(data, svg){  
let sumstat = d3.nest()
.key(function(d) { return d.year;})
.entries(data);

// Stack the data: each group will be represented on top of each other
let mygroups = ["Helen", "Amanda", "Ashley"] // list of group names
let mygroup = [1,2,3] // list of group names
let stackedData = d3.stack()
.keys(mygroup)
.value(function(d, key){
  return d.values[key].n
})
(sumstat)

// Add X axis --> it is a date format
let x = d3.scaleLinear()
.domain(d3.extent(data, function(d) { return d.year; }))
.range([ 0, width2 ]);
svg.append("g")
.attr("transform", "translate(0," + height2 + ")")
.call(d3.axisBottom(x).ticks(5));

// Add Y axis
let y = d3.scaleLinear()
.domain([0, d3.max(data, function(d) { return +d.n; })*1.2])
.range([ height2, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

// color palette
let color = d3.scaleOrdinal()
.domain(mygroups)
.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

// Show the areas
svg
.selectAll("mylayers")
.data(stackedData)
.enter()
.append("path")
  .style("fill", function(d) { name = mygroups[d.key-1] ;  return color(name); })
  .attr("d", d3.area()
    .x(function(d, i) { return x(d.data.key); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
)

svg.append("text")
.attr("x", (width2 / 2))             
.attr("y", 0 + (margin2.top / 2))
.attr("text-anchor", "middle")  
.style("font-size", "16px") 
.text("Stacked Area Plot");

}

