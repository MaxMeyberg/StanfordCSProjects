import torch.fft
import torch
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np

img = Image.open("/900G/dataset/COD10K-v3/images/train/COD10K-CAM-3-Flying-60-Heron-3905.jpg")
img = img.convert('L')
img = np.array(img)
img = torch.from_numpy(img)
print(img.shape)

fft_img = torch.fft.fft2(img)
print(fft_img.shape)
print(fft_img[0][:5])


# Now Highpass filter

hp_image = np.fft.fftshift(fft_img)
#hp_image = highpass(fft_img)
filter_rate=0.9
h, w = hp_image.shape[:2]
# center
cy, cx = h//2, w//2
filter_h = int(filter_rate * cy)
filter_w = int(filter_rate * cx)

hp_image[cy - filter_h:cy+filter_h, cx - filter_w:cx + filter_w] = 0

# restore
inverse_hp_image = np.fft.ifftshift(hp_image)
#inverse_hp_image = inverse_highpass(hp_image)
# inverse fft using torch
ihp_img = torch.fft.ifft2(torch.from_numpy(inverse_hp_image))

ihp_img = ihp_img.to('cpu').detach().numpy().copy()
ihp_img = np.abs(9*ihp_img).clip(0,255).astype(np.uint8)
#ihp_img = ihp_img.real.astype(np.uint8)
plt.imshow(ihp_img, cmap="gray")
plt.imsave('COD10K-CAM-3-Flying-60-Heron-3905.png', ihp_img)


