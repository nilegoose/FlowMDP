const link1_2 = []
const link3_4 = []

const meta_1_30 = [1, 4, 0, 7, 6, 3, 2, 8, 13, 12]
const meta_1_31 = [2, 1, 9, 10, 5, 13, 12] 
const meta_1_32 = [1, 6, 2, 11, 13]
const meta_1_33 = [5, 2, 11, 12]
const meta_1_34 = [6, 4, 0, 12, 13]
// because of the column-swap function, the indices here are relative, and should be used with a setoff value
// link1_3: base index = 9
const link1_3=[
    {
        "source": 0,
        "target": 10,
        "value": 10
    },
    {
        "source": 0,
        "target": 13,
        "value": 10
    },
    {
        "source": 0,
        "target": 9,
        "value": 10
    },
    {
        "source": 0,
        "target": 16,
        "value": 10
    },
    {
        "source": 0,
        "target": 15,
        "value": 10
    },
    {
        "source": 0,
        "target": 12,
        "value": 10
    },
    {
        "source": 0,
        "target": 11,
        "value": 10
    },
    {
        "source": 0,
        "target": 17,
        "value": 10
    },
    {
        "source": 0,
        "target": 22,
        "value": 10
    },
    {
        "source": 0,
        "target": 21,
        "value": 10
    },
    {
        "source": 1,
        "target": 11,
        "value": 7
    },
    {
        "source": 1,
        "target": 10,
        "value": 7
    },
    {
        "source": 1,
        "target": 18,
        "value": 7
    },
    {
        "source": 1,
        "target": 19,
        "value": 7
    },
    {
        "source": 1,
        "target": 14,
        "value": 7
    },
    {
        "source": 1,
        "target": 22,
        "value": 7
    },
    {
        "source": 1,
        "target": 21,
        "value": 7
    },
    {
        "source": 2,
        "target": 10,
        "value": 5
    },
    {
        "source": 2,
        "target": 15,
        "value": 5
    },
    {
        "source": 2,
        "target": 11,
        "value": 5
    },
    {
        "source": 2,
        "target": 20,
        "value": 5
    },
    {
        "source": 2,
        "target": 22,
        "value": 5
    },
    {
        "source": 3,
        "target": 14,
        "value": 4
    },
    {
        "source": 3,
        "target": 11,
        "value": 4
    },
    {
        "source": 3,
        "target": 20,
        "value": 4
    },
    {
        "source": 3,
        "target": 21,
        "value": 4
    },
    {
        "source": 4,
        "target": 15,
        "value": 5
    },
    {
        "source": 4,
        "target": 13,
        "value": 5
    },
    {
        "source": 4,
        "target": 9,
        "value": 5
    },
    {
        "source": 4,
        "target": 21,
        "value": 5
    },
    {
        "source": 4,
        "target": 22,
        "value": 5
    }
]
const link2_3=[
    {
        "source": 5,
        "target": 9,
        "value": 1
    },
    {
        "source": 6,
        "target": 9,
        "value": 1
    },
    {
        "source": 6,
        "target": 10,
        "value": 1
    },
    {
        "source": 7,
        "target": 10,
        "value": 1
    },
    {
        "source": 8,
        "target": 10,
        "value": 1
    },
    {
        "source": 5,
        "target": 11,
        "value": 1
    },
    {
        "source": 6,
        "target": 11,
        "value": 1
    },
    {
        "source": 7,
        "target": 11,
        "value": 1
    },
    {
        "source": 8,
        "target": 11,
        "value": 1
    },
    {
        "source": 6,
        "target": 12,
        "value": 1
    },
    {
        "source": 7,
        "target": 12,
        "value": 1
    },
    {
        "source": 8,
        "target": 12,
        "value": 1
    },
    {
        "source": 5,
        "target": 13,
        "value": 1
    },
    {
        "source": 6,
        "target": 14,
        "value": 1
    },
    {
        "source": 7,
        "target": 14,
        "value": 1
    },
    {
        "source": 8,
        "target": 14,
        "value": 1
    },
    {
        "source": 6,
        "target": 15,
        "value": 1
    },
    {
        "source": 7,
        "target": 15,
        "value": 1
    },
    {
        "source": 8,
        "target": 15,
        "value": 1
    },
    {
        "source": 6,
        "target": 16,
        "value": 1
    },
    {
        "source": 7,
        "target": 16,
        "value": 1
    },
    {
        "source": 8,
        "target": 16,
        "value": 1
    },
    {
        "source": 5,
        "target": 17,
        "value": 1
    },
    {
        "source": 6,
        "target": 18,
        "value": 1
    },
    {
        "source": 7,
        "target": 18,
        "value": 1
    },
    {
        "source": 8,
        "target": 18,
        "value": 1
    },
    {
        "source": 6,
        "target": 19,
        "value": 1
    },
    {
        "source": 7,
        "target": 19,
        "value": 1
    },
    {
        "source": 8,
        "target": 19,
        "value": 1
    },
    {
        "source": 6,
        "target": 20,
        "value": 1
    },
    {
        "source": 7,
        "target": 20,
        "value": 1
    },
    {
        "source": 8,
        "target": 20,
        "value": 1
    },
    {
        "source": 5,
        "target": 21,
        "value": 1
    },
    {
        "source": 6,
        "target": 21,
        "value": 1
    },
    {
        "source": 7,
        "target": 21,
        "value": 1
    },
    {
        "source": 8,
        "target": 21,
        "value": 1
    },
    {
        "source": 5,
        "target": 22,
        "value": 1
    },
    {
        "source": 6,
        "target": 22,
        "value": 1
    }
]
function getData(){
    let combinedList = [...link1_2, ...link2_3, ...link3_4]
    return{        
        "links": link2_3
    }
}

