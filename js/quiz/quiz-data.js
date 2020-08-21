
let timeouts = [];
var quiz_data = {
    "quizId": "volume_quiz",
     "questions": [                             // 0
      {
            "text": "Comparing direct volume rendering and isosurface rendering, point out their respective pros and cons.",
            "type": "text",
            "answer": "pros: efficiency and accuracy, cons: lack of the capability to illustrate the material property and the internal structures."
      },
      {                                         // 1
           "options": [
                "128",
                "128 sqrt(2)",
                "128 sqrt(3)",
                "256"
            ], 
            "text": "Assume the resolution of volume is 128 in each dimension. The sampling rate is one voxel wide during the raycasting process. How many samples at most are taken along one ray?",
            "type": "radio",
            "answer": "c"
      },
  /*    {                                                   // 2
          "resource": "Bonsai",   
          "text": "Given the two direct volume rendering images below, which parameter causes the major difference of rendering results between these two images and how this parameter affects the quality of rendering (assuming all the other parameters are the same)? Explain briefly.", 
          "light": "true",
          "view" :"true",
          "image" : "true",
          "type": "text",
          "answer": ""
       }, */
      {                                         // 3
           "options": [
                "increase the sampling rate",
                "zoom in the volume rendering",
                "increase the specular term from 0.5 to 1.0",
                "change from perspective projection to orthogonal projection"
            ], 
            "text": "Which operations will likely increase the computation cost of direct volume rendering?",
            "type": "checkbox",
            "answer": "a and b"
      },
      {                                               // 4
          "resource": "Atmospheric",
           "light" : "true",
           "view" : "true", 
           "text": "Turn on the axis (red, green, and blue represent X, Y, and Z axis). Assuming X and Y represent East and North in the data set. Which two wind directions does this data set illustrate?",
           "type": "text",
           "answer": ""
       },
       {                                                   // 5
          "options": [
                "empty space skipping",
                "early ray termination",
                "3D mesh derformation",
                "data downsampling"
            ],  
          "text": "Which techniques are most often used for optimizing the efficiency of direct volume rendering?",
          "type": "checkbox",
          "answer": ""
       },
      {                                               // 6
          "resource": "Bonsai",
           "light" : "true",
           "opacity" :"true",
           "view" : "true",
           "text": "The basin is already shown in the rendering. Use the opacity transfer function editor to show the leaves and branches of the bonsai. You must click 'Save' before moving to next question.",
           "type": "parameters",
           "answer": ""
       }, 
       {                                                    // 7
           "options": [
                "surface geometry extraction",
                "ray traversal",
                "transfer function lookup",
                "shading"
            ], 
          "text": "Which process is not included in direct volume rendering?",
          "type": "radio",
          "answer": ""
       },    
       {                                              // 8
          "resource": "UNC Brain",
          "color" : " true",
          "light" : "true",
          "text": "The rendering of the brain is upside down and too small. Adjust the viewing parameters to correct these. Use the color transfer function editor to choose nature colors for skin and brain.",
          "type": "parameters",
          "answer": ""
       },
       {                                               // 9
           "options": [
                "sampling rate",
                "color transfer function",
                "opacity transfer function",
                "ambient and diffuse values"
            ], 
          "text": "Which options will influence the final accumulated opacity of direct volume rendering?",
          "type": "checkbox",
          "answer": ""
       },  
        {                                             // 10
          "resource": "Five Jets",
           "view" : "true",
           "image" : "true",
           "text": "Adjust the lighting parameters and sampling rate to generate a rendering similar to the image below.",
           "type": "parameters",
           "answer": ""
       },   
        {                                                   // 11
          "resource": "Lobster",   
          "text": "Given the two direct volume rendering images below, why the right one has a better rendering on the lobster data set (Hint: A good rendering can provide more information and better quality)? Explain briefly.", 
          "light": "true",
          "view" :"true",
          "image" : "true",
          "type": "text",
          "answer": ""
       }, 
       {                                              // 12
          "resource": "Combustion (OH)",
          "opacity" : "true",
          "light" : "true",
          "isovalue": "140.9",
          "view" : "true",
          "text": "Adjust the opacity transfer function editor to generate a direct volume rendering result similar to the corresponding isosurface rendering result.",
          "type": "parameters",
          "answer": ""
       },  
       {                                                    // 13                                                                
           "options": [
                "raycasting",
                "marching cube",
                "ray tracing",
                "view-aligned slicing "
            ], 
          "text": "Which technique is most often used for isosurface extraction?", 
          "light": "true",
          "view" :"true",
          "type": "radio",
          "answer": ""
       },                                              
       {                                                  // 14
          "resource": "Hurricane Isabel (VAPOR)",
          "text": "Adjust the lighting parameters and use the cutting planes to show a slab of the hurricane similar to the image below.",
          "type": "parameters",
          "image" : "true",
          "view" : "true",
          "answer": ""
       },  
        {                                                   // 15
          "resource": "Foot",   
          "text": "Given the two direct volume rendering images below, which one has a better transfer function applied? Please state at least two reasons.", 
          "light": "true",
          "view" :"true",
          "image" : "true",
          "type": "text",
          "answer": ""
       }, 
       {                                                    // 16
           "resource": "Tornado",
           "options": [
                "velocity magnitude",
                "velocity direction",
                 "vorticity",
                "critical point"
            ], 
          "text": "Which information could not be read from direct volume rendering of the tornado data set?", 
          "light": "true",
          "view" :"true",
          "type": "checkbox",
          "answer": ""
       },                                                   
       {                                                    // 17
          "text": "Comparing the raycasting method and the texture-based slicing method for direct volume rendering, point out their respective pros and cons.",
          "type": "text",
          "answer": ""
       },                                                                    
        {                                                   // 18
          "resource": "Hurricane Isabel (WSMAG)", 
          "text": "Given the isosurface rendering image below, use the cutting planes to reveal the hurricane's eye in direct volume rendering. Also choose a similar color for the eye.",
          "color":"true", 
          "light": "true",
          "image" : "true",
          "type": "parameters",
          "answer": ""
       },                                             
        {                                                   // 19
          "text": "In direct volume rendering, scalar values at intermediate locations are obtained by interpolating scalar values at neighboring voxels. How many 3D data texture lookups does this process perform in the trilinear interpolation of one intermediate location?",  
          "type": "radio",
          "options": [
                "4",
                "6",
                "8",
                "12"
            ], 
          "answer": "8"
       },                                             
       {                                                       // 20
          "resource": "Combustion (HR)",
          "opacity" : "true",
          "image" : "true",
          "color" :"true",  
          "text": "Tweak all the parameters provided in the interface to generate the direct volume rendering result similar to the image below.",
          "type": "parameters",
          "answer": ""
       },
        {                                                   // 21
          "resource": "UNC Brain",   
          "text": "The two images below are rendered by direct volume rendering and isosurface rendering, both of which highlight the same scalar value. Please judge which one is rendered by direct volume rendering and which one is rendered by isosurface rendering. Explain briefly.", 
          "light": "true",
          "view" :"true",
          "image" : "true",
          "type": "text",
          "answer": ""
       }
     ]
}