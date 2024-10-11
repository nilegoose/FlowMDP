
// there are four columns per pre-definition
// deleted column(s) are considered as "hidden"

var width_unit = 1; // cannot fix updating problem, a workaround
const exampleArea = document.getElementById("multiple");
var fun_compa_count = 0; // for toggle button
var fun_rel_count = 0; // for toggle button
var clicked_node = undefined;
var removeCol1_count = 0;
var chart_count = 0;
var splitBtn_count = 0;


var translated_nodes = []; // for highlightened subtree
var padding_space = 10;

function drawSankey(data, svg, sortFun){
  translated_nodes = [];

  svg.selectAll(".link").remove();  
  svg.selectAll(".node").remove();  

  let sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height]);

  let path = sankey.link();  
  console.log(data.links)



  sankey
    .nodes(data.nodes)
    .links(data.links)
    .nodeSort(sortFun == undefined? ascending_name1 : sortFun)
    .layout(32);


  dataObj.updateSankey(sankey);
  dataObj.updateData(data);
  translate_col4();
  dataObj.updateSankey(sankey);//cannot delete two of them


//more elemental drawing operations for animation

  let link = linkEnter(svg, data, path)
  link.append("title")
    .text(title_link);

  let node = nodeEnter(svg, data, sankey)

  /** selection otherwise failed */
  let canvas = d3.select("#chartSVG")
    .on("click", canvasEvent);

    dataObj.updateSankey(sankey);

}

function highlight_node_links(node,i){
  if(splitBtn_count == 1){
    return
  }

  clicked_node = node;
  let current_name = node['name'];
  drawExampleGraph(current_name);
  
  var clicked_col = checkCol(node);
      // change column for new data
  if(cols[0].length == 1 && clicked_col == 2){
    cols[1] = node;
    reset_opacity(0.2);
    traverse_right(node);
    update_nodeLinkText("highlight");
    appendCharts(cols[2])
    translate_spacing(node);
    return;
  }else  if(cols[1].length == 1 && clicked_col == 1){
    cols[0] = node;
    reset_opacity(0.2);
    cols[2] = sliceTask(node, sliceOneColumn(types));
    update_nodeLinkText("highlight");
    appendCharts(cols[2])
    translate_spacing(node);
    return;
  }else{
    resetColList(); // emtpy the list of highlightened columns
  }

  cols[clicked_col -1] = [node]; //assign clicked node
  reset_opacity(0.2);
  traverse_left(node);
  traverse_right(node);
  cleanUpColList();
  update_nodeLinkText("highlight");
  appendCharts(cols[2])
  translate_spacing(node);

}

function linkEnter(svg, data, path){
  let link = svg
  .append("g").selectAll(".link")
  .data(data.links);


link
  .enter().append("path")
  .attr("class", "link")
  .attr("d", path)
  .attr("id", function(d,i){
    d.id = i;
    return "link-"+i;
  })
  .style("stroke-width", function(d) { 
    return Math.max(1, d.dy); })
  .sort(function(a, b) { return b.dy - a.dy; })
  .style('stroke', color_link)

  return link
}

function nodeEnter(svg, data, sankey){
  let node = svg.append("g").selectAll(".node")
    .data(data.nodes)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return translateString(d.x, d.y); })
  node
    .append("rect")
    .attr("height", function(d) { return d.dy; })
    .attr("width", sankey.nodeWidth())
    .style("fill", color_node_fun)
    .on("click", highlight_node_links)
    .append("title")
    .text(title_node);

  node.append("text")
    .attr("x", -6)// position left
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
    .attr("x", 6 + sankey.nodeWidth())// position right
    .attr("text-anchor", "start");
  return node
}




function canvasEvent(){

  if (!d3.event.target.matches("rect") && !d3.event.target.matches("path")) {
    clearHighlight();
    translate_reset();
    if(splitBtn_count == 1){
      splitBtn.setAttribute("fill", "#dce1e0");
      splitBtn_count = 0;
    }

  }

}

  // array highlighted link stores id.. []
function clearHighlight(){
  clicked_node = undefined;
  update_node("dehighlight");
  update_text("dehighlight");
  reset_opacity(0.2);
  resetColList();
  appendCharts([]);
}



function update_opacity(opacity){
  d3.selectAll(".link")
    .filter(link_clicked)
    .style("stroke-opacity", opacity);

}

function update_unclicked_opacity(opacity){
  d3.selectAll(".link")
  .filter(function(d) {
    return !link_clicked(d); // Negate the condition to get not clicked links
  })
    .style("stroke-opacity", opacity);
}


function reset_opacity(opacity){
  d3.selectAll(".link")
    //.filter(link_clicked)
    .style("stroke-opacity", opacity);

}



