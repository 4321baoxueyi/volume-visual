let questionInputs = '<input id="${this.aId}" name="question${this.qNum}" type="${this.qType}" label="${this.qOption}">&#9; ${this.qOption}<br>';
// let textArea = '<textarea id="${this.qNum}" style="width:100%;" rows="6" placeholder="${this.qPlaceholder}"></textarea>';
let textArea = '<textarea id="${this.qNum}" style="width:100%;" rows="6" placeholder="Briefly state your answer and explain your decision."></textarea>';
let selectHint = '<i class="hint">To answer this question, select the corresponding node in the graph and press next</i>';
let questionnaireRow = '<div class="row question rounded ${this.class}" align="center">' +
  '    <div class="col-md-8" align="left">' +
  '      ${this.question}' +
  '    </div>' +
  '    <div class="col-md-1">' +
  '      <input type="radio" name="radio" value="1">' +
  '    </div>' +
  '    <div class="col-md-1">' +
  '      <input type="radio" name="radio" value="2">' +
  '    </div>' +
  '    <div class="col-md-1">' +
  '      <input type="radio" name="radio" value="3">' +
  '    </div>' +
  '    <div class="col-md-1">' +
  '      <input type="radio" name="radio" value="4">' +
  '    </div>' +
  '  </div>';

const QUESTION_TYPE = {
  SINGLE: 'radio',
  MULTI: 'checkbox',
  TEXT: 'text',
  SELECT: 'node',
  PARA: 'parameters'
};



window.onload= main();
function fillTemplate(templateString, templateVars)
{
  return new Function("return `"+templateString +"`;").call(templateVars);
}


function TRACE(x)
{

  return x;
}


function Answer(user, quizId, questionNum, submission, questionText, meta)
{
  this.user = user;
  this.quizId = quizId;
  this.questionNum = questionNum;
  this.questionText = questionText;
  this.submission = submission;
  this.meta = meta;
  this.createRequest = function()
  {
    return {
      "username": this.user,
      "quiz_id": this.quizId,
      "question_number": this.questionNum,
      "question_text": this.questionText,
      "submission": this.submission,
      "metadata": this.meta
    }
  }
}

function Question(jsonObject)
{
  this.text = jsonObject.text;
  this.options = jsonObject.options;
  this.type = jsonObject.type;
  this.image = jsonObject.image === undefined ? null : jsonObject.image;
  this.light  = jsonObject.light === undefined ? null : jsonObject.light;
  this.view  = jsonObject.view === undefined ? null : jsonObject.view;
  this.color  = jsonObject.color === undefined ? null : jsonObject.color;
  this.cutting  = jsonObject.cutting === undefined ? null : jsonObject.cutting;
  this.opacity = jsonObject.opacity === undefined ? null : jsonObject.opacity;
  this.resource = jsonObject.resource === undefined ? null : jsonObject.resource;
  this.isovalue = jsonObject.isovalue === undefined ? null : jsonObject.isovalue;
  this.surface = jsonObject.surface === undefined ? null : jsonObject.surface;
  this.hasVolume = this.resource !== null;
  this.hasImage = this.image !== null;
  this.light = this.light!== null;
  this.view = this.view!== null;
  this.color = this.color!== null;
  this.opacity = this.opacity!== null;
  this.surface = this.surface!== null;
  this.cutting = this.cutting!== null;
  defaultLight = this.light;
  defaultView = this.view;
  defaultColor = this.color;
  defaultOpacity = this.opacity;
  defaultSurface = this.surface;

  defaultIsovalue = this.isovalue === null? null:+this.isovalue;

}

