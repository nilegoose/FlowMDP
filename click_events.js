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
  console.log("function drawSankey");
  console.log(sortFun);

  //console.log(data);


 

svg.selectAll("g").remove().transition().duration(1000);


var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]);
 
var path = sankey.link();  



  sankey
      .nodes(data.nodes)
      .links(data.links)
      .nodeSort(sortFun == undefined? ascendingDepth : sortFun)
      .layout(32);

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
      .transition()
      .duration(1000)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; })
      .style('stroke', color_link);

  link_count = link.length;


  link.append("title")
      .text(title_link);
 
  var node = svg.append("g").selectAll(".node")
      .data(data.nodes)
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    



      /** you cannot specify "the" svg element */
  var canvas = d3.select("#chartSVG")
  .on("click", canvasEvent);


 
  node
  .append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", color_per_func)
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
        clicked_node = node;

        current_name = node['name'];

        highlighted_link.forEach(function(link){
          dehighlight_link(link);
        })

        showText(current_name);
        
      
      
        var clicked_col = checkCol(i);
        link_toHighlight= link_toHighlight.concat(traverse_right(node));
        link_toHighlight = link_toHighlight.concat(traverse_left(node));
      
      
        var encoding_list = [];
      
      
        col4.forEach(function(node){
          encoding_list.push(node['name']);
        });
        // the encoding columns
        showText2(encoding_list);
        encoding_list = [];
        // gove to global variable



        update_link();

        link_toHighlight.forEach(function(id){
          highlight_link(id, 0.6);
        })
        highlighted_link = link_toHighlight;

        translate_spacing(node);
        link_toHighlight = [];

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

    if(highlighted_link.length <= 0) {
      return;
    }
      highlighted_link.forEach(function(element) {
        dehighlight_link(element);
      });
    

  }

  function dehighlight_link(id){
    d3.select("#link-"+id)
    .style("stroke-opacity", 0.2)
    .style("strock", function(d){return d.color = d.source.color});
    // the array records highted links

    highlighted_link = highlighted_link.filter(item => item !== id);
    link_toHighlight = link_toHighlight.filter(item => item !== id);


  }



  function highlight_link(id,opacity){
    d3.select("#link-"+id).style("stroke-opacity", opacity);
    
  }


// translate _ spacing _


function update_general(action, name, sort_param){
  return;
  graph = dataObj.getData();
  var sankey = d3.sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .size([width, height]),
  path;


  if(sort_param != undefined && sort_param.includes("comparasion")){
    sankey 
    .nodes(graph.nodes)
    .links(graph.links)
    .nodeSort(ascending_param)
    .layout(32);

    path = sankey.link();

  }else{
    sankey
    .nodes(graph.nodes)
    .links(graph.links)
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
  .sort(function(a, b) { return b.dy - a.dy; });

  svg.selectAll(".link>title")
  .data(graph.links)
  .transition()
  .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });


  svg.selectAll(".node")
  .data(graph.nodes)
  .transition()
  .duration(1000)
  .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })


  console.log("line 493 fun " + FunState.getValue());
  console.log("line 493 sort " + sort_param);
      

  color_per_func();

  svg.selectAll(".node>rect>title")
  .data(graph.nodes)
  .transition()
  .duration(1000)
  .text(function(d) { return d.name + "\n" + format(d.value); });


  svg.selectAll("text")
  .data(graph.nodes)
  .transition()
  .duration(1000)
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
  .transition()
  .duration(0)
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
  let nodes = dataObj.getSankey().nodes();
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
   link.style('stroke', function(d){   

    if(link_toHighlight.includes(d.id)){
      let sourceColorBool = d.source.column < 3 ;
      if(sourceColorBool){
        return d.color = d.source.color;
      }else{
        return d.color = d.target.color;
      }
  } 
    return d.color = "#D8D8D8"
  });

   //dataObj.getSankey().nodes(backupNodes);
   //console.log("restored");
}

function translate_reset(){
  if(translated_nodes.length == 0) return;
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

      
      






