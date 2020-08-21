   var white = d3.rgb("white")
      , black = d3.rgb("black")
      , width = d3.select("canvas").property("width");

    var channels = {
     l: {
             scale: d3.scale.linear().domain([0, 512]).range([0, width]),
              x: width / 2
         },
        };

  //  var channel = d3.selectAll(".channel").data(d3.entries(channels));

 //   var channel_svg = channel.select("svg").on("click", clicked);
    var channel_svg = d3.select("#svg1").on("click", clicked);
    var channel_canvas = d3.select("#channel_canvas");
 //   var channel_canvas = channel.select("canvas");
//    var opacity_canvas = d3.selectAll(".opacity_channel").select("canvas");
    var opacity_canvas = d3.select("#opacity_canvas");
 //   opacity_canvas[0][0].width = 512 * 0.5;
  //  opacity_canvas[0][0].height = 150 * 0.5;
    var node_tooltip = d3.select('body')
      	.append('div')
      	.style('position', 'absolute')
        .style('z-index', '10')
      	.style('color',  d3.rgb(20, 20, 20))
        .style('visibility', 'hidden')  
        .style('font-size', '12px')
      	.style('font-weight', 'bold')
      	.text('');
    

    var svg3 = d3.select("#svg3").on("click", clickOnSvg3);

    var x1 = 160, y1 = 150;
    var c_color;
    var color_is_choosed = false;
    var colors = ['#ff4422', '#ee1166', '#9911bb', '#6633bb', '#3344bb', '#1199ff', '#00aaff', '#00bbdd', '#009988', '#44bb44', '#88cc44', '#ccdd22', '#ffee11', '#ffcc00', '#ff9900', '#ff5500', '#775544', '#999999', '#828080', '#444'];
    var palet = d3.select("#svg2");
    var lineFunc = d3.svg.line().x(function(d) {
            return d.cx;
        }).y(function(d) {
             return d.cy;
        }).interpolate("linear");
    var currentObject = null;
    var circle_ridius = 5;
    var stroke_width = 2.0;
    var shadow_range = 0.8;
    width = channel_canvas.property("width");
    var channel_canvas_height = $(channel_svg[0]).attr("height");
    var svg3_height = $(svg3[0]).attr("height");
