

// webgl canvas
var canvas = document.getElementById('webgl_volume');
var canvas_surface = document.getElementById('webgl_surface');
var output = document.getElementById('valor');
var box_showAxis = document.getElementById('show_Axis');
var gl;
var gl_surface;

var test = "null";
var dimDesc = "null";
var updateVolumeView = 0;
var updateSurfaceView = 0;
var mouseOncanvas = 0;
// volume and surface shader program

var vol_program;
var backface_program;
var vol_viewport_program;
var vol_border_program;
var vol_slice_program;
var vol_axis_program;
var surface_program;
var surface_border_program;
var surface_slice_program;
var surface_axis_program;
var surface_viewport_program;
//for trackball
var m_inc;
var m_curquat;
var m_mousex = 1;
var m_mousey = 1;

var trackballMove = false;
var rightbuttonMove = false;
var middlebuttonMove = false;

// If use orthogonal projection

var eye_pos = vec3(0.0, 0.0, 2.0);
var eye_up = vec3(0.0, 1.0, 0.0);
var eye_at = vec3(0.0, 0.0, -10.0);


// d3 parameters for color picker
var colorPickerNodes = new Array();
var colorArray = new Array();
var opacityNodes = new Array();
var opacityArray = new Array();
var transferFunc_ColorArray;
var focusNode;
var showAxis = 0;
//webgl parameters
var frameBuffer;
var currentAngle;
var vertices;
var vertices1;
var boundingBoxVertices;
var boundingBoxIndex;
var AxisVertices;
var AxisIndex;
var xAxisVertices;
var yAxisVertices;
var zAxisVertices;
var xAxisVerticesColor;
var yAxisVerticesColor;
var zAxisVerticesColor;

var yOzMinSliceVertex;
var xOzMinSliceVertex;
var xOyMinSliceVertex;

var yOzSliceVertex;
var xOzSliceVertex;
var xOySliceVertex;

// data for volume rendering

var density;
var backFaceTexture;
var depthTexture;

var volumeTexture;
var transferFuncTexture;

var axisColorBuffer;
var vertices_index, vertices_index1;
var texCord;
var verticePosBuffer;
var verticeTexCordBuffer;
var verticeIndexBuffer;
var boundingBoxVerticeBuffer;
var boundingBoxindexBuffer;
var sliceBoundaryVerticeBuffer;
var axisVerticeBuffer;
var axisIndexBuffer;

var transferFunc_data;
var transferFunc_large_data;

var surface_tfArray;
var transferFunc_large_data = new Float32Array(transferFuncRangel * 4);
var volume_data;

var vertexArray;
var vs_shader;
var fs_shader;
var volume_render_vs;
var volume_render_fs;
var viewPortVertices;
var viewPortBuffer;

var trans_Matrix;
var lookatMatrix;
var projMatrix;
var ctMatrix;
var scale_Matrix;
var inverse_MVmatrx;
var axis_mvMatrix;
var textureMatrix;

var scale_cof = 1.0;
var translateX = 0.0;
var translateY = 0.0;
var points = [];


var drawVolume = 0;
var IsOrthogonal = 0;
var MaxEdgeSize;
var volSizeX;
var volSizeY;
var volSizeZ;
var m_volCenter = new Float32Array(3);
var m_volOrigin = new Float32Array([-2.0,-2.0,-2.0]); 
// slicing boundary
var sliceBoundaryVertice;


//invariable parameters for volume rendering
var NumVertices = 36;
var LENGTH = 1;
var transferFuncRange = 9;
var transferFuncRangel = 1024;
var boundingLength = 0.000;
var refSampleRate;

// data for surface rendering

var surface_viewPortBuffer;
var surface_m_inc;
var surface_ctMatrix;
var surface_verticesBuffer;
var surface_normalBuffer;
var surface_indicesBuffer;
var surface_boundingBoxBuffer;
var surface_boundingBoxIndexBuffer;
var surface_slicePlaneBuffer;
var surface_axisVerticesBuffer;
var surface_slicePlaneBuffer;
var surface_axisColorBuffer;

