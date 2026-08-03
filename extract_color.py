from PIL import Image
from collections import Counter

img_path = "./downloaded_images/mathildaLogo-min-300x141-1.png"

try:
    img = Image.open(img_path)
    img = img.convert("RGBA")
    pixels = img.getdata()
    
    # We want to find the orange color of the circles
    # Orange typically has high Red, medium Green, and low Blue.
    # Also ignore fully transparent pixels.
    orange_pixels = []
    for r, g, b, a in pixels:
        if a > 150: # Ignore transparent/semi-transparent pixels
            # Filter for orange range: high Red, moderate Green, low Blue
            if r > 180 and 50 < g < 150 and b < 50:
                orange_pixels.append((r, g, b))
                
    if orange_pixels:
        # Find the most common orange color
        counter = Counter(orange_pixels)
        most_common = counter.most_common(5)
        print("Top 5 exact orange RGB values found in the logo:")
        for color, count in most_common:
            hex_color = "#{:02x}{:02x}{:02x}".format(*color)
            print(f"RGB: {color} -> Hex: {hex_color} (Count: {count})")
    else:
        print("No orange pixels matched the strict criteria. Listing all non-grayscale pixels...")
        non_gray = []
        for r, g, b, a in pixels:
            if a > 200:
                # check if there's a difference between R, G, B (i.e. not grayscale)
                if abs(r - g) > 30 or abs(r - b) > 30:
                    non_gray.append((r, g, b))
        counter = Counter(non_gray)
        most_common = counter.most_common(10)
        for color, count in most_common:
            hex_color = "#{:02x}{:02x}{:02x}".format(*color)
            print(f"RGB: {color} -> Hex: {hex_color} (Count: {count})")
            
except Exception as e:
    print(f"Error: {e}")