function initializeColorPicker() {
    // set up for color picker
   
// channel_svg nodes
    channel_svg.append("circle").attr("cx", circle_ridius + 2).attr("cy", channel_canvas_height / 2).attr("r", circle_ridius).style("fill", d3.rgb(255, 255, 255)).style("stroke", "black").style("stroke-width", "2px");
    var nodes = {
        color: d3.rgb(255, 255, 255),
        cx: circle_ridius + 2
    };
    colorPickerNodes.push(nodes);

    channel_svg.append("circle").attr("cx", width - circle_ridius - 2).attr("cy", channel_canvas_height / 2).attr("r", circle_ridius).style("fill", d3.rgb(255, 0, 0)).style("stroke", "black").style("stroke-width", "2px");
    
    nodes = {
        color: d3.rgb(255, 0, 0),
        cx: width - circle_ridius - 2
    };

    colorPickerNodes.push(nodes);

    d3.select("body").on("keydown",function(){
         if((d3.event.keyCode==82)&&currentObject!=null){
           var mouse_x = $(currentObject[0]).attr('cx');
           var owner = currentObject[0][0].ownerSVGElement.id;
           if(mouse_x <= (circle_ridius + 2)||mouse_x >= (width - circle_ridius - 2))return;   
           if(owner == "svg1") {
                  var i = 0; 
                  while (colorPickerNodes[i].cx != mouse_x) {
                        i++;
                  }
                  colorPickerNodes.splice(i,1);
                  currentObject.remove();
                  currentObject = null;
                  node_tooltip.style('visibility', 'hidden');
                  constructColorArray();
                  channel_canvas.each(render);
           }
           if(owner=="svg3"){
                  var i = 0; 
                  while (opacityNodes[i].cx != mouse_x) {
                        i++;
                  }
                  opacityNodes.splice(i,1);
                  currentObject.remove();
                  opacityNodes.sort(function(x, y) {
                     return x.cx - y.cx;
                  });
                  currentObject = null;
                  node_tooltip.style('visibility', 'hidden');
                  constructOpacityArray();    
                  svg3.select("path").attr("d", lineFunc(opacityNodes)).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
           }             
       }
    });


    var circles = channel_svg.selectAll("circle").on("dblclick", doubleclick).on('mouseover', function() {
         currentObject = d3.select(this).style("stroke","black").style("stroke-width", "4px");
         var value = currentObject.attr('cx');
        if(value==(circle_ridius + stroke_width))value = 0.0;
        else if(value==(width - circle_ridius - stroke_width )) value = 255;
        else {
               value = value / width;
               var temp = parseInt(value * 255 * 10);
               value = temp/10.0;
             }
        node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px');
    }).on('mouseout',function(){
        currentObject.style("stroke","black").style("stroke-width", "2px");
        node_tooltip.style('visibility', 'hidden');
        currentObject = null;
    });
//  svg3 nodes 
 
    svg3.append("circle").attr("cx", circle_ridius + 2).attr("cy", svg3_height - circle_ridius - 2).attr("r", circle_ridius).style("fill", d3.rgb(255, 255, 255)).style("stroke", "black").style("stroke-width", "2px");
    var node_opacity = {
        opacity: 0.0,
        cx: circle_ridius + 2,
        cy: svg3_height - circle_ridius - 2
    };
    opacityNodes.push(node_opacity);
    svg3.append("circle").attr("cx", width - circle_ridius - 2).attr("cy", circle_ridius + 2).attr("r", circle_ridius).style("fill", d3.rgb(255, 255, 255)).style("stroke", "black").style("stroke-width", "2px");
    node_opacity = {
        opacity: 1.0,
        cx: width - circle_ridius - 2,
        cy: circle_ridius + 2
    };
    opacityNodes.push(node_opacity);
    var circles = svg3.selectAll("circle").call(d3.behavior.drag().on("drag", dragOnSvg3)).on("mouseover",function(){
         currentObject = d3.select(this).style("stroke","black").style("stroke-width", "4px");
         var value = currentObject.attr('cy');
        if(value>=(svg3_height - circle_ridius - stroke_width - shadow_range))value = 0.0;
        else if(value<=(circle_ridius + stroke_width + shadow_range )) value = 1.0;
        else value =  1.0 - value / svg3_height;
        node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px');
    }).on("mouseout",function(){
         d3.select(this).style("stroke","black").style("stroke-width", "2px");
         currentObject = null; 
          node_tooltip.style('visibility', 'hidden');
    });
   

    svg3.append("path").attr("d", lineFunc(opacityNodes)).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");

    transferFunc_ColorArray = new Float32Array(width * 4);
    constructOpacityArray();
    constructColorArray();
    channel_canvas.each(render);

    d3.select("#svg2").style('display', 'none');
}
function updateTransferFuncArray() {
    
    refSampleRate = 1.0 / (MaxEdgeSize / 2.0);
    surface_tfArray = null;
    surface_tfArray = new Float32Array(transferFuncRangel/2 * 4);
    for (var i = 0; i < width; i++) {
        var alpha = opacityArray[i];
        alpha = 1.0 - Math.pow((1.0 - alpha), 1.0 / sampleRate);
        surface_tfArray[4 * i] = colorArray[i].r / 255.0;
        surface_tfArray[4 * i + 1] = colorArray[i].g / 255.0;
        surface_tfArray[4 * i + 2] = colorArray[i].b / 255.0;
        surface_tfArray[4 * i + 3] = opacityArray[i];
        transferFunc_ColorArray[4 * i] = colorArray[i].r / 255.0 * alpha;
        transferFunc_ColorArray[4 * i + 1] = colorArray[i].g / 255.0 * alpha;
        transferFunc_ColorArray[4 * i + 2] = colorArray[i].b / 255.0 * alpha;
        transferFunc_ColorArray[4 * i + 3] = alpha;
    }
   
}
function clickOnSvg3() {
    if (d3.event.defaultPrevented)
        return;
    if(currentObject!=null)
        return;

    var mousePos = d3.mouse(this);
    var height = $(svg3[0]).attr("height");
    if(mousePos[0]<= (circle_ridius + 2)||mousePos[0]>=(width - circle_ridius - 2)||mousePos[1]<=(circle_ridius + 2)||mousePos[1]>=(svg3_height - circle_ridius - 2))
        return ;

    if (!opacityNodes.every(function(element){
         return element.cx != mousePos[0]  
    })) return;  
   // while (opacityNodes[i].cx != mouse_x)i++;    
    svg3.append("circle").attr("cx", mousePos[0]).attr("cy", mousePos[1]).attr("r", circle_ridius).style("fill", d3.rgb(255, 255, 255)).style("stroke", "black").style("stroke-width", "2px");
    var node_opacity = {
        opacity: (height - mousePos[1]) / height,
        cx: mousePos[0],
        cy: mousePos[1]
    };
    opacityNodes.push(node_opacity);

    var circles = svg3.selectAll("circle").call(d3.behavior.drag().on("drag", dragOnSvg3)).on("mouseover",function(){
         currentObject = d3.select(this).style("stroke","black").style("stroke-width", "4px");
         var value = currentObject.attr('cy');
         if(value>=(svg3_height - circle_ridius - stroke_width - shadow_range))value = 0.0;
         else if(value<=(circle_ridius + stroke_width + shadow_range )) value = 1.0;
         else value = 1.0 - value / svg3_height;
         var temp = parseInt(value * 100);
         value = parseFloat(temp/100.0);
         node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px');
    }).on("mouseout",function(){
         d3.select(this).style("stroke","black").style("stroke-width", "2px");
          node_tooltip.style('visibility', 'hidden');
         currentObject = null; 
    });

    opacityNodes.sort(function(x, y) {
        return x.cx - y.cx;
    });
    svg3.select("path").attr("d", lineFunc(opacityNodes)).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
    constructOpacityArray();
}
function dragOnSvg3() {
    var fnode = d3.select(this);
    var mousePos = d3.mouse(this);
    var mouse_x = $(fnode[0]).attr('cx');
    var i = 0;
    var move_x = mousePos[0] < (circle_ridius + 2)? (circle_ridius + 2):mousePos[0];
        move_x = move_x > (width - circle_ridius - 2) ? (width - circle_ridius - 2):move_x;
    var move_y = mousePos[1] < (circle_ridius + 2)?(circle_ridius + 2):mousePos[1];
        move_y = move_y > (svg3_height - circle_ridius - 2)?(svg3_height - circle_ridius - 2): move_y ;
    
    var mark = 0;

    while (opacityNodes[i].cx != mouse_x)i++;
                 
    if (i == 0 || i == (opacityNodes.length - 1)) {
         fnode.attr('cy', move_y);
         opacityNodes[i].cy = move_y;
         opacityNodes[i].opacity = (svg3_height - move_y) / svg3_height;
         if( mousePos[1] > (svg3_height - circle_ridius - stroke_width)
             || mousePos[1] < (circle_ridius + stroke_width))mark = 1;
         if((i == 0)&&(mousePos[0] > (circle_ridius * 2 + stroke_width))||mousePos[0]< stroke_width)mark = 1;
         if((i == (opacityNodes.length - 1)) &&(mousePos[0] < (width - circle_ridius * 2 - 2))||(mousePos[0] > (width - 2)))mark = 1;
         value =  move_y;
         if(value>=(svg3_height - circle_ridius - 2 - shadow_range)) value = 0.0;
     
         else if(value<=(circle_ridius + stroke_width + shadow_range )) value = 1.0;
         else value = 1.0 - value / svg3_height;
         var temp = parseInt(value * 100);
         value = parseFloat(temp/100.0);
         if(mark==0)node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px'); 
         
     }
      
     else {
            var lx = opacityNodes[i - 1].cx;
            var rx = opacityNodes[i + 1].cx;
            if ( move_x  > lx &&  move_x  < rx) {
                 fnode.attr('cx',  move_x );
                 fnode.attr('cy',  move_y);
                 opacityNodes[i].cx = move_x ;
                 opacityNodes[i].cy = move_y;
                 opacityNodes[i].opacity = (svg3_height -  move_y) / svg3_height;
                 if( mousePos[1] > (svg3_height - circle_ridius - stroke_width)
                   || mousePos[1] < (circle_ridius + stroke_width))mark = 1;
                value =  move_y;
               if(value>=(svg3_height - circle_ridius - 2 - shadow_range)) value = 0.0;   
               else if(value<=(circle_ridius + stroke_width + shadow_range )) value = 1.0;
               else value = 1.0 - value / svg3_height;
               var temp = parseInt(value * 100);
               value = parseFloat(temp/100.0);
               if(mark==0) node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 20)+'px').style('left',(event.pageX+10)+'px'); 

            }
     }
                 
    svg3.select("path").attr("d", lineFunc(opacityNodes)).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
     
    constructOpacityArray();
    
     
}

