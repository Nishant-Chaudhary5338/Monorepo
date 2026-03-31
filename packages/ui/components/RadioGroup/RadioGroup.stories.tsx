import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./RadioGroup"
import { Label } from "../Label/Label"

const meta: Meta<typeof RadioGroup> = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="card">
      <div className="flex items-start p-4 space-x-3 border rounded-lg">
        <RadioGroupItem value="card" id="card" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="card">Card</Label>
          <p className="text-sm text-muted-foreground">
            Use card for flexible payment options.
          </p>
        </div>
      </div>
      <div className="flex items-start p-4 space-x-3 border rounded-lg">
        <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="paypal">PayPal</Label>
          <p className="text-sm text-muted-foreground">
            Pay with your PayPal account.
          </p>
        </div>
      </div>
      <div className="flex items-start p-4 space-x-3 border rounded-lg">
        <RadioGroupItem value="apple" id="apple" className="mt-1" />
        <div className="grid gap-1.5">
          <Label htmlFor="apple">Apple Pay</Label>
          <p className="text-sm text-muted-foreground">
            Pay with Apple Pay on your device.
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option1" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="d1" />
        <Label htmlFor="d1" className="opacity-50">
          Option 1 (Selected)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="d2" />
        <Label htmlFor="d2" className="opacity-50">
          Option 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="d3" />
        <Label htmlFor="d3" className="opacity-50">
          Option 3
        </Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="daily" className="flex flex-row gap-6">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="daily" id="h1" />
        <Label htmlFor="h1">Daily</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="weekly" id="h2" />
        <Label htmlFor="h2">Weekly</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="monthly" id="h3" />
        <Label htmlFor="h3">Monthly</Label>
      </div>
    </RadioGroup>
  ),
}

export const PaymentMethod: Story = {
  render: () => (
    <RadioGroup defaultValue="card" className="gap-3">
      <label
        htmlFor="pm-card"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="card" id="pm-card" />
          <div>
            <p className="font-medium">Credit Card</p>
            <p className="text-sm text-muted-foreground">
              Visa, Mastercard, Amex
            </p>
          </div>
        </div>
        <svg
          className="w-8 h-6 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      </label>
      <label
        htmlFor="pm-paypal"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="paypal" id="pm-paypal" />
          <div>
            <p className="font-medium">PayPal</p>
            <p className="text-sm text-muted-foreground">
              Pay with your PayPal account
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold text-blue-600">PayPal</span>
      </label>
      <label
        htmlFor="pm-bank"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="bank" id="pm-bank" />
          <div>
            <p className="font-medium">Bank Transfer</p>
            <p className="text-sm text-muted-foreground">
              Direct bank transfer
            </p>
          </div>
        </div>
        <svg
          className="w-6 h-6 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </label>
    </RadioGroup>
  ),
}

export const PricingPlans: Story = {
  render: () => (
    <RadioGroup defaultValue="pro" className="grid grid-cols-3 gap-4">
      <label
        htmlFor="plan-free"
        className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:border-primary"
      >
        <RadioGroupItem value="free" id="plan-free" className="sr-only" />
        <h3 className="font-semibold">Free</h3>
        <p className="mt-2 text-3xl font-bold">$0</p>
        <p className="mt-1 text-sm text-muted-foreground">/month</p>
        <ul className="mt-4 space-y-2 text-sm text-left">
          <li>✓ 1 Project</li>
          <li>✓ 100MB Storage</li>
          <li>✓ Community Support</li>
        </ul>
      </label>
      <label
        htmlFor="plan-pro"
        className="flex flex-col items-center p-6 border-2 rounded-lg cursor-pointer border-primary bg-primary/5"
      >
        <RadioGroupItem value="pro" id="plan-pro" className="sr-only" />
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary text-primary-foreground">
          Popular
        </span>
        <h3 className="mt-2 font-semibold">Pro</h3>
        <p className="mt-2 text-3xl font-bold">$19</p>
        <p className="mt-1 text-sm text-muted-foreground">/month</p>
        <ul className="mt-4 space-y-2 text-sm text-left">
          <li>✓ 10 Projects</li>
          <li>✓ 10GB Storage</li>
          <li>✓ Priority Support</li>
          <li>✓ Analytics</li>
        </ul>
      </label>
      <label
        htmlFor="plan-enterprise"
        className="flex flex-col items-center p-6 border rounded-lg cursor-pointer hover:border-primary"
      >
        <RadioGroupItem
          value="enterprise"
          id="plan-enterprise"
          className="sr-only"
        />
        <h3 className="font-semibold">Enterprise</h3>
        <p className="mt-2 text-3xl font-bold">$99</p>
        <p className="mt-1 text-sm text-muted-foreground">/month</p>
        <ul className="mt-4 space-y-2 text-sm text-left">
          <li>✓ Unlimited Projects</li>
          <li>✓ 1TB Storage</li>
          <li>✓ 24/7 Support</li>
          <li>✓ Custom Integrations</li>
        </ul>
      </label>
    </RadioGroup>
  ),
}

export const SurveyQuestion: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">
        How satisfied are you with our service?
      </h3>
      <RadioGroup defaultValue="satisfied">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="very-dissatisfied" id="vd" />
          <Label htmlFor="vd">Very Dissatisfied</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dissatisfied" id="d" />
          <Label htmlFor="d">Dissatisfied</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="neutral" id="n" />
          <Label htmlFor="n">Neutral</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="satisfied" id="s" />
          <Label htmlFor="s">Satisfied</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="very-satisfied" id="vs" />
          <Label htmlFor="vs">Very Satisfied</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}

export const DeliveryOptions: Story = {
  render: () => (
    <RadioGroup defaultValue="standard" className="gap-3">
      <label
        htmlFor="delivery-standard"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="standard" id="delivery-standard" />
          <div>
            <p className="font-medium">Standard Delivery</p>
            <p className="text-sm text-muted-foreground">
              5-7 business days
            </p>
          </div>
        </div>
        <span className="font-medium">Free</span>
      </label>
      <label
        htmlFor="delivery-express"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="express" id="delivery-express" />
          <div>
            <p className="font-medium">Express Delivery</p>
            <p className="text-sm text-muted-foreground">
              2-3 business days
            </p>
          </div>
        </div>
        <span className="font-medium">$9.99</span>
      </label>
      <label
        htmlFor="delivery-overnight"
        className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="overnight" id="delivery-overnight" />
          <div>
            <p className="font-medium">Overnight Delivery</p>
            <p className="text-sm text-muted-foreground">
              Next business day
            </p>
          </div>
        </div>
        <span className="font-medium">$24.99</span>
      </label>
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h4 className="mb-3 font-medium">Default</h4>
        <RadioGroup defaultValue="option1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="s1" />
            <Label htmlFor="s1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="s2" />
            <Label htmlFor="s2">Option 2</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <h4 className="mb-3 font-medium">Disabled</h4>
        <RadioGroup defaultValue="option1" disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="sd1" />
            <Label htmlFor="sd1" className="opacity-50">
              Option 1
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="sd2" />
            <Label htmlFor="sd2" className="opacity-50">
              Option 2
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
}