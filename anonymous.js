
// colorful link 
function color_link(link){
    if(link.source.column == 2 || link.source.column == 1){
      return link.source.color;
    }
   else{
     return link.target.color;
    }
  }

// color highlight link and fade the rest
function color_fade_link(d){   

    if(link_toHighlight.includes(d.id)){
      let sourceColorBool = d.source.column < 3;
      if(sourceColorBool) return d.color = d.source.color;
      else return d.color = d.target.color;
  }
    return d.color = "#D8D8D8"
}

function color_node_fun(d) { 
  console.log("update color " + FunState.getValue());
  let compBool = FunState.getValue().includes("comparasion");
  let relBool = FunState.getValue().includes("relationship");
  let color1Bool = d.color1 == undefined;
  let color2Bool = d.color2 == undefined;
  let col3Bool = d.column == 3;
  let defaultBool = FunState.getValue().length == 0;
  let temp_color;
  switch (true) {
    case (compBool):
      temp_color = ( color1Bool? 
        col3Bool? "#999999": d.color 
      : d.color1);
      break;
    case (relBool):
      temp_color = ( color2Bool? 
        col3Bool? "#999999": d.color 
      : d.color2);
      break;
    case (defaultBool):
      return d.color;
    default:
      return d.color;                   
  }
  return temp_color;
}

function title_link(d) { 
  return d.source.name + " → " + d.target.name + "\n" + 
  "chart types: " +
  format(d.value)
  /*+ "\n" + d.id*/; }

  function title_node(d) { 
    if(d.column == 3){
      return d.name; 
    }else if(d.column == 1){
      return d.name + "\n" +  "chart types: " + dim_dict[d.name];
    }else if(d.column == 2){
      return d.name + "\n" +  "chart types: " + abstract_dict[d.name];
    }
    return d.name + "\n" +  "chart types: " + format(d.value); 
  }