function clicked() {
    if (d3.event.defaultPrevented)
        return;
    //   var node = e.target;
    if(currentObject!=null)return;

    var mousePos = d3.mouse(this);
  
    if(mousePos[0]>(circle_ridius + 2)&&mousePos[0]<(width - circle_ridius - 2)){
        var nodes = {
        color: d3.rgb(255, 255, 255),
        cx: mousePos[0]
        };
        colorPickerNodes.push(nodes);
        channel_svg.append("circle").attr("cx", mousePos[0]).attr("cy", channel_canvas_height/2).attr("r", circle_ridius).style("fill", d3.rgb(255, 255, 255)).style("stroke", "black").style("stroke-width", "2px");
    } 
    var circles = channel_svg.selectAll("circle").on("dblclick", doubleclick).on('mouseover', function() {

    currentObject = d3.select(this).style("stroke","black").style("stroke-width", "4px");
     var value = currentObject.attr('cx'); 
     if(value<=(circle_ridius + stroke_width))value = 0;
     else if(value>=(width - circle_ridius - circle_ridius)) value = 255;
     else {
             value = value / width;
             var temp = parseInt(value * 255 * 10);
             value = temp/10.0;
          }
       node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px');
    }).on('mouseout',function(){
        currentObject = d3.select(this).style("stroke","black").style("stroke-width", "2px");
        node_tooltip.style('visibility', 'hidden');
        currentObject = null;
    });
    circles.call(d3.behavior.drag().on("drag", dragged));

   
    colorPickerNodes.sort(function(x, y) {
        return x.cx - y.cx;
    });

}

