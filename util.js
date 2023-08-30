var types = ['Boxplot', 'Histogram', 'Density plot', 'Bubble plot', 'Scatterplot', 'Violin plot', 'Area plot', 'Line plot', '2D density plot', 'Stacked Area plot', 'Streamgraph', 'Ridgeline', 'Heatmap', 'Dendrogram', 'Barplot', 'Doughnut chart', 'Piechart', 'Treemap', 'Parallel coordinates', 'Radar Chart', 'Sankey diagram', 'Circular packing', 'Venn diagram', 'Sunburst', 'Network', 'Chord', 'Arc diagram'],

dimensions=["oneDim", "twoDim", "threeDim", "nDim"], 
attributes=['one_Numeric', 'two_Numeric', 'three_Numeric', 'n_Numeric', 'one_Categorical', '2/more_Categorical', 'oneNum_oneCat', 'oneCat_sevNum', 'sevCat_oneNum'],
encoding=['position', 'points', 'colour', 'lines', 'size(area)', 'angle', 'shape', 'length'];


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


        let attributeMap = {
          "name1": "value1",
          "name2": "value2"
        };
        
        graph.nodes.forEach((node) => {
          node.attribute = attributeMap[node.name] || "default value";
        });




        graph.nodes.forEach((node) => {
          node.column = checkCol_node(node);
        });


        var colorCol2=["#fcae91", "#fb6a4a", "#de2d26", "#a50f15", "#6baed6", "#3182bd",
          "#b8a0c3", "#a6747c",  "#865d9e"];

        var colorCol1=["#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"];

        var colorCol3=['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'];

        var colorCol4=['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666'];



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


        var comparasion = ["Boxplot", "Bubble plot", "Line plot", "Stacked Area plot", "Barplot", "Doughnut chart", "Piechart", "Treemap", "Parallel coordinates", "Radar Chart", "Venn diagram", "Chord"];
        
        graph.nodes.forEach((node) => {
          if(node.column == 3){
            if(comparasion.includes(node.name)){
              node.comparasion = true;
              node.color1="#5ab4ac";
            }
          }

        });

        var relationships = ["Scatterplot", "Bubble plot", "Heatmap", "Parallel coordinates", "Radar Chart", "Venn diagram", "Chord"];
        graph.nodes.forEach((node) => {
          if(node.column == 3){
            if(relationships.includes(node.name)){
              node.relationships = true;
              node.color2="#d8b365";
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
    
      // Private function
      function funDefault() {
        current_state = [];
      }
    
      // Public function to access the variable
      function getState() {
        return current_state;
      }
    
      // Public API (exposed methods)
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
