//--------------------------------------------------------------------
// color boxes
var colorBoxes = document.querySelectorAll('.color-box');
var box_compa = document.getElementById('fun_compa');
var box_rel = document.getElementById('fun_rel');

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
    //let svg = d3.select("#chartSVG");
    //console.log(svg);
    drawSankey(dataObj.getData(), svg, ascending_param);
    //update_general("", name, FunState.getValue());
  } else {
      fun_compa_count = 0;
      FunState.cancelCompa();
      drawSankey(dataObj.getData(), svg);

      //update_general("", name, FunState.getValue());

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
      update_general("", name, FunState.getValue());
    } else {
      fun_rel_count = 0;
      FunState.cancelRel();
      update_general("", name, FunState.getValue());
    }
}


function setColText() {



  // Replace these values with your actual x-coordinates calculated by your function
 
  let buttons = [document.getElementById('button1'),
  document.getElementById('button2'),
  document.getElementById('button3'),
  document.getElementById('button4')]

  
  const buttonTexts = ["dimension", "data abstraction", "types", "encoding idoms"];

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerText = buttonTexts[i];

    // Calculate the width of the button text
    
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
  var newHeight = window.innerHeight - 110 -100; // Generates a random height between 50px and 250px
  boxElement.style.height = newHeight + "px";
}

changeHeight();
setColText();




