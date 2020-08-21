var BOUNDING_VSHADER_SOURCE = 
'#version 300 es\n' + 
'precision highp float;\n' +
'precision highp int;\n' +
'layout(location = 0) in vec4 vVertex;\n' +
'uniform mat4 ctMatrix;\n' +
'uniform mat4 scale_Matrix;\n' +
'void main(){\n' + 
            'vec4 pos = vVertex;\n' +
            'gl_Position = ctMatrix *scale_Matrix* pos;\n' +
           '}\n';
var BOUNDING_FSHADER_SOURCE =
'#version 300 es\n' +
'precision highp float;\n' +
'out vec4 fragColor\n;' +
'void main(){\n' + 
            'fragColor = vec4(0.0,0.0,0.0,1.0);\n' +
           '}\n';
var BACKFACE_VSHADER_SOURCE =
'#version 300 es\n' + 
'precision highp float;\n' +
'precision highp int;\n' +
'layout(location = 0) in vec4 vVertex;\n' +
'layout(location = 1) in vec3 texCord;\n' +
'out vec3 texCordforFrag;\n' +
'uniform mat4 ctMatrix;\n' +
'uniform mat4 scale_Matrix;\n' +
'void main(){\n' + 
            'vec4 pos = vVertex;\n' +
            'gl_Position = ctMatrix *scale_Matrix* pos;\n' +
            'texCordforFrag = texCord;\n' +
           '}\n';
var BACKFACE_FSHADER_SOURCE =
'#version 300 es\n' +
'precision highp float;\n' +
'in vec3 texCordforFrag;\n' +
'out vec4 fragColor\n;' +
'uniform mat4 scale_Matrix;\n' +
'void main(){\n' + 
            'fragColor = vec4(texCordforFrag,1.0);\n' +
           '}\n';

var VOL_VSHADER_SOURCE = 
'#version 300 es\n'+
' precision highp float;\n'+
'layout(location = 0) in vec4 vVertex;\n'+
'layout(location = 1) in vec3 texCord;\n'+
'out vec3 texCordforFrag;\n'+
'out vec4 fragCoord;\n'+
'uniform mat4 viewMatrix;\n'+
'uniform mat4 ctMatrix;\n'+
'uniform mat4 scale_Matrix;\n' +
'void main(){\n'+
            'vec4 pos = vVertex;\n'+
            'gl_Position = ctMatrix *scale_Matrix* pos;\n'+
            'texCordforFrag = texCord;\n'+
            'fragCoord =  scale_Matrix*pos;\n'+
            '}\n';

var VOL_FSHADER_SOURCE =
'#version 300 es\n'+
'precision highp float;\n'+
'precision highp sampler2D;\n'+
'precision highp sampler3D;\n'+     
'uniform sampler2D backFaceTexture;\n'+
'uniform sampler3D volumeTexture;\n'+   
'uniform sampler2D transferFunc;\n'+   
'uniform float diffuse_density;\n'+   
'uniform float ambient_density;\n'+   
'uniform float shiness_density;\n'+   
'uniform float specular_density;\n'+
'uniform float constrast_ratio;\n'+
'uniform float sampleRate;\n'+ 
'uniform float slice_X;\n'+
'uniform float slice_Y;\n'+
'uniform float slice_Z;\n'+  
'uniform mat4 scale_Matrix;\n' +  
'in vec3 texCordforFrag;\n'+   
'out vec4 fragColor;\n'+   
'in vec4 fragCoord;\n'+   
'const float dirt = 1.0/150.0;\n'+   
'const float vsize = 128.0;\n'+   
'const float winSize = 800.0;\n'+   
'struct Light{\n'+   
             'float ambient_diffuse;\n'+   
             'float specular;\n'+
            '};\n'+           
'vec3 getNormal(vec3 texPosition){\n'+
          'vec3 gradient;\n'+ 
          'gradient.x=texture(volumeTexture,texPosition.xyz+vec3(dirt,0,0)).r-texture(volumeTexture,texPosition.xyz+vec3(-dirt,0,0)).r;\n'+ 
          'gradient.y=texture(volumeTexture,texPosition.xyz+vec3(0,dirt,0)).r-texture(volumeTexture,texPosition.xyz+vec3(0,-dirt,0)).r;\n'+ 
          'gradient.z=texture(volumeTexture,texPosition.xyz+vec3(0,0,dirt)).r-texture(volumeTexture,texPosition.xyz+vec3(0,0,-dirt)).r;\n'+ 
          'if(length(gradient) > 0.0)gradient = normalize(gradient);\n'+ 
          'return gradient;\n'+ 
          '}\n'+ 
