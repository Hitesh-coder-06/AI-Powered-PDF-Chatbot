import easyocr

print("Loading EasyOCR model...")

reader = easyocr.Reader(['en'])  # English model

print("EasyOCR Model Loaded Successfully!")

image_path = "../uploads/sampleimage.png"  # Change path if needed

print("\nRunning OCR...")

result = reader.readtext(image_path)

print("\nDetected Text:\n")

for detection in result:
    # detection = [bbox, text, confidence]
    print(f"Text: {detection[1]}")
    print(f"Confidence: {detection[2]:.2f}")
    print("-" * 40)