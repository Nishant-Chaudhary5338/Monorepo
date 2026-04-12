export type Category = 'prepaid' | 'postpaid'

export interface Operator {
  id: string
  label: string
}

export interface Circle {
  id: string
  label: string
}

export interface Plan {
  id: string
  price: number
  validity: string
  data: string
  calls: string
  sms: string
}

export interface RechargeFormValues {
  category: Category
  phoneNumber: string
  operator: string
  circle: string
}

export interface PostRequirementPayload extends RechargeFormValues {
  planId?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
