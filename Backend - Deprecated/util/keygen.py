import secrets
import base64

def generate_secret_key():
    key = secrets.token_bytes(32)
    return base64.b64encode(key).decode('utf-8')

secret_key = generate_secret_key()
# Ideally we want to do this with "Go", but having some weird error with crypto/rand :^)
print(secret_key)
