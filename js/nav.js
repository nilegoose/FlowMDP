const paperArea = document.getElementById("papers");
const paperTop = document.getElementById("paperTop");
//--------------------------------------------------------------------
// color boxes
var colorBoxes = document.querySelectorAll('.color-box');
var box_compa = document.getElementById('fun_compa');
var box_rel = document.getElementById('fun_rel');


/*-------------------------------------------------------------------------- */

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
  console.log(newHeight);
}

changeHeight();
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
function displayPaperArea(){
    paperArea.classList.remove("nonDisplay");
    paperArea.setAttribute("class", "paperContainer");

  let paperList = document.getElementById("paperList");
  // clear previous papers
  paperList.innerHTML = '';
}

function hidePaperArea(){
  paperArea.setAttribute("class", "nonDisplay");
}

function createPaperElemenet(title, doiText, linkText, tooltipText){
  let paperList = document.getElementById("paperList");
  // clear previous papers

  let listItem = document.createElement('li');

// Create the first <div> element with class "paperItem"
const div1 = document.createElement('div');
div1.className = 'paperItem';

// Create the <p> element with <b> element inside
const p1 = document.createElement('p');
p1.setAttribute('class', 'tooltip');
var tip1 = document.createElement('span');
tip1.textContent = tooltipText;
tip1.setAttribute('class', 'tooltiptext');
p1.appendChild(tip1);

const b1 = document.createElement('b');
b1.textContent = title;
p1.appendChild(b1);

// Create the <span> element with class "tab"
const span1 = document.createElement('span');
span1.className = 'tab';

// <svg> 
const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg1.setAttribute('id', 'copy_icon');
svg1.setAttribute('class', 'copyBtn');
svg1.setAttribute('height', '24');
svg1.setAttribute('viewBox', '0 -960 960 960');
svg1.setAttribute('width', '24');
const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path1.setAttribute('d', copySVG); 
svg1.appendChild(path1);

svg1.addEventListener("click", function(){
  copyToClipboard(title);
});

div1.appendChild(p1);
div1.appendChild(span1);
div1.appendChild(svg1);

// Create the second <div> element with classes "paperItem" and "doiLine"
const div2 = document.createElement('div');
div2.className = 'paperItem doiLine';

// Create the inner <p> element with "DOI" text
const p2 = document.createElement('p');
p2.textContent = 'DOI:';

// Create the inner <span> element with class "tab"
const span2 = document.createElement('span');
span2.className = 'tab';

// Create the <a> element with "text" text and href attribute
const a2 = document.createElement('a');
a2.setAttribute('target', '_blank');
a2.setAttribute('href', linkText);
a2.textContent = doiText;

// Append the created elements to p2
p2.appendChild(span2);
p2.appendChild(a2);


div2.appendChild(p2);
div2.appendChild(span2);
div2.appendChild(a2);

// Append div1 and div2 to the <li> element
listItem.appendChild(div1);
listItem.appendChild(div2);

// Append the <li> element to the desired parent element in your document
paperList.appendChild(listItem);




}


function copyToClipboard(text){
  navigator.clipboard.writeText(text);
}



// given index, show paper
function drawPaper(index){
  createPaperElemenet(title_list[index], doi_list[index], href_list[index], tooltipText(index));
}

hidePaperArea();

function clearList(){
  let paperList = document.getElementById("paperList");

  paperList.innerHTML = '';
}

function drawBubble(){
  return;
        /*
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
        }*/

}


function updatePaperArea(current_name){
  let display = false;
  let indexList = paperIndex[current_name];
  if (indexList != undefined){
    displayPaperArea();
    listTitle(current_name);
    display = true;
    indexList.forEach(function(idx){
      drawPaper(idx);
    });

    scrollToBottom();

  }
  if(!display){
    hidePaperArea();
  }
}

function tooltipText(idx){
  let text = "Chart type: ";
  let charts = "";
  chart2D[idx].forEach(function(x){
    charts += types[x] + ", ";
  })
  return text + charts.slice(0, -2);
}

function listTitle(nodeName){
  let text = "List of papers : " + nodeName;
  paperTop.innerText = text;

}

/*------------------------------------------------------------------------------------------- */
/*------------------------------------------------------------------------------------------- */

function testPaper(){
  displayPaperArea();
  let i = 0;
  while(i < 17){
    drawPaper(i);
    i++;
  }
}


function displaySearch(){
  let searchIcon = document.getElementById("dropdownDiv");

    searchIcon.classList.remove("nonDisplay");
    searchIcon.setAttribute("class", "dropdown");
}


