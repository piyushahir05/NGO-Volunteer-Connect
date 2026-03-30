const natural = require('natural');

/**
 * Compute cosine similarity between two text strings using TF-IDF.
 *
 * Both texts are added as separate documents to a TfIdf instance.
 * A shared term vector is built by collecting all unique terms that appear
 * in either document; each dimension holds the TF-IDF weight of that term.
 * The standard cosine similarity formula is then applied.
 *
 * Returns a value between 0 (no overlap) and 1 (identical content).
 */
function computeCosineSimilarity(text1, text2) {
  // Guard against empty / null inputs
  const doc1 = text1 || '';
  const doc2 = text2 || '';

  // Both texts must be non-empty to produce a meaningful score
  if (!doc1.trim() || !doc2.trim()) return 0;

  const tfidf = new natural.TfIdf();
  tfidf.addDocument(doc1); // index 0
  tfidf.addDocument(doc2); // index 1

  // Collect all unique terms across both documents
  const terms = new Set();
  tfidf.listTerms(0).forEach((item) => terms.add(item.term));
  tfidf.listTerms(1).forEach((item) => terms.add(item.term));

  // Build parallel TF-IDF weight vectors
  const vec1 = [];
  const vec2 = [];
  terms.forEach((term) => {
    vec1.push(tfidf.tfidf(term, 0));
    vec2.push(tfidf.tfidf(term, 1));
  });

  // Compute dot product and magnitudes
  let dot = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dot += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (mag1 * mag2);
}

module.exports = { computeCosineSimilarity };
