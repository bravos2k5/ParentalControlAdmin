import apiClient from './client'

export const accessApi = {
  // Generate time-limited access code for a device
  async generateCode(deviceId, seconds) {
    const response = await apiClient.post('/access/generate-code', {
      deviceId,
      seconds
    })
    return response.data
  },

  // Grant access directly to a device (sends WebSocket message)
  async grantAccess(deviceId, seconds) {
    const response = await apiClient.post('/access/grant', {
      deviceId,
      seconds
    })
    return response.data
  },

  // Block a device after specified time
  async blockAfterTime(deviceId, seconds) {
    const response = await apiClient.post('/access/block', {
      deviceId,
      seconds
    })
    return response.data
  },

  // Block a device immediately
  async blockNow(deviceId) {
    return this.blockAfterTime(deviceId, 0)
  },

  // Get remaining block time for a device
  async getRemainingBlockTime(deviceId) {
    const response = await apiClient.get(`/access/block-time/${deviceId}`)
    return response.data
  }
}