function update_general(action){// suitable for translating, more subtle for data updating
  // redundancy for:
  // adding, transforming, and deleting
  if(splitBtn_count == 1){
    splitBtn.setAttribute("fill", "#dce1e0");
    splitBtn_count = 0;
  }
  translated_nodes = [];
  clearHighlight();
  resetColList(); // emtpy the list of highlightened columns

  let graph = dataObj.getData();  

  if(action == "data2"){
    graph = data_process2();
  }

  if(action == "add"){
    graph = data_process();
  }
  let sortFunction = getSortfunction(action);
  let sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([width, height])
    .nodes(graph.nodes)
    .nodeSort(sortFunction)
    .links(graph.links)
    .layout(32);


  path = sankey.link();

  dataObj.updateSankey(sankey);
  dataObj.updateData(graph);
  translate_col4();
  dataObj.updateSankey(sankey);//cannot delete two of them





  svg
    .selectAll(".link")
    .data(graph.links)
    //.enter().append("path")
    .attr("class", "link")
    .transition()
    .duration(1000)
    .attr("d", path)
    .style('stroke', color_link)


  svg
    .selectAll(".link")
    .style("stroke-width", function(d) { return Math.max(1, d.value*width_unit); })

  // for adding links
  let link = linkEnter(svg, graph, path)


  svg.selectAll(".link>title")
    .data(graph.links)
    .transition()
    .text(title_link);


  svg.selectAll(".node")
    .data(graph.nodes)
    .transition()
    .duration(1000)
    .attr("class", "node")
    .attr("transform", function(d) {return translateString(d.x, d.y)});

  let node = nodeEnter(svg, graph, sankey);

  svg.selectAll(".rect")
    .data(graph.nodes)
    .transition()
    .duration(1000)
    .attr("height", function(d) { return d.dy; })

  color_per_func();//color nodes

  // have to reset text
  svg.selectAll(".node>rect>title")
    .data(graph.nodes)
    .transition()
    .duration(1000)
    .text(title_node);

  svg.selectAll("text")
    .data(graph.nodes)
    .transition()
    .duration(1000)
    .style("fill", "#000000")
    .attr("x", -6)
    .attr("y", function(d) { 
      return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");


    svg.selectAll(".node")
    .data(graph.nodes).exit().remove()

    svg.selectAll(".link")
    .data(graph.links).exit().remove()

}

function color_per_func(){
  let data = dataObj.getData();
  let sankey = dataObj.getSankey();

  svg.selectAll("rect").data(data.nodes)
    .style("fill", color_node_fun)
    .attr("height", function(d) { 
      return d.dy; })
    .attr("width", sankey.nodeWidth()); 
}


//update graph first, then re-highlight

function translate_spacing(node){

  translate_reset();
  let nodes = dataObj.getData().nodes;
  let col_nr = node.column;

  //const backupNodes = nodes.map(item => ({ ...item }));

  
  let sorted_part = resortPart( nodes.slice(), "column", col_nr, ascendingDepth);
  let idx = sorted_part.indexOf(node);
  let space = Math.min(sorted_part[0].y / 4, 10);
  padding_space = space;


  sorted_part.forEach(function(d, index){
    if(index < idx){
      translated_nodes.push(d);
      d.y = d.y - space * 4;
    }else if(index == idx){
      translated_nodes.push(d);
      d.y = d.y - space * 2;
    }
  })

  svg.selectAll(".node")
    .data(nodes)
    .transition()
    .duration(1000)
    .attr("transform", function(d){
      return translateString(d.x, d.y)});


    
  
  let path = dataObj.getSankey().link();



  svg.selectAll(".link")
    .transition()
    .duration(1000)
    .attr("d", path)
    .style('stroke', color_fade_link);

    //dataObj.getSankey().nodes(backupNodes);
    //console.log("restored");
}

function translate_reset(){
  if(translated_nodes.length == 0){
    return;
  }
  
  let nodes = dataObj.getSankey().nodes();

  if(translated_nodes.length > 1){
    
    translated_nodes.slice(0, -1).forEach(function(d){
      d.y += padding_space * 4;
    })

  }



  let last_node = translated_nodes[translated_nodes.length - 1];
  last_node.y += padding_space * 2;

  svg.selectAll(".node")
    .data(nodes)
    .transition()
    .duration(1000)
    .attr("transform", function(d){
      return translateString(d.x, d.y)});
  
  let path = dataObj.getSankey().link();


  svg.selectAll(".link")
    .transition()
    .duration(1000)
    .attr("d", path)
    .style('stroke', color_link);
  
  translated_nodes = [];

}



// this function regulates vertical space for column 4
function translate_col4(){
  let nodes = dataObj.getSankey().nodes();

  let sorted_part = resortPart( nodes.slice(), "column", 4, descendingDepth);


  let col3Nodes = resortPart( nodes.slice(), "column", 3, descendingDepth);

  //let baseline = col3Nodes[0].y + col3Nodes[0].dy;

  // if the spacing between two nodes exceeds , correct manuelly

  let y_below;
  let padding = 10;
  

  sorted_part.forEach(function(d){
    if (y_below == undefined){
      y_below = d.y;

      return;
    }
    let y_delta = y_below - d.y - d.dy;
    if(y_delta > padding * 2){
      d.y =  y_below - d.dy - padding * 2;
    }

    y_below = d.y;

    
  })


}

function drawExampleGraph(current_name){

  if(current_name == "Bubble plot"){
    draw1();
    scrollToBottom();
    // add a line between
    if (exampleArea.getAttribute("class") == "maxWidth"){
      exampleArea.classList.remove("maxWidth");

    }
    exampleArea.setAttribute("class", "maxWidth")


  }else{

    if (exampleArea.getAttribute("class") == "maxWidth"){
      exampleArea.classList.remove("maxWidth");
    }

    remove1();
    
  }


  switch(current_name) {
    case "Line plot":
        readCSVTime(dataLine, 2);
        break;
    case "2D density plot":
        readCSV(dataDensity2D, 1);
        break;
    case "Area plot":
      readCSVTime(dataArea, 4);
      break;
    case "Density plot":
      readCSV(dataDensity, 3);
      break;
    case "Stacked Area plot":
      readCSV(dataStackedArea, 5);
      break;
    case "Scatterplot":
      readCSV(dataScatter, 6);
      break;
    case "Violin plot":
      readCSV(dataViolin, 7);
      break;
    
    // Add more cases if needed
    default:
        break;
    }
}




      






