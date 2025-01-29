# CS231N-final-project

## Description   
This project aims to identify camouflaged objects of different shapes in complete harmony with their surrounding. The YOLOv8 algorithm operates by extracting features and applying non-maximum suppression to detect overlapping bounding boxes. On the COD10K dataset, YOLOv8 achieved a mean average precision (mAP) of 18.2% in our training dataset. The CAMO dataset, converted to YOLO1.1 format using CVAT.AI, also showed poor training performance with a mean precision (mAP50) of 3.89%, which we believe is due to issues with identifying the center in our bounding boxes for ground truth. We are working on addressing this issue. Using these two datasets, we explored different approaches to improve performance, including edge detection with Fourier transform, wavelet transforms, shape separation, and transfer learning. We achieved over 50% mAP50 by continuing to train the entire YOLOv8 small model with the COD10K and CAMO-COCO datasets, and over 40% mAP50 by performing trans- fer learning on the YOLOv8 nano model.

## How to run   
1, install dependencies   
```bash
# clone project   
git clone https://github.com/LilyLiu0719/CS231N-final-project.git

# install project   
cd CS231N-final-project
pip install ultralytics
pip install -r requirements.txt

# module folder
cd yolov8
```
2. Download the weights from [Link](https://drive.google.com/file/d/1cfG-RFi_SR2JL3J-BWcgApmCR8YP_ycV/view?usp=drive_link)

3. Run module 
```bash
python main.py    
```
You might need to modify the path and mode in `main.py`
