var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
	
	var json = "{}";
   
	
	

	
	
    //init data
   
    //end
    
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //Optional: create a background canvas that plots
        //concentric circles.
       
        /*
        background: {
          CanvasStyles: {
           strokeStyle: 'silver'
          }
        },
       */
       
        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: true,
          zooming: 10
        },
        
        Node: {
            dim:7,
            color: "green"
        },
        Edge: {
            lineWidth: 1.5,
            color: "#C0C0C0"
        },
        
        
        Tips: {  
            enable: true,  
            type: 'Native',  
            offsetX: 20,  
            offsetY: 20,  
            onShow: function(tip, node) {  
              tip.innerHTML = node.data.url + '\n\n' + node.data.relation;  
            }  
          }  ,
        
        
       
        onBeforeCompute: function(node){
            Log.write("centering " + node.name + "...");
            //Add the relation list in the right column.
            //This list is taken from the data property of each JSON node.
            
            var desc = displayCito();
            
            
            $jit.id('inner-details').innerHTML = "<br/>" +  node.data.relation;
            $jit.id('desc').innerHTML = "<br/>" + desc;
            $jit.id('object-url').innerText = node.data.url;
            
            if (/^http/.test(node.data.url)){
            $jit.id('frameobject').src = node.data.url;
            } else {
            	$jit.id('frameobject').src = "";
            }
            
            $jit.id('subject-url').innerText = node.data.parenturl;
            if (/^http/.test(node.data.parenturl)){
                $jit.id('framesubject').src = node.data.parenturl;
                } else {
                	$jit.id('framesubject').src = "";
                }
                
            
            
            
            url = node.data.url;
           
          
           
            
            
        },
        
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name;
            domElement.onclick = function(){
                rgraph.onClick(node.id, {
                    onComplete: function() {
                        Log.write("done");
                    }
                });
                
                  
                
                
                
                
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth < 1) {
                style.fontSize = "1em";
                style.color = "blue";
            
            } else if(node._depth == 1){
                style.fontSize = "0.6em";
               style.color = "slategray";
            
            } else if(node._depth > 1){
                style.fontSize = "0.6em";
                style.color = "slategray";
             
             } else {
                style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
          //  style.margin = 10 + 'px';
        }
    });
    //load JSON data
   
    
    var url = window.location.href;
    subject = url.replace(/.*subject=/g, "");
   
    if ((subject != '') && (subject != window.location.href)){
    	query = "http://www.miidi.org/cito/api/jit.php?subject=" + subject;
    //	$jit.id('subject').innerHTML = "<iframe src='" + subject + "'/>";   
    } else {
    	query = "http://www.miidi.org/cito/api/jit.php";
    }
    

    
    $.get(query, function(json){
    	var json = eval('(' + json + ')');
            //load JSON data.
            rgraph.loadJSON(json);
            //compute positions and plot.
            rgraph.refresh();
            //end
            rgraph.controller.onAfterCompute();
    
    });
    
    
    
   // rgraph.loadJSON(json);
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 2000
    });
    //end
    //append information about the root relations in the right column
    $jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.relation;


    
	

}






   

