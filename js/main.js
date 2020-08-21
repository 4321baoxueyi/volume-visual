"use strict";


window.onload= main();
var currentSurfaceID = 0;
var currentSurfaceValue = 0;
var colorNodes_file = new Array();
var opacityNodes_file = new Array();



var START = 0;
// canvas width larger than 512 when full screen, need to change
function IsMouseOnCanvas(e)
{  
   const canvasW = canvas.getBoundingClientRect().width;
   const canvasH = canvas.getBoundingClientRect().height;
    if((event.clientX - canvas.getBoundingClientRect().left) > (canvasW)
       ||(event.clientX - canvas.getBoundingClientRect().left) < 0.0
       ||(event.clientY -canvas.getBoundingClientRect().top) > (canvasH)
       ||(event.clientY - canvas.getBoundingClientRect().top) < 0.0){
           if((event.clientX - canvas_surface.getBoundingClientRect().left) > (canvasW)
                 ||(event.clientX - canvas_surface.getBoundingClientRect().left) < 0.0
                ||(event.clientY -canvas_surface.getBoundingClientRect().top) > (canvasW)
                ||(event.clientY - canvas_surface.getBoundingClientRect().top) < 0.0)  return false;        
       } 
      
    return true;
}
function mouseMotion(x, y) {
    var lastquat;
    if (m_mousex != x || m_mousey != y) {
     /*   lastquat = trackball(
                  (-2.0*m_mousex + canvas.width) / canvas.width,;
                  (-canvas.height + 2.0*m_mousey) / canvas.height,
                  (-2.0*x +canvas.width) / canvas.width,
                  (-canvas.height + 2.0*y) / canvas.height);*/
        lastquat = trackball((2.0 * m_mousex - canvas.width) / canvas.width, (canvas.height - 2.0 * m_mousey) / canvas.height, (2.0 * x - canvas.width) / canvas.width, (canvas.height - 2.0 * y) / canvas.height);

        m_curquat = add_quats(lastquat, m_curquat);
        m_mousex = x;
        m_mousey = y;
    }
}

function LoadData() {
    data_select = document.getElementById("data");
    var filepath1 = "file:///C:/Users/23626/Desktop/webgl_volumerender/App1/";
    filepath1 += data_select.value.toString();
    filepath1 += ".txt";

    $.get(filepath1, function(data, status) {
        if (status == "success")
            dimDesc = data;
        //  console.log(test);    
    });
    var buffer2 = dimDesc.split(/[\s\n]/);
    volSizeX = parseInt(buffer2[0]);
    volSizeY = parseInt(buffer2[1]);
    volSizeZ = parseInt(buffer2[2]);
    MaxEdgeSize = volSizeX > volSizeY ? volSizeX : volSizeY;
    MaxEdgeSize = MaxEdgeSize > volSizeZ ? MaxEdgeSize : volSizeZ;
    refSampleRate = 1.0 / (MaxEdgeSize / 2.0);
    $.get('file:///C:/Users/23626/Desktop/webgl_volumerender/App1/TF.txt', function(data, status) {
        test = data;
        //  console.log(test);    
    });

    var buffer1 = test.split(/[\s\n]/);
    var num = parseInt(buffer1[0]);
    var k = 1;
    for (var i = 0; i < num; i++) {
        transferFunc_large_data[k - 1] = parseFloat(buffer1[k]);
        k++;
        transferFunc_large_data[k - 1] = parseFloat(buffer1[k]);
        k++;
        transferFunc_large_data[k - 1] = parseFloat(buffer1[k]);
        k++;
        transferFunc_large_data[k - 1] = parseFloat(buffer1[k]);
        k++;
    }
    var translate = 17;
    for (var i = 0; i < num - translate; i++) {
        transferFunc_large_data[i * 4 + 3] = transferFunc_large_data[(i + translate) * 4 + 3];
    }
}


function resetPreferredSetting(){
      
        document.getElementById('slider_sliceX').value = 1.0;
        document.getElementById('slider_sliceY').value = 1.0;
        document.getElementById('slider_sliceZ').value = 1.0;
        document.getElementById('slider_sliceX_min').value = 0.0;
        document.getElementById('slider_sliceY_min').value = 0.0;
        document.getElementById('slider_sliceZ_min').value = 0.0;
        document.getElementById('slider_ambient').value = 0.2;
        document.getElementById('slider_diffuse').value = 1.0;
        document.getElementById('slider_sampleRate').value = preferred_sampleRate;
        document.getElementById('slider_specular').value = 1.0;
        document.getElementById('slider_shiness').value = 128.0;;
        document.getElementById('slider_contrast').value = 0.2;
        document.getElementById('show_Axis').checked = false;  
        document.getElementById('item2').checked = true;  


       
    
        IsOrthogonal = 0;
        showAxis = 0;

        scale_cof = preferred_scale;
        m_curquat = preferred_transQuaterian.slice(0,preferred_transQuaterian.length);
        translateX = preferred_translateX;
        translateY = preferred_translateY;

        var temp = parseInt(translateX * 1000);
        translateX = parseFloat(temp/1000);
        temp = parseInt(translateY * 1000);
        translateY = parseFloat(temp/1000);
        temp = parseInt(scale_cof * 1000);
        scale_cof = parseFloat(temp/1000);

        document.getElementById('slider_translateX').value = translateX;
        document.getElementById('slider_translateY').value = translateY;
        document.getElementById('slider_scale').value = scale_cof;

        interfaceParaInitialization();
          
        if(colorNodes_file.length > 0){
             colorPickerNodes.splice(0,colorPickerNodes.length);
             channel_svg.selectAll("circle").remove();
             for(var i = 0;i< colorNodes_file.length;i++) {
                  var nodes = {
                         color: d3.rgb(colorNodes_file[i].color),
                         cx: colorNodes_file[i].cx
                  };
                  colorPickerNodes.push(nodes);
                  channel_svg.append("circle").attr("cx",colorNodes_file[i].cx).attr("cy", channel_canvas_height/2).attr("r", circle_ridius).style("fill", nodes.color).style("stroke", "black").style("stroke-width", "2px");
             }
             constructColorArray();
             channel_canvas.each(render);
             var circles = channel_svg.selectAll("circle").on("dblclick", doubleclick).on('mouseover', function(){
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
                    d3.select(this).style("stroke","black").style("stroke-width", "2px");
                    node_tooltip.style('visibility', 'hidden');
                    currentObject = null;
             });
             circles.call(d3.behavior.drag().on("drag", dragged));
         }
      if(opacityNodes_file.length > 0){
            opacityNodes.splice(0,opacityNodes.length);
            svg3.selectAll("circle").remove();
            for(var i = 0;i< opacityNodes_file.length;i++) {
                 var nodes = {
                     opacity: opacityNodes_file[i].opacity,
                     cx: opacityNodes_file[i].cx,
                     cy: opacityNodes_file[i].cy
                 };
                opacityNodes.push(nodes);
                svg3.append("circle").attr("cx",opacityNodes_file[i].cx).attr("cy", opacityNodes_file[i].cy).attr("r", circle_ridius).style("fill", "white").style("stroke", "black").style("stroke-width", "2px");
            } 
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
                 currentObject = null; 
                 node_tooltip.style('visibility', 'hidden');
             });
            constructOpacityArray();
            svg3.select("path").attr("d", lineFunc(opacityNodes)).attr("stroke", "black").attr("stroke-width", 2).attr("fill", "none");
       }
}

