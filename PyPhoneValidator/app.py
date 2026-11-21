from fastapi import FastAPI
from routes import phone

app = FastAPI(title="Phone Validation API")



# Prefixes all routes in phone.router with "/api/phone"
app.include_router(phone.router, prefix="/api")


# Deployment commands:

# python -m fastapi run app.py --port 5000
# or
# python -m fastapi dev app.py --port 5000