d3.sankey = function() {
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1],
      nodes = [],
      links = [],
      sort = ascendingDepth,
      padding_preserve = 4
      relax = true; // a boolean for the two functions: relax from left to right
                      // relax from right to left 

  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodeSort = function(_) {
    return arguments.length ? (sort = _, sankey) : sort;
  };

  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function(iterations) {
    console.log(sort);
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = function() {
    computeLinkDepths();
    return sankey;
  };

  // there should be another solution, to have an extra attribute

  sankey.relayout2 = function(name) {

    //computeNodeLinks();
    //computeNodeValues();
    //computeNodeBreadths();
    console.log("relayout2");
    computeNodeDepths_noSort(32);    
    extrapadding(name);
    computeLinkDepths();
    return sankey;
  };






  sankey.link = function() {
    var curvature = .5;

    function link(d) {
      var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy / 2,
          y1 = d.target.y + d.ty + d.dy / 2;
      return "M" + x0 + "," + y0
           + "C" + x2 + "," + y0
           + " " + x3 + "," + y1
           + " " + x1 + "," + y1;
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  function extrapadding(name){
    var i = 0;
    var pivot = false;

    var nodesByBreadth = d3.nest()
    .key(function(d) { return d.x; })
    .sortKeys(d3.ascending)
    .entries(nodes)
    .map(function(d) { return d.values; });
    // 13 - 42
    console.log("103 extrapadding");
    //console.log(nodes);

    nodesByBreadth[3].sort(sort);
    var charts = nodesByBreadth[3];
    charts.forEach(function(node){
      if(node.column == 3){
        if(node.name == name){
          pivot = true;
          node.y = node.y - nodePadding * 2;

        }else{
          if(pivot){


          }else{
            node.y = node.y - nodePadding * 4;

          }

        }
      }
      i++;
    });



    //console.log(nodes);
  }

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function(node) {
      node.value = Math.max(
        d3.sum(node.sourceLinks, value),
        d3.sum(node.targetLinks, value)
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    var remainingNodes = nodes,
        nextNodes,
        x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function(node) {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach(function(link) {
          nextNodes.push(link.target);
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    //
    moveSinksRight(x);
    scaleNodeBreadths((width - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function(node) {
      if (!node.targetLinks.length) {
        node.x = d3.min(node.sourceLinks, function(d) { return d.target.x; }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function(node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function(node) {
      node.x *= kx;
    });
  }

  // sort from x value

  function computeNodeDepths(iterations) {
    let nodeX = [];

    var nodesByBreadth = d3.nest()
        .key(function(d) {
          if(!nodeX.includes(d.x)){
            nodeX.push(d.x);
          }
          return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });


    
    



    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      if(true){
        relaxRightToLeft(alpha *= .99);

      }
      resolveCollisions();
      if(true){
        relaxLeftToRight(alpha);

      }
      resolveCollisions();
    }
    // change
    // calculates the min node depth
    // leave space corrsponding to double padding
    // gives 4 extra padding space from padding_preserve
    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length -1 + padding_preserve) * nodePadding) / d3.sum(nodes, value);
      });

      nodesByBreadth.forEach(function(nodes) {
        //console.log(nodes);

        let col_num = nodes[0].column;
        if(col_num == 3){
          nodes.sort(sort);
        }

        nodes.forEach(function(node, i) {
          node.y = i ;
          node.dy = node.value * ky;
        });
      });

      links.forEach(function(link) {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }

      
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    // vertical positions
    // rule, you can choose on node at once
    function resolveCollisions() {
  

      nodesByBreadth.forEach(function(nodes) {
        let col_num = nodes[0].column;

      //console.log(nodesByBreadth);


        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i,

            sort_comparasion = true;// col2 : encoding channel, col3: dimensions, col4: chart

        //console.log(nodes);
        // stop sorting the first column
        if (true) {          
          if (col_num == 1 || col_num == 2) {
            // skip sort dim and cat
          } else {
            nodes.sort(sort);
          }
        }else{//  skip sorting
          nodes.sort(ascendingDepth);
        }



         // Push any overlapping nodes down.

        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
    
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy; 

          // Push any overlapping nodes back up.
        for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
  
  }

  }



  function computeLinkDepths() {
    nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function(node) {
      var sy = 0, ty = 0;
      node.sourceLinks.forEach(function(link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function(link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  /**
   * 
   * assume the y value is already initialized
   * ! important
   * 
   */



  function computeNodeDepths_noSort(iterations) {
    var nodesByBreadth = d3.nest()
        .key(function(d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function(d) { return d.values; });
  
    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft(alpha *= .99);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }
    
    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function(nodes) {
        return (size[1] - (nodes.length + 3) * nodePadding) / d3.sum(nodes, value);
      });
  
      nodesByBreadth.forEach(function(nodes) {
        nodes.forEach(function(node, i) {
          node.y = i ;
          node.dy = node.value * ky;
        });
      });
  
      links.forEach(function(link) {
        link.dy = link.value * ky;
      });
    }
  
    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function(nodes, breadth) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });
  
      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }
  
    function relaxRightToLeft(alpha) {
      nodesByBreadth.slice().reverse().forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });
  
      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }
  
    // vertical positions
    // rule, you can choose on node at once
    function resolveCollisions() {
      nodesByBreadth.forEach(function(nodes) {
  
  
        var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i,
            skip_col1 = true;
  
         // Push any overlapping nodes down.
  
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;

        }
  
        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;
  
          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;

          }
  
        }
  
  
  
  
      });
    }

  }

  return sankey;
};


