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
