/*----------------------------------------------------------------------------------------- */
/*anoymous functions */
// colorful link 
function color_link(link){
  if(link.source.column == 2 || link.source.column == 1){
    return link.source.color;
  }
 else{
   return link.target.color;
  }
}

// color highlight link and fade the rest
function color_fade_link(d){   

  if(link_clicked(d)){
    let sourceColorBool = d.source.column < 3;
    if(sourceColorBool) return d.color = d.source.color;
    else return d.color = d.target.color;
}
  return d.color = "#D8D8D8"
}

function color_node_fun(d) { 
let compBool = FunState.getValue().includes("comparasion");
let relBool = FunState.getValue().includes("relationship");
let color1Bool = d.color1 == undefined;
let color2Bool = d.color2 == undefined;
let col3Bool = d.column == 3;
let defaultBool = FunState.getValue().length == 0;
let temp_color;
switch (true) {
  case (compBool):
    temp_color = ( color1Bool? 
      col3Bool? "#999999": d.color 
    : d.color1);
    break;
  case (relBool):
    temp_color = ( color2Bool? 
      col3Bool? "#999999": d.color 
    : d.color2);
    break;
  case (defaultBool):
    return d.color;
  default:
    return d.color;                   
}
return temp_color;
}

function title_link(d) { 
return d.source.name + " -- " + d.target.name}

function title_node(d) { 
  if(d.column == 3){
    return d.name; 
  }else if(d.column == 1){
    return d.name + "\n" +  "Chart types: " + dim_dict[d.name];
  }else if(d.column == 2){
    return d.name + "\n" +  "Chart types: " + abstract_dict[d.name];
  }
  return d.name + "\n" +  "Chart types: " + format(d.value); 
}

function link_clicked(d){ 
  return cols.flat().includes(d.source) && cols.flat().includes(d.target) 
}

/*----------------------------------------------------------------------------------------------- */


// assign link_toHighlight
// and nodes
function traverse_right(node){
    let remainingNodes = [],
        nextNodes = [];
                // traversal right

    let currentRightLinks = node["sourceLinks"]
    if(currentRightLinks != undefined){
      node["sourceLinks"].forEach(function(link) {
        remainingNodes.push(link["target"]);      
        });
    }
    while (remainingNodes.length) {

      nextNodes = [];

      let current_index = checkCol(remainingNodes[0]);
      cols[current_index - 1] = remainingNodes;

      remainingNodes.forEach(function(node) {
          // traversal right
          node["sourceLinks"].forEach(function(link) {
          //console.log(link);
          
          nextNodes.push(link["target"]);
        });
  

      });
      
      remainingNodes = nextNodes;
    }
    col4 = removeDuplication([...new Set(cols[3])]);

  }



function traverse_left(node){
    let remainingNodes = [],
        nextNodes = [];

    
    let currentLeftLinks = node["targetLinks"]
    if(currentLeftLinks != undefined){
      node["targetLinks"].forEach(function(link) {
        remainingNodes.push(link["source"]);      
        });
    }


    while (remainingNodes.length) {

    let current_index = checkCol(remainingNodes[0]); // check index fails
    cols[current_index - 1] = remainingNodes;

    nextNodes = [];
    remainingNodes.forEach(function(node) {
// traversal right
    node["targetLinks"].forEach(function(link) {
    nextNodes.push(link["source"]);      
      });
    });
    remainingNodes = nextNodes;
  }
  col1 = removeDuplication([...new Set(cols[0])]);
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
    }else if(action == "highlight"){
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
      return "#a9a9a9";
    }else if(action == "split"){
        if(cols.flat().includes(d)){
          return color_node_fun(d);}
        return "transparent";}
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
    }else if(action == "highlight"){
      if(cols.flat().includes(d)){
        return "#000000";
      }
      return "#8c8c8c";
    }else if(action == "split"){
      if(cols.flat().includes(d)){
        return "#000000";
      }
      return "transparent";
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
