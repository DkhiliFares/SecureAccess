#!/usr/bin/env python3
"""
Test script to verify communication between Raspberry Pi and backend
"""

import requests
import json
import random
import string
import cv2
import numpy as np
from datetime import datetime
from io import BytesIO

# Configuration
BACKEND_URL = "http://192.168.202.141:5000"  # Your Windows machine IP

def generate_rfid_id():
    """Generate a random RFID-like ID"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def create_test_image():
    """Create a simple test image"""
    # Create a 200x200 colored image
    img = np.zeros((200, 200, 3), dtype=np.uint8)
    img[:, :] = [100, 150, 200]  # Light blue background

    # Add some text
    cv2.putText(img, 'TEST', (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3)

    # Encode as JPEG
    _, buffer = cv2.imencode('.jpg', img)
    return buffer.tobytes()

def test_send_auth_data():
    """Test sending authentication data with images to the backend"""

    print("Testing communication with backend...")

    # Test 1: Send accepted authentication with image
    try:
        print("\n1. Testing accepted authentication with image...")

        # Create test image
        image_data = create_test_image()

        # Prepare form data
        files = {
            'image': ('test_accepted.jpg', image_data, 'image/jpeg')
        }

        data = {
            'timestamp': datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            'status': 'Accepted',
            'rfid_id': generate_rfid_id(),
            'user_name': 'Test User'
        }

        response = requests.post(f"{BACKEND_URL}/api/auth_logs", files=files, data=data, timeout=10)
        if response.status_code == 201:
            result = response.json()
            print("✓ Accepted auth data with image sent successfully")
            print(f"  Response: {result}")
            print(f"  Image saved at: {result.get('image_path', 'unknown')}")
        else:
            print(f"✗ Failed to send accepted auth data: {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error sending accepted auth data: {e}")

    # Test 2: Send refused authentication with image
    try:
        print("\n2. Testing refused authentication with image...")

        # Create test image
        image_data = create_test_image()

        # Prepare form data
        files = {
            'image': ('test_refused.jpg', image_data, 'image/jpeg')
        }

        data = {
            'timestamp': datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            'status': 'Refused',
            'rfid_id': generate_rfid_id(),
            'user_name': 'Inconnu',
            'reason': 'Visage non reconnu'
        }

        response = requests.post(f"{BACKEND_URL}/api/auth_logs", files=files, data=data, timeout=10)
        if response.status_code == 201:
            result = response.json()
            print("✓ Refused auth data with image sent successfully")
            print(f"  Response: {result}")
            print(f"  Image saved at: {result.get('image_path', 'unknown')}")
        else:
            print(f"✗ Failed to send refused auth data: {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error sending refused auth data: {e}")

    # Test 3: Test JSON-only request (backward compatibility)
    try:
        print("\n3. Testing JSON-only request (no image)...")

        test_data = {
            "timestamp": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "status": "Accepted",
            "rfid_id": generate_rfid_id(),
            "user_name": "JSON Test User"
        }

        response = requests.post(f"{BACKEND_URL}/api/auth_logs", json=test_data, timeout=5)
        if response.status_code == 201:
            print("✓ JSON-only auth data sent successfully")
            print(f"  Response: {response.json()}")
        else:
            print(f"✗ Failed to send JSON auth data: {response.status_code}")
            print(f"  Response: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error sending JSON auth data: {e}")

    # Test 4: Retrieve auth logs to verify
    try:
        print("\n4. Retrieving auth logs to verify...")
        response = requests.get(f"{BACKEND_URL}/api/auth_logs", timeout=5)
        if response.status_code == 200:
            logs = response.json()
            print(f"✓ Retrieved {len(logs)} auth logs")
            # Show last 3 entries
            if len(logs) >= 3:
                print("  Last 3 entries:")
                for log in logs[-3:]:
                    print(f"    ID: {log.get('id')}, User: {log.get('user_name')}, Status: {log.get('status')}, Image: {log.get('image_path', 'None')}")
        else:
            print(f"✗ Failed to retrieve auth logs: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"✗ Network error retrieving auth logs: {e}")

if __name__ == "__main__":
    test_send_auth_data()
