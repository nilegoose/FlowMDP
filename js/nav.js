
//--------------------------------------------------------------------
// color boxes
var toggleBoxes = document.querySelectorAll('.toggle-op');
var box_compa = document.getElementById('fun_compa');
var box_rel = document.getElementById('fun_rel');
var colBoxes = document.querySelectorAll('.buttonTexts');

//--------------------------------------------------------------------


var opacity_pick;
var dataObj = DataObj.getData();  


var margin = {top: 20, right: 50, bottom: 100, left: 50},
width = window.innerWidth - margin.left - margin.right - 20,
height = window.innerHeight - margin.top - margin.bottom -120;

var formatNumber = d3.format(",.0f"),
format = function(d) { return formatNumber(d) + "  "; };

function generateSVGLarge(){
  let svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id", "chartSVG")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  return svg;

}

var svg = generateSVGLarge();

drawSankey(dataObj.getData(), svg)


/*-----------------------------buttons--------------------------------------------- */


var resetBtn = document.getElementById("reset_icon");
resetBtn.addEventListener("click", resetBtnEvent);
var printBtn = document.getElementById("print-icon");
printBtn.addEventListener("click", downloadSVG);
var splitBtn = document.getElementById("split_btn");
splitBtn.addEventListener("click", splitBtnEvent);

document.getElementById("fun_compa").addEventListener("click", toggleCompa);
document.getElementById("fun_rel").addEventListener("click", toggleRel);

const colNameContainer = document.getElementById('col-names');
const chartTextContainer = document.getElementById('chart_texts');
const chartCountText = document.getElementById('chart-count');
const expandSearch = document.getElementById('expand-search');
const pinBtn = document.getElementById('pin-btn')
pinBtn.addEventListener("click", pinBtnEvent);
var pinChecked = false;


/*----------------------------------------------------------------------------*/

for (var i = 0; i < toggleBoxes.length; i++) {
  toggleBoxes[i].addEventListener('click', toggleOpacity);
}

for (var i = 0; i < colBoxes.length; i++) {
  colBoxes[i].innerText = buttonTexts[i];
  colBoxes[i].click()
}

function toggleOpacity() {
    var currentOpacity = parseFloat(this.style.opacity);

    if (currentOpacity === 1) {
        this.style.opacity = '0.2';
    } else {
        this.style.opacity = '1';
    }

    if (this.style.border) {
      this.style.border = '';
  } else {
      this.style.border = '2px solid black';
  }
}


  
function toggleCompa() {
  // click
    if (fun_compa_count == 0) {
    fun_compa_count = 1; // toggle button
    if(fun_rel_count == 1){
      fun_rel_count = 0;
      toggleOpacity.call(box_rel);//reset other box style
    }
    FunState.compa();
    dataObj.updateData(data_process());
    update_general();
    update_general();
  } else {
      fun_compa_count = 0;
      FunState.cancelCompa();

      //update_general("reset");

  }
}


function toggleRel() {
    // choose function comparasion
    if (fun_rel_count == 0) {
      fun_rel_count = 1; // toggle button
      if(fun_compa_count == 1){
        fun_compa_count = 0;
        toggleOpacity.call(box_compa);//reset other box style
      }
      FunState.rel();
      dataObj.updateData(data_process2());
      update_general("data2");
      update_general("data2");
    } else {
      fun_rel_count = 0;
      FunState.cancelRel();
    }
}

function removeCol1(){
  if(removeCol1_count == 0){
    testFunction2();
    createColName(["Data Abstraction", "Chart Types", "Encoding Idoms"]);
    removeCol1_count = 1;
  }else{
    testFunction3();
    createColName(buttonTexts);
    removeCol1_count = 0;
  }
}



function createColName(array){
  clearContainer(colNameContainer);
// Generate 4 buttons with specific ids
  for (let i = 1; i <= array.length; i++) {
    let button = document.createElement('p');
    button.id =`button${i}`;
    button.innerText = array[i-1];  
    colNameContainer.appendChild(button);
  }
}

