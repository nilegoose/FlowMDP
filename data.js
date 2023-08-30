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

