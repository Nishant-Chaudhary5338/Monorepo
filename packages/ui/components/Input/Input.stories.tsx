import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./Input"

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "search",
        "tel",
        "url",
        "file",
      ],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: "Enter text..." },
}

export const Email: Story = {
  args: { type: "email", placeholder: "Enter your email" },
}

export const Password: Story = {
  args: { type: "password", placeholder: "Enter password" },
}

export const Number: Story = {
  args: { type: "number", placeholder: "0", min: 0, max: 100 },
}

export const Search: Story = {
  args: { type: "search", placeholder: "Search..." },
}

export const Tel: Story = {
  args: { type: "tel", placeholder: "+1 (555) 000-0000" },
}

export const Url: Story = {
  args: { type: "url", placeholder: "https://example.com" },
}

export const File: Story = {
  args: { type: "file" },
}

export const Disabled: Story = {
  args: { placeholder: "Disabled input", disabled: true },
}

export const ReadOnly: Story = {
  args: { value: "Read-only value", readOnly: true },
}

export const WithValue: Story = {
  args: { value: "Pre-filled value", readOnly: true },
}

export const WithPlaceholder: Story = {
  args: { placeholder: "This is a helpful placeholder text" },
}

export const MaxLength: Story = {
  args: { placeholder: "Max 10 characters", maxLength: 10 },
}

export const AllInputTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
      <Input type="tel" placeholder="Phone" />
      <Input type="url" placeholder="URL" />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div>
        <label className="block mb-1 text-sm font-medium">Default</label>
        <Input placeholder="Default input" />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Disabled</label>
        <Input placeholder="Disabled" disabled />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Read Only</label>
        <Input value="Read only" readOnly />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">With Value</label>
        <Input defaultValue="Pre-filled value" />
      </div>
    </div>
  ),
}

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px]">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <Input id="name" placeholder="John Doe" />
        <p className="text-sm text-muted-foreground">
          Enter your full legal name
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email Address
        </label>
        <Input id="email" type="email" placeholder="john@example.com" />
        <p className="text-sm text-muted-foreground">
          We will never share your email
        </p>
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input id="password" type="password" placeholder="••••••••" />
        <p className="text-sm text-muted-foreground">
          Must be at least 8 characters
        </p>
      </div>
    </div>
  ),
}

export const ErrorState: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px]">
      <div className="space-y-2">
        <label htmlFor="error-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="error-email"
          type="email"
          placeholder="john@example.com"
          className="border-red-500 focus-visible:ring-red-500"
          defaultValue="invalid-email"
        />
        <p className="text-sm text-red-500">Please enter a valid email address</p>
      </div>
      <div className="space-y-2">
        <label htmlFor="error-password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="error-password"
          type="password"
          placeholder="••••••••"
          className="border-red-500 focus-visible:ring-red-500"
        />
        <p className="text-sm text-red-500">Password must be at least 8 characters</p>
      </div>
    </div>
  ),
}

export const SuccessState: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px]">
      <div className="space-y-2">
        <label htmlFor="success-username" className="text-sm font-medium">
          Username
        </label>
        <Input
          id="success-username"
          placeholder="johndoe"
          className="border-green-500 focus-visible:ring-green-500"
          defaultValue="johndoe123"
        />
        <p className="text-sm text-green-600">Username is available!</p>
      </div>
    </div>
  ),
}

export const WithInlineIcon: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[300px]">
      <div className="relative">
        <svg
          className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <Input className="pl-10" placeholder="Search..." />
      </div>
      <div className="relative">
        <svg
          className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
        <Input className="pl-10" placeholder="Schedule time..." />
      </div>
      <div className="relative">
        <Input className="pr-10" placeholder="Enter amount" />
        <span className="absolute text-sm -translate-y-1/2 right-3 top-1/2 text-muted-foreground">
          USD
        </span>
      </div>
    </div>
  ),
}

export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-[400px] p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Create Account</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="first-name" className="text-sm font-medium">
            First Name
          </label>
          <Input id="first-name" placeholder="John" />
        </div>
        <div className="space-y-2">
          <label htmlFor="last-name" className="text-sm font-medium">
            Last Name
          </label>
          <Input id="last-name" placeholder="Doe" />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium">
          Email
        </label>
        <Input id="signup-email" type="email" placeholder="john@example.com" />
      </div>
      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium">
          Password
        </label>
        <Input id="signup-password" type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium">
          Confirm Password
        </label>
        <Input id="confirm-password" type="password" placeholder="••••••••" />
      </div>
    </form>
  ),
}