function setChartCount(){
  let chartColIndex = locateChartColumn();
  chart_count = cols[chartColIndex].length;
  if(chart_count == 1 || chart_count == 0){
    chartCountText.innerText = chart_count + " Chart Selected"
  }else if(chart_count > 1){
    chartCountText.innerText = chart_count + " Charts Selected"
  }
  

}

function appendCharts(array){
  setChartCount();
  clearContainer(chartTextContainer);
// Generate 4 buttons with specific ids
  for (let i = 1; i <= array.length; i++) {
    let p = document.createElement('p');
    p.innerText = array[i-1].name;  
    chartTextContainer.appendChild(p);
  }

  
}

function clearContainer(container) {
  while (container.firstChild) {
      container.removeChild(container.firstChild);
  }
}


function setBoxText(){
   
    let boxes = [document.getElementById('fun_compa'),
    document.getElementById('fun_rel')]
  
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].style.backgroundColor = colorFunctions[i];
  }
}

function downloadSVG() {


  const svgElement = document.getElementById('chartSVG');

  const svgString = new XMLSerializer().serializeToString(svgElement);



  // add opacity and fill attributes
  const modifiedSvgString = svgString.replace(/<path([^>]*)">/g, '<path$1" fill="none" opacity="0.2">');

  const modifiedSvgString2 = modifiedSvgString.replace(
    /<path([^>]*)opacity: 0\.6;" fill="none" opacity="0\.2">/g,
    '<path$1opacity: 0.6;" fill="none">'
  )

  
  
  // Create a Blob with the SVG content
  const blob = new Blob([modifiedSvgString2], { type: 'image/svg+xml;charset=utf-8' });

  // Create a URL for the Blob
  const blobUrl = URL.createObjectURL(blob);

  // Create a link element for downloading
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = 'downloaded.svg';
  
  // Trigger the click event to initiate download
  downloadLink.click();

  // Clean up by revoking the Blob URL
  URL.revokeObjectURL(blobUrl);
}



function greyLink(){
  update_link_color(dataObj.getData(), "grey");
}



function changeHeight() {
  var boxElement = document.getElementById("chart");
  var newHeight = window.innerHeight - 120 -100; 
  boxElement.style.height = newHeight + "px";
}

changeHeight();
createColName(buttonTexts);
setBoxText();
expandSearch.click();

/*----------------------------------------------------------------------*/
// set the "search by functions" window
// popup per hover or checkbox
const content = document.querySelector('.dropdown-content');
const hoverWindow = document.getElementById('setting_icon');

let isHovering = false;
let leaveTimeout;

hoverWindow.addEventListener('mouseenter', () => {
  clearTimeout(leaveTimeout);
  content.style.display = 'block';
});

hoverWindow.addEventListener('mouseleave', () => {
  leaveTimeout = setTimeout(() => {
  if (!pinChecked && !isHovering) {
    content.style.display = 'none';
      }
    }, 100); 
});

content.addEventListener('mouseenter', () => {
    isHovering = true;
    content.style.display = 'block';

});

content.addEventListener('mouseleave', () => {
    isHovering = false;
    if (!pinChecked) {
        content.style.display = 'none';
    }
});

/*----------------------------------------------------------------------*/
/*----------------------------------------------------------------------*/
// refresh on resize
function refreshOnResize() {
  window.addEventListener('resize', function() {
    resetPage();
  });
}
refreshOnResize();
/*-------------------------------------- */
// paper functions


/*------------------------------------------------------------------------------------------- */
/*------------------------------------------------------------------------------------------- */

function displaySearch(){
  let searchIcon = document.getElementById("dropdownDiv");

    searchIcon.classList.remove("nonDisplay");
    searchIcon.setAttribute("class", "dropdown");
}

function resetSankey() {

  drawSankey(dataObj.getData(), svg);
  FunState.default();
}



