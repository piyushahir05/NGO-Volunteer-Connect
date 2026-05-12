"""
recommender.py

Hybrid recommendation engine for NGO Volunteer Connect.

Core fix: required skills are sometimes stored as multi-word phrases like
"Web Development React UI Design" (one string) while volunteer skills are
stored as separate entries ["Web Development", "React", "UI design"].

Solution: tokenize every skill string into individual words before matching,
then compute overlap at the word level. This correctly handles both storage
formats.

Scoring pipeline:
  1. Word-token overlap  – tokenizes all skill strings into words and computes
                           what fraction of required-skill words the volunteer covers
  2. Fuzzy skill match   – for each volunteer skill, finds the best fuzzy match
                           against required skills (handles typos); only counts
                           matches above a 0.75 similarity threshold to avoid
                           false positives (e.g. "Devlopment" → "Development" ✓,
                           unrelated short words ✗)
  3. TF-IDF cosine       – word-level semantic signal
  4. Weighted blend      – combines all three
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from difflib import SequenceMatcher
import re


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _normalize(s: str) -> str:
    return s.strip().lower()


def _words(skill_or_skills) -> set:
    """
    Extract all individual words from a skill string or list of skill strings.

    "Web Development React UI Design"  → {"web", "development", "react", "ui", "design"}
    ["Web Development", "React"]       → {"web", "development", "react"}

    This is the KEY fix: it doesn't matter whether skills are stored as one
    long phrase or multiple short strings — we always compare at word level.
    """
    if isinstance(skill_or_skills, list):
        text = " ".join(skill_or_skills)
    else:
        text = skill_or_skills
    return set(re.findall(r'[a-z0-9]+', _normalize(text)))


def _skills_to_text(skills: list[str]) -> str:
    return " ".join(_normalize(s) for s in skills if s.strip())


def _fuzzy_ratio(a: str, b: str) -> float:
    return SequenceMatcher(None, a, b).ratio()


def _word_overlap_score(required_skills: list[str], volunteer_skills: list[str]) -> float:
    """
    Compute what fraction of required-skill WORDS the volunteer covers.

    Example:
      required  = ["Web Development React UI Design"]  → words: {web, development, react, ui, design}
      volunteer = ["Web Development", "React", "UI design"] → words: {web, development, react, ui, design}
      overlap   = 5/5 = 1.0  ✓

      required  = ["Web Development React UI Design"]  → words: {web, development, react, ui, design}
      volunteer = ["Web Development", "Teaching"]      → words: {web, development, teaching}
      overlap   = 2/5 = 0.4
    """
    required_words  = _words(required_skills)
    volunteer_words = _words(volunteer_skills)

    if not required_words:
        return 0.0

    matched = len(required_words & volunteer_words)
    return matched / len(required_words)


def _fuzzy_skill_score(
    required_skills: list[str],
    volunteer_skills: list[str],
    threshold: float = 0.75,
) -> float:
    """
    For each required skill string, find the best fuzzy match among volunteer
    skill strings. Returns the average best-match score across all required
    skills, counting only matches that exceed `threshold`.

    A threshold of 0.75 catches genuine typos like "Devlopment" → "Development"
    while avoiding spurious matches between unrelated short words.
    """
    if not required_skills or not volunteer_skills:
        return 0.0

    total = 0.0
    for req in required_skills:
        best = max(
            _fuzzy_ratio(_normalize(req), _normalize(vol))
            for vol in volunteer_skills
        )
        # Only credit matches that clear the similarity threshold
        total += best if best >= threshold else 0.0

    return total / len(required_skills)


def _tfidf_score(query_text: str, doc_texts: list[str]) -> list[float]:
    """Word-level TF-IDF cosine similarity."""
    corpus = [query_text] + doc_texts
    if not any(t.strip() for t in corpus):
        return [0.0] * len(doc_texts)
    try:
        vec = TfidfVectorizer(sublinear_tf=True)
        mat = vec.fit_transform(corpus)
        return cosine_similarity(mat[0], mat[1:])[0].tolist()
    except Exception:
        return [0.0] * len(doc_texts)


def _hybrid(word_overlap: float, fuzzy: float, tfidf: float) -> float:
    """
    Weighted blend:
      50% word overlap  – most reliable signal for skill matching
      30% fuzzy match   – handles typos and phrasing differences
      20% TF-IDF        – smoothing / semantic signal
    """
    return round(0.50 * word_overlap + 0.30 * fuzzy + 0.20 * tfidf, 4)


# ---------------------------------------------------------------------------
# Feature 1 – Recommend opportunities for a volunteer
# ---------------------------------------------------------------------------

def recommend_opportunities(
    volunteer_skills: list[str],
    opportunities: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Return top-N opportunities best matching a volunteer's skill set."""
    if not opportunities:
        return []

    vol_text  = _skills_to_text(volunteer_skills)
    opp_texts = [_skills_to_text(opp.get("requiredSkills", [])) for opp in opportunities]
    tfidf     = _tfidf_score(vol_text, opp_texts)

    results = []
    for idx, opp in enumerate(opportunities):
        req = opp.get("requiredSkills", [])
        # For volunteer→opportunity: how much of the required words does the volunteer cover?
        wo = _word_overlap_score(req, volunteer_skills)
        fz = _fuzzy_skill_score(req, volunteer_skills)
        results.append({"id": opp["id"], "matchScore": _hybrid(wo, fz, tfidf[idx])})

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:top_n]


# ---------------------------------------------------------------------------
# Feature 2 – Recommend volunteers for an opportunity
# ---------------------------------------------------------------------------

def recommend_volunteers(
    required_skills: list[str],
    volunteers: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Return top-N volunteers best matching an opportunity's required skills."""
    if not volunteers:
        return []

    opp_text  = _skills_to_text(required_skills)
    vol_texts = [_skills_to_text(vol.get("skills", [])) for vol in volunteers]
    tfidf     = _tfidf_score(opp_text, vol_texts)

    results = []
    for idx, vol in enumerate(volunteers):
        vol_skills = vol.get("skills", [])
        # How much of the required words does this volunteer cover?
        wo = _word_overlap_score(required_skills, vol_skills)
        fz = _fuzzy_skill_score(required_skills, vol_skills)
        results.append({"id": vol["id"], "matchScore": _hybrid(wo, fz, tfidf[idx])})

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:top_n]


# ---------------------------------------------------------------------------
# Feature 3 – Semantic opportunity search
# ---------------------------------------------------------------------------

def search_opportunities(
    query: str,
    opportunities: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Rank opportunities by semantic relevance to a free-text search query."""
    if not opportunities:
        return []

    opp_texts = [opp.get("text", "") for opp in opportunities]
    try:
        vec = TfidfVectorizer(sublinear_tf=True)
        mat = vec.fit_transform([query] + opp_texts)
        scores = cosine_similarity(mat[0], mat[1:])[0]
    except Exception:
        scores = [0.0] * len(opportunities)

    results = [
        {"id": opp["id"], "matchScore": round(float(scores[idx]), 4)}
        for idx, opp in enumerate(opportunities)
    ]
    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:top_n]