# Lec 1: Introduction

## What is "deep learning for computer vision"?

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051740545.png" alt="image-20240305174038154" style="zoom:50%;" />

## History of Computer Vision

### Hubel & Wiesel, 1959

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051800519.png" alt="image-20240305180031665" style="zoom:33%;" />

- Simple cells:
  - **Response to light orientation**
    <img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051801414.png" alt="image-20240305180141894" style="zoom:50%;" />

- Complex cells:
  - Response to light orientation and movement

- Hypercomplex cells:
  - response to movement with an end point

Thus, this research tells us that **light orientation** is important, and **edges** are fundamental in visual processing.

### Larry Roberts, 1963

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051805982.png" alt="image-20240305180515918" style="zoom: 33%;" />

It is commonly accepted that the father of Computer Vision is Larry Roberts, who in his Ph.D. thesis (cir. 1960) at MIT discussed the possibilities of **extracting 3D geometrical information from 2D perspective views of blocks** (polyhedra). 

### David Marr, 1970

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051812924.png" alt="image-20240305181244051" style="zoom:50%;" />

David proposed four stages of visual processing:

1. Primal Sketch: find the edges, etc of the raw image
2. 2 1/2-D Sketch: find the depth of the raw image, and identify the object in the edge image
3. 3-D model: translate the 2 1/2-D object to 3-D object

### 1970s and onwards

In the 1970s, many algorithms that recognize **an object that contains many "parts"**, such as the robot shown below. We recognize each part by edges, and combine them topologically to form the object.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051821987.png" alt="image-20240305182101499" style="zoom:50%;" />

---

In the 1980s, the camera is way better and edge detection is now very plausible.

Like the image below, you can have a *template* of a razor, and you are able to find all razors by ***matching** edges*.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051823123.png" alt="image-20240305182331409" style="zoom:33%;" />

---

In the 1990s, computer scientists try to break the image into several **semantically meaningful segments** instead of just do edge matching.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051825069.png" alt="image-20240305182534142" style="zoom:50%;" />

---

In the 2000s, recognition via matching is more and more popular.

The SIFT (Scale-Invariant Feature Transform) algorithm first **detects key points** in an image, 

- which typically exhibit good invariance to local features such as texture, edges, or corners. 

Then, **feature descriptors are extracted** within the local regions surrounding each key point.

- These descriptors are vectors encoding information about the image around the key points and possess invariance properties to scale, rotation, and illumination changes. 
- These feature descriptors are utilized in subsequent tasks such as image matching and object recognition.

<img src="https://cdn.jsdelivr.net/gh/mtdickens/mtd-images/img/202403051829292.png" alt="image-20240305182940082" style="zoom:50%;" />

### Facial Detection

Viola and Jones proposed a very practical algorithm in 2001. It's one of the first successful applications of machine learning to vision.

- Because it uses boosted (a slightly modified version of AdaBoost) decision trees.

## History of Machine (Deep) Learning

The development of machine (deep) learning has a timeline that is almost parallel to computer vision. Before 2012, many people also have tried to apply ML techniques in CV, but all of them failed.

It's 

- algorithm: AlexNet
- data: Big Data Era
- computation: Moore's Law

that contribute to the success of AlexNet in CV in 2012.
