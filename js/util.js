//-----------------------------locate clicked nodes-------------------------------------------------

function checkCol(x, col1 = column_1, col2 = column_2, col3 = column_3, col4 = column_4, col5 = column_5) {
  if (typeof x === 'number') {
      return checkCol_index(x, col1, col2, col3, col4);
  } else {
      return checkCol_node(x, col1, col2, col3, col4, col5);
  } 
}



// i : index of node
function checkCol_index(i, col1, col2, col3, col4){
  switch (true) {
    case (i >= 0 && i < col1.length):
      return 1;
    case (i >= col1.length && i < col2.length + col1.length):
      return 2;
    case (i >= col2.length + col1.length && i < col1.length + col2.length + col3.length):
      return 3;
    case (i >= col1.length + col2.length + col3.length && i < col1.length + col2.length + col3.length + col4.length):
      return 4;
    default:
      return 5;
  }
}

// for initial assignment, not efficient but secure
function checkCol_node(node, col1, col2, col3, col4, col5){
  if(col3.includes(node.name)){
    return 3;
  }else if(col1.includes(node.name)){
     return 1;
  }else if(col2.includes(node.name)){
    return 2;
  }else if(col4.includes(node.name)){
    return 4;
  }else if(col5.includes(node.name)){
    return 5;
  }else{
    console.log("new name " + node.name);
  }
}


  


