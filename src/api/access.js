import apiClient from './client'

export const accessApi = {
  // Grant access time to a device
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

  // Get remaining block time for a device
  async getRemainingBlockTime(deviceId) {
    const response = await apiClient.get(`/access/block-time/${deviceId}`)
    return response.data
  }
}

