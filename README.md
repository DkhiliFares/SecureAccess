
# 🔐 SecureAccess — Smart Access Control & Monitoring System

> 🧠 Multimodal authentication | 📷 Face Recognition | 📱 Web Monitoring | 🔒 Secure Room Access



---

## 🧭 Overview

**SecureAccess** is an intelligent access control system designed to secure sensitive rooms such as laboratories or private offices using **multi-factor authentication**:

- RFID Badge
- Facial Recognition (AI-based)
- PIN Code
- PIR Presence Sensor (for activation)

🖥 A custom-built web application provides **remote monitoring**, **access logs**, and **real-time alerts**.

> ✅ Cost-efficient, scalable, and secure.

---

## 🧠 Features

- 👁️‍🗨️ **Presence Detection** — PIR sensor triggers authentication
- 🧾 **RFID Authentication** — Badge scanning with UID recognition
- 🎭 **Facial Recognition** — Powered by OpenCV and `face_recognition` lib
- 🔐 **PIN Code** — Numeric entry via keypad
- ⚙️ **Web Dashboard** — Monitor access attempts, users, door status & sensors
- 🌐 **Flask API** — Lightweight local server to manage system logic
- 💡 **Energy Efficient** — Only activates on detected presence

---

## 🏗️ System Architecture
![graphe fares ](https://github.com/user-attachments/assets/bdc66664-6197-4763-a59f-70c612f0825f)

![_Logigramme](https://github.com/user-attachments/assets/1afe2ef1-5e23-4347-a047-de5fbc7b698e)


---

## 🚀 Technologies Used

| Component        | Tech Stack                                            |
| ---------------- | ----------------------------------------------------- |
| Hardware         | Raspberry Pi 3, RFID-RC522, PIR Sensor, Camera, Relay |
| Software         | Python, Flask, OpenCV, face\_recognition, RPi.GPIO    |
| Frontend Web App | HTML5, CSS3, JavaScript                               |
| Database         | JSON-based logs                              |
| Deployment       | Localhost / Raspberry Pi                              |

---
## 🖥️ Implementation 
### 🍓 Raspberry Pi Side
#### RAPI Facial Recognition - Setup Instructions

This part all the commands required to set up OpenCV with extra modules and run the RAPI Facial Recognition project.

---

 *🧰 Install Required Packages*

```bash
sudo apt install cmake build-essential pkg-config git
sudo apt install libjpeg-dev libtiff-dev libjasper-dev libpng-dev libwebp-dev libopenexr-dev
sudo apt install libavcodec-dev libavformat-dev libswscale-dev libv4l-dev libxvidcore-dev libx264-dev libdc1394-22-dev libgstreamer-plugins-base1.0-dev libgstreamer1.0-dev
sudo apt install libgtk-3-dev libqtgui4 libqtwebkit4 libqt4-test python3-pyqt5
sudo apt install libatlas-base-dev liblapacke-dev gfortran
sudo apt install libhdf5-dev libhdf5-103
sudo apt install python3-dev python3-pip python3-numpy
```

*📥 Clone OpenCV and Extra Modules*

```bash
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib
```

*🛠️ Build and Install OpenCV*

```bash
mkdir ~/opencv/build
cd ~/opencv/build

cmake -D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
-D ENABLE_NEON=ON \
-D ENABLE_VFPV3=ON \
-D BUILD_TESTS=OFF \
-D INSTALL_PYTHON_EXAMPLES=OFF \
-D OPENCV_ENABLE_NONFREE=ON \
-D CMAKE_SHARED_LINKER_FLAGS=-latomic \
-D BUILD_EXAMPLES=OFF ..

make -j$(nproc)
sudo make install
sudo ldconfig
```

*🐍 Set Up Python Virtual Environment*

```bash
python3 -m venv venv --system-site-packages
source venv/bin/activate
```

*📦 Clone the RAPI Facial Recognition Repository*

```bash
git clone https://github.com/annie-hola/rapi-facial-recognition
cd rapi-facial-recognition
```

*📦 Install Python Dependencies*

```bash
pip install face-recognition
pip install opencv-python
pip install numpy
pip install imutils
pip install dlib
```

**📸 Run the Application**

*1-take photos for the dataset(headshot_picam.py take over 50 photos)*
try to capture yourself with a different angles
```bash
python3 headshotpicam.py
```
*2-train the model*
```bash
python3 train_model.py
```
*3-Test it (2 test needed -> try to test it with your own face & other faces*
```bash
python3 facial_req.py
```
*if the test doesn't work correctly you should improve your dataset (try to make all possible angles or add more photos to the dataset)*

*4- run the main application to real-time capturing and sending data to the web server backend*
```bash
python3 back.py
```
```python
from picamera2 import Picamera2
import cv2
import pickle
import face_recognition
import time
import requests
import random
import string
from datetime import datetime

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
        image_data = prepare_image_for_upload(frame)

        # Prepare form data
        timestamp = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")

        # Create multipart form data
        files = {
            'image': ('face_image.jpg', image_data, 'image/jpeg')
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
```



### 🌐 Web App Side
* **Dashboard (WebApp)**
![image](https://github.com/user-attachments/assets/c7351453-b5cd-41e2-9a0a-e5932e590c04)



* **Authentication Logs**
![image](https://github.com/user-attachments/assets/f9df95ef-8a99-4719-8ce6-a1147e6e4f8e)


* **Sensor Monitoring**
![image](https://github.com/user-attachments/assets/617fb9d7-f036-4100-9db7-d9da469cfed2)


  ![image](https://github.com/user-attachments/assets/233a6daf-0678-491a-a567-e7c0174e812f)

* **Door History**
![image](https://github.com/user-attachments/assets/3deba630-3de9-4d07-99c9-848eeb9de010)

![image](https://github.com/user-attachments/assets/9ce779c1-23b7-456c-b44e-fa03bf4d1ff3)




---

## 🧪 Test Scenarios

| Test Case             | Expected Result     |
| --------------------- | ------------------- |
| ✅ All factors correct | Access granted      |
| ❌ Wrong RFID          | Access denied       |
| ❌ Unrecognized face   | Access denied       |
| ❌ Wrong PIN           | Access denied       |
| ❌ No motion           | System remains idle |

---
Test of an authorized person 
![image](https://github.com/user-attachments/assets/32e296a5-e761-4f60-969c-97f57a721ad3)

![image](https://github.com/user-attachments/assets/1166841c-a969-4479-8e58-f93ade928cb3)

Test of non authorized person
![image](https://github.com/user-attachments/assets/5b9300c5-fd4a-4466-876b-0f3da7353eeb)

Connexion within the Rpi:
![image](https://github.com/user-attachments/assets/f87c3d16-792e-45da-8cf9-0d898c79878f)



> ⏱️ Avg. response time: **2-3 seconds**
> 🎯 Face recognition accuracy: **95%+** (under good lighting)


---

## 🔬 Analysis & Improvements

### ✅ Strengths

* High security with 3-factor authentication
* Lightweight and energy-efficient
* Intuitive admin dashboard
* Low-cost hardware setup

### ⚠️ Limitations

* Facial recognition depends on lighting
* No encryption (yet) — consider HTTPS/TLS
* PIN keypad is sensitive to humidity

### 📈 Future Enhancements

* Add fingerprint sensor
* Mobile companion app
* Intrusion alerts via Email/SMS
* Enhanced AI model for face recognition
* Switch to C++ for faster response time
* Cloud integration (MQTT, Firebase, etc.)

---

## 🧑‍💻 Contributors

* 👨‍🎓 **Dkhili Fares** — [@DkhiliFares](https://github.com/DkhiliFares)
* 👨‍🎓 **Zouari Adam** — [@ZouariAdam](https://github.com/Adam-Zouari)

---

## 📚 Resources

* [OpenCV Documentation](https://docs.opencv.org/)
* [Flask Framework](https://flask.palletsprojects.com/)
* [Raspberry Pi GPIO](https://www.raspberrypi.org/documentation)
* [RFID Python Library](https://pypi.org/project/mfRC522)

---


> *“SecureAccess — Because smart access means smarter security.”*


