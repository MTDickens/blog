# 流程

流程很简单：

1. 通过 SIFT 等特征，找出两个图片之间的特征
2. 使用 RANSAC 算法，求出两个相机之间的 Fundamental matrix
3. 将第二个相机变换到第一个相机，然后进行后期处理（比如对光影进行处理），结束

> [!example]+
> 
> <img src="https://gitlab.com/mtdickens1998/mtd-images/-/raw/main/pictures/2024/12/9_23_31_33_20241209233133.png"/>


