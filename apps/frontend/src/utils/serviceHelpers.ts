import {v4 as uuidv4} from 'uuid'

/**
 * Cleans the services array by removing any empty or invalid services
 */
export const cleanupServices = (services: any[] = []) => {
  if (!Array.isArray(services)) return []

  return services.filter(service => service && service.id && service.service_name && service.service_name.trim())
}

/**
 * Creates a new service with the given properties and a unique ID
 */
export const createNewService = (serviceName: string, availabilityType: string, timeSlots: any[] = []) => {
  return {
    id: uuidv4(),
    service_name: serviceName || 'Unnamed Service',
    availability_type: availabilityType,
    time_slots: timeSlots
  }
}