// labels 

const types = ['Density plot', 'Scatterplot', 'Heatmap', 'Dendrogram', 'Voronoi diagram',
    'Parallel coordinates','Contour plot', '2D density plot', 'Radial chart', 'Box plot',
    'Violin plot', 'Line plot', 'Bar chart', 'Histogram'],
tasks = ["Cluster Identification", "Anomaly Detection", "Distance Preservation", "Global Structure", "Class Separation"]
dimensions=["1D", "2D", "3D", "HD"];
const column_1 = tasks,
column_2 = dimensions,
column_3 = types,
column_4 = [];



// colors for each column
const colorCol2=["#fcae91", "#fb6a4a", "#de2d26", "#a50f15", "#6baed6", "#3182bd", "#b8a0c3", "#a6747c",  "#865d9e"],
colorCol1=["#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"],
colorCol3=['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'],
colorCol4=['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666'];
/*----------------------------------------------------------------------------------- */
//this part for the two additional categories

const compaIdx = []; //indices in the array chart types
const relIdx = []; //indices in the array chart types
const colorFunctions = ["#5ab4ac", "#d8b365"];
const nameFunctions = ["Comparision", "Relationship"];
var compa_name = [],
rel_name = []; 


/*------------------------------------------------------------------------------------ */

var buttonTexts = ["Tasks", "Dimensions", "Chart Types"];


/*-------------------------------------------------------------------------------------- */
// the copy icon

const copySVG = 'M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z';

/*------------------------------------------------------------------------------------- */
// for the tooltip
var abstract_dict = {'One Numeric': 2,
'Two Numeric': 8,
'Three Numeric': 7,
'Several Numeric': 9,
'One Categorical': 6,
'Several Categorical': 12,
'One Num, One Cat': 10,
'One Cat, Several Num': 14,
'Several Cat, One Num': 15};

 var dim_dict = {'1D': 8, '2D': 15, '3D': 10, 'HD': 22};



 /*------------------------------------------------------------------------------------------ */


// transfer data to object
var DataObj = (function() {
    var data;
  
    var sankey;
  
    function initialize() {
      return {
        data: data_process(),
  
        sankey: d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .size([width, height]),
  
        updateData: function(newValue) {
          this.data = newValue;
        },
  
        getData: function() {
          return this.data;
        },
  
        updateSankey: function(newValue){
          this.sankey = newValue;
        },
        
        getSankey : function(){
          return this.sankey;
        }
      };
    }
  
    return {
      getData: function() {
        if (!data) {
          data = initialize();
        }
        return data;
      },
      getSankey: function() {
        return sankey;
      }
    };
  })();
  
  
  // TODO
  // data & buttons (delete columns)
  // print svg
