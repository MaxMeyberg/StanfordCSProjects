
import torch
from dotenv import load_dotenv
import os
from collections import defaultdict
import sys

mode = 'dev' # 'pip' or 'dev'
where_am_i = 'cpu' # 'mac' or 'aws'

opt_train = {
    "epochs": 10,
    "imgsz": 640,
    "batch": 32,
    "save": True,
    "project": 'camo-yolo', 
    "resume": True, 
}

opt_test = {
    "imgsz": 640,
    "batch": 8,
    # "iou": 0.5,
    "save": True,
    "project": 'camo-yolo'
}

if mode == 'dev':
    sys.path.insert(0, os.getcwd()+'/ultralytics')

from ultralytics import YOLO

load_dotenv('.env')
if where_am_i == 'mac':
    device = 'mps' if torch.backends.mps.is_available() else 'cpu'
elif where_am_i == 'aws':
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
else:  
    device = 'cpu'

class CamoDetector:
    def __init__(self, model_path=None, device='cpu'):
        self.device = device
        if model_path is None:  
            self.model = YOLO("yolov8n.yaml")
        else:
            self.model = YOLO(model_path)  # load a pretrained model

    def load_backbone(self, ckptPath):
        backboneWeights = torch.load(ckptPath)
        self.model.load_state_dict(backboneWeights, strict=False)
    
    def freeze_backbone(self, freeze_layers=2):
        # Freeze backbone params
        freeze = [f'model.{x}.' for x in range(freeze_layers)]  # layers to freeze
        count = 0
        count_frozen = 0
        params_count = 0
        params_count_frozen = 0
        for k, v in self.model.named_parameters():
            v.requires_grad = True  # train all layers
            count += 1
            if any(x in k for x in freeze):
                v.requires_grad = False
                count_frozen += 1
                params_count_frozen += v.numel()
            params_count += v.numel()
        print(f"[INFO] Frozen {count_frozen}/{count} layers.")
        print(f"[INFO] Frozen {params_count_frozen}/{params_count} parameters.")

    def unfreeze_backbone(self):
        # unfreeze backbone params
        for k, v in self.model.named_parameters():
            v.requires_grad = True  # train all layers
            # v.register_hook(lambda x: torch.nan_to_num(x))  # NaN to 0 (commented for erratic training results)
        return self
    
    def train(self, data, opt={}, freeze=False):
        print(f"[INFO] Training model on {data} with options: {opt}")
        if freeze:
            self.freeze_backbone(freeze)
        self.model.train(data=data,
                         device=self.device,
                         **opt
                        )
        metrics = self.model.val(data=data, 
                                 device=self.device, 
                                 **opt
                                 )
        return metrics
    
    def validate(self, data, opt={}):
        print(f"[INFO] Validating model on {data} with options: {opt}")
        metrics = self.model.val(data=data, 
                                 device=self.device, 
                                 **opt
                                 )
        return metrics
    
    def predict(self, img_path, opt={}):
        return self.model.predict(img_path, 
                                  device=self.device, 
                                  **opt
                                 )
def run_predict():
    model_modes = ['edge', 'basic', 'shape', 'yolov8s']
    for mmode in model_modes:
        if mmode == 'yolov8s':
            model_path = "yolov8s.yaml"
        else:
            model_path = f"final_models/weights/{mmode}.pt"

        opt_predict = { "imgsz": 640, "save": True, "project": mmode}

        detector = CamoDetector(model_path, device)
        res = detector.predict("demo_images/people_in_smoke.jpeg", opt_predict)

def run_train(model_path):
    detector = CamoDetector(model_path, device=device)
    metrics = detector.train("camo_m.yaml", opt_train, freeze=0)
    val_metrics = detector.validate("camo.yaml", opt_test)
    print(metrics)
    print(val_metrics)

def run_validate(model_path):
    detector = CamoDetector(model_path, device=device)
    val_metrics = detector.validate("camo.yaml", opt_test)
    print(val_metrics)

if __name__ == '__main__':
    model_path = "final_models/weights/basic.pt"
    # run_train(model_path)
    # run_validate(model_path)
    run_predict()