from fastapi import APIRouter, Query
from services.phone_service import validate_phone

router = APIRouter(prefix="/phone", tags=["Phone"])

# Matches: GET /api/phone
@router.get("/")
def phone_root():
    return {"message": "Phone API main entry point"}

# Matches: GET /api/phone/isValid?phone=+212612345678
@router.get("/isValid")
def check_phone_validity(
    phone: str = Query(..., min_length=7, description="Phone number to validate")
):
    return validate_phone(phone)
