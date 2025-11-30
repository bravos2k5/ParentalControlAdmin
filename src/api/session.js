import apiClient from './client'

export const sessionApi = {
  // Get all sessions
  async getAllSessions() {
    const response = await apiClient.get('/sessions')
    return response.data
  },

  // Delete a specific session
  async deleteSession(sessionId) {
    await apiClient.delete(`/sessions/${sessionId}`)
  },

  // Delete all sessions
  async deleteAllSessions() {
    await apiClient.delete('/sessions')
  }
}

