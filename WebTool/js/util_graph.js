// assign link_toHighlight
// and nodes
function traverse_right(node){
    let remainingNodes = [],
        nextNodes = [];

    let sankey = dataObj.getSankey();
                // traversal right
    node["sourceLinks"].forEach(function(link) {
      remainingNodes.push(link["target"]);
    });
    while (remainingNodes.length) {

      nextNodes = [];

      let current_index = sankey.nodes().indexOf(remainingNodes[0]);
      cols[checkCol(current_index) - 1] = remainingNodes;


      remainingNodes.forEach(function(node) {
          // traversal right
          node["sourceLinks"].forEach(function(link) {
          //console.log(link);
          
          nextNodes.push(link["target"]);
        });
  

      });
      
      remainingNodes = nextNodes;
    }
    col4 = [...new Set(cols[3])];
  }



function traverse_left(node){
    let remainingNodes = [],
        nextNodes = [],
        sankey = dataObj.getSankey();

    node["targetLinks"].forEach(function(link) {
    remainingNodes.push(link["source"]);      
    });

    while (remainingNodes.length) {

    let current_index = sankey.nodes().indexOf(remainingNodes[0]);
    cols[checkCol(current_index) - 1] = remainingNodes;

    nextNodes = [];
    remainingNodes.forEach(function(node) {
// traversal right
    node["targetLinks"].forEach(function(link) {
    nextNodes.push(link["source"]);      
      });
    });
    remainingNodes = nextNodes;
  }
  col1 = [...new Set(cols[0])];
}


function update_node(action){

  var graph = dataObj.getData();



svg.selectAll("rect").data(graph.nodes)
  .transition()
  .duration(1000)
  .style("fill", function(d){
    let compBool = FunState.getValue().includes("comparasion");
    let relBool = FunState.getValue().includes("relationship");
  
    if(action == "dehighlight"){
      return color_node_fun(d);
    }else{
      if(cols.flat().includes(d)){
        return color_node_fun(d);}
      if(compBool  && d.column ==3){
        if(d.color1 != undefined){
          return d.color1;
        }
       

      }

      if(relBool && d.column ==3){
      
        if(d.color2 != undefined){
          return d.color2;
        }

      }

      
      return "#a9a9a9";}
    })
    .attr("height", function(d) { 
      return d.dy; })
}

function update_text(action){
  graph = dataObj.getData();


  svg.selectAll("text")
  .data(graph.nodes)
  .transition()
  .duration(1000)
  .style("fill", function(d){
    if(action == "dehighlight"){
      return "#000000";
    }else{
      if(cols.flat().includes(d)){
        return "#000000";
      }
      return "#8c8c8c";
    }
  })
  
}

/**-------------------------------------------------------------------------- */
//test functions
function changeColor(){
  d3.selectAll("rect")
    .transition()
    .duration(500)
    .style("fill", "red")
}

function changeWidth(width){
  d3.selectAll("rect")
    .transition()
    .duration(2000)
    .style("width", width)
}