var surface_transferFuncTexture;

var surface_axisBuffer;
var surface_trans_Matrix;

var surface_indices;
var surface_normals;
var surface_vertices;
var normalReady = 0;
var indiceReady = 0;
var verticesReady = 0;
var  isoValue = -999;

// interface parameters
var data_select = "";
var ambient;
var diffuse;
var sampleRate;
var shiness;
var specular;
var contrast;
var opacity;
var surface_color;
var sliceX_min = 0.0;
var sliceY_min = 0.0;
var sliceZ_min = 0.0;
var sliceX = 0.0;
var sliceY = 0.0;
var sliceZ = 0.0;
var arrow_size = 0.02;
var slice_distance = 0.01;
var axisLength = 0.2;
// preferred parameters
var preferred_ambient;
var preferred_diffuse;
var preferred_sampleRate;
var preferred_shiness;
var preferred_specular;
var preferred_constrast;
var preferred_transQuaterian = new Array();
var preferred_scale;
var preferred_translateX;
var preferred_translateY;
var widgetsSliderDivs;
// slider updated
var surface_slider = document.getElementById("slider_surface");
var translateX_slider = document.getElementById("slider_translateX");
var translateY_slider = document.getElementById("slider_translateY");
var scale_slider = document.getElementById("slider_scale");
var ambient_slider = document.getElementById('slider_ambient');
var diffuse_slider = document.getElementById('slider_diffuse');
var specular_slider = document.getElementById('slider_specular');
var shiness_slider = document.getElementById('slider_shiness');
var contrast_slider = document.getElementById('slider_contrast');
var sampleRate_slider = document.getElementById('slider_sampleRate');
var sliceX_max_slider = document.getElementById('slider_sliceX');
var sliceY_max_slider = document.getElementById('slider_sliceY');
var sliceZ_max_slider = document.getElementById('slider_sliceZ');
var sliceX_min_slider = document.getElementById('slider_sliceX_min');
var sliceY_min_slider = document.getElementById('slider_sliceY_min');
var sliceZ_min_slider = document.getElementById('slider_sliceZ_min');

ambient_slider.oninput = function(){
      ambient = this.value;
    
      updateVolumeView = 1;
      updateSurfaceView = 1; 
}

specular_slider.oninput = function(){
      specular = this.value;
    
      updateVolumeView = 1;
      updateSurfaceView = 1; 
}

