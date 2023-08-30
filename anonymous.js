
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