'Light getLight(vec3 normal, vec3 lightDir, vec3 rayDir){\n'+ 
          'Light light;\n'+ 
          'float ambient =1.0 * ambient_density;\n'+        
          'float diffuse =  max(dot(lightDir, normal), dot(lightDir, -normal)) * diffuse_density;\n'+ 
          'vec3 H = normalize(-rayDir + lightDir);\n'+ 
          'float DotHV = max(dot(H, normal), dot(H, -normal));\n'+ 
          'float specular = 0.0;\n'+ 
          'if ( DotHV > 0.0 )specular = specular_density * pow(DotHV,64.0*shiness_density);\n'+ 
          'light.ambient_diffuse = ambient + diffuse;\n'+ 
          'light.specular = specular;\n'+ 
          'return light;\n'+ 
          '}\n'+
'void main(){\n'+ 
              'vec2 fragCord = gl_FragCoord.xy - 0.5;\n'+
              'fragCord.xy = fragCord.xy/winSize;\n'+
              'vec4 color = texture(backFaceTexture, fragCord);\n'+
              'vec3 exitTex = color.xyz;\n'+
              'vec3 entryTex = texCordforFrag;\n'+
              'vec3 start = entryTex;\n'+
              'float sampleNum = vsize * sampleRate;\n'+
              'vec3 dirt_tex = (exitTex- entryTex)/sampleNum;\n'+
              'vec4 accumulated_color = vec4(0.0,0.0,0.0,0.0);\n'+
              'vec4 transferColor =  vec4(0.0,0.0,0.0,0.0);\n'+
              'vec3 rayStart,rayDir,lightDir,normal;\n'+
              'rayDir = normalize(fragCoord.xyz);\n'+
              'vec3 start_coord = fragCoord.xyz;\n'+
              'float depth = distance(exitTex,entryTex);\n'+
              'vec3 exitCoord = fragCoord.xyz + rayDir * depth;\n'+
              'lightDir = normalize(rayDir * -1.0);\n'+
              'float ambient_diffuse,specular;\n'+
              'Light light;\n'+
              'float step =0.0;\n'+
              'float dirtstep = 1.0;\n'+
              '// accumulate color along view direction\n'+
              ' while(step<(sampleNum)){\n'+
               
               'start = entryTex+ (dirt_tex.xyz *step);\n'+
               'start_coord = fragCoord.xyz + length(dirt_tex.xyz *step)*rayDir;\n'+
               'if(start.x>=(1.0-slice_X)){\n'+
                  'step+=dirtstep;\n'+
                  'continue;\n' +
               '}\n'+
               'if(start.y>=(1.0-slice_Y)){\n'+
                  'step+=dirtstep;\n'+
                  'continue;\n' +
               '}\n'+
               'if(start.z>=(1.0-slice_Z)){\n'+
                  'step+=dirtstep;\n'+
                  'continue;\n' +
               '}\n'+
               'normal = getNormal(start);\n'+
               'light = getLight(normal,lightDir,rayDir);\n'+
               'ambient_diffuse = light.ambient_diffuse;\n'+
               'specular = light.specular;\n'+
               'vec4 sliceColor = texture(volumeTexture,start);\n'+
               'transferColor = texture(transferFunc,vec2(sliceColor.x,0.0));\n'+
               'transferColor.a = smoothstep(0.0+constrast_ratio*0.2,1.0-constrast_ratio*0.2,transferColor.a);\n'+
               'transferColor.rgb *= transferColor.a;\n'+
               'transferColor.rgb = transferColor.rgb * ambient_diffuse + transferColor.a * specular;\n'+
               'accumulated_color.xyz = accumulated_color.xyz + (1.0 -accumulated_color.a ) * transferColor.xyz;\n'+
               'accumulated_color.a = accumulated_color.a+  (1.0 -accumulated_color.a ) *transferColor.a;\n'+
               'if(accumulated_color.a>=0.9)accumulated_color.a*=0.9;\n'+
               'step+=dirtstep;\n'+
               '}\n'+
               'accumulated_color = min(accumulated_color, vec4(1.0));\n'+
               'fragColor = accumulated_color;\n'+  
           '}\n';
  

