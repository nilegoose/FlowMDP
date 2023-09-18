const exampleArea = document.getElementById("multiple");
var fun_compa_count = 0; // for toggle button
var fun_rel_count = 0; // for toggle button
var clicked_node = undefined;
var col1 = [],
col2 = [],
col3 = [],
col4 = [];

var cols = [col1, col2, col3, col4];

var translated_nodes = [];
var padding_space = 10;

function drawSankey(data, svg, sortFun){
  translated_nodes = [];
  console.log("function drawSankey");
  console.log(sortFun);

  //console.log(data);


 

svg.selectAll("g").remove();


var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]);
 
var path = sankey.link();  



  sankey
      .nodes(data.nodes)
      .links(data.links)
      .nodeSort(sortFun == undefined? ascending_name1 : sortFun)
      .layout(32);

      dataObj.updateSankey(sankey);

  translate_col4();

  dataObj.updateSankey(sankey);


  var link = svg.append("g").selectAll(".link")
      .data(data.links);

      
  link
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .attr("id", function(d,i){
        d.id = i;
        return "link-"+i;
      })
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; })
      .style('stroke', color_link);

 

  link.append("title")
      .text(title_link);
 
  var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return translateString(d.x, d.y); });
    



      /** you cannot specify "the" svg element */
  var canvas = d3.select("#chartSVG")
  .on("click", canvasEvent);


 
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

            
     
      // usually we dont dont have to write so complex function
      // but since there are multiple updating operations.. 
      // so the main function is splitted into several 


      // - hightlight
      // - resort then highlight
      
      
      function highlight_node_links(node,i){
        console.log("highlight_node_links");
        clicked_node = node;

        current_name = node['name'];
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
        console.log(current_name + " clicked");
        update_opacity(0.2);



        
      
      
        var clicked_col = checkCol(i);
        cols[clicked_col -1] = [node];


        traverse_left(node);
        traverse_right(node);
       
        update_link();
        update_opacity(0.6);
        update_node("highlight");
        update_text("highlight");

        translate_spacing(node);
       
      }
      
  }




  function canvasEvent(){

    if (!d3.event.target.matches("rect") && !d3.event.target.matches("path")) {
      clearHighlight();
      translate_reset();

    }

  }

  // array highlighted link stores id.. []
  function clearHighlight(){
    clicked_node = undefined;
    update_node("dehighlight");
    update_text("dehighlight");
    update_opacity(0.2);
  }



  function update_opacity(opacity){
    d3.selectAll(".link")
    .filter(link_clicked)
    .style("stroke-opacity", opacity);

  }


// translate _ spacing _


function update_general(action){
  translated_nodes = [];
  clearHighlight();


col1 = [];
col2 = [];
col3 = [];
col4 = [];

cols = [col1, col2, col3, col4];
  graph = dataObj.getData();
  var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]),
  path;


  if(action == "compa"){
    sankey 
    .nodes(graph.nodes)
    .links(graph.links)
    .nodeSort(ascending_param)
    .layout(32);

    path = sankey.link();

  }else if(action == "rel"){
    sankey 
    .nodes(graph.nodes)
    .links(graph.links)
    .nodeSort(ascending_param2)
    .layout(32);

    path = sankey.link();

  }
  else{
    sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .nodeSort(ascending_name1)
    .layout(32);
    path = sankey.link();
  }


  dataObj.updateSankey(sankey);



  var link2 = svg.selectAll(".link")
  .data(graph.links)
  .transition()
  .duration(1000)
  .attr("class", "link")
  .attr("d", path)
  .style("stroke-width", function(d) { return Math.max(1, d.dy); })
  .style('stroke', color_link);


  svg.selectAll(".link>title")
  .data(graph.links)
  .transition()
  .text(title_link);


  svg.selectAll(".node")
  .data(graph.nodes)
  .transition()
  .duration(1000)
  .attr("class", "node")
  .attr("transform", function(d) {return translateString(d.x, d.y)})


      

  color_per_func();

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
    //if(d.name == "PCA"){return d.dy + 6}
    return d.dy / 2; })
  .attr("dy", ".35em")
  .attr("text-anchor", "end")
  .attr("transform", null)
  .text(function(d) { return d.name; })
  .filter(function(d) { return d.x < width / 2; })
  .attr("x", 6 + sankey.nodeWidth())
  .attr("text-anchor", "start");

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

// changes link color, including fading
function update_link(){
  var link3 = svg.selectAll(".link");

  link3.style('stroke', color_fade_link)
  .transition()
  .duration(1000);

}


function fade_link(data, path){
  var link3 = svg.selectAll(".link")
  .data(data)
  .transition()
  .duration(1000)
  .style("stroke-opacity", opacity_pick)
}


function translate_spacing(node){

  translate_reset();
  console.log(node);
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


    
  let link = svg.selectAll(".link");
  let path = dataObj.getSankey().link();



   link
   //.data(link_data)
   .transition()
   .duration(1000)
   .attr("d", path);
   link.style('stroke', color_fade_link);

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
  let link = svg.selectAll(".link");
  let path = dataObj.getSankey().link();


   link
   //.data(link_data)
   .transition()
   .duration(1000)
   .attr("d", path)
   .style('stroke', color_link);
   translated_nodes = [];

}


// the idea is, to update graph first, then re-highlight


function translate_col4(){
  let nodes = dataObj.getSankey().nodes();

  //const backupNodes = nodes.map(item => ({ ...item }));

  
  let sorted_part = resortPart( nodes.slice(), "column", 4, descendingDepth);

  let col3Nodes = resortPart( nodes.slice(), "column", 3, descendingDepth);

  //let baseline = col3Nodes[0].y + col3Nodes[0].dy;

  // if the spacing between two nodes exceeds , correct manuelly

  let y_below;
  let padding = 8;
  

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

      






