var colorBoxes = document.querySelectorAll('.color-box');
var pickerVal = 5;






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

/*
var numberInput = document.getElementById("paddingPicker");

numberInput.addEventListener("input", function() {
  var value = numberInput.value;
  pickerVal = value; 
});
*/



var numberInput = document.getElementById("paddingPicker");
  numberInput.addEventListener("input", function() {
    var step = 1; // Step value
    var value = Math.round(numberInput.value / step) * step;
    numberInput.value = value;
  });


  var opacityInput = document.getElementById("opacityPicker");
  opacityInput.addEventListener("input", function() {
    var step = 0.1; // Step value
    var value = Math.round(opacityInput.value / step) * step;
    opacityInput.value = value;
    //console.log("opacity " + value);
    opacityPick = value;

  });


var colorInput = document.getElementsByName("colorPicker");

// Set a default value (e.g., the first option)
colorInput[0].checked = true;

// Add event listener for value change
for (var i = 0; i < 3; i++) {
  colorInput[i].addEventListener("change", function() {
    var selectedValue = this.value;
    console.log(selectedValue); // Display the selected value in the console
  });
}


numberInput.addEventListener("input", function() {
  var value = numberInput.value;
  pickerVal = value;
  update_general("padding2");
});



function toggleCompa() {
  // choose function comparasion
  if (fun_compa_count == 0) {
    fun_compa_count = 1; // toggle button
    FunState.compa();
    console.log(FunState.getValue());
    update_general("", name, FunState.getValue());
  } else {
      fun_compa_count = 0;
      FunState.cancelCompa();
      update_general("", name, FunState.getValue());

  }
}


function toggleRel() {
    // choose function comparasion
    if (fun_rel_count == 0) {
      fun_rel_count = 1; // toggle button
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




