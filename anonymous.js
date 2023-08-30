
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
