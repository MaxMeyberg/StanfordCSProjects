# Usage
from ultralytics import YOLO
from scipy import fftpack
import numpy as np
import astropy.io.fits as pyfits

import torch.fft
import torch
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np

import os

#folder_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/images/train' 
folder_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/images/val' 
folder2_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/gen_e/images/val' 
folder3_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/gen_s/images/val' 
#gen_shape_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/gen_s/images/train'
gen_shape_path = r'/data/900G/CAMO/CAMO-COCO-V.1.0-CVIU2019/ensemble/images/val'


model1 = YOLO("/data/900G/ultralytics/runs/detect/train372/weights/best.pt")
model2 = YOLO("/data/900G/ultralytics/runs/detect/train3/weights/best.pt")
model3 = YOLO("/data/900G/ultralytics/runs/detect/train4/weights/best.pt")

i = 0
for filename in os.listdir(folder_path):
    img_path = os.path.join(folder_path, filename)
    #gen_file = os.path.join(gen_shape_path, filename)
    #gen01_file_path = os.path.splitext(gen_file)[0]+'_01.png'
    #gen02_file_path = os.path.splitext(gen_file)[0]+'_02.png'
    #gen03_file_path = os.path.splitext(gen_file)[0]+'_03.png'
    i += 1
    model1.predict(img_path, save=True, imgsz=320, conf=0.25)
    #model2.predict(img_path, save=True, imgsz=320, conf=0.25)
    #model3.predict(img_path, save=True, imgsz=320, conf=0.25)

i = 0
for filename in os.listdir(folder2_path):
    img_path = os.path.join(folder2_path, filename)
    #gen_file = os.path.join(gen_shape_path, filename)
    #gen01_file_path = os.path.splitext(gen_file)[0]+'_01.png'
    #gen02_file_path = os.path.splitext(gen_file)[0]+'_02.png'
    #gen03_file_path = os.path.splitext(gen_file)[0]+'_03.png'
    i += 1
    #model1.predict(img_path, save=True, imgsz=320, conf=0.25)
    model2.predict(img_path, save=True, imgsz=320, conf=0.25)
    #model3.predict(img_path, save=True, imgsz=320, conf=0.25)

i = 0
for filename in os.listdir(folder3_path):
    img_path = os.path.join(folder3_path, filename)
    #gen_file = os.path.join(gen_shape_path, filename)
    #gen01_file_path = os.path.splitext(gen_file)[0]+'_01.png'
    #gen02_file_path = os.path.splitext(gen_file)[0]+'_02.png'
    #gen03_file_path = os.path.splitext(gen_file)[0]+'_03.png'
    i += 1
    #model1.predict(img_path, save=True, imgsz=320, conf=0.25)
    #model2.predict(img_path, save=True, imgsz=320, conf=0.25)
    model3.predict(img_path, save=True, imgsz=320, conf=0.25)

print("Processed ", i, " files, generated fg, bg images.")
