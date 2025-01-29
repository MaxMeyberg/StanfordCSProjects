import torch
import torch.nn as nn
import torchvision
from torchvision import models, transforms, utils
from torch.autograd import Variable
import numpy as np
import matplotlib.pyplot as plt
import scipy.misc
from pathlib import Path
from PIL import Image
import json
import sys
import os
import seaborn as sns

device = 'cpu'
mode = 'dev' # 'pip' or 'dev'

transform = transforms.Compose([
    transforms.Resize((640, 640)),
    transforms.ToTensor(),
    transforms.Normalize(mean=0., std=1.)
])

if mode == 'dev':
    sys.path.insert(0, os.getcwd()+'/ultralytics')

from ultralytics import YOLO
import ultralytics

def load_image(image_path, transform):
    image = Image.open(image_path)
    image = transform(image)
    image = image.unsqueeze(0).to(device)
    return image

def load_model(model_path):
    model = YOLO(model_path)
    return model

def extract_cnn_weight(model):
    model_weights =[]
    conv_layers = list(filter(lambda x: isinstance(x, nn.Conv2d), model.modules()))
    for l in conv_layers:
        model_weights.append(l.weight)

    return model_weights

def hook_fn(module, input, output):
    intermediate_features.append(output)

# Define feature extraction function
def extract_features(model, img, layer_index=20): ##Choose the layer that fit your application
    global intermediate_features
    intermediate_features = []
    hook = model.model.model[layer_index].register_forward_hook(hook_fn)
    # print(hook)
    with torch.no_grad():
        model(img)
    hook.remove()
    return intermediate_features[0]  # Access the first element of the list

# Make sure to preprocess the image since the input image must be 640x640x3
def preprocess_image(img_path):
    transform = transforms.Compose([
        transforms.Resize((640, 640)),
        transforms.Grayscale(num_output_channels=3),  # Convert to RGB
        transforms.ToTensor(),
        transforms.Normalize(mean=0., std=1.)
    ])
    img = Image.open(img_path)
    img = transform(img)
    img = img.unsqueeze(0)
    
    return img

# Plot the Features extracted
def extract_and_plot_features(img_path, out_path, layer_index=20, channel_index=5):
    
    img = preprocess_image(img_path)
    features = extract_features(model, img, layer_index)

    plt.figure(figsize=(10, 5))
    sns.heatmap(features[0][channel_index].cpu().numpy(), cmap='viridis', annot=False)
    plt.title(f'Features for {img_path.name} - Layer {layer_index} - Channel {channel_index}')
    plt.savefig(out_path)
    plt.clf()

def predict(model, img_path, opt={}):
    return model.predict(img_path, 
                        device=device, 
                        **opt
                        )

def visTensor(tensor, ch=0, allkernels=False, nrow=8, padding=1): 
    tensor = tensor.permute(3, 2, 0, 1)
    n,c,w,h = tensor.shape

    if allkernels: tensor = tensor.view(n*c, -1, w, h)
    elif c != 3: tensor = tensor[:,ch,:,:].unsqueeze(dim=1)
    rows = np.min((tensor.shape[0] // nrow + 1, 64))    
    grid = utils.make_grid(tensor, nrow=nrow, normalize=True, padding=padding)
    plt.figure( figsize=(nrow, rows) )
    plt.imshow(grid.numpy().transpose((1, 2, 0)))

def visulize_kernel(model, outpath_dir):
    weights = extract_cnn_weight(model)
    # for i, w in enumerate(weights):
    visTensor(weights[1])
    plt.axis('off')
    plt.ioff()
    plt.savefig(f'{outpath_dir}/kernel.jpg')

if __name__ == '__main__':
    test_imgs = [
        'test/COD10K-CAM-1-Aquatic-2-ClownFish-10.jpg', 
        'train/COD10K-CAM-3-Flying-60-Heron-3905.jpg', 
        'test/COD10K-CAM-1-Aquatic-3-Crab-30.jpg', 
        'test/COD10K-CAM-2-Terrestrial-24-Caterpillar-1548.jpg', 
        'test/COD10K-CAM-3-Flying-59-Grasshopper-3636.jpg', 
        'test/COD10K-CAM-1-Aquatic-13-Pipefish-556.jpg'
    ]

    opt_test = {
        "imgsz": 640,
        # "iou": 0.5,
        "save": True,
    }

    model_path = "../weight/yolov8n.pt"
    # model_path = "../weight/s_best_0601.pt"
    # mode = 'yolov8'
    # model_path = f"../weight/best_{mode}.pt"
    model = load_model(model_path)

    # visulize_kernel(model, f'results/{mode}/')
    
    for img_path in test_imgs:
        img_path = Path(f'../datasets/cod10K/images/{img_path}')
        if not os.path.exists(f'results/{mode}/{img_path.stem}'):
            os.makedirs(f'results/{mode}/{img_path.stem}')
        for i in range(0, 22):
            extract_and_plot_features(img_path, layer_index=i, out_path=f'results/{mode}/{img_path.stem}/feature_map_{i}.jpg')
        prediction = predict(model, img_path, opt=opt_test)
    # image_path = Path(r'../datasets/cod10K/images/train/COD10K-CAM-1-Aquatic-1-BatFish-1.jpg')
    
    # model = load_model(model_path)
    # image = load_image(image_path, transform)
    # visulize_feature_map(model, image, layer_num, save_path)
    # img = preprocess_image(image_path)
    # features = extract_features(model, img, layer_index=20)
    # for i in range(0, 20):
        # extract_and_plot_features(image_path, layer_index=i, out_path=f'results/feature_map_{i}.jpg')
    # extract_and_plot_features(image_path, layer_index=20)