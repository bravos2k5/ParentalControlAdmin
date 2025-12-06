import apiClient from './client'

export const sessionApi = {
  // Get all sessions
  async getAllSessions() {
    const response = await apiClient.get('/sessions')
    return response.data
  },

  // Delete a specific session
  async deleteSession(sessionId) {
    const response = await apiClient.delete(`/sessions/${sessionId}`)
    return response.data
  },

  // Delete all sessions
  async deleteAllSessions() {
    const response = await apiClient.delete('/sessions')
    return response.data
  }
}

