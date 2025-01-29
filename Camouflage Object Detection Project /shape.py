import torch.fft
import torch
from PIL import Image
import matplotlib.pyplot as plt
import numpy as np
import torchvision.transforms as T

img = Image.open("/900G/dataset/COD10K-v3/images/train/COD10K-CAM-3-Flying-60-Heron-3905.jpg")
#img = Image.open("./COD10K-CAM-3-Flying-60-Heron-3905.png")
img = img.convert('L')
img = np.array(img).astype(float)
#img = torch.from_numpy(img)
#transform = T.Resize((640, 640))
#img = transform(torch.from_numpy(img))
print(img.shape)

import numpy as np
import matplotlib.pyplot as plt
import kymatio.numpy as kp

# Example image (2D array)

# Define wavelet scattering parameters
J = 2  # Number of scales
L = 8  # Number of angles
#image_size = img.shape[0]

def rgb_to_ycbcr(image: torch.Tensor) -> torch.Tensor:
    r"""Convert an RGB image to YCbCr.

    Args:
        image (torch.Tensor): RGB Image to be converted to YCbCr.

    Returns:
        torch.Tensor: YCbCr version of the image.
    """

    if not torch.is_tensor(image):
        raise TypeError("Input type is not a torch.Tensor. Got {}".format(
            type(image)))

    if len(image.shape) < 3 or image.shape[-3] != 3:
        raise ValueError("Input size must have a shape of (*, 3, H, W). Got {}"
                         .format(image.shape))

    r: torch.Tensor = image[..., 0, :, :]
    g: torch.Tensor = image[..., 1, :, :]
    b: torch.Tensor = image[..., 2, :, :]

    delta = .5
    y: torch.Tensor = .299 * r + .587 * g + .114 * b
    cb: torch.Tensor = (b - y) * .564 + delta
    cr: torch.Tensor = (r - y) * .713 + delta
    return torch.stack((y, cb, cr), -3)

#yCBCR_Image = rgb_to_ycbcr(torch.from_numpy(img))
#yCBCR_Image = yCBCR_Image.numpy()
#image_size = yCBCR_Image.shape[0]

# Compute wavelet scattering transform
scattering = kp.Scattering2D(J=J, shape=img.shape, L=L)
#src_img_tensor = torch.from_numpy(img).to(device).contiguous()
#device = "cuda"
#scattering = scattering.cuda()
src_img_tensor = torch.from_numpy(img).to("cpu").contiguous()
scattering_coeffs = scattering(img)

# Plot the original image
plt.figure(figsize=(8, 4))
plt.subplot(1, 3, 1)
plt.imshow(img, cmap='gray')
plt.title('Original Image')
plt.axis('off')

# Plot the first-order scattering coefficients
plt.subplot(1, 3, 2)
plt.imshow(scattering_coeffs[1], cmap='viridis')
plt.title('First-order Scattering Coefficients')
plt.axis('off')

# Plot the second-order scattering coefficients
plt.subplot(1, 3, 3)
plt.imshow(scattering_coeffs[2], cmap='viridis')
plt.title('Second-order Scattering Coefficients')
plt.axis('off')

plt.tight_layout()
plt.show()
plt.imsave('COD10K-CAM-3-Flying-60-Heron-3905_s1.png', scattering_coeffs[1])
plt.imsave('COD10K-CAM-3-Flying-60-Heron-3905_s2.png', scattering_coeffs[2])
