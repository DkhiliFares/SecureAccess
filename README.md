
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

* **Dashboard (WebApp)**
![Capture d'écran 2025-05-31 105959](https://github.com/user-attachments/assets/1f3d3ed0-ef38-41b8-948d-680e31fecc6b)


* **Authentication Logs**
![image](https://github.com/user-attachments/assets/f9df95ef-8a99-4719-8ce6-a1147e6e4f8e)


* **Sensor Monitoring**
![image](https://github.com/user-attachments/assets/94517377-7dd0-4de9-a93a-1beb6f333ef0)

![image](https://github.com/user-attachments/assets/233a6daf-0678-491a-a567-e7c0174e812f)

* **Door History**
![image](https://github.com/user-attachments/assets/e9d02314-b85b-48ed-9456-127626727160)


---

## 🧪 Test Scenarios

| Test Case             | Expected Result     |
| --------------------- | ------------------- |
| ✅ All factors correct | Access granted      |
| ❌ Wrong RFID          | Access denied       |
| ❌ Unrecognized face   | Access denied       |
| ❌ Wrong PIN           | Access denied       |
| ❌ No motion           | System remains idle |
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


