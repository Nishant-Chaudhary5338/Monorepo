import type { ApiResponse, Category, Plan, PostRequirementPayload } from './recharge.types'
import { getMockPlans } from './recharge.mock'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getPlans(
  _operator: string,
  _circle: string,
  category: Category
): Promise<Plan[]> {
  await delay(400)
  return getMockPlans(category)
}

export async function postRequirement(
  payload: PostRequirementPayload
): Promise<ApiResponse<{ orderId: string }>> {
  await delay(600)

  // Simulate occasional failure for realism (10% chance)
  if (Math.random() < 0.1) {
    return {
      success: false,
      data: { orderId: '' },
      message: 'Service temporarily unavailable. Please try again.',
    }
  }

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
  console.info('[mock] postRequirement payload:', payload)

  return {
    success: true,
    data: { orderId },
    message: `Recharge initiated successfully! Order ID: ${orderId}`,
  }
}