function clickEvent(e, quiz)
{
  let currentQuestion = +$("#questionId").text();
  console.log("currentQ: " + currentQuestion);
  e.preventDefault();
  let answer = updateAnswer(quiz, currentQuestion);
  if (answer !== null)
  {
    sendAnswer(quiz, answer, currentQuestion);
    answer.submission = [];
  }
}
let ParaAlreadySaved = 1; 
function recordParameters(submissions)
{
  var parameters = {};
  parameters.RESOURCE = resource;
  parameters.AMBIENT = ambient;
  parameters.DIFFUSE = diffuse;
  parameters.SHINESS = shiness;
  parameters.SPECULAR = specular;
  parameters.CONTRAST = contrast;
  parameters.XMAX = sliceX;
  parameters.YMAX = sliceY;
  parameters.ZMAX = sliceZ;
  parameters.XMIN = sliceX_min;
  parameters.YMIN = sliceY_min;
  parameters.ZMIN = sliceZ_min;
  parameters.TX = translateX;
  parameters.TY = translateY;
  parameters.SCALE = scale_cof;
  parameters.SAMPLERATE = sampleRate;
  parameters.REFSAMPLERATE = refSampleRate;
  parameters.ORTHOGONAL = IsOrthogonal;
  
  parameters.QUATERIN = {};
  for(var i = 0;i<m_curquat.length;i++)parameters.QUATERIN[i] = m_curquat[i];
 
  parameters.COLORPOINTS = {};
  for(var i = 0;i<colorPickerNodes.length;i++){
    parameters.COLORPOINTS[i] ={};
    parameters.COLORPOINTS[i].color = d3.rgb(colorPickerNodes[i].color);
    parameters.COLORPOINTS[i].cx = colorPickerNodes[i].cx;
  }
  
  parameters.OPACITYPOINTS = {};
  for(var i = 0;i<opacityNodes.length;i++)parameters.OPACITYPOINTS[i] = opacityNodes[i];
  
  submissions.push(parameters);
  ParaAlreadySaved = 1;

}
function updateAnswer(quiz, questionNumber)
{
  let question = quiz.questions[questionNumber];
  let submissions = [];
   
  if(question.type == QUESTION_TYPE.PARA)
     if(ParaAlreadySaved==0)recordParameters(submissions); 

  if (question.type === QUESTION_TYPE.TEXT) {
       let submission = document.getElementById(questionNumber).value;
        if (submission !== "")
        {
          submissions.push(submission);
        }
    } else if (question.type === QUESTION_TYPE.SINGLE || question.type === QUESTION_TYPE.MULTI) {
      for (let i = 0; i < question.options.length; i++) {
        let selection = document.getElementById(i.toString());
        if (selection.checked) {
          submissions.push(selection.getAttribute('label'));
        }
       }
    }
  let answer = null;
  if (validateAnswer(quiz, questionNumber, submissions))
  {
    let endTime = (new Date()).getTime();
    let timeDiff = (endTime-startTime)/1000;
    answer = new Answer("mimre", TRACE(quiz.quizId), questionNumber, submissions, question.text,  {'time' : timeDiff});
  }
  return answer;
}

