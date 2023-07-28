from PIL import Image
import os

def create_thumbnail(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        input_path = os.path.join(input_folder, filename)

        if os.path.isfile(input_path):
            try:
                img = Image.open(input_path)
                img.thumbnail((300, 300))

                # Create the thumbnail filename
                thumb_filename = f"{os.path.splitext(filename)[0]}_thumb.png"
                output_path = os.path.join(output_folder, thumb_filename)

                img.save(output_path)
                print(f"Thumbnail created: {output_path}")
            except IOError:
                print(f"Error creating thumbnail for: {input_path}")
        else:
            print(f"Skipping non-file item: {input_path}")

if __name__ == "__main__":
    input_folder = "./"
    output_folder = "./thumbnails"
    create_thumbnail(input_folder, output_folder)