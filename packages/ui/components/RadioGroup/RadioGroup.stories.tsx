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
    <RadioGroup defaultValue="option-one" disabled>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="d1" />
        <Label htmlFor="d1">Disabled Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="d2" />
        <Label htmlFor="d2">Disabled Option 2</Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="english" className="flex flex-row space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="english" id="h1" />
        <Label htmlFor="h1">English</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="french" id="h2" />
        <Label htmlFor="h2">French</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="german" id="h3" />
        <Label htmlFor="h3">German</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithFormLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-3">
      <Label>Notification Method</Label>
      <RadioGroup defaultValue="email" className="grid grid-cols-3 gap-4">
        <label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
          <RadioGroupItem value="email" id="email-method" className="sr-only" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="mt-2 text-sm font-medium">Email</span>
        </label>
        <label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
          <RadioGroupItem value="sms" id="sms-method" className="sr-only" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="mt-2 text-sm font-medium">SMS</span>
        </label>
        <label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
          <RadioGroupItem value="push" id="push-method" className="sr-only" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span className="mt-2 text-sm font-medium">Push</span>
        </label>
      </RadioGroup>
    </div>
  ),
}

export const PaymentOptions: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-3">
      <Label>Payment Method</Label>
      <RadioGroup defaultValue="card">
        <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="card" id="pm-card" />
            <div className="space-y-1">
              <Label htmlFor="pm-card" className="cursor-pointer">Credit Card</Label>
              <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
            </div>
          </div>
        </label>
        <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="paypal" id="pm-paypal" />
            <div className="space-y-1">
              <Label htmlFor="pm-paypal" className="cursor-pointer">PayPal</Label>
              <p className="text-xs text-muted-foreground">Pay with your PayPal account</p>
            </div>
          </div>
        </label>
        <label className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="apple" id="pm-apple" />
            <div className="space-y-1">
              <Label htmlFor="pm-apple" className="cursor-pointer">Apple Pay</Label>
              <p className="text-xs text-muted-foreground">Fast and secure</p>
            </div>
          </div>
        </label>
      </RadioGroup>
    </div>
  ),
}
