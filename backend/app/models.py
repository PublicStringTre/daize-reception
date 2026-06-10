from pydantic import BaseModel, EmailStr
from typing import Optional


class LeadCreate(BaseModel):
    business_id: str = "demo-plumbing"
    customer_name: str
    customer_phone: str
    customer_email: Optional[EmailStr] = None
    service_requested: str
    message: str
    location: Optional[str] = None
    urgency: Optional[str] = None


class LeadResponse(BaseModel):
    id: str
    business_id: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    service_requested: str
    message: str
    location: Optional[str] = None
    urgency: Optional[str] = None
    priority: str
    lead_score: int
    estimated_value_min: int
    estimated_value_max: int
    summary: str
    recommended_action: str
    status: str
    source: str
    created_at: str