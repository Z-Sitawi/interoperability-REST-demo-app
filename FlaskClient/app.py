import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
import json


app = Flask(__name__)

# Enable CORS so the frontend can communicate with this server
CORS(app)

PORT = 3001

# parse users from users.json

with open('../users.json', 'r') as file:
    USERS = json.load(file)


PHONE_VALIDATOR_URL = (
    "http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT"
    "/api/phonevalidator/isvalid"
)


@app.post("/login")
def login():
    # Parse the incoming JSON body (empty dict if missing or malformed)
    body = request.get_json(silent=True) or {}
    phone = body.get("phone")
    pwd = body.get("password")

    if not phone:
        return jsonify(success=False, message="Invalid phone number"), 400

    try:
        # requests URL-encodes the query parameter for us
        response = requests.get(
            PHONE_VALIDATOR_URL,
            params={"pNum": phone},
            timeout=5,
        )
        is_valid_phone = response.text.strip() == "true"
    except requests.RequestException as error:
        app.logger.error("Error validating phone number: %s", error)
        return jsonify(success=False, message="Error validating phone number"), 500

    if not is_valid_phone:
        return jsonify(success=False, message="Invalid phone number"), 400

    user = next(
        (u for u in USERS if u["phone"] == phone and u["password"] == pwd),
        None,
    )

    if user:
        return jsonify(
            success=True, message="Phone is valid. User is authenticated"
        ), 200

    return jsonify(
        success=False, message="Phone is valid. But invalid credentials"
    ), 401


if __name__ == "__main__":
    print(f"Server running at http://localhost:{PORT}")
    app.run(port=PORT)
