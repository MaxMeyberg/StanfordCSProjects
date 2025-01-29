from ultralytics.data.converter import convert_coco
import cv2
from tqdm import tqdm

def convert_camo():
    convert_coco(labels_dir='../data/COD10K-v3/annotations', save_dir='../data/cod10k_converted/')

def convert_non_camo():
    train_names = []
    test_names = []
    with open('../data/COD10K-v3 2/Info/CAM_train.txt', 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            name, c = line.split()
            name = name.split('/')[-1].split('.')[0]
            train_names.append(name)

    with open('../data/COD10K-v3 2/Info/CAM_test.txt', 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            name, c = line.split()
            name = name.split('/')[-1].split('.')[0]
            test_names.append(name)
    
    train_names = set(train_names)
    test_names = set(test_names)

    modes = ["Train", "Test"]
    for mode in modes:
        dir_name = "train_labels" if mode == 'Train' else "test_labels"
        img_name = "train" if mode == 'Train' else "val"
        with open(f'../data/COD10K-v3/CAM-NonCAM_Instance_{mode}.txt', 'r') as f:
            lines = f.readlines()
            n = len(lines)
            i = 0
            pbar = tqdm(total=n)
            while i < n:
                line = lines[i]
                line = line.strip()
                if '[INFO]' in line:
                    _, name, c = line.split()
                    c = int(c)
                    if c == 0:
                        i += 1
                        continue
                    name = name.split('/')[-1].split('.')[0]
                    if name in train_names or name in test_names:
                        i += 1
                        continue
                    img = cv2.imread(f'../yolov8/datasets/cod10K/images/{img_name}/{name}.jpg')
                    # if img is None:
                    print(name)
                    img_h, img_w, _ = img.shape
                    with open(f'../data/cod10k_converted/labels/{dir_name}/{name}.txt', 'w') as f2:
                        for j in range(c):
                            i += 1
                            line = lines[i].strip()
                            _, x, y, w, h, _ = line.split()
                            x, y, w, h = float(x), float(y), float(w), float(h)
                            x, y = float(x+w/img_w), float(y+h/img_h)
                            x, y, w, h = x/img_w, y/img_h, w/img_w, h/img_h
                            f2.write(f'0 {x:.6f} {y:.6f} {w:.6f} {h:.6f}\n')
                i += 1
                pbar.update(1)

if __name__ == '__main__':
    convert_camo()
    # convert_non_camo()