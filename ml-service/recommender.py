"""
recommender.py

Reusable ML functions for the NGO Volunteer Connect recommendation system.

Scoring pipeline (hybrid approach):
  1. TF-IDF cosine similarity  – captures semantic term overlap
  2. Fuzzy skill matching       – handles typos / casing differences
     (e.g. "Web Devlopment" still matches "Web Development")
  3. Jaccard overlap            – rewards direct skill set intersection
  4. Weighted combination       – blends all three for a robust final score

Why hybrid?
  Pure TF-IDF struggles with:
    - Small corpora (< 20 docs) where IDF weights are unreliable
    - Typos / inconsistent casing between skill strings
    - Single-skill opportunities that produce artificially low scores
  Fuzzy + Jaccard compensate for these weaknesses while TF-IDF still
  captures multi-word semantic relationships.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from difflib import SequenceMatcher


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _skills_to_text(skills: list[str]) -> str:
    """Join skill tokens into a single whitespace-separated string."""
    return " ".join(s.strip().lower() for s in skills if s.strip())


def _normalize(skill: str) -> str:
    """Lowercase and strip a skill string for comparison."""
    return skill.strip().lower()


def _fuzzy_ratio(a: str, b: str) -> float:
    """Return similarity ratio between two strings (0.0 – 1.0)."""
    return SequenceMatcher(None, a, b).ratio()


def _best_fuzzy_match(skill: str, candidates: list[str], threshold: float = 0.75) -> float:
    """
    Return the best fuzzy match score for `skill` against a list of candidates.
    Returns 0.0 if no candidate exceeds the threshold.
    A threshold of 0.75 catches typos like "Devlopment" → "Development"
    while avoiding false positives.
    """
    norm = _normalize(skill)
    best = 0.0
    for c in candidates:
        r = _fuzzy_ratio(norm, _normalize(c))
        if r > best:
            best = r
    return best if best >= threshold else 0.0


def _jaccard_score(set_a: list[str], set_b: list[str], fuzzy: bool = True) -> float:
    """
    Compute a fuzzy-Jaccard similarity between two skill lists.

    Standard Jaccard = |A ∩ B| / |A ∪ B|

    Fuzzy variant: a skill in A "matches" a skill in B if the best fuzzy
    ratio ≥ 0.75, so typos and casing differences still count as matches.
    """
    if not set_a or not set_b:
        return 0.0

    norm_b = [_normalize(s) for s in set_b]
    matched = 0

    for skill in set_a:
        if _best_fuzzy_match(skill, set_b, threshold=0.75) > 0:
            matched += 1

    union = len(set(
        [_normalize(s) for s in set_a] + norm_b
    ))
    return matched / union if union > 0 else 0.0


def _overlap_score(query_skills: list[str], candidate_skills: list[str]) -> float:
    """
    Overlap coefficient = |A ∩ B| / min(|A|, |B|)

    Better than Jaccard when one set is much smaller than the other
    (e.g. opportunity has 1 required skill, volunteer has 10).
    Uses fuzzy matching for each pair.
    """
    if not query_skills or not candidate_skills:
        return 0.0

    matched = sum(
        1 for s in query_skills
        if _best_fuzzy_match(s, candidate_skills, threshold=0.75) > 0
    )
    return matched / min(len(query_skills), len(candidate_skills))


def _tfidf_scores(query_text: str, doc_texts: list[str]) -> list[float]:
    """
    Compute TF-IDF cosine similarity between query_text and each doc in doc_texts.
    Falls back to zeros if vectorization fails (e.g. empty vocabulary).
    """
    corpus = [query_text] + doc_texts
    # Filter out completely empty documents to avoid vectorizer errors
    if not any(t.strip() for t in corpus):
        return [0.0] * len(doc_texts)
    try:
        vectorizer = TfidfVectorizer(
            analyzer='char_wb',   # character n-grams → robust to typos
            ngram_range=(3, 4),   # trigrams + 4-grams
            min_df=1,
            sublinear_tf=True,    # log-normalise TF to dampen high-freq terms
        )
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = tfidf_matrix[0]
        doc_vecs  = tfidf_matrix[1:]
        return cosine_similarity(query_vec, doc_vecs)[0].tolist()
    except Exception:
        return [0.0] * len(doc_texts)


def _hybrid_score(
    tfidf: float,
    jaccard: float,
    overlap: float,
    w_tfidf: float  = 0.30,
    w_jaccard: float = 0.35,
    w_overlap: float = 0.35,
) -> float:
    """
    Weighted blend of three complementary signals.

    Weights (must sum to 1.0):
      - TF-IDF   0.30  – semantic / keyword similarity
      - Jaccard  0.35  – symmetric set overlap (handles different-sized sets)
      - Overlap  0.35  – asymmetric overlap (best when set sizes differ a lot)
    """
    return round(w_tfidf * tfidf + w_jaccard * jaccard + w_overlap * overlap, 4)


# ---------------------------------------------------------------------------
# Feature 1 – Recommend opportunities for a volunteer
# ---------------------------------------------------------------------------

def recommend_opportunities(
    volunteer_skills: list[str],
    opportunities: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Return the top-N opportunities best matching a volunteer's skill set."""
    if not opportunities:
        return []

    volunteer_text = _skills_to_text(volunteer_skills)
    opp_texts = [
        _skills_to_text(opp.get("requiredSkills", []))
        for opp in opportunities
    ]

    tfidf_scores = _tfidf_scores(volunteer_text, opp_texts)

    results = []
    for idx, opp in enumerate(opportunities):
        req = opp.get("requiredSkills", [])
        j   = _jaccard_score(volunteer_skills, req)
        ov  = _overlap_score(req, volunteer_skills)   # how many required skills the vol covers
        score = _hybrid_score(tfidf_scores[idx], j, ov)
        results.append({"id": opp["id"], "matchScore": score})

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
    """Return the top-N volunteers best matching an opportunity's required skills."""
    if not volunteers:
        return []

    opp_text  = _skills_to_text(required_skills)
    vol_texts = [
        _skills_to_text(vol.get("skills", []))
        for vol in volunteers
    ]

    tfidf_scores = _tfidf_scores(opp_text, vol_texts)

    results = []
    for idx, vol in enumerate(volunteers):
        vol_skills = vol.get("skills", [])
        j  = _jaccard_score(required_skills, vol_skills)
        ov = _overlap_score(required_skills, vol_skills)  # what % of required skills vol has
        score = _hybrid_score(tfidf_scores[idx], j, ov)
        results.append({"id": vol["id"], "matchScore": score})

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

    # For free-text search we rely primarily on TF-IDF (word-level this time)
    # since the query and opportunity text are already full sentences.
    corpus = [query] + opp_texts
    try:
        vectorizer = TfidfVectorizer(sublinear_tf=True)
        tfidf_matrix = vectorizer.fit_transform(corpus)
        query_vec = tfidf_matrix[0]
        opp_vecs  = tfidf_matrix[1:]
        scores = cosine_similarity(query_vec, opp_vecs)[0]
    except Exception:
        scores = [0.0] * len(opportunities)

    results = []
    for idx, opp in enumerate(opportunities):
        results.append({"id": opp["id"], "matchScore": round(float(scores[idx]), 4)})

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:top_n]