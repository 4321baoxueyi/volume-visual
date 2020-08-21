/**
 * Use "introJs" third library ("/lib/intro.js") to implement the onboarding
 */

var introGuide = introJs();
introGuide.setOptions({
  exitOnOverlayClick: false,
});
introGuide.addSteps([{
    element: "#webgl_volume",
    intro: "This panel shows direct volume rendering of the data set. Use mouse, touchpad, or keyboard to manipulate the view.",
    position: "right"
  },
  {
    element: "#webgl_surface",
    intro: "This panel shows isosurface rendering of the data set. Use mouse, touchpad, or keyboard to manipulate the view.",
    position: "top"
  },
  {
    element: "#OpacityContainer",
    intro: "This panel shows the opacity transfer function. Use mouse to create and update control points to edit the opacity transfer function.",
    position: "top"
  },
   {
    element: "#ColorContainer",
    intro: "This panel shows the color transfer function. Use mouse to create and update control points to edit the color transfer function.",
    position: "top"
  },
   {
     element: "#color_panel",
     intro: "Select a color for the corresponding control point in the color transfer function.",
     position: "left",
   },
  {
    element: "#dataDropdownIntro",
    intro: "Here you can select a different data set.",
    position: "left"
  },
  // {
  //   element: "#colorBlindDiv",
  //   intro: "Colorblind? Flip this switch for a color blindness friendly color map.",
  //   position: "left",
  // },
  {
    element: "#cuttingPlanePanel",
    intro: "Cut through the volume along X, Y, and Z dimensions to observe the inside structure. This section and four sections below can be folded/unfolded.",
    position: "left"
  },
  {
    element: "#lightintParaPanel",
    intro: "Adjust the lighting parameters for both volume rendering and isosurface rendering.",
    position: "left"
  },
  {
    element: "#transViewPanel",
    intro: "Besides using mouse, you can also use sliders here to translate and scale the volume.",
    position: "left"
  },
  {
    element: "#sampleRatePanel",
    intro: "Adjust the sampling rate for volume rendering.",
    position: "left",
    scrollTo: "tooltip",
  },
  {
    element: "#isoValuePanel",
    intro: "Change the representative isovalue to see a different isosurface.",
    position: "left",
    scrollTo: "tooltip",
  }, 
  {
    element: "#describeDivIntro",
    intro: "Learn more about the data set here.",
    position: "left",
    scrollTo: "tooltip",
  },
  {
    element: "#help",
    intro: "Click 'help?' to review this introduction.",
    position: "bottom"
  },
]);

// show onboarding when someone opens the page for the first time
function initHelp (elements1, elements2, currentGraph, graphic1, graphic2, svgs) {
  
  

    if (localStorage.getItem("hasLoadBefore") == null) {
        setTimeout(function () {
            introGuide.start()
            .onchange(function(targetElement){
                resetForBackwards(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs);
                openSection(targetElement);
            })
            .onbeforechange(function(targetElement){
                resetSection(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs)})
            .onafterchange(function(targetElement){
                resetFilterBackwards(targetElement, svgs, currentGraph)})
            .onexit(() => foldSection());
      console.log("onboarding");
    }, 2000);
    localStorage.setItem("hasLoadBefore", true);
  }
  ;
}

// when clicking "help" link
function helpOnClick(elements1, elements2, currentGraph, graphic1, graphic2, svgs) {
    console.log("onboarding");

    introGuide.start()
        .onchange(function(targetElement){
            //resetForBackwards(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs);
            openSection(targetElement);
        })
        .onbeforechange(function(targetElement){
            //resetSection(targetElement, elements1, elements2, currentGraph, graphic1, graphic2, svgs);
            })
        .onafterchange(function(targetElement){
           // resetFilterBackwards(targetElement, svgs, currentGraph);
             
            })
        .onexit(() => foldSection());
}

// open folded "Appearance"
function openSection(targetElement)
{
 //  $("#cuttingPlaneDiv").collapse("hide"); 
 //  $("#lightingParaDiv").collapse('hide');
 //  $("#transViewDiv").collapse('hide');
 //  $("#sampleRateDiv").collapse('hide');
 //  $("#isoValueDiv").collapse('hide');
  if(targetElement.id == "color_panel") svg_color_picker.style('display', 'inline');

  $("#cuttingPlaneDiv").collapse("show");
 
  $("#lightingParaDiv").collapse('show');

  $("#transViewDiv").collapse('show');

  $("#sampleRateDiv").collapse('show');

  $("#isoValueDiv").collapse('show');
}

function foldSection(targetElement)
{
   $("#cuttingPlaneDiv").collapse("hide");
 
   $("#lightingParaDiv").collapse('show');

   $("#transViewDiv").collapse('hide');

   $("#sampleRateDiv").collapse('hide');

   $("#isoValueDiv").collapse('hide');
   
   svg_color_picker.style('display', 'none');
}

function resetForBackwards(targetElement, elements1, elements2, graph, graphic1, graphic2, svgs)
{

}

function resetFilterBackwards(targetElement, svgs, graph)
{
}
function resetSection(targetElement, elements1, elements2, graph, graphic1, graphic2, svgs)
{
}