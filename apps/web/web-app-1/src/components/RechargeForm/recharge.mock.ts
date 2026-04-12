import type { Circle, Operator, Plan } from './recharge.types'

export const OPERATORS: Operator[] = [
  { id: 'airtel', label: 'Airtel' },
  { id: 'jio', label: 'Jio' },
  { id: 'vi', label: 'Vi (Vodafone Idea)' },
  { id: 'bsnl', label: 'BSNL' },
  { id: 'mtnl', label: 'MTNL' },
]

export const CIRCLES: Circle[] = [
  { id: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { id: 'assam', label: 'Assam' },
  { id: 'bihar-jharkhand', label: 'Bihar & Jharkhand' },
  { id: 'chennai', label: 'Chennai' },
  { id: 'delhi', label: 'Delhi & NCR' },
  { id: 'gujarat', label: 'Gujarat' },
  { id: 'haryana', label: 'Haryana' },
  { id: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { id: 'jammu-kashmir', label: 'Jammu & Kashmir' },
  { id: 'karnataka', label: 'Karnataka' },
  { id: 'kerala', label: 'Kerala' },
  { id: 'kolkata', label: 'Kolkata' },
  { id: 'madhya-pradesh', label: 'Madhya Pradesh & Chhattisgarh' },
  { id: 'maharashtra', label: 'Maharashtra & Goa' },
  { id: 'mumbai', label: 'Mumbai' },
  { id: 'north-east', label: 'North East' },
  { id: 'odisha', label: 'Odisha' },
  { id: 'punjab', label: 'Punjab' },
  { id: 'rajasthan', label: 'Rajasthan' },
  { id: 'tamil-nadu', label: 'Tamil Nadu' },
  { id: 'up-east', label: 'Uttar Pradesh (East)' },
  { id: 'up-west', label: 'Uttar Pradesh (West)' },
  { id: 'west-bengal', label: 'West Bengal' },
]

const PREPAID_PLANS: Plan[] = [
  { id: 'p1', price: 99, validity: '24 days', data: '1 GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 'p2', price: 179, validity: '28 days', data: '1.5 GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 'p3', price: 299, validity: '28 days', data: '2 GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 'p4', price: 399, validity: '56 days', data: '2.5 GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 'p5', price: 599, validity: '84 days', data: '2 GB/day', calls: 'Unlimited', sms: '100/day' },
  { id: 'p6', price: 999, validity: '365 days', data: '2 GB/day', calls: 'Unlimited', sms: '100/day' },
]

const POSTPAID_PLANS: Plan[] = [
  { id: 'pp1', price: 399, validity: '30 days', data: '40 GB', calls: 'Unlimited', sms: '100/month' },
  { id: 'pp2', price: 499, validity: '30 days', data: '75 GB', calls: 'Unlimited', sms: '100/month' },
  { id: 'pp3', price: 699, validity: '30 days', data: 'Unlimited', calls: 'Unlimited', sms: 'Unlimited' },
  { id: 'pp4', price: 999, validity: '30 days', data: 'Unlimited + 100 GB hotspot', calls: 'Unlimited', sms: 'Unlimited' },
]

export function getMockPlans(category: 'prepaid' | 'postpaid'): Plan[] {
  return category === 'prepaid' ? PREPAID_PLANS : POSTPAID_PLANS
}