diffuse_slider.oninput = function(){
      diffuse = this.value;
    
      updateVolumeView = 1;
      updateSurfaceView = 1; 
}
shiness_slider.oninput = function(){
      shiness = this.value;
    
      updateVolumeView = 1;
      updateSurfaceView = 1; 
}
contrast_slider.oninput = function(){
      contrast = this.value;
    
      updateVolumeView = 1;
      updateSurfaceView = 1; 
}
sampleRate_slider.oninput = function(){
      sampleRate = this.value;
    
      updateVolumeView = 1;  
}
translateX_slider.oninput = function(){
    translateX = this.value;
    var temp = parseInt(translateX * 1000);
    translateX = parseFloat(temp/1000);
  
    updateVolumeView = 1;
    updateSurfaceView = 1;   
}
translateY_slider.oninput = function(){
     translateY = this.value;
     temp = parseInt(translateY * 1000);
     translateY = parseFloat(temp/1000); 
   
     updateVolumeView = 1;
     updateSurfaceView = 1;  
}
scale_slider.oninput = function(){
    scale_cof = this.value;
    temp = parseInt(scale_cof * 1000);
    scale_cof = parseFloat(temp/1000);
   
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceX_max_slider.oninput = function(){
    if(this.value <= sliceX_min){
        var temp = +sliceX_min_slider.value + 0.1;
        this.value =temp;
    }
    sliceX = this.value;
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceY_max_slider.oninput = function(){
    if(this.value <=sliceY_min){
        var temp = +sliceY_min_slider.value + 0.1;
        this.value = temp;
    }
    sliceY = this.value;
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceZ_max_slider.oninput = function(){
    if(this.value <=sliceZ_min){
        var temp = +sliceZ_min_slider.value + 0.1;
        this.value = temp;
    }
    sliceZ = this.value;
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceX_min_slider.oninput = function(){
    if(this.value >= sliceX){
        var temp = +sliceX_max_slider.value - 0.1;
        this.value = temp;
    }
    sliceX_min = this.value;
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceY_min_slider.oninput = function(){
    if(this.value >= sliceY){
        var temp = +sliceY_max_slider.value - 0.1;
        this.value = temp;
    }
    sliceY_min = this.value;
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
sliceZ_min_slider.oninput = function(){
    if(this.value >= sliceZ){
        var temp = +sliceZ_max_slider.value - 0.1;
        this.value = temp;
    }
    sliceZ_min = this.value;
    this.title = sliceZ_min.toString();
    updateVolumeView = 1;
    updateSurfaceView = 1;  
}
box_showAxis.onclick = function(){
        if(box_showAxis.checked)showAxis = 1;
        else showAxis = 0;
       updateVolumeView = 1;
       updateSurfaceView = 1; 
      //  console.log(showAxis);
}

function updateAllParameters()
{
    sliceX = parseFloat($('#slider_sliceX').val());
    sliceX_min = parseFloat($('#slider_sliceX_min').val());
    sliceY = parseFloat($('#slider_sliceY').val());
    sliceY_min = parseFloat($('#slider_sliceY_min').val());
    sliceZ = parseFloat($('#slider_sliceZ').val());
    sliceZ_min = parseFloat($('#slider_sliceZ_min').val());
    ambient = parseFloat($('#slider_ambient').val());
    diffuse = parseFloat($('#slider_diffuse').val());
    specular = parseFloat($('#slider_specular').val());
    contrast = parseFloat($('#slider_contrast').val());
    shiness =parseFloat($('#slider_shiness').val());
    translateX = parseFloat($('#slider_translateX').val());
    translateY = parseFloat($('#slider_translateY').val());
    scale_cof = parseFloat($('#slider_scale').val());
    sampleRate = parseFloat($('#slider_sampleRate').val());
    
}
function volumeSetupRC() {

    document.οncοntextmenu=function(e){return false;};

    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('WEBGL_depth_texture');
    
    
    vol_program = initShaders(gl, "vol_vertexShader", "vol_fragmentShader");
    backface_program = initShaders(gl, "BackFace_VertexShader", "BackFace_FragmentShader");
    vol_border_program = initShaders(gl, "boundingBox_vertexShader", "boundingBox_fragmentShader");
    vol_viewport_program = initShaders(gl, "viewPort_vertexShader", "viewPort_fragmentShader");
    vol_axis_program = initShaders(gl, "Axis_vertexShader", "Axis_fragmentShader");
    vol_slice_program = initShaders(gl, "slice_vertexShader", "slice_fragmentShader");

    surface_border_program = initShaders(gl_surface, "boundingBox_vertexShader", "boundingBox_fragmentShader");
    surface_viewport_program = initShaders(gl_surface, "viewPort_vertexShader", "viewPort_fragmentShader");
    surface_axis_program = initShaders(gl_surface, "Axis_vertexShader", "Axis_fragmentShader");
    surface_slice_program = initShaders(gl_surface, "slice_vertexShader", "slice_fragmentShader");
    surface_program = initShaders(gl_surface, "surface_VertexShader", "surface_FragmentShader");
    //  init texture and frameBuffer;

    gl.activeTexture(gl.TEXTURE2);
    transferFuncTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, transferFuncTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, Math.log2(transferFuncRange));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.activeTexture(gl.TEXTURE0);
    backFaceTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, backFaceTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

   
 //  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texStorage2D(gl.TEXTURE_2D, 1,  gl.RGBA32F,canvas.width, canvas.height);   
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, canvas.width, canvas.height, gl.RGBA, gl.FLOAT, null);
//    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, canvas.width, canvas.height, 0, gl.RGBA, gl.FLOAT, null);
 // texStorage2D may work better in FireFox ?    

    gl.activeTexture(gl.TEXTURE3);
    depthTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texStorage2D(gl.TEXTURE_2D, 1,  gl.DEPTH_COMPONENT16, canvas.width, canvas.height);   
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, canvas.width, canvas.height, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);

 //   gl.texImage2D(gl.TEXTURE_2D,0,gl.DEPTH_COMPONENT16,canvas.width,canvas.height,0,gl.DEPTH_COMPONENT,gl.UNSIGNED_SHORT,null);

    frameBuffer = gl.createFramebuffer();


   
    
//    var frameBuffer1 = gl.createFramebuffer();
    
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, frameBuffer);
    gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, backFaceTexture, 0);

    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

    


    var status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
        console.log('fb status: ' + status.toString(16));
        return;
    }

    m_curquat = trackball(0, 0, 0, 0);

    // set up data 

    vertices1 = new Float32Array(16);

    xAxisVertices = new Float32Array([
    -0.5, -0.5, -0.5,
    -0.5 + axisLength,-0.5,-0.5,
    -0.5 + axisLength,-0.5,-0.5,
    -0.5 + axisLength - arrow_size,-0.5,-0.5 + arrow_size,
    -0.5 + axisLength,-0.5,-0.5,
    -0.5 + axisLength - arrow_size,-0.5,-0.5 - arrow_size,
    ])
    yAxisVertices = new Float32Array([
    -0.5, -0.5, -0.5,
    -0.5,-0.5 + axisLength,-0.5,
    -0.5 ,-0.5+ axisLength,-0.5,
    -0.5+ arrow_size,-0.5 + axisLength - arrow_size,-0.5 ,
     -0.5 ,-0.5+ axisLength,-0.5,
    -0.5- arrow_size ,-0.5+ axisLength- arrow_size,-0.5 ,
    ])
    zAxisVertices = new Float32Array([
    -0.5, -0.5, -0.5,
    -0.5,-0.5 ,-0.5+ axisLength,
    -0.5 ,-0.5,-0.5+ axisLength,
    -0.5 + arrow_size,-0.5 ,-0.5+ axisLength - arrow_size,
    -0.5 ,-0.5,-0.5+ axisLength,
    -0.5 -arrow_size ,-0.5,-0.5 + axisLength- arrow_size,
    ])
    xAxisVerticesColor = new Float32Array([
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    ])
    yAxisVerticesColor = new Float32Array([
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    ])
    zAxisVerticesColor = new Float32Array([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    ])
    viewPortVertices = new Float32Array([
    -1.0,-1.0,0.5,1.0,
     1.0,-1.0,0.5,1.0,
    -1.0,-1.0,0.5,1.0,
    -1.0,1.0,0.5,1.0,
     1.0,-1.0,0.5,1.0,
     1.0, 1.0,0.5,1.0,
     -1.0,1.0,0.5,1.0,
     1.0,1.0,0.5,1.0
    ])
    

    boundingBoxIndex = new Uint16Array([0, 1, 0, 3, 0, 4, 1, 2, 1, 5, 2, 3, 2, 6, 3, 7, 4, 5, 4, 7, 5, 6, 6, 7]);
    
    vertices_index = new Uint16Array([
     1, 0, 3,
     1, 3, 2,
     2, 3, 7,
     2, 7, 6, 
     3, 0, 4,
     3, 4, 7,
     2, 5, 1,
     2, 6, 5,
     5, 7, 4,
     5, 6, 7, 
     1, 4, 0,
     1, 5, 4, 
     ]);
    vertices_index1 = new Uint16Array([0,1,3,2,1,5,7,3,4,6,7,5,0,2,6,4,0,4,5,1,2,3,7,6]);
    texCord = new Float32Array([0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, ]);

    // Init Buffer
    verticePosBuffer = gl.createBuffer();

    viewPortBuffer = gl.createBuffer();

    verticeTexCordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticeTexCordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCord, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    verticeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertices_index, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    axisVerticeBuffer = gl.createBuffer();
   
    axisColorBuffer = gl.createBuffer();

    axisIndexBuffer = gl.createBuffer();
   
    sliceBoundaryVerticeBuffer = gl.createBuffer();

    boundingBoxVerticeBuffer = gl.createBuffer();

    boundingBoxindexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boundingBoxindexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, boundingBoxIndex, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    canvas.addEventListener("mousedown", function(event) {
       if (event.defaultPrevented) return;
       if(event.button == 0){
             m_mousex = event.clientX - event.target.getBoundingClientRect().left;
             m_mousey = event.clientY - event.target.getBoundingClientRect().top;
            trackballMove = true;
       }
       else if(event.button == 2){
          
           m_mousex = event.clientX - event.target.getBoundingClientRect().left;   
           m_mousey = event.clientY - event.target.getBoundingClientRect().top;  
           rightbuttonMove = true;
            
       }
       else if(event.button == 1){
           m_mousex = event.clientX - event.target.getBoundingClientRect().left;   
           m_mousey = event.clientY - event.target.getBoundingClientRect().top;  
           middlebuttonMove = true;    
       }
    });
 
    // for trackball
    canvas.addEventListener("mouseup", function(event) {
          
       if(event.button == 0) trackballMove = false;
       else if(event.button == 2) rightbuttonMove = false; 
       else if(event.button == 1) middlebuttonMove = false;  
    });

    // for trackball
    canvas.addEventListener("mousemove", function(event) {
        
        var x = event.clientX - event.target.getBoundingClientRect().left;
        var y = event.clientY - event.target.getBoundingClientRect().top;
        
        document.getElementById('volumeTip').innerHTML = "Use mouse left button for rotation, middle button or W, A, S, and D keys for translation, and right button or touchpad for scaling." ;
      
        if (trackballMove)  mouseMotion(x, y);

        if(trackballMove||rightbuttonMove||middlebuttonMove){
            updateVolumeView = 1;
            updateSurfaceView = 1; 
        }
        
        if(rightbuttonMove){
             if (m_mousex != x || m_mousey != y){  
                 var dirtX = x - m_mousex;
                 var dirtY = m_mousey - y;
                 var max = dirtX > dirtY ? dirtX:dirtY;
                 var t = dirtY/500;
                 scale_cof *= (1.0 - t);  
                 m_mousey = y; 
             }
          //   else if(scale_cof>3.0)scale_cof = 3.0;
             if (scale_cof < 0.5)
                 scale_cof = 0.5;
                 scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
                scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
                scale_slider.value = scale_cof; 
        }
        if(middlebuttonMove){      
              if (m_mousex != x || m_mousey != y){
                    translateX += (x - m_mousex) * 0.005;
                    translateY += (m_mousey - y) * 0.005;
                    translateX = translateX > 0.5 ? 0.5:translateX;
                    translateX = translateX < -0.5 ? -0.5:translateX; 
                    translateY = translateY > 0.5 ? 0.5:translateY;
                    translateY = translateY < -0.5 ? -0.5:translateY; 
                    translateX_slider.value = translateX;
                    translateY_slider.value = translateY;
                   // updateAllParameters();
               }   
               m_mousex = x;
               m_mousey = y;
        }
    });
    window.onkeydown = function(event){
       if(mouseOncanvas==1){ 
        switch (event.keyCode){      
                    case 87:                  
                        translateY += 0.1;
                        break;
                    case 83:
                        translateY -= 0.1;
                        break;
                    case 65:
                        translateX -= 0.1;
                        break;
                    case 68:
                        translateX += 0.1;
                        break;
        }
         translateX = translateX > 0.5 ? 0.5:translateX;
         translateX = translateX < -0.5 ? -0.5:translateX; 
         translateY = translateY > 0.5 ? 0.5:translateY;
         translateY = translateY < -0.5 ? -0.5:translateY; 
         slider_translateX.value = translateX;
         slider_translateY.value = translateY;
         updateVolumeView = 1;
         updateSurfaceView = 1;
       }
    }
     canvas.addEventListener("mouseout", function(event) {
       if (event.defaultPrevented) return;
        document.getElementById('volumeTip').innerHTML = "";
    });
 
    
    $('#item1').click(function() {
        IsOrthogonal = 1;
        updateVolumeView = 1;
        updateSurfaceView = 1;
    });
    $('#item2').click(function() {
        IsOrthogonal = 0;
        updateVolumeView = 1;
        updateSurfaceView = 1;
    });
    $('#item3').click(function() {
        showAxis = 1;
        updateVolumeView = 1;
        updateSurfaceView = 1;
    });
    $('#item4').click(function() {
        showAxis = 0;
        updateVolumeView = 1;
        updateSurfaceView = 1;
    });
    $(window).mousedown(function(e){
      e = window.event || e;
//      alert(e.which || e.button)
      if( e.which == 2 ||e.which == 3){
      if (e.preventDefault) {
             e.preventDefault();
      } else {
             e.returnValue = false;
        }
         return false;
    }
    });
 //   window.onresize = function(){};
    
    $(window).mousemove(function(e){
         e = window.event || e;
         if(IsMouseOnCanvas(e) == false){
            trackballMove = false;
            rightbuttonMove = false;
            middlebuttonMove = false;
            mouseOncanvas = 0;
         }
         else mouseOncanvas = 1;
    });

    window.oncontextmenu = function () {
        return false;
    }
    window.onselectstart = function(){
        return false;
    }
    window.ondragstart = function(){
        return false;
    }
   
  
    canvas.onmousewheel = function(event) {
      event = event || window.event;
      if (event.preventDefault)event.preventDefault();
      event.returnValue = false;
     // console.log(event.deltaY);
      var t = event.deltaY/500;
      scale_cof *= (1.0 - t);  
      if (scale_cof < 0.5)scale_cof = 0.5;
      scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
      scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
      scale_slider.value = scale_cof; 
      updateVolumeView = 1;
      updateSurfaceView = 1;
    };
  // For FireFox
   canvas.addEventListener("DOMMouseScroll", function (event) {
      event = event || window.event;
      if (event.preventDefault)event.preventDefault();
      event.returnValue = false;
       //  console.log(event.detail);
       var t = event.detail/100;
       scale_cof *= (1.0 - t); 
       if (scale_cof < 0.5)scale_cof = 0.5;
       scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
       scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
       scale_slider.value = scale_cof; 
       updateVolumeView = 1;
       updateSurfaceView = 1;
    });
  //  window.onresize
 }
 // set up one slider's value displaying effect