function validateAnswer(quiz, question_number, submissions)
{
  let q = quiz.questions[question_number];
  let ret = true;
  if (submissions.length === 0)
  {
    ret = confirm("The question has not been answered. Proceed anyway?");
  }
  return ret;
}
function loadQuizVolumeData()
{
    drawVolume = 0;
    
    isoValue = -999;
   
    currentSurfaceID = 0.0;
    document.getElementById('slider_surface').value = 0.0;

    document.getElementById('volume_spinner').style.visibility = "visible";
   
    var filepath1 = "./transfunc/";
    var tf_color_filepath = filepath1 + resource  + "_color.txt";
    tf_color_filepath.slice(0,tf_color_filepath.indexOf("_"));
    var tf_opacity_filepath = filepath1  + resource + "_opacity.txt";
    filepath1 += resource;
   
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
    filepath += resource;
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
             oReq = null;
             document.getElementById('volume_spinner').style.visibility = "hidden";
        
        }
    }
   oReq.send(null);
   if(defaultIsovalue!=null) {
     isoValue = defaultIsovalue;
     document.getElementById('slider_surface').value = isoValue;
     document.getElementById('slider_surface').title = isoValue;
     document.getElementById('surfaceIndex').style.opacity = 0.5;
     document.getElementById('slider_surface').disabled = true;
     document.getElementById('surfaceIndex').innerHTML = "Isovalue" + " (" + (currentSurfaceID + 1) + "/1" + ")";
   }
   else {
     surface_slider.onchange();
     document.getElementById('surfaceIndex').style.opacity = 1.0;
     document.getElementById('slider_surface').disabled = false;
   }
   
   updateDataDescription();
}
function loadQuestionImage(type)
{
   var canvas = document.getElementById('image_canvas');
   var context = canvas.getContext("2d");
   var img = new Image();
   var filepath = "./quiz-image/";
   filepath += resource + "1.png";
   img.src = filepath;

   $('#image1_spinner').css('display', 'block');
   $('#image_canvas').css('display', 'block');
   context.clearRect(0, 0, canvas.width, canvas.height);
   

   img.onload = function(){
    context.drawImage(this, 0, 0,512,512);
    $('#image1_spinner').css('display', 'none');
   }
   if(type=='text'){
      var canvas2 = document.getElementById('image_canvas2');
      var context2 = canvas2.getContext("2d");
      var img2 = new Image();
       filepath = "./quiz-image/";
       filepath += resource + "2.png";
      img2.src = filepath;

      context2.clearRect(0, 0, canvas.width, canvas.height);
      $('#image2_spinner').css('display', 'block');
      $('#image_canvas2').css('display', 'block');

      img2.onload = function(){
          context2.drawImage(this, 0, 0,512,512);
          $('#image2_spinner').css('display', 'none');
          $('#image_canvas2').css('display', 'block');
       } 
     //  $('#image_canvas2').css('display', 'block');
       $('#volumeContainer').css('display', 'none');
       $('#ViewSwitcherDiv').css('display', 'none');
       $('#questionInsideDiv').attr('class', 'col-lg-10');
       $('#referenceImage').attr('class','col-lg-5 ml-5');
       $('#referenceImage2').attr('class','col-lg-5 ml-5');
   //    $('#sidebarInsideDiv').css('display', 'none');
   }
   else  $('#image_canvas2').css('display', 'none'); 

}

