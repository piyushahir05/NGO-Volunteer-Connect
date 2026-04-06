"""
main.py

FastAPI entry-point for the NGO Volunteer Connect ML microservice.

Endpoints
---------
POST /recommend/opportunities  – rank opportunities for a volunteer
POST /recommend/volunteers     – rank volunteers for an opportunity
POST /recommend/search         – semantic free-text search over opportunities

Run locally
-----------
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Interactive API docs are available at http://localhost:8000/docs once the
server is running.
"""

from fastapi import FastAPI
from pydantic import BaseModel, Field

from recommender import recommend_opportunities, recommend_volunteers, search_opportunities

# ---------------------------------------------------------------------------
# Application instance
# ---------------------------------------------------------------------------

app = FastAPI(
    title="NGO Volunteer Connect – ML Recommendation Service",
    description=(
        "TF-IDF + cosine similarity based recommendation engine "
        "for matching volunteers with NGO opportunities."
    ),
    version="1.0.0",
)


# ---------------------------------------------------------------------------
# Pydantic request / response models
# ---------------------------------------------------------------------------

class Opportunity(BaseModel):
    id: str
    requiredSkills: list[str] = Field(default_factory=list)


class OpportunityText(BaseModel):
    id: str
    text: str = ""


class Volunteer(BaseModel):
    id: str
    skills: list[str] = Field(default_factory=list)


class RecommendOpportunitiesRequest(BaseModel):
    skills: list[str] = Field(..., description="Skills the volunteer possesses")
    opportunities: list[Opportunity] = Field(
        ..., description="Pool of opportunities to rank"
    )


class RecommendVolunteersRequest(BaseModel):
    requiredSkills: list[str] = Field(
        ..., description="Skills required by the opportunity"
    )
    volunteers: list[Volunteer] = Field(
        ..., description="Pool of volunteers to rank"
    )


class SearchRequest(BaseModel):
    query: str = Field(..., description="Free-text search query")
    opportunities: list[OpportunityText] = Field(
        ..., description="Pool of opportunities to search"
    )


class MatchResult(BaseModel):
    id: str
    matchScore: float


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.post(
    "/recommend/opportunities",
    response_model=list[MatchResult],
    summary="Recommend opportunities for a volunteer",
    description=(
        "Given a volunteer's skills and a list of opportunities with required "
        "skills, returns the top-10 opportunities ranked by TF-IDF cosine "
        "similarity score."
    ),
)
def opportunities_endpoint(body: RecommendOpportunitiesRequest):
    # Convert Pydantic models to plain dicts for the recommender function.
    opps = [opp.model_dump() for opp in body.opportunities]
    results = recommend_opportunities(body.skills, opps)
    return results


@app.post(
    "/recommend/volunteers",
    response_model=list[MatchResult],
    summary="Recommend volunteers for an opportunity",
    description=(
        "Given an opportunity's required skills and a list of volunteers with "
        "their own skills, returns the top-10 volunteers ranked by TF-IDF "
        "cosine similarity score."
    ),
)
def volunteers_endpoint(body: RecommendVolunteersRequest):
    vols = [vol.model_dump() for vol in body.volunteers]
    results = recommend_volunteers(body.requiredSkills, vols)
    return results


@app.post(
    "/recommend/search",
    response_model=list[MatchResult],
    summary="Semantic opportunity search",
    description=(
        "Given a free-text query and a list of opportunities with descriptive "
        "text, returns the top-10 opportunities ranked by TF-IDF cosine "
        "similarity score."
    ),
)
def search_endpoint(body: SearchRequest):
    opps = [opp.model_dump() for opp in body.opportunities]
    results = search_opportunities(body.query, opps)
    return results


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

@app.get("/health", summary="Health check")
def health():
    """Return service liveness status, name, and version."""
    return {
        "status": "ok",
        "service": "ngo-volunteer-connect-ml",
        "version": app.version,
    }
