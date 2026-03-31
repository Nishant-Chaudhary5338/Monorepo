import React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./Checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    "aria-label": "Accept terms",
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    "aria-label": "Checked checkbox",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    "aria-label": "Disabled checkbox",
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    "aria-label": "Disabled checked checkbox",
  },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <div className="flex items-start space-x-2">
      <Checkbox id="marketing" className="mt-1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="marketing"
          className="text-sm font-medium leading-none"
        >
          Marketing emails
        </label>
        <p className="text-sm text-muted-foreground">
          Receive emails about new products, features, and more.
        </p>
      </div>
    </div>
  ),
}

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" defaultChecked />
        <label htmlFor="option1" className="text-sm">
          Option 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <label htmlFor="option2" className="text-sm">
          Option 2
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <label htmlFor="option3" className="text-sm">
          Option 3
        </label>
      </div>
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center space-x-2">
        <Checkbox id="unchecked" />
        <label htmlFor="unchecked" className="text-sm">
          Unchecked
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="checked" defaultChecked />
        <label htmlFor="checked" className="text-sm">
          Checked
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <label htmlFor="disabled-unchecked" className="text-sm opacity-50">
          Disabled Unchecked
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <label htmlFor="disabled-checked" className="text-sm opacity-50">
          Disabled Checked
        </label>
      </div>
    </div>
  ),
}

export const TermsAndConditions: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Create Account</h3>
      <div className="flex items-start space-x-2">
        <Checkbox id="tos" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="tos" className="text-sm font-medium leading-none">
            I agree to the Terms of Service
          </label>
          <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="privacy" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label htmlFor="privacy" className="text-sm font-medium leading-none">
            I agree to the Privacy Policy
          </label>
          <p className="text-sm text-muted-foreground">
            You acknowledge that you have read and understood our Privacy Policy.
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" />
        <label htmlFor="newsletter" className="text-sm">
          Subscribe to our newsletter
        </label>
      </div>
    </div>
  ),
}

export const NotificationSettings: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>
      <div className="flex items-start space-x-2">
        <Checkbox id="email-notif" className="mt-1" defaultChecked />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="email-notif"
            className="text-sm font-medium leading-none"
          >
            Email Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive notifications via email
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="push-notif" className="mt-1" defaultChecked />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="push-notif"
            className="text-sm font-medium leading-none"
          >
            Push Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive push notifications on your device
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="sms-notif" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="sms-notif"
            className="text-sm font-medium leading-none"
          >
            SMS Notifications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive important updates via SMS
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="marketing-notif" className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="marketing-notif"
            className="text-sm font-medium leading-none"
          >
            Marketing Communications
          </label>
          <p className="text-sm text-muted-foreground">
            Receive promotional offers and updates
          </p>
        </div>
      </div>
    </div>
  ),
}

export const FilterOptions: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[250px] p-4 border rounded-lg">
      <h4 className="font-medium">Filter by Category</h4>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="electronics" defaultChecked />
          <label htmlFor="electronics" className="text-sm">
            Electronics
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="clothing" />
          <label htmlFor="clothing" className="text-sm">
            Clothing
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="books" defaultChecked />
          <label htmlFor="books" className="text-sm">
            Books
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="home" />
          <label htmlFor="home" className="text-sm">
            Home & Garden
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="sports" />
          <label htmlFor="sports" className="text-sm">
            Sports
          </label>
        </div>
      </div>
    </div>
  ),
}

export const PermissionsList: Story = {
  render: () => (
    <div className="flex flex-col max-w-md gap-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">User Permissions</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="read" defaultChecked />
            <label htmlFor="read" className="text-sm font-medium">
              Read Access
            </label>
          </div>
          <span className="text-xs text-muted-foreground">View content</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="write" defaultChecked />
            <label htmlFor="write" className="text-sm font-medium">
              Write Access
            </label>
          </div>
          <span className="text-xs text-muted-foreground">Create & edit</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="delete" />
            <label htmlFor="delete" className="text-sm font-medium">
              Delete Access
            </label>
          </div>
          <span className="text-xs text-muted-foreground">Remove content</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="admin" />
            <label htmlFor="admin" className="text-sm font-medium">
              Admin Access
            </label>
          </div>
          <span className="text-xs text-muted-foreground">Full control</span>
        </div>
      </div>
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => {
    const [checked, setChecked] = React.useState([true, false, false])
    const allChecked = checked.every(Boolean)
    const someChecked = checked.some(Boolean) && !allChecked

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={allChecked}
            onCheckedChange={(val) => {
              setChecked([!!val, !!val, !!val])
            }}
            aria-label="Select all"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
        </div>
        <div className="ml-6 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item-1"
              checked={checked[0]}
              onCheckedChange={(val) => {
                setChecked([!!val, checked[1], checked[2]])
              }}
            />
            <label htmlFor="item-1" className="text-sm">
              Item 1
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item-2"
              checked={checked[1]}
              onCheckedChange={(val) => {
                setChecked([checked[0], !!val, checked[2]])
              }}
            />
            <label htmlFor="item-2" className="text-sm">
              Item 2
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="item-3"
              checked={checked[2]}
              onCheckedChange={(val) => {
                setChecked([checked[0], checked[1], !!val])
              }}
            />
            <label htmlFor="item-3" className="text-sm">
              Item 3
            </label>
          </div>
        </div>
      </div>
    )
  },
}