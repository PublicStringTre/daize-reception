from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import LeadCreate, LeadResponse
from app.lead_qualification import qualify_lead
from app.config import supabase

app = FastAPI(title="Daize Reception API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Daize Reception API"}


@app.post("/leads", response_model=LeadResponse)
def create_lead(lead: LeadCreate):
    qualification = qualify_lead(lead)

    lead_data = {
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
    }

    try:
        result = supabase.table("daize_leads").insert(lead_data).execute()
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create lead: {str(error)}",
        )

    if not result.data:
        raise HTTPException(status_code=500, detail="Lead was not created")

    return result.data[0]


@app.get("/leads")
def get_leads():
    try:
        result = (
            supabase.table("daize_leads")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch leads: {str(error)}",
        )

    return result.data