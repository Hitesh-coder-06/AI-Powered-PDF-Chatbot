import sys
import os
import easyocr

# -------------------------------
# Check image path
# -------------------------------

if len(sys.argv) < 2:
    print("ERROR: No image path provided")
    sys.exit(1)

image_path = sys.argv[1]

if not os.path.exists(image_path):
    print("ERROR: Image not found")
    print(image_path)
    sys.exit(1)

# -------------------------------
# Load OCR Model
# -------------------------------

reader = easyocr.Reader(['en'])

try:

    # Perform OCR
    result = reader.readtext(image_path)

    extracted_text = []

    # Read recognized text
    for detection in result:
        # detection = [bbox, text, confidence]
        extracted_text.append(detection[1])

    final_text = "\n".join(extracted_text)

    print(final_text)

except Exception as e:

    print("ERROR:")
    print(str(e))