const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Simple API helper for backend requests.
 * PUBLIC_INTERFACE
 */
export const api = {
  /** PUBLIC_INTERFACE
   * Fetch quiz definition (questions, options)
   */
  async getQuiz() {
    const res = await fetch(`${API_BASE}/api/quiz`);
    if (!res.ok) throw new Error('Failed to load quiz');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Submit answers to get character match. Returns { character, description, resultId }
   */
  async submitAnswers(answers) {
    const res = await fetch(`${API_BASE}/api/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error('Failed to submit answers');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Upload selfie for mashup generation. Returns { imageUrl } or { mashupUrl }
   */
  async uploadSelfie(file, resultId) {
    const form = new FormData();
    form.append('file', file);
    if (resultId) form.append('resultId', resultId);
    const res = await fetch(`${API_BASE}/api/upload-selfie`, {
      method: 'POST',
      body: form
    });
    if (!res.ok) throw new Error('Failed to upload selfie');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Fetch mashup image by resultId
   */
  async getMashup(resultId) {
    const res = await fetch(`${API_BASE}/api/results/${encodeURIComponent(resultId)}`);
    if (!res.ok) throw new Error('Failed to load result');
    return res.json();
  },

  // Admin APIs

  /** PUBLIC_INTERFACE
   * Get all questions
   */
  async getQuestions() {
    const res = await fetch(`${API_BASE}/api/admin/questions`);
    if (!res.ok) throw new Error('Failed to load questions');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Update or create question
   */
  async saveQuestion(question) {
    const method = question.id ? 'PUT' : 'POST';
    const url = question.id
      ? `${API_BASE}/api/admin/questions/${encodeURIComponent(question.id)}`
      : `${API_BASE}/api/admin/questions`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(question)
    });
    if (!res.ok) throw new Error('Failed to save question');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Delete question
   */
  async deleteQuestion(id) {
    const res = await fetch(`${API_BASE}/api/admin/questions/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete question');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Get characters list
   */
  async getCharacters() {
    const res = await fetch(`${API_BASE}/api/admin/characters`);
    if (!res.ok) throw new Error('Failed to load characters');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Save character
   */
  async saveCharacter(character) {
    const method = character.id ? 'PUT' : 'POST';
    const url = character.id
      ? `${API_BASE}/api/admin/characters/${encodeURIComponent(character.id)}`
      : `${API_BASE}/api/admin/characters`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(character)
    });
    if (!res.ok) throw new Error('Failed to save character');
    return res.json();
  },

  /** PUBLIC_INTERFACE
   * Delete character
   */
  async deleteCharacter(id) {
    const res = await fetch(`${API_BASE}/api/admin/characters/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete character');
    return res.json();
  },
};

export default api;
