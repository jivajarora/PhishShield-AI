import cv2
import numpy as np
from PIL import Image
import io

try:
    from pyzbar.pyzbar import decode
    HAS_PYZBAR = True
except ImportError:
    decode = None
    HAS_PYZBAR = False


def decode_qr(image_bytes: bytes) -> str:
    try:
        # Load image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return None

        def try_decode(image, method_name):
            print(f"Trying QR decode method: {method_name}")
            # Try pyzbar if available
            if HAS_PYZBAR and decode is not None:
                try:
                    decoded = decode(image)
                    if decoded:
                        print(f"Success with {method_name} (pyzbar)")
                        return decoded[0].data.decode('utf-8')
                except Exception as pyzbar_err:
                    print(f"pyzbar decoding failed: {pyzbar_err}")
            
            # Try OpenCV
            detector = cv2.QRCodeDetector()
            data, _, _ = detector.detectAndDecode(image)
            if data:
                print(f"Success with {method_name} (OpenCV)")
                return data
            return None

        # Gather different preprocessed versions of the image to try
        pipelines = []
        
        # 1. Base image versions
        pipelines.append((img, "Original"))
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        pipelines.append((gray, "Grayscale"))
        
        # 2. Add border to original and grayscale (handles missing quiet zones)
        for border_w in [10, 20, 30, 40]:
            bordered_color = cv2.copyMakeBorder(img, border_w, border_w, border_w, border_w, cv2.BORDER_CONSTANT, value=[255, 255, 255])
            pipelines.append((bordered_color, f"Border-{border_w}px"))
            bordered_gray = cv2.copyMakeBorder(gray, border_w, border_w, border_w, border_w, cv2.BORDER_CONSTANT, value=[255, 255, 255])
            pipelines.append((bordered_gray, f"Grayscale-Border-{border_w}px"))

        # 3. Downscale high-resolution images or upscale low-resolution images
        h, w = gray.shape
        # Try target sizes around 500px, 800px (handles high/low resolution matching)
        for target_w in [500, 800]:
            if abs(w - target_w) > 50:
                scale = target_w / w
                resized = cv2.resize(img, (target_w, int(h * scale)), interpolation=cv2.INTER_CUBIC)
                resized_gray = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
                
                # Try resized original
                pipelines.append((resized, f"Resized-{target_w}px"))
                pipelines.append((resized_gray, f"Resized-Gray-{target_w}px"))
                
                # Resized with border
                for border_w in [10, 20, 30]:
                    res_bordered = cv2.copyMakeBorder(resized, border_w, border_w, border_w, border_w, cv2.BORDER_CONSTANT, value=[255, 255, 255])
                    pipelines.append((res_bordered, f"Resized-{target_w}px-Border-{border_w}px"))
                    
                    res_bordered_gray = cv2.copyMakeBorder(resized_gray, border_w, border_w, border_w, border_w, cv2.BORDER_CONSTANT, value=[255, 255, 255])
                    pipelines.append((res_bordered_gray, f"Resized-Gray-{target_w}px-Border-{border_w}px"))

        # 4. Add thresholding pipelines
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        pipelines.append((thresh, "Threshold-127"))
        _, otsu = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        pipelines.append((otsu, "Threshold-Otsu"))
        
        # Add border to thresholded
        for border_w in [15, 30]:
            otsu_border = cv2.copyMakeBorder(otsu, border_w, border_w, border_w, border_w, cv2.BORDER_CONSTANT, value=[255, 255, 255])
            pipelines.append((otsu_border, f"Otsu-Border-{border_w}px"))

        # Run all pipelines until we find a match
        for processed_img, method_name in pipelines:
            res = try_decode(processed_img, method_name)
            if res:
                return res
                
        print("All QR decoding pipelines failed.")
        return None
    except Exception as e:
        print(f"Error decoding QR: {e}")
        return None

