// this file is mostly adapted from d3-gallery
var margin2 = {top: 30, right: 30, bottom: 30, left: 50},
    width2 = 460 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;
    
    // Function to generate a new SVG object
function generateSVG(containerId = "#my_dataviz") {
      // Create a new SVG container
      let svg = d3.select(containerId)
        .append("svg")
          .attr("width", width2 + margin2.left + margin2.right)
          .attr("height", height2 + margin2.top + margin2.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin2.left + "," + margin2.top + ")");
      return svg;
    }

const dataDensity = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/1_OneNum.csv";
const dataLine = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv"; // Time
const dataDensity2D = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_for_density2d.csv"
const dataArea = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv" // Time
const dataStackedArea = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv"
function readCSV(path, funcIndex){
  d3.csv(path, function(data){
    console.log(data)
    const func = functionsMap[funcIndex]
    console.log(func)
    func(data, generateSVG())
  })
}

function readCSVTime(path, funcIndex){
  d3.csv(path, function(d){
    return  { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value };
  },function(error, data){
    if (error) {
      console.error('Error loading the CSV file:', error);
    } else {
      const func = functionsMap[funcIndex]
      func(data, generateSVG());
    }
  });
}




  
  