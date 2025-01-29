import os
import numpy as np
import torch
import matplotlib.pyplot as plt

import torchvision.transforms.functional as F
#import torchvision.utils.save_image as S
from torchvision.ops import masks_to_boxes



ASSETS_DIRECTORY = "."

plt.rcParams["savefig.bbox"] = "tight"


def show(imgs):
    if not isinstance(imgs, list):
        imgs = [imgs]
    fix, axs = plt.subplots(ncols=len(imgs), squeeze=False)
    for i, img in enumerate(imgs):
        img = img.detach()
        img = F.to_pil_image(img)
        axs[0, i].imshow(np.asarray(img))
        axs[0, i].set(xticklabels=[], yticklabels=[], xticks=[], yticks=[])

from torchvision.io import read_image



#folder_path = r'/900G/dataset/COD10K-v3/Train/GT_Instance'
# Images in YOLO directory format.
folder_path = r'/900G/dataset/COD10K-v3/images/train'
folder_path = r'/900G/dataset/COD10K-v3/images/val'
# Images in COD10K-v3 directory format, read instance labels.
instance_path = r'/900G/dataset/COD10K-v3/Train/GT_Instance'
instance_path = r'/900G/dataset/COD10K-v3/Test/GT_Instance'
# Labels generated using pytorch
label_path = r'/900G/dataset/COD10K-v3/Train/Labels-T/val'
i = 0
for filename in os.listdir(folder_path):
    img_path = os.path.join(folder_path, filename)
    mask_path = os.path.join(instance_path, filename)
    mask_file_path = os.path.splitext(mask_path)[0]+'.png'
    print(mask_path, mask_file_path)
    img = read_image(img_path)
    mask = read_image(mask_file_path)
    #unique colors as object Ids
    obj_ids = torch.unique(mask)
    #remove background
    obj_ids = obj_ids[1:]

    masks = mask == obj_ids[:, None, None]
    boxes = masks_to_boxes(masks)
    N, Height, Width = img.size()
    output_file = os.path.join(label_path, filename)
    output_file_path = os.path.splitext(output_file)[0]+'.txt'
    i += 1
    with open(output_file_path, 'w') as out_file:
        for i in boxes:
            w = i[2]-i[0]
            h = i[3]-i[1]
            x_center = i[0] + (w/2)
            y_center = i[1] + (h/2)
            normalized_x = x_center / Width
            normalized_y = y_center / Height
            normalized_width = w / Width
            normalized_height = h / Height
            print("B" , x_center, " ", y_center, " ", w, " ", h )
            #print("B" , normalized_x, " ", normalized_y, " ", normalized_width, " ", normalized_height )
            out_file.write(f'{0} {normalized_x:.6f} {normalized_y:.6f} {normalized_width:.6f} {normalized_height:.6f}\n')

print("Processed " , i, " files.")

#img_path = os.path.join(ASSETS_DIRECTORY, "COD10K-CAM-5-Other-69-Other-5065.jpg")
#mask_path = os.path.join(ASSETS_DIRECTORY, "COD10K-CAM-5-Other-69-Other-5065.png")
#label_path = os.path.join(ASSETS_DIRECTORY, "COD10K-CAM-5-Other-69-Other-5065.txt")
#img = read_image(img_path)
#mask = read_image(mask_path)

#print(mask.size())
#print(img.size())
#print(mask)

# We get the unique colors, as these would be the object ids.
#obj_ids = torch.unique(mask)
#print("1")

# first id is the background, so remove it.
#obj_ids = obj_ids[1:]

# split the color-encoded mask into a set of boolean masks.
# Note that this snippet would work as well if the masks were float values instead of ints.
#masks = mask == obj_ids[:, None, None]

#from torchvision.ops import masks_to_boxes

#boxes = masks_to_boxes(masks)
#print(boxes.size())
#print(boxes)
#print("2")

# no need to actually draw boxes...
"""
from torchvision.utils import draw_bounding_boxes

drawn_boxes = draw_bounding_boxes(img, boxes, colors="red")
show(drawn_boxes)
#S(drawn_boxes, "a.png")
# 853 x 1280
N, Height, Width = img.size()
print(" Here ", N, Height, Width)

with open(label_path, 'w') as out_file:
    for i in boxes:
        w = i[2]-i[0]
        h = i[3]-i[1]
        x_center = i[0] + (w/2)
        y_center = i[1] + (h/2)
        normalized_x = x_center / Width
        normalized_y = y_center / Height
        normalized_width = w / Width
        normalized_height = h / Height
        print("B" , x_center, " ", y_center, " ", w, " ", h )
        print("B" , normalized_x, " ", normalized_y, " ", normalized_width, " ", normalized_height )
        out_file.write(f'{0} {normalized_x:.6f} {normalized_y:.6f} {normalized_width:.6f} {normalized_height:.6f}\n')


plt.imsave('first_imsave.png',drawn_boxes[0].numpy().squeeze())
"""
