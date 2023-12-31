var col1 = [],
col2 = [],
col3 = [],
col4 = [];

var cols = [col1, col2, col3, col4];




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

  function scrollToBottom(){
    window.scrollTo({left : 0, top : document.body.scrollHeight, behavior: "smooth"});
  }


function resetColList(){
col1 = [],
col2 = [],
col3 = [],
col4 = [];

cols = [col1, col2, col3, col4];

    }

