def qualify_lead(lead):
    text = f"{lead.service_requested} {lead.message} {lead.urgency or ''}".lower()

    high_urgency_keywords = [
        "emergency",
        "urgent",
        "asap",
        "flood",
        "flooding",
        "burst",
        "leak",
        "major leak",
        "no water",
        "overflowing",
        "broken",
    ]

    medium_urgency_keywords = [
        "soon",
        "today",
        "tomorrow",
        "repair",
        "issue",
        "problem",
        "not working",
    ]

    high_value_keywords = [
        "water heater",
        "main line",
        "sewer",
        "install",
        "replacement",
        "renovation",
        "commercial",
    ]

    score = 30
    priority = "Low"
    estimated_min = 150
    estimated_max = 400

    if any(keyword in text for keyword in high_urgency_keywords):
        score += 50
        priority = "High"
        estimated_min = 350
        estimated_max = 1500
    elif any(keyword in text for keyword in medium_urgency_keywords):
        score += 25
        priority = "Medium"
        estimated_min = 200
        estimated_max = 800

    if any(keyword in text for keyword in high_value_keywords):
        score += 20
        estimated_max += 1000

    score = min(score, 100)

    if priority == "High":
        recommended_action = "Call this lead immediately."
    elif priority == "Medium":
        recommended_action = "Contact this lead today."
    else:
        recommended_action = "Follow up within 24-48 hours."

    summary = (
        f"{lead.customer_name} requested help with {lead.service_requested}. "
        f"Priority is {priority} based on the message and urgency indicators."
    )

    return {
        "priority": priority,
        "lead_score": score,
        "estimated_value_min": estimated_min,
        "estimated_value_max": estimated_max,
        "summary": summary,
        "recommended_action": recommended_action,
    }