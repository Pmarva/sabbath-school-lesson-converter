from PIL import Image
import PIL
import os
import glob
import sys


pilt = "/run/media/marva/Failid/õppetükk/2021/03/Õppetükk 2021-03-20210612T103457Z-001/Õppetükk 2021-03/Veebi/6ptyk_kaaned_2021-03_esikaas.jpg"
img = Image.open(pilt)
print(f"The image size dimensions are: {img.size}")
img.save("oppetukk/cover.png",optimize=True,quality=15,format="png",compress_level = 50)

