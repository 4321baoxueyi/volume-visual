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
The quiz component can be used to test the user's general knowledge about volume visualization techniques and their ability to efficiently use #VolumeVisual to explore data.
