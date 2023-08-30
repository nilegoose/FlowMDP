function traverse_right(node){
    let remainingNodes = [],
        nextNodes = [];

    let sankey = dataObj.getSankey();
                // traversal right
    node["sourceLinks"].forEach(function(link) {
      remainingNodes.push(link["target"]);

      link_toHighlight.push(link.id);
      
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
          link_toHighlight.push(link.id);
        });
  

      });
      
      remainingNodes = nextNodes;
    }
  }



function traverse_left(node){
    let remainingNodes = [],
        nextNodes = [],
        sankey = dataObj.getSankey();

    node["targetLinks"].forEach(function(link) {
    remainingNodes.push(link["source"]);
    link_toHighlight.push(link.id);
    });

    while (remainingNodes.length) {

    let current_index = sankey.nodes().indexOf(remainingNodes[0]);
    cols[checkCol(current_index) - 1] = remainingNodes;

    nextNodes = [];
    remainingNodes.forEach(function(node) {
// traversal right
    node["targetLinks"].forEach(function(link) {
//console.log(link);

    nextNodes.push(link["source"]);

// highlight expect the leftmost

    if(nextNodes.length > 0){
        link_toHighlight.push(link.id); 
    }
});


});

remainingNodes = nextNodes;
}
}


function update_node(action){
  var graph = dataObj.getData();


svg.selectAll("rect").data(graph.nodes)
  .transition()
  .duration(1000)
  .style("fill", function(d){
    if(action == "dehighlight"){
      return d.color;
    }else{
      if(cols.flat().includes(d)){
        return d.color;
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