function data_process(){
  graph = {
    "nodes" :[],
    "links" :[]
  };

  let combinedList = [...column_1, ...column_2, ...column_3, ...column_4, ...column_5];

  combinedList.forEach(function (d){
    graph.nodes.push({
      "name" : d,
      "clicked" : 0
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
    node.column = checkCol(node);
  });


  // assign color
  let countCol1 = 0,
  countCol2 = 0,
  countCol3 = 0,
  countCol4 = 0;
      

  graph.nodes.forEach((node) => {
    if (node.column == 1){
      node.color = colorCol1[countCol1];
      countCol1++;
    } else if (node.column == 2){
      node.color = colorCol2[countCol2];
      countCol2++
    } else if (node.column == 3){
      node.color = colorColAb[countCol3];
      countCol3++
    } else if (node.column == 5){
      node.color = colorCol4[countCol4];
      countCol4++
    } else {
      node.color = "#a9a9a9"
    } 
  });

  console.log(graph)
  return graph;
}

// help function for the search list
// to change the var FunState
// remove one element for the array
function filterFunction(array_in, eleToRemove){
  newArray = array_in.filter((element)=> element != eleToRemove);
  return newArray;

}
    


// gives back nodes which fill certain function
function filterByFunction(array, fun) {
  return array.filter(function(element) {
    return element["column"] != 3 || element[fun] == true;
  });
}






function data_process2(){
  graph = {
    "nodes" :[],
    "links" :[]
  };

  let combinedList = [...column_1, ...column_2, ...column_3, ...column_4];

  combinedList.forEach(function (d){
    graph.nodes.push({
      "name" : d
    });

  });

  getData2()["links"].forEach(function (d){

    graph.links.push({
      "source" : d.source,
      "target" : d.target,
      "value" :  d.value
    });
  });

  graph.nodes.forEach((node) => {
    node.column = checkCol(node);
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

  console.log(graph)
  return graph;
}

  // to remove redundant elements for an array


function removeDuplication(array_in){
    return Array.from(new Set(array_in));
}

function translateString(x, y){
  return "translate(" + x + "," + y + ")"
}



// considering the structure of nodes, this function sorts one column
function resortPart(arr, field, value, sortFun = noSort){
  let startIdx = arr.findIndex(node => node[field] == value);
  let endIdx = arr.findIndex((node, idx) => idx > startIdx && node[field] !== value);
  // if endIdx cannot be found
  if(endIdx == -1){
    endIdx = arr.length;
  }
  //console.log(endIdx);
  const sectionToSort = arr.slice(startIdx, endIdx);
  sectionToSort.sort(sortFun);
  // if return the whole array with sorted part:
  //arr.splice(startIdx, sectionToSort.length, ...sectionToSort);
  return sectionToSort;
}

function filterPart(arr, field, value){
   let section = []
   arr.forEach(function(node){
    if(node[field] == value){
      section.push(node)
    }
   })
  return section;
}

function getFieldsFromNodes(arr, field){
  let output = []
  arr.forEach(function(node){
    output.push(node[field])}
  )
 return output;
}

var ColorState = (function() {
  var current_state = "";

  function colorByComp() {
    current_state = "comparison";
  }

  // Private function
  function colorByDefault() {
    current_state = "";
  }

  // Public function to access the variable
  function getState() {
    return current_state;
  }

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
    current_state.push("comparison");
  }

  function elimComp() {
    current_state = filterFunction(current_state, "comparison");
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

function sortAttributes(a, b) {
  indexA = attributes.findIndex(attr => attr.name === a.name)
  indexB = attributes.findIndex(attr => attr.name === b.name)
  return indexA - indexB;
}

function sortDim(a, b) {
  indexA = dimensions.findIndex(attr => attr.name === a.name)
  indexB = dimensions.findIndex(attr => attr.name === b.name)
  return indexA - indexB;
}


function sortTask(a, b) {
  indexA = tasks.findIndex(attr => attr.name === a.name)
  indexB = tasks.findIndex(attr => attr.name === b.name)
  return indexA - indexB;
}



// sort by 1. nodes with comparison param
// then by y value
function ascending_param(a, b) {
  if (a.comparison == b.comparison) {
    return a.y - b.y; 
  } else if (a.comparison == true) {
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


// to sort similar names together
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

function splitBtnEvent(){

  let currentClicked = filterPart(dataObj.getData().nodes, "clicked", 1);
  if(currentClicked.length == 0){
    return
  }
  if(splitBtn_count == 0){
    splitBtn.setAttribute("fill", "#3e8e41");
    update_unclicked_opacity(0);
    update_text("split");
    update_node("split");
    splitBtn_count = 1;

  }else{
    splitBtn.setAttribute("fill", "#dce1e0");
    update_unclicked_opacity(0.2)
    update_text("highlight");
    update_node("highlight");
    splitBtn_count = 0;
  }
  
}

function pinBtnEvent(){

  if(pinChecked == false){
    pinBtn.setAttribute("fill", "#3e8e41");

    pinChecked = true;

  }else{
    pinBtn.setAttribute("fill", "#dce1e0");
    pinChecked = false;
  }
  
}

function resetColList(){
  chart_count = 0;
  setChartCount();

}

// for general update function, it needs different sort functions according to action name
function getSortfunction(action){
  if(action == "compa"){
    return ascending_param;
  }else if(action == "rel"){
    return ascending_param2
  }
  else{
    return ascending_name1
  }
}


function sliceOneColumn(column){
  let data = dataObj.getData(); 
  let nodes = data.nodes;
  let result = [];

  for (let x of nodes) {
      if (column.includes(x.name)) {
          result.push(x);
      }
  }
  return result;
}

// given a task and give corresponding charts
function sliceTask(task, charts){
  let names = [];
  let result = [];
  let index = tasks.indexOf(task.name);
  let charts_indices = task_charts[index];
  for(let x of charts_indices){
    names.push(types[x])
  }

  for (let x of charts) {
    if (names.includes(x.name)) {
        result.push(x);
    }
  }
  return result;
}



// given a task and give corresponding charts
function sliceMultipleTask(taskArray, charts){
  return 
}

function clickNodes(arrayIn, value) {
  arrayIn.forEach(node => {
    node.clicked = value;
  });
}

// consider the case when not all tasks are logically adjancent
// gives back the "missed" tasks
function filterTasks(current_charts, allNodes){
  let chart_names = getFieldsFromNodes(current_charts, "name")
  let missedMatch = []
  task_charts.forEach(function(list, index) {
    const hasMatch = list.some(function(i) {
      let chart = types[i];
      return chart_names.includes(chart); 
    });
  
    if (hasMatch) {
      return;
    }

    missedMatch.push(index)
  
  });

  if(missedMatch.length != 0){
    console.log(missedMatch)
    missedMatch.forEach(function(i){
      allNodes[i].clicked = 0;
    })

  }

}
