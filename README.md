
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

cmake -D CMAKE_BUILD_TYPE=RELEASE -D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules ..

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
---
![image](https://github.com/user-attachments/assets/7d1f9959-74d4-4979-b36b-69bd13f6da55)

---

**📸 Run the Application**

*1-take photos for the dataset(headshot_picam.py take over 50 photos)*
try to capture yourself with a different angles
```bash
python3 headshotpicam.py
```
*dataset*

![image](https://github.com/user-attachments/assets/4a7e8f14-e365-42d6-b5a7-ff21087f5376)


*note !* by changing the known name in headshot_picam.py you can add more than one authorized person in this case i used to train the model only with my own face

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

*this code uses requests to send data (images+Auth attempts)*

🐍 back.py code [https://github.com/DkhiliFares/SecureAccess/blob/main/back.py]

*First test (unknown/known Faces)*
![image](https://github.com/user-attachments/assets/d0175dde-921d-4656-b3bd-0c851a28922f)





### 🌐 Web App Side
This is the link to download the App (see readme.md to deploy it correctly ) 
https://github.com/DkhiliFares/SecureAccess/tree/main/Secure_Access_Site

**Dashboard (WebApp)**
![image](https://github.com/user-attachments/assets/c7351453-b5cd-41e2-9a0a-e5932e590c04)



**Authentication Logs**
![image](https://github.com/user-attachments/assets/f9df95ef-8a99-4719-8ce6-a1147e6e4f8e)


**Sensor Monitoring**
![image](https://github.com/user-attachments/assets/617fb9d7-f036-4100-9db7-d9da469cfed2)


  ![image](https://github.com/user-attachments/assets/233a6daf-0678-491a-a567-e7c0174e812f)

**Door History**
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


