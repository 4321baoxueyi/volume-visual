# Quiz Setup
The quiz needs to be set up properly.
Questions have to reside under '/questions' and need to be YAML (https://yaml.org/) files containing a single question each,
and are named by the question number (eg: 1.yaml, 2.yaml, ...).

## Question format

### Question

This is the text of the question.

Examples:

```
question: "What is three plus two"?
```

```
question: >
  What is the sum of the second-smallest prime number and the smallest prime number?
```

### Type

This is the type of response to this question.

Options:

- `radio` denotes a multiple-choice question with exactly one answer.
Set the `answer` field to the value of the correct choice.
Example:
```
question: Assume the resolution of volume is 128 in each dimension. The sampling rate is one voxel wide during the raycasting process. How many samples at most are taken along one ray?
type: radio
choices:
  - 128
  - 128 sqrt(2)
  - 128 sqrt(3)
  - 256
answer: 128 sqrt(3)
```

- `checkbox` denotes a "select all choices that apply" question.
Here, the `answer` field is an array.
Example:
```
question: Which operations will likely increase the computation cost of direct volume rendering?
type: checkbox
choices:
  - increase the sampling rate
  - zoom in the volume rendering
  - increase the specular term from 0.5 to 1.0
  - change perspective projection to orthogonal projection
answer:
  - increase the sampling rate
  - zoom in the volume rendering
```

- `text` denotes a free-response question.
Example:
```
question: Comparing direct volume rendering and isosurface rendering, point out their respective pros and cons.
type:text

answer: DVR shows clear inner structure of the volume data ...
```
- Here the `answer` key only gives a reference answer, which is not used by VolumeVisual directly.

### Volume

When including a volume data set in a quiz question, up to nine parameters can be included:

* `resource` denotes the name of the data set to be loaded.
* `type` denotes the type of the data set related question. If it is a `text`, `radio`, `checkbox`, or `parameters` question. Question with type `parameter` requires users to 
tweak light, view parameters, or transfer function editor.
* `light` `true` denotes light parameters could not be modified by users, default light parameters will be loaded.
* `view` `true` denotes view parameters could not be modified by users, default view parameters will be loaded.
* `color` `true` denotes color transfer function editor could be modified by users, default color transfer function editor will not be loaded.
* `opacity` `true` denotes opacity transfer function editor could be modified by users, the default opacity transfer function editor will not be loaded.
* `surface` `true` denotes only one isovalue is provided in this question. This type of question usually requires users to generate similar direct volume rendering to the isosurface rendering results.
* `isovalue`: This is a float number denoting the specific isovalue for the isosurface rendering. This parameter is used in companion with the `surface` parameter.
* `image` `true` denotes reference image is needed for the question. The reference image should be put under the `quiz-image` folder.

Note that if there is no explicit definition of one parameter, the quiz component will automatically set the parameter to `false`.

### Example
Below are three full examples.

```
question: The basin is already shown in the rendering. Use the opacity transfer function editor to show the leaves and branches of the bonsai. You must click 'Save' before moving to next question.
type: parameters
light: true
opacity: true
resource: Bonsai
view: true
answer: <Reference Answer>

```
This first example is a question using the Bonsai dataset and requiring users to tweak the opacity transfer function editor.

```
question: Turn on the axis (red, green, and blue represent X, Y, and Z axis). Assuming X and Y represent East and North in the data set. Which two wind directions does this data set illustrate?
type: text
resource: Atmospheric
view: true
light: true
answer: <Reference Answer>
```
This second example is a text question that uses the Atmospheric data set.

```
question: Adjust the opacity transfer function editor to generate a direct volume rendering result similar to the corresponding isosurface rendering result.
type: parameters
resource: Combustion (OH)
light: true
isovalue: 140.9
view: true
surface: true
opacity: true
answer: <Reference Answer>
```
This last example is a `parameters` question using Combustion (OH) data set, which defines the `isovalue` and the `surface` parameter together.

For more examples, see 'tutorial.yaml'.


#### Quiz Compilation

The quiz is automatically compiled when the server is started.