function setupEachSlider(sliderDivName) {
  var sliderDiv = $(sliderDivName),
    slider = $('input', sliderDiv),
    valueText = $('.sliderValue', sliderDiv),
    thumbwidth = 20;

  function setTooltip() {
    var value = slider.val();
    var percent = (value - slider.attr('min'))/(slider.attr('max') - slider.attr('min'));
    var thumbCorrect = thumbwidth * (percent - 0.5) * -1,
      textPos = Math.round((percent * slider.width()) - thumbwidth/4 + thumbCorrect);
    valueText.css('left', textPos);
    valueText.css('top', 25);
    valueText.css('width', 32);
    valueText.text(value);
  }

  function setSliderEvent() {
    slider.on('input.slider change.slider keyup.slider', function() {
      setTooltip();
     // updateAllParameters();
      updateVolumeView = 1;
      updateSurfaceView = 1; 
      valueText.css('visibility', 'visible');
    });
    slider.on('mouseover.slider', function() {
      setTooltip();
      valueText.css('visibility', 'visible');
    });

    slider.on('mouseout.slider', function() {
      valueText.css('visibility', 'hidden');
    //  updateVolumeView = 0;
    //  updateSurfaceView = 0;
    });

    // when window size changes
    $(window).on('resize.slider', function() {
      setTooltip();
    });
  }


  setSliderEvent();

}
 function interfaceParaInitialization()
 {
    widgetsSliderDivs = ['#SliceX', '#SliceX_min', '#SliceY', '#SliceY_min', '#SliceZ', '#SliceZ_min','#Ambient','#Diffuse','#Specular','#Shiness','#Contrast','#translateX','#translateY','#scale','#SamplingRate'];
    $.each(widgetsSliderDivs, function(index, sliderDiv){
      setupEachSlider(sliderDiv);
    });
    ambient = (document.getElementById('slider_ambient')).value;
    diffuse = (document.getElementById('slider_diffuse')).value;
    sampleRate = (document.getElementById('slider_sampleRate')).value;
    specular = (document.getElementById('slider_specular')).value;
    shiness = (document.getElementById('slider_shiness')).value;
    contrast = (document.getElementById('slider_contrast')).value;
    sliceX = (document.getElementById('slider_sliceX')).value;
    sliceY = (document.getElementById('slider_sliceY')).value;
    sliceZ = (document.getElementById('slider_sliceZ')).value;
    sliceX_min = (document.getElementById('slider_sliceX_min')).value;
    sliceY_min = (document.getElementById('slider_sliceY_min')).value;
    sliceZ_min = (document.getElementById('slider_sliceZ_min')).value;
    
 
 }