surface_slider.oninput = function(){
     
    normalReady = 0;
    verticesReady = 0;
    indiceReady = 0;
    updateSurfaceView = 1;
    var sliderValue = document.getElementById("slider_surface").value;
  //   console.log(sliderValue);
     data_select = document.getElementById("data").value.toString();
     var filepath = "./surface/";
     var surface_indexPath = filepath + data_select.toString()+".txt"; 

     var surfaceIndex = document.getElementById("surfaceIndex");

   
     $.get(surface_indexPath, function(data, status) {
        
        if(status != "success"){
            alert("Fail to load " + surface_indexPath);
            isoValue = -999;
            console.log(status);    
        }
        if (status == "success"){      
            var buffer = data.split(/[\s\n]/);
            var num = parseInt(buffer[0]);
            surface_slider.max = num - 1;
            var k = 2;
            for(var i = 0;i<num;i++){   
               var surfaceId = parseInt(buffer[k++]);
               var temp = parseFloat(buffer[k++]);
               if(sliderValue==surfaceId){
                   currentSurfaceID = surfaceId;
                   isoValue = temp;
                   var isovalue_text = document.getElementById("text_isovalue");
                   (document.getElementById('slider_surface')).title = isoValue;
                   surfaceIndex.innerHTML = "Isovalue" + " (" + (currentSurfaceID + 1) + "/" + num + ")";
               }
                k++;
            }
          
        }              
    },"text")
    .fail(function(){alert('Fail to load ' + surface_indexPath);
         currentSurfaceID = 0;
         isoValue = -999;
    });

};
function LoadSurfaceData2()
{

   
    var slider = document.getElementById("slider_surface");
    var sliderValue = document.getElementById("slider_surface").value;

    data_select = document.getElementById("data").value.toString();
    var filepath = "./surface/";
    var surface_indexPath = filepath + data_select.toString(); 
    var surface_path = surface_indexPath + "_" + isoValue.toString()+"_";
    var surface_indices_path = surface_path + "indices.dat";
    var surface_normals_path = surface_path + "normals.dat";
    var surface_vertices_path = surface_path + "vertices.dat";

     document.getElementById('surface_spinner').style.visibility = "visible";


    var oReq1 = new XMLHttpRequest();
    oReq1.open("GET", surface_normals_path, true);
    oReq1.responseType = "arraybuffer";
    oReq1.onreadystatechange = function() {
        if (oReq1.readyState == oReq1.DONE) {
            var arrayBuffer = oReq1.response;

            surface_normals = null;
            surface_normals = new Float32Array(arrayBuffer);
            normalReady = 1;
          //  if(verticesReady==1&&indiceReady==1) slider.removeAttr("disabled");
            oReq1 = null;
        }
    }
    oReq1.send(null);
//LoadSurfaceIndices    
    var oReq2 = new XMLHttpRequest();
    oReq2.open("GET", surface_indices_path, true);
    oReq2.responseType = "arraybuffer";
    oReq2.onreadystatechange = function() {
        if (oReq2.readyState == oReq2.DONE) {
            var arrayBuffer = oReq2.response;

            surface_indices = null;
            surface_indices = new Int16Array(arrayBuffer);
            indiceReady = 1;
          //  if(verticesReady==1&&normalReady==1) slider.removeAttr("disabled");
            oReq2 = null;
        }
    }
    oReq2.send(null);
//LoadSurfaceVertices
    var oReq3 = new XMLHttpRequest();
    oReq3.open("GET", surface_vertices_path, true);
    oReq3.responseType = "arraybuffer";
    oReq3.onreadystatechange = function() {
        if (oReq3.readyState == oReq3.DONE) {
            var arrayBuffer = oReq3.response;

            surface_vertices = null;
            surface_vertices = new Float32Array(arrayBuffer);
            verticesReady = 1;
          //  if(indiceReady==1&&normalReady==1) slider.removeAttr("disabled");
            oReq3 = null;
        }
    }
    oReq3.send(null);
         
  // slider.attr("disabled","disabled");
}
function updateDataDescription()
{
    data_select = document.getElementById("data").value.toString();
    var name_desc =  document.getElementById("dataInfoName");
    var dim_desc = document.getElementById("dataInfoDim");
    var variable_desc = document.getElementById("dataInfoVariable");
    var data_desc = document.getElementById("dataDescription");
    name_desc.innerHTML = data_select;
    var desc_filepath = "./data-description/";
    desc_filepath += data_select;
    desc_filepath += ".txt";

    $.get(desc_filepath, function(data, status) {
        if (status == "success"){ 
          var buffer = data;
      //    buffer = buffer.replace(/\ +/g,""); 
       //   buffer = buffer.replace(/[\r\n]/g,"");  
          var name_index = buffer.indexOf("Name:");
          var dim_index = buffer.indexOf("Dimension:");
          var variable_index = buffer.indexOf("Variable:");
          var data_index = buffer.indexOf("Description:");
          var name = buffer.slice(name_index+5,dim_index);
          var dim = buffer.slice(dim_index + 10,variable_index);
          var variable = buffer.slice(variable_index + 9,data_index);
          var desc = buffer.slice(data_index + 12, buffer.length);
          name_desc.innerHTML = name;
          dim_desc.innerHTML = dim;
          variable_desc.innerHTML = variable;
          data_desc.innerHTML = desc;

          var temp;
        }   
    },"text");
}
function LoadVolumeData()
{
   // loadibng = true
    drawVolume = 0;

    gl_surface.clearColor(1.0, 1.0, 1.0, 1.0);
    gl_surface.clear(gl_surface.COLOR_BUFFER_BIT|gl_surface.DEPTH_BUFFER_BIT);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    isoValue = -999;
    currentSurfaceID = 0.0;
    document.getElementById('slider_surface').value = 0.0;
    data_select = document.getElementById("data").value.toString();

    document.getElementById('volume_spinner').style.visibility = "visible";

    var filepath1 = "./transfunc/";
    var tf_color_filepath = filepath1 + data_select.toString()  + "_color.txt";
    tf_color_filepath.slice(0,tf_color_filepath.indexOf("_"));
    var tf_opacity_filepath = filepath1  + data_select.toString() + "_opacity.txt";
    filepath1 += data_select;
   
    filepath1 += ".txt";
    
      
    $.get(filepath1, function(data, status) {
        if (status == "success") dimDesc = data;

          var buffer = dimDesc.split(/[\s\n]/);
          volSizeX = parseInt(buffer[0]);
          volSizeY = parseInt(buffer[1]);
          volSizeZ = parseInt(buffer[2]);

          MaxEdgeSize = volSizeX > volSizeY ? volSizeX : volSizeY;
          MaxEdgeSize = MaxEdgeSize > volSizeZ ? MaxEdgeSize : volSizeZ;
          refSampleRate = 1.0 / (MaxEdgeSize / 2.0);

          preferred_scale = parseFloat(buffer[3]);
          preferred_transQuaterian.splice(0,preferred_transQuaterian.length);
          preferred_transQuaterian.push(parseFloat(buffer[4]));
          preferred_transQuaterian.push(parseFloat(buffer[5]));
          preferred_transQuaterian.push(parseFloat(buffer[6]));
          preferred_transQuaterian.push(parseFloat(buffer[7]));
          preferred_translateX = parseFloat(buffer[8]);
          preferred_translateY = parseFloat(buffer[9]);
          
          preferred_sampleRate = parseFloat(buffer[10]);
          resetPreferredSetting();
         
        //  console.log(test);    
    },"text");
    $.get(tf_color_filepath, function(data, status) {
        if (status == "success"){ 
            colorNodes_file.splice(0,colorNodes_file.length);
            var buffer = data.split(/[\s\n]/);
            var num = parseInt(buffer[0]);
            var k = 2;
            for(var i = 0;i<num;i++){
                var node = {cx:parseInt(buffer[k++]),
                 color:d3.rgb(parseFloat(buffer[k++]),parseFloat(buffer[k++]),parseFloat(buffer[k++]))
                }; 
                colorNodes_file.push(node);
                k++;
            } 
            resetPreferredSetting();
        }
        else colorNodes_file.splice(0,colorNodes_file.length);

         
        //  console.log(test);    
    },"text");
    $.get(tf_opacity_filepath, function(data, status) {
        if (status == "success"){ 
            opacityNodes_file.splice(0,opacityNodes_file.length);
            var buffer = data.split(/[\s\n]/);
            var num = parseInt(buffer[0]);
            var k = 2;
            for(var i = 0;i<num;i++){
                var node = 
                {  opacity: parseFloat(buffer[k++]),
                   cx:  parseFloat(buffer[k++]),
                   cy:  parseFloat(buffer[k++])
                };
                k++
                opacityNodes_file.push(node);
            } 
             resetPreferredSetting();
        }
        else opacityNodes_file.splice(0,opacityNodes_file.length);     
        //  console.log(test);    
    },"text");

//    console.log(volSizeX);
//    var filepath = "file:///C:/Users/23626/Desktop/webgl_volumerender/App1/data/";
    var filepath = "./volume/";
    filepath += data_select;
    filepath += ".dat";
    volume_data = null;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", filepath, true);
    oReq.responseType = "arraybuffer";
    oReq.onreadystatechange = function() {
        if (oReq.readyState == oReq.DONE) {
           
            var arrayBuffer = oReq.response;
            volume_data = null;
            volume_data = new Float32Array(arrayBuffer);

            var min = 999999;
            var max = -999999;
            for (var i = 0; i < volume_data.length; i++) {
               
                min = volume_data[i] > min ? min : volume_data[i];
                max = volume_data[i] > max ? volume_data[i] : max;
            }
            for (var i = 0; i < volume_data.length; i++) {
                volume_data[i] = (volume_data[i] - min) / (max - min);  
            }
            drawVolume = 1.0;
            updateVolumeView = 1;
            updateSurfaceView = 1;
            gl.deleteTexture(volumeTexture);    
            volumeTexture = gl.createTexture();
         
             gl.activeTexture(gl.TEXTURE1);
             gl.bindTexture(gl.TEXTURE_3D, volumeTexture);
             gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
             gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
             gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
             gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
             gl.texParameterf(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
             
             gl.texStorage3D(gl.TEXTURE_3D, 1, gl.R32F, volSizeX, volSizeY, volSizeZ);   
             gl.texSubImage3D(gl.TEXTURE_3D, 0, 0, 0, 0, volSizeX, volSizeY, volSizeZ, gl.RED, gl.FLOAT, volume_data);

          //   gl.texImage3D(gl.TEXTURE_3D, 0, gl.R32F, volSizeX, volSizeY, volSizeZ, 0, gl.RED, gl.FLOAT, volume_data);
             $("#data").removeAttr("disabled");
             document.getElementById('volume_spinner').style.visibility = "hidden";
             oReq = null;
        
        }
    }
   oReq.send(null);
   $("#data").attr("disabled","disabled");
   surface_slider.oninput();
   updateDataDescription();
}
function drawBoundingBox() {


    gl.useProgram(vol_border_program);
    var u_ctMatrixLoc = gl.getUniformLocation(vol_border_program, 'ctMatrix');
    var scaleMatrixLoc = gl.getUniformLocation(vol_border_program, 'scale_Matrix');

    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));

    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices1, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    var vertexPosLocation = 0;
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundingBoxindexBuffer);
    gl.drawElements(gl.LINES, boundingBoxIndex.length, gl.UNSIGNED_SHORT, 0);
  //  gl.deleteProgram(program);

}
function drawViewPort(){
 // draw volume viewport   
 
    gl.useProgram(vol_viewport_program);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, viewPortBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, viewPortVertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, viewPortBuffer);
    var vertexPosLocation = 0;
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);
    
    var width = gl.getParameter(gl.LINE_WIDTH);
    gl.lineWidth(5.0);
    gl.drawArrays(gl.LINES,0,viewPortVertices.length/4);
  //  gl.deleteProgram(vol_viewport_program);
}
function drawAxis() {
    
 

    gl.useProgram(vol_axis_program);

    var u_ctMatrixLoc = gl.getUniformLocation(vol_axis_program, 'ctMatrix');
    var u_projectMatrixLoc = gl.getUniformLocation(vol_axis_program, 'projMatrix');
    var u_viewMatrixLoc = gl.getUniformLocation(vol_axis_program, 'viewtransMatrix');
    var u_lookatMatrixLoc = gl.getUniformLocation(vol_axis_program, 'viewMatrix');
    var u_transMatrixLoc = gl.getUniformLocation(vol_axis_program, 'transMatrix');
    var u_IsOrthogonal = gl.getUniformLocation(vol_axis_program, 'IsOrthogonal');
   // var u_vec3 = gl.getUniformLocation(program, 'temp');
  
    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    gl.uniformMatrix4fv(u_projectMatrixLoc, false, flatten(projMatrix));
    gl.uniformMatrix4fv(u_viewMatrixLoc, false, flatten(axis_mvMatrix));
    gl.uniformMatrix4fv(u_lookatMatrixLoc, false, flatten(lookatMatrix));
    gl.uniformMatrix4fv(u_transMatrixLoc, false, flatten(trans_Matrix));
    gl.uniform1i(u_IsOrthogonal, IsOrthogonal);
  //  gl.uniform3fv(u_vec3,eye_up);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xAxisVertices, gl.STATIC_DRAW);
    var vertexPosLocation = 0;
    gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xAxisVerticesColor, gl.STATIC_DRAW);
    var vertexColorLocation = 1;
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.drawArrays(gl.LINES,0,xAxisVertices.length/3);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yAxisVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yAxisVerticesColor, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.drawArrays(gl.LINES,0,xAxisVertices.length/3);


    gl.bindBuffer(gl.ARRAY_BUFFER, axisVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, zAxisVertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, zAxisVerticesColor, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexColorLocation);

    gl.drawArrays(gl.LINES,0,xAxisVertices.length/3);

  //  gl.deleteProgram(program);
}
function drawSlicingPlane() {
   
    MaxEdgeSize = volSizeX > volSizeY ? volSizeX : volSizeY;
    MaxEdgeSize = MaxEdgeSize > volSizeZ ? MaxEdgeSize : volSizeZ;

    var width = volSizeX / MaxEdgeSize * sliceX;
    var height = volSizeY / MaxEdgeSize * sliceY;
    var depth = volSizeZ / MaxEdgeSize * sliceZ;

    var ox = -0.5 + volSizeX / MaxEdgeSize * sliceX_min;
    var oy = -0.5 + volSizeY / MaxEdgeSize * sliceY_min;
    var oz = -0.5 + volSizeZ / MaxEdgeSize * sliceZ_min;

    var tx = -0.5 + width;
    var ty = -0.5 + height;
    var tz = -0.5 + depth;

    yOzMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        ox , oy , tz , 1.0,
        ox , oy , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , ty , tz , 1.0, 
        ox , ty , tz , 1.0, 
        ox , oy , tz , 1.0,
    ]);

    xOzMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        ox , oy , oz , 1.0,
        ox , oy , tz , 1.0,
        tx , oy , oz , 1.0,
        tx , oy , tz , 1.0, 
        tx , oy , tz , 1.0, 
        ox , oy , tz , 1.0,
    ]);

    xOyMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        tx , ty , oz , 1.0, 
        tx , ty , oz , 1.0, 
        ox , ty , oz , 1.0,
    ]);

   yOzSliceVertex = new Float32Array([
         tx , oy , oz , 1.0,
         tx , ty , oz , 1.0,
         tx , ty , oz , 1.0,
         tx , ty , tz , 1.0,
         tx , ty , tz , 1.0,
         tx , oy , tz , 1.0, 
         tx , oy , tz , 1.0, 
         tx , oy , oz , 1.0,
    ]);
    
    xOzSliceVertex = new Float32Array([
         ox, ty, oz, 1.0,
         tx, ty, oz, 1.0,
         tx, ty, oz, 1.0,
         tx, ty, tz, 1.0,
         tx, ty, tz, 1.0,
         ox, ty, tz, 1.0,
         ox, ty, tz, 1.0,
         ox, ty, oz, 1.0, 
    ]);
    xOySliceVertex = new Float32Array([
       ox, oy, tz,1.0,
       tx, oy, tz,1.0,
       tx, oy, tz,1.0,
       tx, ty, tz,1.0,
       tx, ty, tz,1.0,
       ox, ty, tz,1.0,
       ox, ty, tz,1.0,
       ox, oy, tz,1.0,      
    ])
    

    gl.useProgram(vol_slice_program);
    var u_ctMatrixLoc = gl.getUniformLocation(vol_slice_program, 'ctMatrix');
    var u_sliceIndex = gl.getUniformLocation(vol_slice_program, 'sliceIndex');

    gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    gl.uniform1i(u_sliceIndex,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yOzSliceVertex, gl.STATIC_DRAW);
    var vertexPosLocation = 0;
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceX<1.0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);

    gl.uniform1i(u_sliceIndex,1);

    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xOzSliceVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceY<1.0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);

    gl.uniform1i(u_sliceIndex,2);
    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xOySliceVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceZ<1.0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);

    gl.uniform1i(u_sliceIndex,0);
    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, yOzMinSliceVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceX_min>0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);

    gl.uniform1i(u_sliceIndex,1);
    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xOzMinSliceVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceY_min>0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);

    gl.uniform1i(u_sliceIndex,2);
    gl.bindBuffer(gl.ARRAY_BUFFER, boundingBoxVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, xOyMinSliceVertex, gl.STATIC_DRAW);
    gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosLocation);

    if(sliceZ_min>0)gl.drawArrays(gl.LINES,0,yOzSliceVertex.length/4.0);
  
    
 
    sliceBoundaryVertice = null;
    yOzSliceVertex = null;
    xOzSliceVertex = null;
    xOySliceVertex = null;
    yOzMinSliceVertex = null;
    xOzMinSliceVertex = null;
    xOyMinSliceVertex = null;
}
function glDrawVolume() {

  //  LoadData();
  
    //  drawViewPort();
    if(START==0){
        LoadVolumeData();
        START = 1;
    }
    if(IsOrthogonal&&scale_cof>5.0)scale_cof =5.0;  
   // console.log(updateVolumeView);
   if( drawVolume==0){
        drawViewPort();
   }
   
    if(updateVolumeView ==1){

        updateTransferFuncArray();
        var width = volSizeX / MaxEdgeSize;
        var height = volSizeY / MaxEdgeSize;
        var depth = volSizeZ / MaxEdgeSize;
    
        var bOx = -0.45; 

        vertices1 = null;
        boundingBoxVertices = null;
        var ox = m_volOrigin[0];
        var oy = m_volOrigin[1];
        var oz = m_volOrigin[2];
   
        vertices1 = new Float32Array([-0.5, -0.5, -0.5 + depth, 1.0, 
            -0.5, -0.5 + height,  -0.5+ depth, 1.0, 
            -0.5 + width, -0.5 + height,  -0.5 + depth, 1.0,
            -0.5 + width, -0.5,  -0.5+ depth, 1.0, 
            -0.5, -0.5, -0.5, 1.0, 
            -0.5, -0.5 + height,  -0.5, 1.0, 
            -0.5 + width, -0.5 + height,  -0.5, 1.0,
            -0.5 + width, -0.5,  -0.5, 1.0, ]);
    
        for(var j = 0;j < 3;j++){  
             m_volCenter[j] = 0.0;
            for(var i = 0;i<vertices1.length;i+=4)m_volCenter[j]+=vertices1[i+j]; 
             m_volCenter[j]/=8.0; 
         }  
    

 
    //   gl.generateMipmap(gl.TEXTURE_3D);
    
        gl.deleteTexture(transferFuncTexture);
        transferFuncTexture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, transferFuncTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA32F, transferFuncRangel/2, 1);   
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, transferFuncRangel/2, 1,gl.RGBA, gl.FLOAT, transferFunc_ColorArray);
   //    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, transferFuncRangel/2, 1, 0, gl.RGBA, gl.FLOAT, transferFunc_ColorArray);
  

   
         // load transformation matrix

        scale_Matrix = scalem(scale_cof, scale_cof, scale_cof);
    
        var translate_Matrix = translate(-m_volCenter[0],-m_volCenter[1],-m_volCenter[2]);
        m_inc = build_rotmatrix(m_curquat);
        m_inc = mult(m_inc,translate_Matrix);

        translate_Matrix = translate(translateX,translateY,0);
        m_inc = mult(translate_Matrix,m_inc);
        // axis_mvMatrix = mat4();
        axis_mvMatrix = mult(translate_Matrix,m_inc);
        trans_Matrix = mult(translate_Matrix, m_inc);
   
        m_inc = mult(scale_Matrix, m_inc);
        if (IsOrthogonal == 0) {
            lookatMatrix = lookAt(eye_pos, eye_at, eye_up);
            m_inc = mult(lookatMatrix, m_inc);
            axis_mvMatrix = mult(lookatMatrix, axis_mvMatrix);
            projMatrix = perspective(60, 1.0, 0.1, 20);
            ctMatrix = mult(perspective(60, 1.0, 0.1, 20), m_inc);
        } else {
            translate_Matrix = translate(0.0,0.0,-9.0);
            trans_Matrix = mult(translate_Matrix, trans_Matrix);
            m_inc = mult(translate_Matrix,m_inc);
            axis_mvMatrix = mult(translate_Matrix, axis_mvMatrix);
            lookatMatrix = mat4();
            ctMatrix = mult(ortho(-1, 1, -1, 1, -2.0,20.0), m_inc);
            projMatrix = ortho(-1, 1, -1, 1, -2.0, 20.0);
        }

        inverse_MVmatrx = inverse(m_inc);
        textureMatrix = mult(scalem(1.0/width,1.0/height,1.0/depth),translate(0.5,0.5,0.5));
        textureMatrix = mult(textureMatrix,inverse_MVmatrx);


        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
         
        
        drawViewPort();
        gl.depthMask(true);
    
        var X = parseFloat(sliceX_min)+ parseFloat(sliceX);
        var Y = parseFloat(sliceY_min)+ parseFloat(sliceY);
        var Z = parseFloat(sliceZ_min)+ parseFloat(sliceZ);
        if (drawVolume) {
            drawBoundingBox();
            if(showAxis)drawAxis();
            if ((sliceX < 1.0 || sliceY < 1.0 || sliceZ < 1.0||sliceX_min>0.0||sliceY_min>0.0||sliceZ_min>0.0)&&sliceX_min<sliceX&&sliceY_min<sliceY&&sliceZ_min<=sliceZ) drawSlicingPlane();   
        }
    
     // initiate shader...

       gl.useProgram(backface_program);

       var u_ctMatrixLoc = gl.getUniformLocation(backface_program, 'ctMatrix');
       gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    
     //init Vertex Array
       vertexArray = gl.createVertexArray();
       gl.bindVertexArray(vertexArray);

       gl.bindBuffer(gl.ARRAY_BUFFER, verticePosBuffer);
       gl.bufferData(gl.ARRAY_BUFFER, vertices1, gl.STATIC_DRAW);

       var vertexPosLocation = 0;
       gl.vertexAttribPointer(vertexPosLocation, 4, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(vertexPosLocation);

       gl.bindBuffer(gl.ARRAY_BUFFER, verticeTexCordBuffer);
       var vertexTexCordLocation = 1;
       gl.vertexAttribPointer(vertexTexCordLocation, 3, gl.FLOAT, false, 0, 0);
       gl.enableVertexAttribArray(vertexTexCordLocation);

       gl.bindVertexArray(null);
  //     gl.deleteProgram(program);

       //render front face
       gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, frameBuffer);

  
       gl.enable(gl.DEPTH_TEST);
       gl.frontFace(gl.CCW);
       gl.enable(gl.CULL_FACE);
    
       gl.cullFace(gl.BACK);

       gl.clearColor(1.0, 1.0, 1.0, 0.9);
       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

       gl.bindVertexArray(vertexArray);

       gl.viewport(0, 0, canvas.width, canvas.height);
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticeIndexBuffer);
       gl.drawElements(gl.TRIANGLES, vertices_index.length, gl.UNSIGNED_SHORT, 0);

       gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);

       //   render  back face
      
       gl.useProgram(vol_program);

    //  load transformation matrix   
       var transferFuncRangeLoc = gl.getUniformLocation(vol_program, 'tf_range');
       gl.uniform1f(transferFuncRangeLoc, transferFuncRange);
       var  u_ctMatrixLoc = gl.getUniformLocation(vol_program, 'ctMatrix');
       gl.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
       var u_projMatrtixLoc = gl.getUniformLocation(vol_program,'projectMatrix');
       gl.uniformMatrix4fv(u_projMatrtixLoc,false,flatten(projMatrix));
       var u_inverseMVmatrix = gl.getUniformLocation(vol_program, 'inverseMVmatrix');
       gl.uniformMatrix4fv(u_inverseMVmatrix, false, flatten(inverse_MVmatrx));

    //  load texture     
       var backFaceTextureLocation = gl.getUniformLocation(vol_program, 'backFaceTexture');
       var depthTextureLocation = gl.getUniformLocation(vol_program, 'depthTexture');
       var volumeTexLocation = gl.getUniformLocation(vol_program, 'volumeTexture');
       var transferFuncLocation = gl.getUniformLocation(vol_program, 'transferFunc');
       var ambientLocation = gl.getUniformLocation(vol_program, 'ambient_density');
       var diffuseLocation = gl.getUniformLocation(vol_program, 'diffuse_density');
       var shinessLocation = gl.getUniformLocation(vol_program, 'shiness_density');
       var specularLocation = gl.getUniformLocation(vol_program, 'specular_density');
       var sampleRateLocation = gl.getUniformLocation(vol_program, 'sampleRate');
       var refsampleRateLocation = gl.getUniformLocation(vol_program, 'refSampleRate');
       var contrastLocation = gl.getUniformLocation(vol_program, 'constrast_ratio');
       var sliceXLocation = gl.getUniformLocation(vol_program, 'slice_X');
       var sliceYLocation = gl.getUniformLocation(vol_program, 'slice_Y');
       var sliceZLocation = gl.getUniformLocation(vol_program, 'slice_Z');
       var sliceX_minLocation = gl.getUniformLocation(vol_program, 'slice_X_min');
       var sliceY_minLocation = gl.getUniformLocation(vol_program, 'slice_Y_min');
       var sliceZ_minLocation = gl.getUniformLocation(vol_program, 'slice_Z_min');

       var IsOrthogonalLocation = gl.getUniformLocation(vol_program, 'IsOrthogonal');
       var volSizeXLocation = gl.getUniformLocation(vol_program, 'volSizeX');
       var volSizeYLocation = gl.getUniformLocation(vol_program, 'volSizeY');
       var volSizeZLocation = gl.getUniformLocation(vol_program, 'volSizeZ');

       gl.uniform1f(sliceXLocation, sliceX);
       gl.uniform1f(sliceYLocation, sliceY);
       gl.uniform1f(sliceZLocation, sliceZ);
       gl.uniform1f(sliceX_minLocation, sliceX_min);
       gl.uniform1f(sliceY_minLocation, sliceY_min);
       gl.uniform1f(sliceZ_minLocation, sliceZ_min);
       gl.uniform1f(ambientLocation, ambient);
       gl.uniform1f(diffuseLocation, diffuse);
       gl.uniform1f(shinessLocation, shiness);
       gl.uniform1f(sampleRateLocation, sampleRate);
       gl.uniform1f(refsampleRateLocation, refSampleRate);
       gl.uniform1f(specularLocation, specular);
       gl.uniform1f(contrastLocation, contrast);
       gl.uniform1i(IsOrthogonalLocation, IsOrthogonal);
       gl.uniform1f(volSizeXLocation, volSizeX);
       gl.uniform1f(volSizeYLocation, volSizeY);
       gl.uniform1f(volSizeZLocation, volSizeZ);

       gl.activeTexture(gl.TEXTURE0);
       gl.bindTexture(gl.TEXTURE_2D, backFaceTexture);
       gl.uniform1i(backFaceTextureLocation, 0);

       gl.activeTexture(gl.TEXTURE1);
       gl.bindTexture(gl.TEXTURE_3D, volumeTexture);
       gl.uniform1i(volumeTexLocation, 1);

       gl.activeTexture(gl.TEXTURE2);
       gl.bindTexture(gl.TEXTURE_2D, transferFuncTexture);
       gl.uniform1i(transferFuncLocation, 2);

       gl.activeTexture(gl.TEXTURE3);
       gl.bindTexture(gl.TEXTURE_2D, depthTexture);
       gl.uniform1i(depthTextureLocation, 3);

       gl.bindVertexArray(vertexArray);
    
    
   
       gl.enable(gl.DEPTH_TEST);
       gl.frontFace(gl.CCW);
       gl.enable(gl.CULL_FACE);
       gl.enable(gl.BLEND);
       gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
       gl.depthMask(true); 

  
      gl.cullFace(gl.FRONT);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticeIndexBuffer);
      if(drawVolume)gl.drawElements(gl.TRIANGLES, vertices_index.length, gl.UNSIGNED_SHORT, 0);
    
   

    
      gl.depthMask(true);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);      
    
     
      updateVolumeView = 0;
    }   

    requestAnimationFrame(glDrawVolume);   
        
   
}
function glDrawSurfaceBoundingBox()
{
   
    gl_surface.useProgram(surface_border_program);
    var u_ctMatrixLoc = gl_surface.getUniformLocation(surface_border_program, 'ctMatrix');
    var scaleMatrixLoc = gl_surface.getUniformLocation(surface_border_program, 'scale_Matrix');

    gl_surface.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(surface_ctMatrix));

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, vertices1, gl_surface.STATIC_DRAW);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, null);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    var vertexPosLocation = 0;
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, surface_boundingBoxIndexBuffer);
    gl_surface.drawElements(gl_surface.LINES, boundingBoxIndex.length, gl_surface.UNSIGNED_SHORT, 0);
}
function glDrawSurfaceViewPort()
{
    // drawSurface viewport
  
    gl_surface.useProgram(surface_viewport_program);
 
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_viewPortBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, viewPortVertices, gl_surface.STATIC_DRAW);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, null);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_viewPortBuffer);
    var vertexPosLocation = 0;
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);
    
    var width = gl_surface.getParameter(gl_surface.LINE_WIDTH);
    gl_surface.lineWidth(1.0);
    gl_surface.drawArrays(gl_surface.LINES,0,viewPortVertices.length/4);
}
function glDrawSurfaceAxis()
{
 
    gl_surface.useProgram(surface_axis_program);

    var u_ctMatrixLoc = gl_surface.getUniformLocation(surface_axis_program, 'ctMatrix');
    var u_projectMatrixLoc = gl_surface.getUniformLocation(surface_axis_program, 'projMatrix');
    var u_viewMatrixLoc = gl_surface.getUniformLocation(surface_axis_program, 'viewtransMatrix');
    var u_lookatMatrixLoc = gl_surface.getUniformLocation(surface_axis_program, 'viewMatrix');
    var u_transMatrixLoc = gl_surface.getUniformLocation(surface_axis_program, 'transMatrix');
    var u_IsOrthogonal = gl_surface.getUniformLocation(surface_axis_program, 'IsOrthogonal');
   // var u_vec3 = gl.getUniformLocation(program, 'temp');
  
    gl_surface.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    gl_surface.uniformMatrix4fv(u_projectMatrixLoc, false, flatten(projMatrix));
    gl_surface.uniformMatrix4fv(u_viewMatrixLoc, false, flatten(m_inc));
    gl_surface.uniformMatrix4fv(u_lookatMatrixLoc, false, flatten(lookatMatrix));
    gl_surface.uniformMatrix4fv(u_transMatrixLoc, false, flatten(trans_Matrix));
    gl_surface.uniform1i(u_IsOrthogonal, IsOrthogonal);
  //  gl.uniform3fv(u_vec3,eye_up);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisVerticesBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xAxisVertices, gl_surface.STATIC_DRAW);
    var vertexPosLocation = 0;
    gl_surface.vertexAttribPointer(vertexPosLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisColorBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xAxisVerticesColor, gl_surface.STATIC_DRAW);
    var vertexColorLocation = 1;
    gl_surface.vertexAttribPointer(vertexColorLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexColorLocation);

    gl_surface.drawArrays(gl_surface.LINES,0,xAxisVertices.length/3);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisVerticesBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, yAxisVertices, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisColorBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, yAxisVerticesColor, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexColorLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexColorLocation);

    gl_surface.drawArrays(gl_surface.LINES,0,xAxisVertices.length/3);


    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisVerticesBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, zAxisVertices, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_axisColorBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, zAxisVerticesColor, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexColorLocation, 3, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexColorLocation);

    gl_surface.drawArrays(gl_surface.LINES,0,xAxisVertices.length/3);

}
function glDrawSurfaceSlicePlane()
{
    var width = volSizeX / MaxEdgeSize *  sliceX;
    var height = volSizeY / MaxEdgeSize * sliceY;
    var depth = volSizeZ / MaxEdgeSize *  sliceZ;
  
    var ox = -0.5 + volSizeX / MaxEdgeSize * sliceX_min;
    var oy = -0.5 + volSizeY / MaxEdgeSize * sliceY_min;
    var oz = -0.5 + volSizeZ / MaxEdgeSize * sliceZ_min;

    var tx = -0.5 + width;
    var ty = -0.5 + height;
    var tz = -0.5 + depth;

    yOzMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        ox , oy , tz , 1.0,
        ox , oy , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , ty , tz , 1.0, 
        ox , ty , tz , 1.0, 
        ox , oy , tz , 1.0,
    ]);

    xOzMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        ox , oy , oz , 1.0,
        ox , oy , tz , 1.0,
        tx , oy , oz , 1.0,
        tx , oy , tz , 1.0, 
        tx , oy , tz , 1.0, 
        ox , oy , tz , 1.0,
    ]);

    xOyMinSliceVertex = new Float32Array([
        ox , oy , oz , 1.0,
        ox , ty , oz , 1.0,
        ox , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        tx , oy , oz , 1.0,
        tx , ty , oz , 1.0, 
        tx , ty , oz , 1.0, 
        ox , ty , oz , 1.0,
    ]);

   yOzSliceVertex = new Float32Array([
         tx , oy , oz , 1.0,
         tx , ty , oz , 1.0,
         tx , ty , oz , 1.0,
         tx , ty , tz , 1.0,
         tx , ty , tz , 1.0,
         tx , oy , tz , 1.0, 
         tx , oy , tz , 1.0, 
         tx , oy , oz , 1.0,
    ]);
    
    xOzSliceVertex = new Float32Array([
         ox, ty, oz, 1.0,
         tx, ty, oz, 1.0,
         tx, ty, oz, 1.0,
         tx, ty, tz, 1.0,
         tx, ty, tz, 1.0,
         ox, ty, tz, 1.0,
         ox, ty, tz, 1.0,
         ox, ty, oz, 1.0, 
    ]);
    xOySliceVertex = new Float32Array([
       ox, oy, tz,1.0,
       tx, oy, tz,1.0,
       tx, oy, tz,1.0,
       tx, ty, tz,1.0,
       tx, ty, tz,1.0,
       ox, ty, tz,1.0,
       ox, ty, tz,1.0,
       ox, oy, tz,1.0,      
    ])
    
    gl_surface.useProgram(surface_slice_program);

    var u_ctMatrixLoc = gl_surface.getUniformLocation(surface_slice_program, 'ctMatrix');
    var u_sliceIndex = gl_surface.getUniformLocation(surface_slice_program, 'sliceIndex');

    gl_surface.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));
    gl_surface.uniform1i(u_sliceIndex,0);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, yOzSliceVertex, gl_surface.STATIC_DRAW);
    var vertexPosLocation = 0;
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    if(sliceX<1.0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);

    gl_surface.uniform1i(u_sliceIndex,1);

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xOzSliceVertex, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    if(sliceY<1.0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);

    gl_surface.uniform1i(u_sliceIndex,2);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xOySliceVertex, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    if(sliceZ<1.0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);


    gl_surface.uniform1i(u_sliceIndex,0);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, yOzMinSliceVertex, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    if(sliceX_min>0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);

    gl_surface.uniform1i(u_sliceIndex,1);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xOzMinSliceVertex, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);

    if(sliceY_min>0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);

    gl_surface.uniform1i(u_sliceIndex,2);
    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, xOyMinSliceVertex, gl_surface.STATIC_DRAW);
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);
   
     gl.enable(gl.BLEND);
     gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
     gl.depthMask(true); 
    if(sliceZ_min>0)gl_surface.drawArrays(gl_surface.LINES,0,yOzSliceVertex.length/4.0);

 
    sliceBoundaryVertice = null;
    yOzSliceVertex = null;
    xOzSliceVertex = null;
    xOySliceVertex = null;
    yOzMinSliceVertex = null;
    xOzMinSliceVertex = null;
    xOyMinSliceVertex = null;
}
function testDraw()
{
    var program = initShaders(gl_surface, "test_VertexShader", "test_FragmentShader");
    
    var points = new Float32Array(10 * 4);

       
    for(var i = 0;i < 10;i++){
        var radians = i * 2 * 3.1416 / 10;
        points[i * 4 + 0] = 0.5 * Math.cos(radians);
        points[i * 4 + 1] = 0.5 * Math.sin(radians);
        points[i * 4 + 2] = 0.0;
        points[i * 4 + 3] = 1.0;
    }
    gl_surface.useProgram(program);
    var u_ctMatrixLoc = gl_surface.getUniformLocation(program, 'ctMatrix');
    gl_surface.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(ctMatrix));

    gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_boundingBoxBuffer);
    gl_surface.bufferData(gl_surface.ARRAY_BUFFER, points, gl_surface.STATIC_DRAW);
    var vertexPosLocation = 0;
    gl_surface.vertexAttribPointer(vertexPosLocation, 4, gl_surface.FLOAT, false, 0, 0);
    gl_surface.enableVertexAttribArray(vertexPosLocation);
    
   // gl.pointsSize(4.0);
    gl_surface.drawArrays(gl_surface.LINE_STRIP,0,10);


    gl_surface.deleteProgram(program); 
}
function glDrawSurface()
{
     if(isoValue!=-999){
         LoadSurfaceData2();
         currentSurfaceValue = isoValue / 255.0;
         isoValue = -999;
     }
     if(updateSurfaceView==1&&(normalReady==0||indiceReady==0||verticesReady==0))glDrawSurfaceViewPort();
     if(updateSurfaceView==1&&normalReady==1&&indiceReady==1&&verticesReady==1){ 


         var translate_Matrix = translate(-m_volCenter[0],-m_volCenter[1],-m_volCenter[2]);

         surface_m_inc = build_rotmatrix(m_curquat);
         surface_m_inc = mult(surface_m_inc,translate_Matrix);

         translate_Matrix = translate(translateX,translateY,0);
         surface_m_inc = mult(translate_Matrix,surface_m_inc);
   
         surface_trans_Matrix = mult(scale_Matrix, surface_m_inc);
         surface_m_inc = mult(scale_Matrix, surface_m_inc);
         if (IsOrthogonal == 0) {     
            surface_m_inc = mult(lookatMatrix, surface_m_inc);
            projMatrix = perspective(60, 1.0, 0.1, 20);
            surface_ctMatrix = mult(perspective(60, 1.0, 0.1, 20), surface_m_inc);
         }
         else {
            translate_Matrix = translate(0.0,0.0,-9.0);
            surface_trans_Matrix = mult(translate_Matrix, trans_Matrix);
            surface_m_inc = mult(translate_Matrix,surface_m_inc);
            lookatMatrix = mat4();
            surface_ctMatrix = mult(ortho(-1, 1, -1, 1, -2.0,20.0), surface_m_inc);
             projMatrix = ortho(-1, 1, -1, 1, -2.0, 20.0);
        }
     
   
        
          gl_surface.clearColor(1.0, 1.0, 1.0, 0.9);
          gl_surface.clear(gl_surface.COLOR_BUFFER_BIT|gl_surface.DEPTH_BUFFER_BIT);

          if(showAxis)glDrawSurfaceAxis();
          if(drawVolume)glDrawSurfaceBoundingBox();
       //   testDraw();
        
          var X = parseFloat(sliceX_min)+ parseFloat(sliceX);
          var Y = parseFloat(sliceY_min)+ parseFloat(sliceY);
          var Z = parseFloat(sliceZ_min)+ parseFloat(sliceZ); 
           if ((sliceX < 1.0 || sliceY < 1.0 || sliceZ < 1.0||sliceX_min>0.0||sliceY_min>0.0||sliceZ_min>0.0)&&sliceX_min<sliceX&&sliceY_min<sliceY&&sliceZ_min<=sliceZ) glDrawSurfaceSlicePlane();
    
        
  
          gl_surface.deleteTexture(surface_transferFuncTexture);
          surface_transferFuncTexture = gl_surface.createTexture();
          gl_surface.bindTexture(gl_surface.TEXTURE_2D, surface_transferFuncTexture);
          gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_WRAP_S, gl_surface.CLAMP_TO_EDGE);
          gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_WRAP_T, gl_surface.CLAMP_TO_EDGE);
          gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_MIN_FILTER, gl_surface.LINEAR);
          gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_MAG_FILTER, gl_surface.LINEAR);

          gl_surface.texStorage2D(gl_surface.TEXTURE_2D, 1, gl_surface.RGBA32F, transferFuncRangel/2, 1);   
          gl_surface.texSubImage2D(gl_surface.TEXTURE_2D, 0, 0, 0, transferFuncRangel/2, 1,gl_surface.RGBA, gl_surface.FLOAT, surface_tfArray);

      //    gl_surface.texImage2D(gl_surface.TEXTURE_2D, 0, gl_surface.RGBA32F, transferFuncRangel/2, 1, 0, gl_surface.RGBA, gl_surface.FLOAT, surface_tfArray);
        
          gl_surface.useProgram(surface_program);

          var  u_ctMatrixLoc = gl_surface.getUniformLocation(surface_program, 'ctMatrix');
          var  u_transMatrixLoc = gl_surface.getUniformLocation(surface_program, 'm_inc');
          var u_inverseMVmatrix = gl_surface.getUniformLocation(surface_program, 'inverseMVmatrix');
  
          gl_surface.uniformMatrix4fv(u_inverseMVmatrix, false, flatten(inverse_MVmatrx));
          gl_surface.uniformMatrix4fv(u_ctMatrixLoc, false, flatten(surface_ctMatrix));
          gl_surface.uniformMatrix4fv(u_transMatrixLoc, false, flatten(surface_m_inc));
   
          var ambientLocation = gl_surface.getUniformLocation(surface_program, 'ambient_density');
          var diffuseLocation = gl_surface.getUniformLocation(surface_program, 'diffuse_density');
          var shinessLocation = gl_surface.getUniformLocation(surface_program, 'shiness_density');
          var specularLocation = gl_surface.getUniformLocation(surface_program, 'specular_density');
          var IsOrthogonalLocation = gl_surface.getUniformLocation(surface_program, 'IsOrthogonal');
          var opacityLocation = gl_surface.getUniformLocation(surface_program, 'opacity_density');
          var colorLocation = gl_surface.getUniformLocation(surface_program, 'diffuse_color');
          var contrastLocation = gl_surface.getUniformLocation(surface_program, 'constrast_ratio');
          var sliceXLocation = gl_surface.getUniformLocation(surface_program, 'slice_X');
          var sliceYLocation = gl_surface.getUniformLocation(surface_program, 'slice_Y');
          var sliceZLocation = gl_surface.getUniformLocation(surface_program, 'slice_Z');
          var volSizeXLocation = gl_surface.getUniformLocation(surface_program, 'volSizeX');
          var volSizeYLocation = gl_surface.getUniformLocation(surface_program, 'volSizeY');
          var volSizeZLocation = gl_surface.getUniformLocation(surface_program, 'volSizeZ');
          var surfaceIDLocation = gl_surface.getUniformLocation(surface_program, 'surfaceID');
          var surfaceIsoValueLocation = gl_surface.getUniformLocation(surface_program, 'isoValue');
          var transferFuncLocation = gl_surface.getUniformLocation(surface_program, 'transferFunc');
          var sliceX_minLocation = gl_surface.getUniformLocation(surface_program, 'slice_X_min');
          var sliceY_minLocation = gl_surface.getUniformLocation(surface_program, 'slice_Y_min');
          var sliceZ_minLocation = gl_surface.getUniformLocation(surface_program, 'slice_Z_min');


          gl_surface.uniform1f(sliceX_minLocation, sliceX_min);
          gl_surface.uniform1f(sliceY_minLocation, sliceY_min);
          gl_surface.uniform1f(sliceZ_minLocation, sliceZ_min); 
          gl_surface.uniform1f(ambientLocation, ambient);
          gl_surface.uniform1f(diffuseLocation, diffuse);
          gl_surface.uniform1f(shinessLocation, shiness);
          gl_surface.uniform1f(specularLocation, specular);
          gl_surface.uniform1i(IsOrthogonalLocation, IsOrthogonal);
          gl_surface.uniform1f(surfaceIDLocation, parseFloat(currentSurfaceID));
          gl_surface.uniform1f(surfaceIsoValueLocation, currentSurfaceValue);
          gl_surface.uniform1f(opacityLocation, 1.0);
          gl_surface.uniform1f(contrastLocation, contrast);
          gl_surface.uniform1f(sliceXLocation, sliceX);
          gl_surface.uniform1f(sliceYLocation, sliceY);
          gl_surface.uniform1f(sliceZLocation, sliceZ);
          gl_surface.uniform1f(volSizeXLocation, volSizeX);
          gl_surface.uniform1f(volSizeYLocation, volSizeY);
          gl_surface.uniform1f(volSizeZLocation, volSizeZ);
        
          gl_surface.activeTexture(gl_surface.TEXTURE2);
          gl_surface.bindTexture(gl_surface.TEXTURE_2D,surface_transferFuncTexture);
          gl_surface.uniform1i(transferFuncLocation,2);
  
    //   gl_surface.uniform3fv(colorLocation, color);
   
          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_verticesBuffer);
          gl_surface.bufferData(gl_surface.ARRAY_BUFFER, surface_vertices, gl_surface.STATIC_DRAW);
          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, null);

          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_normalBuffer);
          gl_surface.bufferData(gl_surface.ARRAY_BUFFER, surface_normals, gl_surface.STATIC_DRAW);
          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, null);

          gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, surface_indicesBuffer);
          gl_surface.bufferData(gl_surface.ELEMENT_ARRAY_BUFFER, surface_indices, gl_surface.STATIC_DRAW);
          gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, null);
   
          var coord = 0; 
          var coord1 = 1;
       // Bind vertex buffer object
          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_verticesBuffer);
          gl_surface.vertexAttribPointer(coord, 3, gl_surface.FLOAT, false, 0, 0);
          gl_surface.enableVertexAttribArray(coord);

          gl_surface.bindBuffer(gl_surface.ARRAY_BUFFER, surface_normalBuffer);
          gl_surface.vertexAttribPointer(coord1, 3, gl_surface.FLOAT, false, 0, 0);
          gl_surface.enableVertexAttribArray(coord1);

    
          gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, surface_indicesBuffer); 
             
          gl_surface.enable(gl_surface.DEPTH_TEST); 
          gl_surface.disable(gl_surface.BLEND);


     //   gl_surface.blendFuncSeparate(gl_surface.SRC_ALPHA,gl_surface.ONE_MINUS_SRC_ALPHA,gl_surface.SRC_COLOR,gl_surface.DST_COLOR); 
    //      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      
         if(drawVolume==1){
               document.getElementById('surface_spinner').style.visibility = "hidden";
               gl_surface.drawElements(gl_surface.TRIANGLES, surface_indices.length, gl_surface.UNSIGNED_SHORT,0);
         } 

 
        //  gl_surface.deleteProgram(program);
          updateSurfaceView = 0;

          glDrawSurfaceViewPort();
       }  
   
       requestAnimationFrame(glDrawSurface);   
       
}
function main() {

    console.log("main is called");
    $("#data").on('change', LoadVolumeData);
    gl = canvas.getContext('webgl2', {
        antialias: true
    });
   
    gl_surface = canvas_surface.getContext('webgl2', {
        antialias: true
    });
 //   if(!gl) gl = canvas.getContext('webgl');
//    if(!gl_surface) gl_surface = canvas_surface.getContext('webgl');
    initializeColorPicker();
    draw_panel();

    volumeSetupRC();
    surfaceSetupRC();
    interfaceParaInitialization();
    // draw volume 
   
    glDrawVolume();
    glDrawSurface();
    
  
    initHelp();
 //   LoadVolumeData();

}