function doubleclick() {
    if (d3.event.defaultPrevented)
        return;
    
    svg_color_picker.style('display', 'inline');
    var mousePos = d3.mouse(this);
    focusNode = d3.select(this);
  
  //  channel_svg.style('display', 'none');
  //  svg3.style('display', 'none');

    var temp;
}
function dragged() {

  //  var height = $(channel_svg[0]).attr('height');
    focusNode = d3.select(this);
    var mousePos = d3.mouse(this);
    var mouse_x = $(focusNode[0]).attr('cx');
    var i = 0;
    if(mousePos[0]<=(circle_ridius + 2)||mousePos[0]>=(width - circle_ridius - 2))return;
   else{
        while (colorPickerNodes[i].cx != mouse_x) {
            i++;
        }
        if(i==(colorPickerNodes.length-1)||i==0) return;
        var lx = colorPickerNodes[i - 1].cx;
        var rx = colorPickerNodes[i + 1].cx;
        if (mousePos[0] > lx && mousePos[0] < rx) {
            focusNode.attr('cx', mousePos[0]);
            colorPickerNodes[i].cx = mousePos[0];
            var value = focusNode.attr('cx');
            if(value<=(circle_ridius + stroke_width))value = 0;
            else if(value>=(width - circle_ridius - circle_ridius)) value = 255;
            else {
                   value = value / width;
                   var temp = parseInt(value * 255 * 10);
                   value = temp/10.0;
                 }
         if((mousePos[1]>(circle_ridius+stroke_width))&&(mousePos[1]<(height-circle_ridius-stroke_width)))   node_tooltip.style('visibility', 'visible').text(value).style('top', (event.pageY - 10)+'px').style('left',(event.pageX+10)+'px');
         else  node_tooltip.style('visibility', 'hidden');
        }
    }
    constructColorArray();
    channel_canvas.each(render);
}

 
var basic_color = ['#ff4422', 
'#ee1166', '#9911bb', '#6633bb', '#3344bb', 
'#1199ff', '#00aaff', '#00bbdd', '#009988',
 '#44bb44', '#88cc44', '#ccdd22', '#ffee11', 
 '#ffcc00', '#ff9900', '#ff5500', '#775544', 
 '#999999', '#828080', '#444']; 
