# Raspberry Pi Face Recognition with Backend Communication

This system integrates face recognition on a Raspberry Pi with a Flask backend to log authentication events.

## Features

- Real-time face detection and recognition
- Automatic authentication logging every second for detected faces
- Image capture and upload to backend server
- Communication with backend API via multipart form data
- Continuous monitoring with 1-second intervals
- Automatic image path generation by backend
- No local image storage (images only saved on backend)

## Setup Instructions

### 1. Prerequisites

Make sure you have the following installed on your Raspberry Pi:

```bash
pip install picamera2 opencv-python face-recognition requests
```

### 2. Configuration

Edit the configuration in `ai.py`:

```python
BACKEND_URL = "http://localhost:5000"  # Change to your backend server IP
SEND_INTERVAL = 1                      # Send data every 1 second for detected faces
```

### 3. Face Encodings

Make sure you have an `encodings.pickle` file with known face encodings in the same directory as `ai.py`.

### 4. Backend Setup

The backend must be running and accessible. The system will send POST requests to:
- `{BACKEND_URL}/api/auth_logs` - To add new authentication logs

## Usage

### Running the Face Recognition System

```bash
cd raspberry
python ai.py
```

### Testing Communication

Before running the main system, test the communication:

```bash
cd raspberry
python test_communication.py
```

## Data Format

The system sends authentication data in this format:

```json
{
    "id": 2,
    "timestamp": "2025-05-25T11:20:45",
    "status": "Accepted" or "Refused",
    "rfid_id": "D8E2F1G3",
    "user_name": "Known Name" or "Inconnu",
    "image_path": "/static/img/captured_image.jpg",
    "reason": "Visage non reconnu" (only for refused access)
}
```

## How It Works

1. **Face Detection**: The system continuously captures frames from the camera
2. **Face Recognition**: Each detected face is compared against known encodings
3. **Authentication Decision**:
   - Known faces → "Accepted" status
   - Unknown faces → "Refused" status
4. **Image Processing**: Face images are prepared for upload
5. **Upload to Backend**: Images and data are sent via multipart form data
6. **Backend Processing**: Server saves images and generates paths
7. **Database Update**: Authentication logs are updated with image paths
8. **Continuous Monitoring**: Sends new data every second while faces are detected

## File Structure

```
raspberry/
├── ai.py                    # Main face recognition script
├── test_communication.py    # Test script for backend communication
├── encodings.pickle         # Face encodings (you need to create this)
└── README.md               # This file
```

## Troubleshooting

### Common Issues

1. **Network Connection**: Ensure the Raspberry Pi can reach the backend server
2. **Camera Permissions**: Make sure the camera is enabled and accessible
3. **Missing Dependencies**: Install all required Python packages
4. **Encodings File**: Ensure `encodings.pickle` exists and contains valid data

### Error Messages

- `Network error sending auth data`: Check backend URL and network connection
- `Failed to send auth data`: Backend may be down or returning errors
- `Error loading encodings`: Check if `encodings.pickle` file exists

## Backend API

The backend provides these endpoints:

- `GET /api/auth_logs` - Retrieve all authentication logs
- `POST /api/auth_logs` - Add new authentication log

## Security Notes

- Images are saved locally on the Raspberry Pi
- Only metadata is sent to the backend
- Consider implementing HTTPS for production use
- Implement proper authentication for the API endpoints
