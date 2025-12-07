import os
from cryptography.hazmat.primitives.ciphers.aead import AESCCM

# Configuration
KEY_FILE = "secret.key"
DEFAULT_KEY = b"SecureAccessKey1"

def load_key():
    """Load encryption key from file or return default."""
    try:
        # Look for secret.key in the same directory as this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        key_path = os.path.join(current_dir, KEY_FILE)
        
        if os.path.exists(key_path):
            with open(key_path, "rb") as f:
                key = f.read().strip()
                # Ensure key is 16 bytes for AES-128
                if len(key) == 16:
                   return key
                elif len(key) > 0:
                   # If not 16 bytes, hash it and take first 16 bytes to ensure validity
                   import hashlib
                   return hashlib.sha256(key).digest()[:16]
        
        # Look for secret.key in parent directory (if running from source dir)
        parent_key_path = os.path.join(os.path.dirname(current_dir), KEY_FILE)
        if os.path.exists(parent_key_path):
             with open(parent_key_path, "rb") as f:
                key = f.read().strip()
                if len(key) == 16:
                   return key
                elif len(key) > 0:
                   import hashlib
                   return hashlib.sha256(key).digest()[:16]
                   
        print(f"[WARN] {KEY_FILE} not found. Using default key.")
        return DEFAULT_KEY
    except Exception as e:
        print(f"[ERROR] Failed to load key: {e}. Using default.")
        return DEFAULT_KEY

ENCRYPTION_KEY = load_key()

def encrypt_image_data(image_data):
    """
    Encrypts image data using AES-128-CCM.
    
    Args:
        image_data (bytes): The raw image data (e.g., JPEG bytes).
        
    Returns:
        bytes: The encrypted data prefixed with the nonce.
               Format: [Nonce (12 bytes)] + [Ciphertext]
    """
    try:
        # AES-CCM requires a nonce (number used once). 
        # Recommended nonce length for AES-CCM is often 7-13 bytes. 
        # We use 12 bytes to allow for a larger length field (3 bytes), 
        # supporting data sizes up to ~16MB (2^24 bytes).
        aesccm = AESCCM(ENCRYPTION_KEY)
        nonce = os.urandom(12)
        
        # Encrypt the data
        # AESCCM.encrypt(nonce, data, associated_data)
        # We don't use associated data (AAD) for this simple case, so it's None.
        ciphertext = aesccm.encrypt(nonce, image_data, None)
        
        # Return Nonce + Ciphertext so the receiver can decrypt it
        return nonce + ciphertext
        
    except Exception as e:
        print(f"[ERROR] Encryption failed: {e}")
        return None

def decrypt_image_data(encrypted_data, key=None):
    """
    Decrypts image data using AES-128-CCM.
    
    Args:
        encrypted_data (bytes): The encrypted data prefixed with the nonce.
                                Format: [Nonce (12 bytes)] + [Ciphertext]
        key (bytes, optional): The decryption key. If None, uses the loaded ENCRYPTION_KEY.
        
    Returns:
        bytes: The raw image data (e.g., JPEG bytes) or None if decryption fails.
    """
    try:
        # Use provided key or fallback to loaded key
        decryption_key = key if key else ENCRYPTION_KEY
        
        aesccm = AESCCM(decryption_key)
        
        # Extract nonce (first 12 bytes)
        nonce = encrypted_data[:12]
        ciphertext = encrypted_data[12:]
        
        # Decrypt the data
        decrypted_data = aesccm.decrypt(nonce, ciphertext, None)
        return decrypted_data
        
    except Exception as e:
        print(f"[ERROR] Decryption failed: {e}")
        return None
