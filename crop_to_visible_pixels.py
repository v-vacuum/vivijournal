import os
import sys
from PIL import Image

def crop_visible_pixels(image):
    # Ensure image is in RGBA mode
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    # Extract the alpha channel
    alpha = image.getchannel('A')
    # Create a binary mask: pixels with alpha > 1 become 255, otherwise 0.
    mask = alpha.point(lambda p: 255 if p > 1 else 0)
    # Get the bounding box of the non-zero regions in the mask
    bbox = mask.getbbox()
    if bbox:
        return image.crop(bbox)
    # If no visible pixels found, return the original image
    return image

def process_directory(directory):
    for filename in os.listdir(directory):
        if filename.lower().endswith('.png'):
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    cropped_img = crop_visible_pixels(img)
                    cropped_img.save(filepath)
                    print(f"Cropped and saved: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_directory("public")
