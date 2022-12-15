import io
import PIL
from PIL import Image
import yaml
from typing import List
from celery import Celery
import debugpy
import redis

app = Celery('tasks', backend='redis://redis:6379/0', broker='amqp://guest:guest@rabbitmq:5672//')
r = redis.Redis(host='redis', port=6379, db=0)
pipeline = r.pipeline()

STICKER_INFO_YAML_PATH = "../resources/sticker_info.yaml"
PIXEL_RESIZE_SIZES_KEY = 'pixel_resize_sizes'

# debugpy.listen(5678)
# print("Waiting for debugger attach")
# debugpy.wait_for_client()

@app.task(bind=True)
def resize_image(self, icon):
    """"
    Function to take an image and resize it to various values 
    as defined in the YAML File and return a list of resized image data
    """
    # print('break on this line')
    # debugpy.breakpoint()
    f = io.BytesIO(bytearray(icon['data']['data']))
    image = PIL.Image.open(f)
    resize_sizes = list()
    with open(STICKER_INFO_YAML_PATH, 'r') as file:
        resize_sizes = yaml.safe_load(file)[PIXEL_RESIZE_SIZES_KEY]
    result_keys = []
    for new_width, new_height in resize_sizes:
        # Resizes the image and retains aspect ratio
        resized_img = PIL.ImageOps.contain(image, (new_width, new_height))
        img_byte_arr = io.BytesIO()
        resized_img.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        key = f"resized_images/{self.request.id}/{new_width}x{new_height}"
        pipeline.set(key, img_byte_arr)
        result_keys.append(key)

    pipeline.execute()
    return {'data':result_keys}

@app.task
def hello():
    return 'hello world'

@app.task
def add(x, y):
    return x + y