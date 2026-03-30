"""
recommender.py

Reusable ML functions for the NGO Volunteer Connect recommendation system.

All three functions use the same two-step ML pipeline:
  1. TF-IDF vectorization  – converts text (skill lists / free-text) into
     numerical feature vectors where each dimension represents a term and
     its value reflects how "important" that term is relative to the corpus.
  2. Cosine similarity     – measures the angle between two vectors; a score
     of 1.0 means identical direction (perfect match) and 0.0 means no
     overlap at all.

Why does this qualify as Machine Learning?
  TF-IDF is an unsupervised, corpus-driven weighting scheme (the IDF part
  "learns" term importance from the document collection at inference time).
  Cosine similarity is the standard distance metric used in information-
  retrieval and content-based recommendation systems.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _skills_to_text(skills: list[str]) -> str:
    """Join a list of skill tokens into a single whitespace-separated string.

    TfidfVectorizer expects plain text documents, so skill arrays must be
    converted before vectorization.
    """
    return " ".join(s.strip().lower() for s in skills if s.strip())


# ---------------------------------------------------------------------------
# Feature 1 – Recommend opportunities for a volunteer
# ---------------------------------------------------------------------------

def recommend_opportunities(
    volunteer_skills: list[str],
    opportunities: list[dict],
    top_n: int = 10,
) -> list[dict]:
    """Return the top-N opportunities best matching a volunteer's skill set.

    Parameters
    ----------
    volunteer_skills:
        Skills the volunteer has (e.g. ["python", "teaching"]).
    opportunities:
        List of opportunity dicts, each containing at least "id" and
        "requiredSkills" (a list of strings).
    top_n:
        Maximum number of results to return (default 10).

    Returns
    -------
    List of dicts sorted by matchScore descending, e.g.:
        [{"id": "opp1", "matchScore": 0.82}, ...]
    """
    if not opportunities:
        return []

    # Convert the volunteer's skills to a single text document.
    volunteer_text = _skills_to_text(volunteer_skills)

    # Build one text document per opportunity from its requiredSkills list.
    opp_texts = [
        _skills_to_text(opp.get("requiredSkills", []))
        for opp in opportunities
    ]

    # The first document in our corpus is the volunteer profile; the rest are
    # the opportunities.  We fit TF-IDF on *all* documents so that the IDF
    # weights reflect the full vocabulary.
    corpus = [volunteer_text] + opp_texts

    # TF-IDF vectorization:
    #   TF  = term frequency within a single document
    #   IDF = log(N / df) where N = corpus size, df = document frequency
    #   A term appearing in every document gets IDF ≈ 0 (not informative);
    #   rare terms get high IDF (more discriminative).
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # The volunteer vector is row 0; opportunity vectors are rows 1..N.
    volunteer_vec = tfidf_matrix[0]
    opp_vecs = tfidf_matrix[1:]

    # Cosine similarity between the volunteer vector and each opportunity.
    # Shape: (1, num_opportunities)
    scores = cosine_similarity(volunteer_vec, opp_vecs)[0]

    results = []
    for idx, opp in enumerate(opportunities):
        score = float(scores[idx])
        # Cosine similarity is already in [0, 1] for non-negative TF-IDF
        # vectors, so no additional normalization is needed.
        results.append({"id": opp["id"], "matchScore": round(score, 4)})

    # Sort by matchScore descending and return top N.
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
    """Return the top-N volunteers best matching an opportunity's required skills.

    Parameters
    ----------
    required_skills:
        Skills the opportunity requires (e.g. ["python", "mentoring"]).
    volunteers:
        List of volunteer dicts, each containing at least "id" and
        "skills" (a list of strings).
    top_n:
        Maximum number of results to return (default 10).

    Returns
    -------
    List of dicts sorted by matchScore descending, e.g.:
        [{"id": "v1", "matchScore": 0.91}, ...]
    """
    if not volunteers:
        return []

    # Convert the opportunity's required skills into a query document.
    opp_text = _skills_to_text(required_skills)

    # Build one text document per volunteer from their skills list.
    vol_texts = [
        _skills_to_text(vol.get("skills", []))
        for vol in volunteers
    ]

    # Fit TF-IDF on the combined corpus (opportunity + all volunteers).
    corpus = [opp_text] + vol_texts
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    opp_vec = tfidf_matrix[0]
    vol_vecs = tfidf_matrix[1:]

    # Cosine similarity: measures how closely a volunteer's skill vector
    # points in the same direction as the opportunity's skill vector.
    scores = cosine_similarity(opp_vec, vol_vecs)[0]

    results = []
    for idx, vol in enumerate(volunteers):
        score = float(scores[idx])
        results.append({"id": vol["id"], "matchScore": round(score, 4)})

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
    """Rank opportunities by semantic relevance to a free-text search query.

    Parameters
    ----------
    query:
        Free-text search string (e.g. "teaching children mathematics").
    opportunities:
        List of opportunity dicts, each containing at least "id" and
        "text" (a descriptive free-text string).
    top_n:
        Maximum number of results to return (default 10).

    Returns
    -------
    List of dicts sorted by matchScore descending, e.g.:
        [{"id": "opp1", "matchScore": 0.74}, ...]
    """
    if not opportunities:
        return []

    # Each opportunity is already a free-text description – no conversion
    # needed.  We treat the search query as the first document in the corpus.
    opp_texts = [opp.get("text", "") for opp in opportunities]
    corpus = [query] + opp_texts

    # TF-IDF: rare words shared between the query and an opportunity get
    # upweighted, making the similarity score more meaningful than a simple
    # word-count overlap.
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    query_vec = tfidf_matrix[0]
    opp_vecs = tfidf_matrix[1:]

    # Cosine similarity between the query vector and every opportunity vector.
    scores = cosine_similarity(query_vec, opp_vecs)[0]

    results = []
    for idx, opp in enumerate(opportunities):
        score = float(scores[idx])
        results.append({"id": opp["id"], "matchScore": round(score, 4)})

    results.sort(key=lambda x: x["matchScore"], reverse=True)
    return results[:top_n]