var svg_color_picker = d3.select("#color_panel");
var X1 = 10, Y1 = 10;
var svg_color_picker_width = $(svg_color_picker[0]).attr("width");
var svg_color_picker_height = $(svg_color_picker[0]).attr("height");
var color_box_width = 20;
var color_box_height = 20;
var color_box_spacing = 5;
var color_level = 7;
var current_color;
var d_color = new Array();
function transform_color(color) {
    d_color.splice(0,d_color.length);
    var s = parseInt(color_level/2);
    var dirt_color = 1.0/s;
    var start_color = d3.hsl(color).darker(1.0);
    for(var i = 0;i < color_level;i++ ){
        var color = d3.hsl(start_color).brighter(i * dirt_color);
        d_color.push(color);
    }
    var temp;
}
function drawColorBox(container, x, y, rx, ry, width, height, color=null, stroke=null, id=null, classed=null) {
    var ele;
    if (container == 'rect') {
        ele = svg_color_picker.append('g');
    } else {
        ele = svg_color_picker.select(container);
    }
    ele.append('rect').attr('id', id).attr('class', classed).attr('fill', color).attr('stroke', stroke).attr('x', x).attr('y', y).attr('rx', rx).attr('ry', ry).attr('width', width).attr('height', height);
}
function draw_panel() {
    
    var panel_container = svg_color_picker.append('g').attr('id', 'panel_container');
    var spacing = color_box_height + color_box_spacing;
    for (var i = 0; i < basic_color.length; i++) {
        panel_container.append('g').attr('id', 'graph_container' + i).attr('data-color', basic_color[i]).attr('class', 'graph_container');
        transform_color(basic_color[i]);
        for(var j = 0;j < color_level;j++ )
        drawColorBox('#graph_container' + i, X1 + i * spacing, Y1 + j * spacing, 4, 4, color_box_width, color_box_height, d_color[j], '', '', 'color_box color_box' + j );    

    }
    svg_color_picker.style('display', 'none');
    d3.selectAll('.color_box').on('mouseover', function(){
        d3.select(this).style("stroke","black").style("stroke-width", "2px");})
    .on('mouseout',function(){ d3.select(this).style("stroke-width", "0px");});
    d3.selectAll('.color_box').on('click', function(){
        var color = d3.select(this).attr('fill');
        current_color = d3.rgb(color);
        focusNode.style('fill', color);
        var mouse_x = $(focusNode[0]).attr('cx');
        colorPickerNodes.forEach(function(ele) {
        if (ele.cx == mouse_x)
            ele.color = color

        constructColorArray();
        channel_canvas.each(render);
        svg_color_picker.style('display', 'none');
    });
    });
}
function render(d) {
    
    height =  channel_canvas.property("height");
    var width = this.width
      , context = this.getContext("2d")
      , image = context.createImageData(width, height)
      , i = -1;
    for(var y = 0;y<height;y++){
       for (var x = 0; x < width; x++) {
       
                 image.data[y * width * 4 + x * 4 + 0] = colorArray[x].r;
                 image.data[y * width * 4 + x * 4 + 1] = colorArray[x].g;
                 image.data[y * width * 4 + x * 4  + 2] = colorArray[x].b;
                 image.data[y * width * 4 + x * 4  + 3] = 255;
       }
    }
    context.putImageData(image, 0, 0);
}
function render_opacity_canvas(d){
   var width = this.width
      , height = this.height
      , context = this.getContext("2d")
      , image = context.createImageData(width,height);

    for (var i = 0; i < opacityNodes.length - 1; i++) {
        var lnode = opacityNodes[i];
        var rnode = opacityNodes[i + 1];
        var lx = parseInt(lnode.cx);
        var rx = parseInt(rnode.cx);
        var ly = lnode.cy;
        var ry = rnode.cy;
   
        for (var j = lx; j < rx; j++) {
            var t = (j - lx) / (rx - lx);
            var h = d3.interpolate(ly, ry)(t);
            var color = colorArray[j];
            for(var k = 0;k < (height - circle_ridius - 2);k++){
                if(k< h){
                    image.data[k * width * 4 + j * 4] = 255;
                    image.data[k * width * 4 + j * 4 + 1] = 255;
                    image.data[k * width * 4 + j * 4 + 2] = 255;
                    image.data[k * width * 4 + j * 4 + 3] = 255;
                }
                else{
                     image.data[k * width * 4 + j * 4] = color.r;
                     image.data[k * width * 4 + j * 4 + 1] = color.g;
                     image.data[k * width * 4 + j * 4 + 2] = color.b;
                     image.data[k * width * 4 + j * 4 + 3] = 255;
                }
            } 
        }
    }
   context.putImageData(image, 0, 0);    

}
function constructOpacityArray() {
    opacityArray.splice(0, opacityArray.length);
    for (var i = 0; i < opacityNodes.length - 1; i++) {
        var lnode = opacityNodes[i];
        var rnode = opacityNodes[i + 1];
        var lx = lnode.cx;
        var rx = rnode.cx;
        var ly = lnode.cy;
        var ry = rnode.cy;
        var lopacity = lnode.opacity;
        var ropacity = rnode.opacity;
        if(lx == (circle_ridius + 2))lx = 0;
        if(rx == (width - circle_ridius - 2))rx = width;
        if(ly <= (circle_ridius + 2 + shadow_range)) lopacity = 1.0;
        if(ly >= (svg3_height - circle_ridius - 2 - shadow_range))lopacity = 0.0; 
        if(ry <= (circle_ridius + 2 + shadow_range)) ropacity = 1.0;
        if(ry >= (svg3_height - circle_ridius - 2 - shadow_range))ropacity = 0.0; 
        for (var j = lx; j < rx; j++) {
            var t = (j - lx) / (rx - lx);
            var color = d3.interpolate(lopacity, ropacity)(t);
            opacityArray.push(color);
        }
    }
    if(colorArray.length>0)opacity_canvas.each(render_opacity_canvas);
    updateVolumeView = 1;
    updateSurfaceView = 1;

}
function constructColorArray() {
    colorArray.splice(0, colorArray.length);
    for (var i = 0; i < colorPickerNodes.length - 1; i++) {
        var lnode = colorPickerNodes[i];
        var rnode = colorPickerNodes[i + 1];
        var lx = lnode.cx;
        var rx = rnode.cx;
        if(lx == (circle_ridius + 2))lx = 0;
        if(rx == (width - circle_ridius - 2))rx = width;
        var lcolor = d3.rgb(lnode.color);
        var rcolor = d3.rgb(rnode.color);
        for (var j = lx; j < rx; j++) {
            var t = (j - lx) / (rx - lx);
            var color = d3.rgb(d3.interpolateLab(lcolor, rcolor)(t));
            colorArray.push(color);
        }
    }
    if(opacityArray.length>0)opacity_canvas.each(render_opacity_canvas);
    updateVolumeView = 1;
    updateSurfaceView = 1;
}
 svg3[0][0].onmousemove = function() {
        document.getElementById('volumeTip').innerHTML = "Left click to create a control point, drag & drop for editing, and R key for removal.";                
    };
 svg3[0][0].onmouseout = function() {
        document.getElementById('volumeTip').innerHTML = " ";                
    };
 channel_svg[0][0].onmousemove = function() {
        document.getElementById('volumeTip').innerHTML = "Left click to create a control point, drag for editing the color map, double click to select a new color, and R key for removal.";                
    };
 channel_svg[0][0].onmouseout = function() {
        document.getElementById('volumeTip').innerHTML = " ";                
    };   