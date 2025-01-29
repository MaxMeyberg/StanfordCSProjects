# https://www.youtube.com/watch?v=uMzOcCNKr5A
from ultralytics import YOLO
import cv2

model = YOLO("./weight/best_374.pt")
video = './Camo_Youtube.mov'
# c = cv2.VideoCapture(video)
c = cv2.VideoCapture(1)

frame = True
while frame:
    frame, F = c.read()
    if frame:
        results = model.track(F, persist=True)
        F_ = results[0].plot()
        cv2.imshow('F', F_)
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break
