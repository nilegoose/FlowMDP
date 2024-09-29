
//--------------------------------------------------------------------
// color boxes
var colorBoxes = document.querySelectorAll('.color-box');
var box_compa = document.getElementById('fun_compa');
var box_rel = document.getElementById('fun_rel');
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

/*----------------------------------------------------------------------------*/

for (var i = 0; i < colorBoxes.length; i++) {
    colorBoxes[i].addEventListener('click', toggleOpacity);
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
      toggleOpacity.call(box_rel);
    }
    FunState.compa();
    update_general("compa");
  } else {
      fun_compa_count = 0;
      FunState.cancelCompa();

      update_general("reset");

  }
}


function toggleRel() {
    // choose function comparasion
    if (fun_rel_count == 0) {
      fun_rel_count = 1; // toggle button
      if(fun_compa_count == 1){
        fun_compa_count = 0;
        toggleOpacity.call(box_compa);
      }
      FunState.rel();
      update_general("rel");
    } else {
      fun_rel_count = 0;
      FunState.cancelRel();
      update_general("reset");
    }
}

// create p element with certain id
function createP(id) {
  let button = document.createElement('p');
  button.innerText = "1";
  button.id = id;
  return button;
}

function createColName(){
// Generate 4 buttons with specific ids
  for (let i = 1; i <= 4; i++) {
    const button = createP(`button${i}`);
    colNameContainer.appendChild(button);
  }
}


function setColText() {

  let buttons = [document.getElementById('button1'),
  document.getElementById('button2'),
  document.getElementById('button3'),
  document.getElementById('button4')]

  

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerText = buttonTexts[i];  
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
  //console.log(newHeight);
}

changeHeight();
createColName();
setColText();
setBoxText();

/*----------------------------------------------------------------------*/
// set the "search by functions" window
// popup per hover or checkbox
const openCheckbox = document.getElementById('open-checkbox');
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
  if (!openCheckbox.checked && !isHovering) {
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
    if (!openCheckbox.checked) {
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



