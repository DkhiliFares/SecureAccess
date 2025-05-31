import sys
import os
import json
import uuid
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from datetime import datetime
from werkzeug.utils import secure_filename

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!

app = Flask(__name__,
            static_folder="../static",
            template_folder="../templates")

# Configuration for file uploads
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'img')

# Enable CORS for API endpoints
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Fonction pour charger les données JSON
def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Erreur lors du chargement des données: {e}")
        return []

# Fonction pour sauvegarder les données JSON
def save_json_data(file_path, data):
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Erreur lors de la sauvegarde des données: {e}")
        return False

# Fonction pour sauvegarder les images uploadées
def save_uploaded_image(image_file, status, user_name):
    try:
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]

        # Create filename based on status
        if status in ["Refusé", "Refuse", "Refused"]:
            filename = f"failed_auth_{timestamp}_{unique_id}.jpg"
        else:
            # Clean user name for filename
            clean_name = secure_filename(user_name.replace(" ", "_").lower())
            filename = f"auth_{clean_name}_{timestamp}_{unique_id}.jpg"

        # Save file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(filepath)

        # Return relative path for database
        return f"/static/img/{filename}"

    except Exception as e:
        print(f"Erreur lors de la sauvegarde de l'image: {e}")
        return None

# Routes pour l'API
@app.route('/api/auth_logs')
def get_auth_logs():
    auth_logs = load_json_data(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data/auth_logs.json'))
    return jsonify(auth_logs)

@app.route('/api/auth_logs', methods=['POST'])
def add_auth_log():
    try:
        # Check if request has form data (multipart) or JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle multipart form data with image

            # Get form data
            timestamp = request.form.get('timestamp')
            status = request.form.get('status')
            rfid_id = request.form.get('rfid_id')
            user_name = request.form.get('user_name')
            reason = request.form.get('reason')

            # Validate required fields
            if not all([timestamp, status, rfid_id, user_name]):
                return jsonify({"error": "Missing required fields"}), 400

            # Handle image upload
            image_path = None
            if 'image' in request.files:
                image_file = request.files['image']
                if image_file.filename != '':
                    image_path = save_uploaded_image(image_file, status, user_name)
                    if not image_path:
                        return jsonify({"error": "Failed to save image"}), 500

            # Create auth data
            auth_data = {
                'timestamp': timestamp,
                'status': status,
                'rfid_id': rfid_id,
                'user_name': user_name,
                'image_path': image_path
            }

            # Add reason if provided
            if reason:
                auth_data['reason'] = reason

        else:
            # Handle JSON data (backward compatibility)
            auth_data = request.get_json()

            if not auth_data:
                return jsonify({"error": "No data provided"}), 400

            # Validate required fields
            required_fields = ['timestamp', 'status', 'rfid_id', 'user_name']
            for field in required_fields:
                if field not in auth_data:
                    return jsonify({"error": f"Missing required field: {field}"}), 400

        # Load existing auth logs
        auth_logs_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data/auth_logs.json')
        auth_logs = load_json_data(auth_logs_path)

        # Generate ID if not provided
        if 'id' not in auth_data:
            max_id = max([log.get('id', 0) for log in auth_logs]) if auth_logs else 0
            auth_data['id'] = max_id + 1

        # Add the new log entry
        auth_logs.append(auth_data)

        # Save back to file
        if save_json_data(auth_logs_path, auth_logs):
            print(f"[INFO] New auth log added: {auth_data['user_name']} - {auth_data['status']}")
            if auth_data.get('image_path'):
                print(f"[INFO] Image saved at: {auth_data['image_path']}")

            return jsonify({
                "message": "Auth log added successfully",
                "id": auth_data['id'],
                "image_path": auth_data.get('image_path')
            }), 201
        else:
            return jsonify({"error": "Failed to save auth log"}), 500

    except Exception as e:
        print(f"[ERROR] Error adding auth log: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/sensor_data')
def get_sensor_data():
    sensor_data = load_json_data(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data/sensor_data.json'))
    return jsonify(sensor_data)

@app.route('/api/latest_sensor_data')
def get_latest_sensor_data():
    sensor_data = load_json_data(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data/sensor_data.json'))
    if sensor_data:
        return jsonify(sensor_data[-1])
    return jsonify({})

@app.route('/api/door_history')
def get_door_history():
    sensor_data = load_json_data(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data/sensor_data.json'))
    door_history = [{"timestamp": item["timestamp"], "door_status": item["door_status"]} for item in sensor_data]
    return jsonify(door_history)

# Routes pour les pages web
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/auth_logs')
def auth_logs_page():
    return render_template('auth_logs.html')

@app.route('/sensor_monitoring')
def sensor_monitoring_page():
    return render_template('sensor_monitoring.html')

@app.route('/door_history')
def door_history_page():
    return render_template('door_history.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
