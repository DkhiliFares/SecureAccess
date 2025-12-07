from picamera2 import Picamera2
import cv2
import pickle
import face_recognition
import time
import requests
import random
import string
from datetime import datetime
from crypto_utils import encrypt_image_data

# Configuration
BACKEND_URL = "http://192.168.251.1:5000"  # Your Windows machine IP (change if different)
SEND_INTERVAL = 1  # Send data every 1 second for detected faces

# Utility functions
def generate_rfid_id():
    """Generate a random RFID-like ID"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def prepare_image_for_upload(frame):
    """Prepare image data for upload to backend"""
    # Convert frame to BGR for encoding
    bgr_frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    # Encode image as JPEG
    _, buffer = cv2.imencode('.jpg', bgr_frame)
    return buffer.tobytes()

def send_auth_data(name, status, frame, reason=None):
    """Send authentication data with image to the backend"""
    try:
        # Prepare image for upload
        raw_image_data = prepare_image_for_upload(frame)
        
        # Encrypt the image data
        encrypted_image_data = encrypt_image_data(raw_image_data)
        
        if encrypted_image_data is None:
            print("[ERROR] Failed to encrypt image. Aborting send.")
            return

        # Prepare form data
        timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

        # Create multipart form data
        # Note: We send the encrypted bytes. The filename extension is still .jpg to satisfy some server checks,
        # but the content is actually encrypted binary data.
        files = {
            'image': ('face_image.bin', encrypted_image_data, 'application/octet-stream')
        }

        data = {
            'timestamp': timestamp,
            'status': status,
            'rfid_id': generate_rfid_id(),
            'user_name': name if name != "Unknown" else "Inconnu"
        }

        # Add reason if status is refused
        if status == "Refused" and reason:
            data['reason'] = reason

        # Send to backend with image
        response = requests.post(f"{BACKEND_URL}/api/auth_logs",
                               files=files,
                               data=data,
                               timeout=10)

        if response.status_code == 201:
            result = response.json()
            print(f"[INFO] Auth data sent successfully for {name}")
            print(f"[INFO] Image saved at: {result.get('image_path', 'unknown path')}")
        else:
            print(f"[ERROR] Failed to send auth data: {response.status_code}")
            print(f"[ERROR] Response: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Network error sending auth data: {e}")
    except Exception as e:
        print(f"[ERROR] Error sending auth data: {e}")

# Load encodings
encodingsP = "encodings.pickle"
print("[INFO] loading encodings + face detector...")
data = pickle.loads(open(encodingsP, "rb").read())

# Initialize PiCamera2
picam2 = Picamera2()
config = picam2.create_video_configuration(main={"format": "RGB888", "size": (640, 480)})
picam2.configure(config)
picam2.start()

time.sleep(2)  # Warm-up
last_send_time = {}  # Track last send time for each person

try:
    while True:
        frame = picam2.capture_array()
        rgb_frame = frame  # Already RGB888
        boxes = face_recognition.face_locations(rgb_frame)
        encodings = face_recognition.face_encodings(rgb_frame, boxes)
        names = []

        for encoding in encodings:
            matches = face_recognition.compare_faces(data["encodings"], encoding)
            name = "Unknown"

            if True in matches:
                matchedIdxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}

                for i in matchedIdxs:
                    name = data["names"][i]
                    counts[name] = counts.get(name, 0) + 1

                name = max(counts, key=counts.get)

            # Check if we should send data (every second for detected faces)
            current_time = time.time()
            should_send = (name not in last_send_time or
                          current_time - last_send_time[name] >= SEND_INTERVAL)

            if should_send:
                print(f"[INFO] Face detected: {name}")

                # Send authentication data with image
                if name == "Unknown":
                    # Unknown face - refused access
                    send_auth_data(name, "Refused", frame, "Visage non reconnu")
                else:
                    # Known face - granted access
                    send_auth_data(name, "Accepted", frame)

                # Update last send time
                last_send_time[name] = current_time

            names.append(name)

        for ((top, right, bottom, left), name) in zip(boxes, names):
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 225), 2)
            y = top - 15 if top - 15 > 15 else top + 15
            cv2.putText(frame, name, (left, y), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

        cv2.imshow("Face Recognition", cv2.cvtColor(frame, cv2.COLOR_RGB2BGR))
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

finally:
    picam2.stop()
    cv2.destroyAllWindows()
