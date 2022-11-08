import PIL
import yaml
from typing import List

STICKER_INFO_YAML_PATH = "../resources/sticker_info.yaml"
PIXEL_RESIZE_SIZES_KEY = 'pixel_resize_sizes'

""""
Function to take an image array and resize it to various values as defined in the YAML File and return a list of resized image data
"""
IMG_TYPE = List[List[List[int]]]
IMG_ARRAY = List[IMG_TYPE]
def resize_image(img_arr : IMG_TYPE ) -> IMG_ARRAY :
    image = PIL.Image(img_arr)
    resize_sizes = list()
    with open(STICKER_INFO_YAML_PATH, 'r') as file:
        resize_sizes = yaml.safe_load(file)[PIXEL_RESIZE_SIZES_KEY]

    resized_images = list()
    for new_width, new_height in resize_sizes :
        # Resizes the image and retains aspect ratio
        resized_img = PIL.ImageOps.contain(image, (new_width, new_height))
        resized_image_values = resized_img.getdata()
        resized_images.append(resized_image_values)
    return resized_images