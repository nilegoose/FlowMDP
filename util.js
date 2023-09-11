/*----------------------------------------------------------------------------- */
// labels 

const types = ['Boxplot', 'Histogram', 'Density plot', 'Bubble plot', 'Scatterplot', 'Violin plot', 'Area plot', 'Line plot', '2D density plot', 'Stacked Area plot', 'Streamgraph', 'Ridgeline', 'Heatmap', 'Dendrogram', 'Barplot', 'Donut chart', 'Piechart', 'Treemap', 'Parallel coordinates', 'Radar chart', 'Sankey diagram', 'Circular packing', 'Venn diagram', 'Sunburst', 'Network', 'Chord', 'Arc diagram'],

dimensions=["1D", "2D", "3D", "HD"], 
attributes=['One Numeric', 'Two Numeric', 'Three Numeric', 'Several Numeric', 'One Categorical', 'Several Categorical', 'One Num, One Cat', 'One Cat, Several Num', 'Several Cat, One Num'],
encoding=['Position', 'Point', 'Color', 'Line', 'Size(area)', 'Angle', 'Shape', 'Length'];

// colors for each column
const colorCol2=["#fcae91", "#fb6a4a", "#de2d26", "#a50f15", "#6baed6", "#3182bd", "#b8a0c3", "#a6747c",  "#865d9e"],
colorCol1=["#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
colorCol3=['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'],
colorCol4=['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666'];

const colorFunctions = ["#5ab4ac", "#d8b365"];


// i : index of node
function checkCol(i){
    switch (true) {
      case (i >= 0 && i < dimensions.length):
        return 1;
      case (i >= dimensions.length && i < dimensions.length + attributes.length):
        return 2;
      case (i >= dimensions.length + attributes.length && i < dimensions.length + attributes.length + types.length):
        return 3;
      case (i >= dimensions.length + attributes.length + types.length):
        return 4;
      default:
        console.log("function checkCol fails")
      }
    }

// for initial assignment, not efficient but secure
function checkCol_node(node){
  if(types.includes(node.name)){
    return 3;
  }else if(dimensions.includes(node.name)){
     return 1;
  }else if(attributes.includes(node.name)){
    return 2;
  }else if(encoding.includes(node.name)){
    return 4;
  }else{
    console.log("new name " + node.name);
  }
}


  


function data_process(){
        graph = {
          "nodes" :[],
          "links" :[]
        };


        //types.forEach(function(name){
        //  graph.nodes.push({
        //    "name" : name
        //  });

        //});

        getData()["nodes"].forEach(function (d){
          graph.nodes.push({
            "name" : d.name
          });

        });

        getData()["links"].forEach(function (d){

          graph.links.push({
            "source" : d.source,
            "target" : d.target,
            "value" :  d.value
          });
        });


        

        graph.nodes.forEach((node) => {
          node.column = checkCol_node(node);
        });


        // assign color
        let countCol1 = 0,
        countCol2 = 0,
        countCol4 = 0;
      

        graph.nodes.forEach((node) => {
          if (node.column == 1){
            node.color = colorCol1[countCol1];
            countCol1++;
          } else if (node.column == 2){
            node.color = colorCol2[countCol2];
            countCol2++
          } else if (node.column == 4){
            node.color = colorCol4[countCol4];
            countCol4++
          } else {
            node.color = "#a9a9a9"
          } 
        });


        const compaIdx = [0, 3, 7, 9, 14, 15, 16, 17, ,18, 19, 22, 25]; //indices in the array chart types
        var compa_name = []; 
        compaIdx.forEach(index => {
          let name = types[index];
          compa_name.push(name);          
        });

        const relIdx = [4, 3, 12, 19, 18, 22, 25]; //indices in the array chart types
        var rel_name = []; 
        relIdx.forEach(index => {
          let name = types[index];
          rel_name.push(name);          
        });



        graph.nodes.forEach((node) => {
          if(node.column == 3){
            if(compa_name.includes(node.name)){
              node.comparasion = true;
              node.color1=colorFunctions[0];
            }
          }
        });



        graph.nodes.forEach((node) => {
          if(node.column == 3){
            if(rel_name.includes(node.name)){
              node.relationships = true;
              node.color2=colorFunctions[1];
            }
          }
        });
        return graph;
    }

    // help function for the search list
    // to change the var FunState
    // remove one element for the array
    function filterFunction(array_in, eleToRemove){
      newArray = array_in.filter((element)=> element != eleToRemove);
      return newArray;

    }
    

   // data_process();

   // gives back nodes which fill certain function
   function filterByFunction(array, fun) {
    return array.filter(function(element) {
      return element["column"] != 3 || element[fun] == true;
    });
  }

  function removeCol_link(array, collumnIndex) {
    return array.filter(function(link) {
      return ![0, 1, 2, 3].includes(link["source"]);
    });
  }
  function removeCol_node(array, collumnIndex) {
    return array.splice(0, 4);

  }



   function data_process2(){
    graph = data_process();
    graph.links = removeCol_link(graph.links);
    //graph.nodes.splice(0, 4);// cannot remove nodes because... the links are computed with indices
    // rewrite the sankey function ...
    // then you also have to recompute the id of links...
    
 
    return graph;
  }

  // to remove redundant elements for an array


function removeDuplication(array_in){
    return Array.from(new Set(array_in));

}

function translateString(x, y){
  return "translate(" + x + "," + y + ")"
}


function resortPart(arr, field, value, sortFun){
  let startIdx = arr.findIndex(node => node[field] == value);
  let endIdx = arr.findIndex((node, idx) => idx > startIdx && node[field] !== value);
  // if endIdx cannot be found
  if(endIdx == -1){
    endIdx = arr.length;
  }
  console.log(endIdx);
  const sectionToSort = arr.slice(startIdx, endIdx);
  sectionToSort.sort(sortFun);
  // if return the whole array with sorted part:
  //arr.splice(startIdx, sectionToSort.length, ...sectionToSort);
  return sectionToSort;
}
//calculate the spacing between topmost and the upper edge

var abstract_dict = {'one_Numeric': 2,
 'two_Numeric': 8,
 'three_Numeric': 7,
 'n_Numeric': 9,
 'one_Categorical': 6,
 '2/more_Categorical': 12,
 'oneNum_oneCat': 10,
 'oneCat_sevNum': 13,
 'sevCat_oneNum': 15};

 var dim_dict = {'oneDim': 8,
  'twoDim': 15,
  'threeDim': 10,
  'nDim': 21};

  

  var ColorState = (function() {
    var current_state = "";
  
    function colorByComp() {
      current_state = "comparasion";
    }
  
    // Private function
    function colorByDefault() {
      current_state = "";
    }
  
    // Public function to access the variable
    function getState() {
      return current_state;
    }
  
    // Public API (exposed methods)
    return {
      compa: colorByComp,
      default: colorByDefault,
      getValue: getState
    };
  })();

    

  // it allowed multiple choice, later corrected to single choice

    var FunState = (function() {
      var current_state = [];
    
      function funComp() {
        current_state = [];
        current_state.push("comparasion");
      }

      function elimComp() {
        current_state = filterFunction(current_state, "comparasion");
      }

      
      function funRel() {
        current_state = [];
        current_state.push("relationship");
      }

      function elimRel() {
        current_state=filterFunction(current_state, "relationship");
      }
    
      function funDefault() {
        current_state = [];
      }
    
      function getState() {
        return current_state;
      }
    
      return {
        compa: funComp,
        rel : funRel,
        default: funDefault,
        getValue: getState,
        cancelCompa : elimComp,
        cancelRel : elimRel 
      };
    })();



   // data_process();


  function removeCol_link(array, collumnIndex) {
    return array.filter(function(link) {
      return ![0, 1, 2, 3].includes(link["source"]);
    });
  }
  function removeCol_node(array, collumnIndex) {
    return array.splice(0, 4);

  }
/*----------------------------------------------------------------------*/
// sorting functions for ordering nodes
// used in sankey.js

  function ascendingDepth(a, b) {
    return a.y - b.y;
  }

  function descendingDepth(a, b) {
    return b.y - a.y;
  }

  function noSort(a, b) {
    return a.index - b.index;
  }

  // sort by 1. nodes with comparison param
  // then by y value
  function ascending_param(a, b) {
    if (a.comparasion == b.comparasion) {
      return a.y - b.y; 
    } else if (a.comparasion == true) {
      return -1; 
    } else {
      return 1; 
    }
  }

  // sort by 1. nodes with the param relationship
  // then by y value
  function ascending_param2(a, b) {
    if (a.relationships == b.relationships) {
      return a.y - b.y; 
    } else if (a.relationships == true) {
      return -1; 
    } else {
      return 1; 
    }
  }





function ascending_name1(a, b) {
  // plot first
  if (a.name.endsWith("plot") && !b.name.endsWith("plot")) {
    return -1; 
  } else if (!a.name.endsWith("plot") && b.name.endsWith("plot")) {
    return 1;  
  }
  // then chart
  if (a.name.endsWith("hart") && !b.name.endsWith("hart")) {
    return -1; 
  } else if (!a.name.endsWith("hart") && b.name.endsWith("hart")) {
    return 1;  
  }
  // the y
  return a.y - b.y;
}
/*----------------------------------------------------------------------*/
  function resetPage(){
    location.reload();
  }

  function resetBtnEvent(){
    resetPage();
    this.classList.toggle('rotated');
  }

