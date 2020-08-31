# VolumeVisual
VolumeVisual is an educational tool that provides a friendly web interface for students to explore and interact with volume visualizations of a variety of data sets from real-world medical applications and scientific simulations. As the most popular techniques for volume visualization, direct volume rendering and isosurface rendering are utilized to allow users to draw important information from these data sets. Users learn how to compare and evaluate these two different visualization techniques in side-by-side panels, which can be interactively explored by various interactions.
VolumeVisual is mainly developed with WebGL 2.0. To get better browser compatibility and performance, users are strongly recommended to download the latest version of Chrome, FireFox, or Edge and update Graphics Cards driver to the newest version.
## Dependencies
Several libraries were used for the development of VolumeVisual.
They are already included in VolumeVisual, but for further reference, we link them below.

* Intro JS: https://github.com/usablica/intro.js
* Bootstrap: https://getbootstrap.com/
## Datasets
All the volume data sets used in VolumeVisual could be found under 'volume/'.
The folder 'surface/' contains all the isosurfaces for isosurface rendering.
The folder 'data-description' contains descriptions about all the data sets.
The folder 'transfunc' contains parameter-related information including data set dimension, default view parameters, and transfer function control points, etc.

### Adding a Dataset
To add new data sets, one needs to put data of required format into the corresponding folder:
1. Volume data set under 'volume/', the raw data has to be stored in float32 format. 
2. Isosurface data under 'surface/', stored as '.indices', '.vertices', and '.normals' separately.
3. One '.txt' file under 'transferfunc/' containing 9 float numbers: x, y, z dimensions of the data set, 4 quaternion numbers, and two translation numbers (x and y) defining a default view for each data set.
4. One '.txt' description file of the data set under 'data-description/'.
## Quiz Component
The quiz component can be used to test the user's general knowledge about volume visualization techniques and their ability to efficiently use **VolumeVisual** to explore data.
There are two general types of questions: data set related question and data set unrelated question. 
For more information about the question format and how to add them, check the README in the 'quiz-tutorial' folder.
### Quiz image
The 'quiz-image' folder contains the reference image used by quiz questions. For further details, please check README in the 'quiz-tutorial' folder.
### Running the quiz
To run the quiz, one simply needs to execute 'server/server.py'.
This will host a web server that can communicate to the quiz front end.
A temporary Http and Https URL will be given each time running the server.py and will be displayed on the command line. Every user could get access to the quiz page using the URL on the internet with no restriction.
To access the quiz, go to the URL followed by /quiz.
During start-up, it compiles the quiz from the question files into a json file that is served to the user.
The server stores the results in similar json files, one for each user.
This is done by creating a folder for each user under 'server/db/'.
To allow users to log in for the quiz, an '_auth.json' file needs to exists which looks like this:

```
{
  "username": "<username>",
  "password": "<password>",
  "authd": true
}

```
**Note:** we do not claim that this is a secure/preferred way to store login credentials, this method was just used as a quick and dirty solution for our research study.

This repository contains an example quiz with three questions and an example user.

## Contributors
<sub><sup>_Sorted by join date, alphabetically to break ties_</sup></sub>


* Alexander Mascoli ~ _09/2018-12/2018_
* Ahmed Farag ~ _02/2019-05/2019_
* Kekoa Wong ~ _02/2019-05/2019_
* Kyle Weingartner ~ _04/2019-10/2019_
* Shuzhan Wang ~  _07/2019-08/2019_
* Wenqing Chang ~ _07/2019-08/2019_
* __Project lead__: Martin Imre
* __Advisor__: Chaoli Wang