function printQuestion(quiz, question_num)
{
  startTime = (new Date()).getTime();
  console.warn("showing question " + question_num);

 
   
  while(timeouts.length > 0)
  {
    clearTimeout(timeouts.pop());
  }
  let q = new Question(quiz.questions[question_num]);
  console.log({quiz, q});
  let contents = ''; // where question's html is stored
  if (q.type === 'checkbox')
  {
    q.text += "<br />Select all applicable answers.";
  }
  contents += '<p>' + q.text + '</p>';

  if (q.type === 'radio' || q.type === 'checkbox')
  {
    for (let i = 0; i < q.options.length; i++)
    {
      contents += fillTemplate(questionInputs, {aId: i, qNum: question_num, qType: q.type, qOption:q.options[i]});
    }
  } else if (q.type === 'text')
  {
    contents += fillTemplate(textArea, {qNum: question_num, qPlaceholder: q.placeholder});
  } else if (q.type === 'node')
  {
    contents += selectHint;
  }
  else contents += "";


  contents += '<hr>';
  let colSize = 'col-lg-6';
  let volumeContainerDisplay = 'block';
  if (!q.hasVolume)
  {
    volumeContainerDisplay = 'none';

    colSize = 'col-lg-10';
  }
  
   $('#image1_spinner').css('display', 'none');
   $('#image2_spinner').css('display', 'none');

  $('#volumeContainer').css('display', volumeContainerDisplay);
  $('#ViewSwitcherDiv').css('display', volumeContainerDisplay);
  $('#sidebarInsideDiv').css('display', volumeContainerDisplay);
  $('#questionInsideDiv').attr('class', colSize);
  if(q.hasVolume){
      resource = q.resource;
    if(q.type!='text'||!q.hasImage)loadQuizVolumeData(resource);
    else updateDataDescription();
  }
  if(q.hasVolume&&q.type!='parameters'&&q.hasImage) $('#sidebarIntroDiv').css('display', 'none');
  else $('#sidebarIntroDiv').css('display', 'block');
  
  if(q.hasImage){
    $('#referenceImage').attr('class','col-lg-8 ml-5');
    $('#image_canvas').css('display', 'none');
    loadQuestionImage(q.type);
  }
  else {
    $('#image_canvas').css('display', 'none');
    $('#image_canvas2').css('display', 'none');
  }
   
  if(q.type == 'parameters'){
    $('#bSave').css('display', 'block');
    $('#SaveButton').attr('class','col-md-2');
    $('#NextButton').attr('class','col-md-6');
    $('#bNext').attr("disabled","disabled");
    $('#bNext').css('opacity','0.5');
  }
  else {
    $('#bSave').css('display', 'none');
    $('#SaveButton').attr('class','col-md-1');
    $('#NextButton').attr('class','col-md-1 mr-4');
    $("#bNext").removeAttr("disabled");
    $('#bNext').css('opacity','1.0');
  }

  if(!q.color) $('#svg1').css('pointer-events', 'none');
  else $('#svg1').css('pointer-events', 'auto');

  if(!q.opacity)$('#svg3').css('pointer-events', 'none');
  else $('#svg3').css('pointer-events', 'auto');
  
 /* if(q.view)$('#transViewDiv').attr("hidden","true");
  else {
    $('#transViewDiv').removeAttr("hidden");
    $("#transViewDiv").collapse("show");
  }

  if(q.light)$('#lightingParaDiv').attr("hidden","true");
  else {
     $('#lightingParaDiv').removeAttr("hidden");
     $('#lightingParaDiv').collapse("show");
  }
  
  if(!q.cutting)$('#cuttingPlaneDiv').attr("hidden","true");
  else {
    $('#cuttingPlaneDiv').removeAttr("hidden");
    $('#cuttingPlaneDiv').collapse("show");
  }*/


  document.getElementById("questions").innerHTML = contents;
  $("#questionId").text(question_num);

  document.getElementById("questions-counter").innerHTML = '(' +
    (question_num + 1) + ' of ' + (quiz.questions.length) + ')';

  if (question_num + 1 === quiz['questions'].length)
  {
    $('#bSubmit').show();
    $('#bNext').hide();
  } 
  else
  {
    $('#bSubmit').hide();
    $('#bNext').show();
  }
  
  
  
}

function main()
{
   console.log("main is called");
   initializeColorPicker();
   draw_panel();

   volumeSetupRC();
   surfaceSetupRC();
   interfaceParaInitialization();
    // draw volume 
   
   glDrawVolume();
   glDrawSurface();
   
   let currentUser = "xbao";
   let currentQuiz = "volume_quiz";


   let quizRequest = {
    "username": currentUser,
    "quiz_id": currentQuiz
  };

   
   getQuiz(quizRequest, runQuiz);
   

}


function runQuiz(quiz)
{
  console.log("running quiz");
  let i = 0;
  console.log("quiz", quiz);
  while(i < quiz.questions.length && quiz.questions[i].answered) {
    console.log("skipping answered question number " + i++);
  }
  if (i >= quiz.questions.length)
  {
    window.location.replace("/submitted");
  }
  printQuestion(TRACE(quiz), i);
  $('#bNext').on('click', e => clickEvent(e, quiz));
  $('#bSubmit').on('click', e => clickEvent(e, quiz));
  $('#bSave').on('click',function(){
    alert("Last change of parameters has already been saved.");
    ParaAlreadySaved = 0;
    $("#bNext").removeAttr("disabled");
    $('#bNext').css('opacity','1.0');
    console.log(ParaAlreadySaved);});

}