function surfaceSetupRC()
{
    gl_surface.getExtension('OES_texture_float');
    gl_surface.getExtension('OES_texture_float_linear');
    gl_surface.getExtension('EXT_color_buffer_float');

    surface_viewPortBuffer = gl_surface.createBuffer();
    surface_normalBuffer = gl_surface.createBuffer();
    surface_indicesBuffer = gl_surface.createBuffer();
    surface_verticesBuffer  = gl_surface.createBuffer();
    surface_boundingBoxBuffer = gl_surface.createBuffer();
    surface_boundingBoxIndexBuffer = gl_surface.createBuffer();
    surface_slicePlaneBuffer = gl_surface.createBuffer();
    surface_axisVerticesBuffer = gl_surface.createBuffer();
    surface_slicePlaneBuffer = gl_surface.createBuffer();
    surface_axisColorBuffer = gl_surface.createBuffer();
   
    gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, surface_boundingBoxIndexBuffer);
    gl_surface.bufferData(gl_surface.ELEMENT_ARRAY_BUFFER, boundingBoxIndex, gl_surface.STATIC_DRAW);
    gl_surface.bindBuffer(gl_surface.ELEMENT_ARRAY_BUFFER, null);

    gl_surface.activeTexture(gl_surface.TEXTURE2);
    surface_transferFuncTexture = gl_surface.createTexture();
    gl_surface.bindTexture(gl_surface.TEXTURE_2D, surface_transferFuncTexture);
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_BASE_LEVEL, 0);
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_MAX_LEVEL, Math.log2(transferFuncRange));
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_WRAP_S, gl_surface.CLAMP_TO_EDGE);
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_WRAP_T, gl_surface.CLAMP_TO_EDGE);
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl_surface.texParameteri(gl_surface.TEXTURE_2D, gl_surface.TEXTURE_MAG_FILTER, gl_surface.LINEAR);


    canvas_surface.addEventListener("mousedown", function(event) {
       if (event.defaultPrevented) return;
       if(event.button == 0){
             m_mousex = event.clientX - event.target.getBoundingClientRect().left;
             m_mousey = event.clientY - event.target.getBoundingClientRect().top;
            trackballMove = true;
       }
       else if(event.button == 2){
          
           m_mousex = event.clientX - event.target.getBoundingClientRect().left;   
           m_mousey = event.clientY - event.target.getBoundingClientRect().top;  
           rightbuttonMove = true;
            
       }
       else if(event.button == 1){
           m_mousex = event.clientX - event.target.getBoundingClientRect().left;   
           m_mousey = event.clientY - event.target.getBoundingClientRect().top;  
           middlebuttonMove = true;    
       }
    });
 
    // for trackball
    canvas_surface.addEventListener("mouseup", function(event) {
          
       if(event.button == 0) trackballMove = false;
       else if(event.button == 2) rightbuttonMove = false; 
       else if(event.button == 1) middlebuttonMove = false;  
    });

    // for trackball
    canvas_surface.addEventListener("mousemove", function(event) {
        
        var x = event.clientX - event.target.getBoundingClientRect().left;
        var y = event.clientY - event.target.getBoundingClientRect().top;
        
        document.getElementById('volumeTip').innerHTML = "Use mouse left button for rotation, middle button or W, A, S, and D keys for translation, and right button or touchpad for scaling.";
            
        if (trackballMove) mouseMotion(x, y);
              
        if(trackballMove||rightbuttonMove||middlebuttonMove){
            updateVolumeView = 1;
            updateSurfaceView = 1; 
        }

        if(rightbuttonMove){
             if (m_mousex != x || m_mousey != y){  
                 var dirtX = x - m_mousex;
                 var dirtY = m_mousey - y;
                 var max = dirtX > dirtY ? dirtX:dirtY;
                 var t = dirtY/500;
                 scale_cof *= (1.0 - t);  
                 m_mousey = y; 
             }
          //   else if(scale_cof>3.0)scale_cof = 3.0;
             if (scale_cof < 0.5)
                 scale_cof = 0.5;
                 scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
                 scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
                 scale_slider.value = scale_cof; 
        }
        if(middlebuttonMove){      
              if (m_mousex != x || m_mousey != y){
                    translateX += (x - m_mousex) * 0.005;
                    translateY += (m_mousey - y) * 0.005;
                    translateX = translateX > 0.5 ? 0.5:translateX;
                    translateX = translateX < -0.5 ? -0.5:translateX; 
                    translateY = translateY > 0.5 ? 0.5:translateY;
                    translateY = translateY < -0.5 ? -0.5:translateY; 
                    translateX_slider.value = translateX;
                    translateY_slider.value = translateY;
               }
               m_mousex = x;
               m_mousey = y;
        }
    });
    canvas_surface.onmousewheel = function(event) {
        event = event || window.event;
        if (event.preventDefault)event.preventDefault();
        event.returnValue = false;
        console.log(event.deltaY);
        var t = event.deltaY/500;
        scale_cof *= (1.0 - t); 
        if (scale_cof < 0.5)scale_cof = 0.5;
        scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
        scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
        scale_slider.value = scale_cof;        
        updateVolumeView = 1;
        updateSurfaceView = 1;
    };
     canvas_surface.addEventListener("DOMMouseScroll", function (event) {
        event = event || window.event;
        if (event.preventDefault)event.preventDefault();
        event.returnValue = false;
        //  console.log(event.detail);
        var t = event.detail/100;
        scale_cof *= (1.0 - t); 
        if (scale_cof < 0.5)scale_cof = 0.5;
        scale_Matrix[0] = scale_Matrix[5] = scale_Matrix[10] = scale_cof;
        scale_cof = scale_cof > 5.0 ? 5.0: scale_cof;   
        scale_slider.value = scale_cof; 
        updateVolumeView = 1;
        updateSurfaceView = 1;
    });

    canvas_surface.addEventListener("mouseout", function(event) {
       if (event.defaultPrevented) return;
        document.getElementById('volumeTip').innerHTML = "";
    });  
    var cuttingPlaneDiv = document.getElementById('Cutting Plane');
    cuttingPlaneDiv.onmousemove =  function() {
        document.getElementById('volumeTip').innerHTML = "Max and min Cutting Plane should never cross each other (X (max) > X (min), etc).";                
    };  
    cuttingPlaneDiv.onmouseout =  function() {
        document.getElementById('volumeTip').innerHTML = " ";                
    };  
    var resetButton =  document.getElementById('Reset');
    resetButton.onmousemove =  function() {
        document.getElementById('volumeTip').innerHTML = "Reset all parameters to default settings.";                
    };
    resetButton.onmouseout =  function() {
        document.getElementById('volumeTip').innerHTML = " ";                
    };        
}
