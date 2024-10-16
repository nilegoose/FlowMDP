/*----------------------------------------------------------------------------------------- */
/*anoymous functions */
// default link color: color, color, grey, grey
function color_link(link){
  if(link.target.column == chartCol || link.target.column == encodeCol){
    return link.target.color;
  }
 else{
   return link.source.color;
  }
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
  let bool1 = d.source.clicked;
  let bool2 = d.target.clicked;
  return bool1 == 1 && bool2 == 1; 
}

/*----------------------------------------------------------------------------------------------- */


// assign link_toHighlight
// and nodes
function traverse_right(node){
  let result = [];

  let remainingNodes = [],
      nextNodes = [];
              // traversal right
  node["sourceLinks"].forEach(function(link) {
    remainingNodes.push(link["target"]);
  });
  while (remainingNodes.length) {

    nextNodes = [];
    remainingNodes.forEach(function(node) {
      result.push(node);
        node["sourceLinks"].forEach(function(link) {        
        nextNodes.push(link["target"]);
      });


    });
    
    remainingNodes = nextNodes;
  }

  result = removeDuplication(result);
  return result;
}


function traverse_right_charts(chat_array){
  let result = [];

  let remainingNodes = [];

  chat_array.forEach(function(chart){
                  // traversal right
    chart["sourceLinks"].forEach(function(link) {
      remainingNodes.push(link["target"]);
    });
    
  })

    
    result = removeDuplication(remainingNodes);
    return result;
  }

  // go to the abstraction column
  function traverse_left_charts(chat_array){
    let result = [];
  
    let remainingNodes = [];
  
    chat_array.forEach(function(chart){
                    // traversal right
      chart["targetLinks"].forEach(function(link) {
        remainingNodes.push(link["source"]);
      });
      
    })
  
      
      result = removeDuplication(remainingNodes);
      return result;
    }

    
  // go to the dim column
  function traverse_left_attri(chat_array){
    let result = [];
  
    let remainingNodes = [];
  
    chat_array.forEach(function(chart){
                    // traversal right
      chart["targetLinks"].forEach(function(link) {
        remainingNodes.push(link["source"]);
      });
      
    })
  
      
      result = removeDuplication(remainingNodes);
      return result;
    }





function traverse_left(node){
  if(node.column == 1){
    return
  }
  result = []
    let remainingNodes = [],
        nextNodes = [];

    
    let currentLeftLinks = node["targetLinks"]
    if(currentLeftLinks != undefined){
      currentLeftLinks.forEach(function(link) {
        remainingNodes.push(link["source"]);      
        });
    }


    while (remainingNodes.length) {
    nextNodes = [];
    remainingNodes.forEach(function(node) {
      result.push(node);
      node["targetLinks"].forEach(function(link) {
      nextNodes.push(link["source"]);      
      });
    });
    remainingNodes = nextNodes;
  }
  result = removeDuplication(result);
  return result;
}


function update_node(action){

  var graph = dataObj.getData();



svg.selectAll("rect").data(graph.nodes)
  .transition()
  .duration(1000)
  .style("fill", function(d){
  
    if(action == "dehighlight"){
      return color_node_fun(d);
    }else if(action == "highlight"){
      if(d.clicked){
        return color_node_fun(d);}
      
      return "#a9a9a9";
    }else if(action == "split"){
        if(d.clicked){
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
      if(d.clicked){
        return "#000000";
      }
      return "#8c8c8c";
    }else if(action == "split"){
      if(d.clicked){
        return "#000000";
      }
      return "transparent";
    }
  })
  
}

// changes link color, including fading and highlighting
function update_link(){
  svg.selectAll(".link")
    .style('stroke', color_fade_link)
    .transition()
    .duration(500);
  update_opacity(0.6);

}


// color highlight link and fade the rest
function color_fade_link(d){   

  if(link_clicked(d)){
    return color_link(d)
  }
  return d.color = "#D8D8D8"
}


function update_nodeLinkText(action){
  update_node(action);
  update_text(action);
  update_link();
  
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
