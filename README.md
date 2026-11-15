# Phone Validator

A small full-stack project that validates phone numbers and uses the result to authenticate users. A Java REST service decides whether a number is valid, and three interchangeable backends (Node.js, Python, PHP) expose a `/login` endpoint on top of it. A modern HTML/CSS/JS frontend talks to the backend.

## How it works

```
┌────────────┐   POST /login    ┌───────────────────────┐   GET ?pNum=...   ┌──────────────────────────┐
│  Frontend  │ ───────────────▶ │  Backend (pick one)   │ ────────────────▶ │  Java REST validator     │
│ HTML/CSS/JS│ ◀─────────────── │  Express / Flask / PHP│ ◀──────────────── │  localhost:8080          │
└────────────┘   JSON result    └───────────────────────┘   "true"/"false"  └──────────────────────────┘
```

1. The user enters a phone number and password in the frontend.
2. The backend asks the Java service whether the phone number is valid.
3. If it is valid, the backend checks the credentials against its list of users.
4. The backend answers with a JSON message and an HTTP status code.

## Project structure

```
phone-validator/
├── frontend/          # index.html, index.css, index.js
├── backend-node/      # Express server (port 3000)
├── backend-flask/     # Flask server (port 3000)
├── backend-php/       # PHP server (port 3002)
└── README.md
```

The Java service (`RestPhoneValidatorService`) runs separately on port 8080 and is not included in the folders above. Add it as its own folder or link to its repository.

## Tech stack

| Part | Technology |
| --- | --- |
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend options | Node.js (Express), Python (Flask), PHP |
| Validation service | Java (JAX-RS REST) |

## Prerequisites

- The Java validator service running at `http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT/api/phonevalidator/isvalid`
- One of the following for the backend:
  - Node.js 18 or newer
  - Python 3.9 or newer
  - PHP 7.4 or newer

## Getting started

### 1. Start the Java validator

Deploy `RestPhoneValidatorService` to your application server so that this URL responds with `true` or `false`:

```
http://localhost:8080/RestPhoneValidatorService-1.0-SNAPSHOT/api/phonevalidator/isvalid?pNum=0612345678
```

### 2. Start one backend

Run **only one** of these. Node.js and Flask both use port 3000.

**Node.js (Express)**

```bash
cd backend-node
npm install express cors
node server.js
```

**Python (Flask)**

```bash
cd backend-flask
pip install Flask flask-cors requests
python app.py
```

**PHP**

```bash
cd backend-php
php -S localhost:3002 server.php
```

### 3. Open the frontend

Open `frontend/index.html` in your browser, or serve the folder:

```bash
cd frontend
python -m http.server 5500
```

Then visit `http://localhost:5500`. Make sure the backend URL in `index.js` matches the port of the backend you started (`3000` for Node.js or Flask, `3002` for PHP).

## API

### `GET /`

Returns `Hello World!` as plain text. Useful as a quick health check.

### `POST /login`

**Request body (JSON)**

```json
{
  "phone": "0612345678",
  "password": "1234"
}
```

**Responses**

| Status | Meaning | Body |
| --- | --- | --- |
| `200` | Phone is valid and credentials match | `{"success": true, "message": "Phone is valid. User is authenticated"}` |
| `401` | Phone is valid but credentials are wrong | `{"success": false, "message": "Phone is valid. But invalid credentials"}` |
| `400` | Phone number is missing or not valid | `{"success": false, "message": "Invalid phone number"}` |
| `500` | The validator service could not be reached | `{"success": false, "message": "Error validating phone number"}` |

**Example**

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"0612345678","password":"1234"}'
```

### Demo users

| Phone | Password |
| --- | --- |
| `0612345678` | `1234` |
| `0788877722` | `0000` |
| `0611111111` | `1111` |

## Troubleshooting

- **CORS error in the browser:** the backends already send the required CORS headers. If you call the Java service directly from the page, it needs a CORS filter too.
- **`406 Not Acceptable`:** the Java service does not return JSON. Do not force an `Accept: application/json` header when calling it.
- **`500 Error validating phone number`:** the backend cannot reach the Java service. Check that it is running on port 8080.

## Security note

This project is a learning demo. Users and passwords are hard-coded and stored in plain text. For real use, store hashed passwords (bcrypt or Argon2) in a database and serve everything over HTTPS.

## Author

Built by Zak. See more projects at [zaktech.top](https://zaktech.top).

## License

Add a license of your choice, for example [MIT](https://choosealicense.com/licenses/mit/).
