import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./Textarea"
import { Label } from "../Label/Label"
import { Button } from "../Button/Button"

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { placeholder: "Type your message here." },
}

export const WithValue: Story = {
  args: {
    defaultValue: "This is a pre-filled textarea with some content.",
  },
}

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  ),
}

export const WithLabelAndDescription: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="bio">Bio</Label>
      <Textarea
        placeholder="Tell us a little bit about yourself"
        id="bio"
        className="min-h-[100px]"
      />
      <p className="text-sm text-muted-foreground">
        Your bio will be visible on your profile.
      </p>
    </div>
  ),
}

export const WithButton: Story = {
  render: () => (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Type your message here." />
      <Button>Send message</Button>
    </div>
  ),
}

export const CharacterLimit: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="limited">Limited to 200 characters</Label>
      <Textarea
        id="limited"
        placeholder="Type your message here (max 200 characters)"
        maxLength={200}
        className="min-h-[100px]"
      />
    </div>
  ),
}
