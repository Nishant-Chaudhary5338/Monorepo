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
    rows: { control: "number" },
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

export const ReadOnly: Story = {
  args: {
    value: "This content is read-only and cannot be edited.",
    readOnly: true,
  },
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

export const ErrorState: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="error-textarea">Feedback</Label>
      <Textarea
        id="error-textarea"
        placeholder="Please provide your feedback"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">This field is required</p>
    </div>
  ),
}

export const SuccessState: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="success-textarea">Description</Label>
      <Textarea
        id="success-textarea"
        defaultValue="This looks great! The description is clear and concise."
        className="border-green-500 focus-visible:ring-green-500"
      />
      <p className="text-sm text-green-600">Description saved successfully</p>
    </div>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="small">Short comment</Label>
      <Textarea
        id="small"
        placeholder="Brief comment..."
        className="min-h-[60px]"
        rows={2}
      />
    </div>
  ),
}

export const MediumSize: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="medium">Message</Label>
      <Textarea
        id="medium"
        placeholder="Write your message..."
        className="min-h-[120px]"
        rows={4}
      />
    </div>
  ),
}

export const LargeSize: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="large">Article content</Label>
      <Textarea
        id="large"
        placeholder="Write your article..."
        className="min-h-[200px]"
        rows={8}
      />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <div className="grid gap-1.5">
        <Label>Default</Label>
        <Textarea placeholder="Default textarea" />
      </div>
      <div className="grid gap-1.5">
        <Label>With Value</Label>
        <Textarea defaultValue="Pre-filled content" />
      </div>
      <div className="grid gap-1.5">
        <Label>Disabled</Label>
        <Textarea placeholder="Disabled" disabled />
      </div>
      <div className="grid gap-1.5">
        <Label>Read Only</Label>
        <Textarea value="Read-only content" readOnly />
      </div>
      <div className="grid gap-1.5">
        <Label>Error</Label>
        <Textarea
          placeholder="Error state"
          className="border-red-500 focus-visible:ring-red-500"
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Success</Label>
        <Textarea
          defaultValue="Valid content"
          className="border-green-500 focus-visible:ring-green-500"
        />
      </div>
    </div>
  ),
}

export const ContactForm: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-[400px] p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Contact Us</h3>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <input
          id="contact-name"
          className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
          placeholder="Your name"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <input
          id="contact-email"
          type="email"
          className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
          placeholder="your@email.com"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          placeholder="How can we help you?"
          className="min-h-[120px]"
        />
      </div>
      <Button type="submit">Send Message</Button>
    </form>
  ),
}

export const FeedbackForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px] p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Product Feedback</h3>
      <div className="grid gap-1.5">
        <Label htmlFor="feedback-likes">What do you like?</Label>
        <Textarea
          id="feedback-likes"
          placeholder="Tell us what you enjoy about our product..."
          className="min-h-[80px]"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="feedback-improve">What could be improved?</Label>
        <Textarea
          id="feedback-improve"
          placeholder="Share your suggestions for improvement..."
          className="min-h-[80px]"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="feedback-comments">Additional comments</Label>
        <Textarea
          id="feedback-comments"
          placeholder="Any other thoughts..."
          className="min-h-[80px]"
        />
      </div>
      <Button>Submit Feedback</Button>
    </div>
  ),
}

export const CodeEditor: Story = {
  render: () => (
    <div className="grid w-full gap-1.5 max-w-[600px]">
      <Label htmlFor="code">JSON Configuration</Label>
      <Textarea
        id="code"
        className="font-mono text-sm min-h-[200px]"
        defaultValue={`{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}`}
      />
      <p className="text-sm text-muted-foreground">
        Edit your configuration file in JSON format
      </p>
    </div>
  ),
}

export const Resizable: Story = {
  render: () => (
    <div className="grid w-full gap-1.5 max-w-[400px]">
      <Label htmlFor="resizable">Resizable textarea</Label>
      <Textarea
        id="resizable"
        placeholder="You can resize this textarea..."
        className="min-h-[100px] resize-y"
      />
      <p className="text-sm text-muted-foreground">
        Drag the bottom-right corner to resize
      </p>
    </div>
  ),
}