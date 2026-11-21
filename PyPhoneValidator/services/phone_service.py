import re

def validate_phone(raw_phone: str) -> dict:
    # Restore '+' if URL query decoding turned it into a leading space
    normalized = f"+{raw_phone.strip()}" if raw_phone.startswith(" ") else raw_phone.strip()
    
    # Strip spaces, dashes, dots, and parentheses
    cleaned = re.sub(r"[\s\-().]", "", normalized)
    
    # Match international (+...) or local (0...) numbers (7 to 15 digits)
    pattern = r"^(\+?[1-9]\d{6,14}|0[1-9]\d{6,13})$"
    is_valid = bool(re.match(pattern, cleaned))
    
    return {"phone": cleaned, "is_valid": is_valid}
