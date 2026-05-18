import cv2
import numpy as np
from pyzbar.pyzbar import decode
from PIL import Image
import io

def decode_qr(image_bytes: bytes) -> str:
    try:
        # Load image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return None

        def try_decode(image, method_name):
            print(f"Trying QR decode method: {method_name}")
            # Try pyzbar
            decoded = decode(image)
            if decoded:
                print(f"Success with {method_name} (pyzbar)")
                return decoded[0].data.decode('utf-8')
            # Try OpenCV
            detector = cv2.QRCodeDetector()
            data, _, _ = detector.detectAndDecode(image)
            if data:
                print(f"Success with {method_name} (OpenCV)")
                return data
            return None

        # 1. Try original image
        res = try_decode(img, "Original")
        if res: return res

        # 2. Try Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        res = try_decode(gray, "Grayscale")
        if res: return res

        # 3. Try Thresholding
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        res = try_decode(thresh, "Threshold")
        if res: return res

        # 4. Try Otsu's Thresholding
        _, thresh_otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        res = try_decode(thresh_otsu, "Otsu")
        if res: return res

        # 5. Try Resizing (Upscaling)
        height, width = gray.shape
        upscaled = cv2.resize(gray, (width * 2, height * 2), interpolation=cv2.INTER_CUBIC)
        res = try_decode(upscaled, "Upscaled")
        if res: return res

        print("All QR decoding methods failed.")
        return None
    except Exception as e:
        print(f"Error decoding QR: {e}")
        return None

