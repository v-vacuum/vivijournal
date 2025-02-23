import os
import sys
from PIL import Image

def get_visible_bbox(image):
    """
    Returns the bounding box (left, upper, right, lower) of the visible (alpha > 1)
    pixels in the image. Returns None if no visible pixels are found.
    """
    # Ensure image is in RGBA mode to access the alpha channel
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    alpha = image.getchannel('A')
    # Create a binary mask: visible pixels (alpha > 1) become 255, others 0.
    mask = alpha.point(lambda p: 255 if p > 1 else 0)
    return mask.getbbox()

def union_bbox(bbox1, bbox2):
    """
    Returns the union of two bounding boxes.
    If one is None, returns the other.
    If both are None, returns None.
    """
    if bbox1 is None and bbox2 is None:
        return None
    if bbox1 is None:
        return bbox2
    if bbox2 is None:
        return bbox1
    left = min(bbox1[0], bbox2[0])
    upper = min(bbox1[1], bbox2[1])
    right = max(bbox1[2], bbox2[2])
    lower = max(bbox1[3], bbox2[3])
    return (left, upper, right, lower)

def crop_visible_pixels(image, bbox=None):
    """
    Crops the image to the provided bbox.
    If bbox is None, it calculates the visible bbox.
    """
    if bbox is None:
        bbox = get_visible_bbox(image)
    if bbox:
        return image.crop(bbox)
    return image

def process_directory(directory):
    # Group images by their base name (ignoring "-hover" suffix)
    groups = {}
    for filename in os.listdir(directory):
        if filename.lower().endswith('.png'):
            if filename.lower().endswith('-hover.png'):
                base = filename[:-len('-hover.png')]
                groups.setdefault(base, {})['hover'] = filename
            else:
                base = filename[:-len('.png')]
                groups.setdefault(base, {})['normal'] = filename

    for base, group in groups.items():
        if 'normal' in group and 'hover' in group:
            # Process the pair together
            normal_path = os.path.join(directory, group['normal'])
            hover_path = os.path.join(directory, group['hover'])
            try:
                with Image.open(normal_path) as normal_img, Image.open(hover_path) as hover_img:
                    normal_img = normal_img.convert('RGBA')
                    hover_img = hover_img.convert('RGBA')

                    # Compute the visible bounding boxes for both images
                    bbox_normal = get_visible_bbox(normal_img)
                    bbox_hover = get_visible_bbox(hover_img)
                    # Determine the union of the two bounding boxes
                    combined_bbox = union_bbox(bbox_normal, bbox_hover)

                    if combined_bbox:
                        normal_cropped = normal_img.crop(combined_bbox)
                        hover_cropped = hover_img.crop(combined_bbox)
                    else:
                        normal_cropped = normal_img
                        hover_cropped = hover_img

                    normal_cropped.save(normal_path)
                    hover_cropped.save(hover_path)
                    print(f"Cropped group: {group['normal']} and {group['hover']}")
            except Exception as e:
                print(f"Error processing group {base}: {e}")
        else:
            # Process a single image normally
            filename = group.get('normal') or group.get('hover')
            filepath = os.path.join(directory, filename)
            try:
                with Image.open(filepath) as img:
                    img = img.convert('RGBA')
                    cropped_img = crop_visible_pixels(img)
                    cropped_img.save(filepath)
                    print(f"Cropped: {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

if __name__ == "__main__":
    process_directory("public")
