from ultralytics import YOLO
import torch
from dotenv import load_dotenv
import os
from collections import defaultdict

load_dotenv('.env')

hyper_params = {
   "learning_rate": 0.5,
   "steps": 100000,
   "batch_size": 50,
}

# Load a model
model = YOLO("weight/best.pt")  # load a pretrained model (recommended for training)
# model = YOLO("yolov8n.yaml")  # build a new model from scratch
# device = 'mps' if torch.backends.mps.is_available() else 'cpu'
device = 'cpu'

def train(model, device):
    
    model.train(data="camo.yaml", 
                epochs=20, 
                # imgsz=64, 
                device=device, 
                batch=8, 
                project='camo-yolo'
                )

    metrics = model.val()  # evaluate model performance on the validation set
    path = model.export()

def test(model, img_path):
    # sizes = [64, 128, 256, 512, 1024]  # test different image sizes
    sizes = [64]
    results = defaultdict(list)
    for s in sizes:
        res = model.predict(img_path, 
                            iou=0.25, 
                            imgsz=s, 
                            batch_size=16,
                            save=True)
        
    return results

def validate(model):
    metrics = model.val(data="camo.yaml", 
                        iou=0.7, 
                        imgsz=640, 
                        batch=16,
                        save=True, 
                        device=device, 
                        project='camo-yolo'
                        )
    return metrics

if __name__ == '__main__':
    # train(model, device)
    # res = test(model, './datasets/cod10K/images/test/COD10K-CAM-1-Aquatic-1-BatFish-2.jpg')
    # print(res)
    metrics = validate(model)
    # print(metrics)