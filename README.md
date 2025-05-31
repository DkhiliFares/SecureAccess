
# 🔐 SecureAccess — Smart Access Control & Monitoring System

> 🧠 Multimodal authentication | 📷 Face Recognition | 📱 Web Monitoring | 🔒 Secure Room Access

![GitHub repo size](https://img.shields.io/github/repo-size/DkhiliFares/SecureAccess)
![GitHub stars](https://img.shields.io/github/stars/DkhiliFares/SecureAccess?style=social)
![Made with](https://img.shields.io/badge/Made%20with-Python%20%26%20Flask-blue)
![License](https://img.shields.io/github/license/DkhiliFares/SecureAccess)

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


---

## 🚀 Technologies Used

| Component        | Tech Stack                                            |
| ---------------- | ----------------------------------------------------- |
| Hardware         | Raspberry Pi 3, RFID-RC522, PIR Sensor, Camera, Relay |
| Software         | Python, Flask, OpenCV, face\_recognition, RPi.GPIO    |
| Frontend Web App | HTML5, CSS3, JavaScript                               |
| Database         | SQLite / JSON-based logs                              |
| Deployment       | Localhost / Raspberry Pi                              |

---

## 📸 Screenshots

> *You can replace these with real image files in your repo*

* **Dashboard (WebApp)**
  ![Dashboard](./screenshots/dashboard.png)

* **Authentication Logs**
  ![Logs](./screenshots/logs.png)

* **Sensor Monitoring**
  ![Sensors](./screenshots/sensors.png)

* **Door History**
  ![Door](./screenshots/door.png)

---

## 🧪 Test Scenarios

| Test Case             | Expected Result     |
| --------------------- | ------------------- |
| ✅ All factors correct | Access granted      |
| ❌ Wrong RFID          | Access denied       |
| ❌ Unrecognized face   | Access denied       |
| ❌ Wrong PIN           | Access denied       |
| ❌ No motion           | System remains idle |

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
* 👨‍🏫 **Supervisor** — Hizem Moez

---

## 📚 Resources

* [OpenCV Documentation](https://docs.opencv.org/)
* [Flask Framework](https://flask.palletsprojects.com/)
* [Raspberry Pi GPIO](https://www.raspberrypi.org/documentation)
* [RFID Python Library](https://pypi.org/project/mfRC522)

---

## ⚖️ License

This project is licensed under the MIT License. See `LICENSE` for more information.

---

> *“SecureAccess — Because smart access means smarter security.”*

```

---

