from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import LeadCreate, LeadResponse
from app.lead_qualification import qualify_lead
from datetime import datetime
from uuid import uuid4

app = FastAPI(title="Daize Reception API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory storage for first local test.
# We will replace this with Supabase next.
leads = []


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Daize Reception API"}


@app.post("/leads", response_model=LeadResponse)
def create_lead(lead: LeadCreate):
    qualification = qualify_lead(lead)

    new_lead = {
        "id": str(uuid4()),
        "business_id": lead.business_id,
        "customer_name": lead.customer_name,
        "customer_phone": lead.customer_phone,
        "customer_email": lead.customer_email,
        "service_requested": lead.service_requested,
        "message": lead.message,
        "location": lead.location,
        "urgency": lead.urgency,
        "priority": qualification["priority"],
        "lead_score": qualification["lead_score"],
        "estimated_value_min": qualification["estimated_value_min"],
        "estimated_value_max": qualification["estimated_value_max"],
        "summary": qualification["summary"],
        "recommended_action": qualification["recommended_action"],
        "status": "New",
        "source": "Website Intake",
        "created_at": datetime.utcnow().isoformat(),
    }

    leads.append(new_lead)
    return new_lead


@app.get("/leads")
def get_leads():
    return leads