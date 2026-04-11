import type { Meta, StoryObj } from "@storybook/react"
import { z } from "zod"
import { AutoForm } from "./AutoForm"

const meta: Meta<typeof AutoForm> = {
  title: "Components/AutoForm",
  component: AutoForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AutoForm>

// ─── Schemas ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "editor", "viewer"]),
  bio: z.string().optional(),
  agreeToTerms: z.boolean(),
})

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name is required"),
  bio: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  notifications: z.boolean(),
  theme: z.enum(["light", "dark", "system"]),
})

const surveySchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Must be 18 or older").max(120),
  satisfaction: z.enum(["very_satisfied", "satisfied", "neutral", "dissatisfied"]),
  feedback: z.string().optional(),
  subscribeToNewsletter: z.boolean(),
})

const contactSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  attachLogs: z.boolean(),
})

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Login: Story = {
  render: () => (
    <AutoForm
      schema={loginSchema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Sign in"
      fieldConfig={{
        email: {
          label: "Email address",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          placeholder: "••••••••",
        },
      }}
    />
  ),
}

export const Registration: Story = {
  render: () => (
    <AutoForm
      schema={registrationSchema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Create account"
      fieldConfig={{
        firstName: { label: "First name", placeholder: "John" },
        lastName: { label: "Last name", placeholder: "Doe" },
        email: { label: "Email", placeholder: "john@example.com" },
        password: { label: "Password", placeholder: "Min 8 characters" },
        role: {
          label: "Role",
          placeholder: "Select a role",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ],
        },
        bio: {
          label: "Bio",
          placeholder: "Tell us a bit about yourself...",
          description: "Optional. Max 200 characters.",
        },
        agreeToTerms: { label: "I agree to the Terms of Service and Privacy Policy" },
      }}
    />
  ),
}

export const Profile: Story = {
  render: () => (
    <AutoForm
      schema={profileSchema}
      defaultValues={{
        displayName: "Jane Smith",
        notifications: true,
        theme: "system",
      }}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Save changes"
      fieldConfig={{
        displayName: { label: "Display name", placeholder: "How others see you" },
        bio: {
          label: "Bio",
          placeholder: "A short description...",
          description: "Shown on your public profile.",
        },
        website: { label: "Website", placeholder: "https://yoursite.com" },
        notifications: { label: "Email notifications" },
        theme: {
          label: "Theme",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ],
        },
      }}
    />
  ),
}

export const Survey: Story = {
  render: () => (
    <AutoForm
      schema={surveySchema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Submit survey"
      fieldConfig={{
        name: { label: "Your name", placeholder: "Full name" },
        age: { label: "Age", placeholder: "Your age" },
        satisfaction: {
          label: "Overall satisfaction",
          fieldType: "radio",
          options: [
            { label: "Very satisfied", value: "very_satisfied" },
            { label: "Satisfied", value: "satisfied" },
            { label: "Neutral", value: "neutral" },
            { label: "Dissatisfied", value: "dissatisfied" },
          ],
        },
        feedback: {
          label: "Additional feedback",
          placeholder: "Any other thoughts?",
        },
        subscribeToNewsletter: { label: "Subscribe to product updates" },
      }}
    />
  ),
}

export const ContactSupport: Story = {
  render: () => (
    <AutoForm
      schema={contactSchema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Send message"
      fieldConfig={{
        subject: { label: "Subject", placeholder: "Brief summary of your issue" },
        message: {
          label: "Message",
          placeholder: "Describe your issue in detail...",
        },
        priority: {
          label: "Priority",
          options: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Urgent", value: "urgent" },
          ],
        },
        attachLogs: { label: "Attach system logs" },
      }}
    />
  ),
}

export const WithCustomSubmit: Story = {
  render: () => (
    <AutoForm
      schema={loginSchema}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      fieldConfig={{
        email: { label: "Email", placeholder: "you@example.com" },
        password: { label: "Password", placeholder: "••••••••" },
      }}
      renderSubmit={({ isLoading, isValid }) => (
        <div className="flex gap-2 w-full">
          <button
            type="button"
            className="flex-1 rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="flex-1 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      )}
    />
  ),
}

export const Loading: Story = {
  render: () => (
    <AutoForm
      schema={loginSchema}
      onSubmit={() => new Promise(() => {})}
      isLoading={true}
      submitText="Signing in..."
      fieldConfig={{
        email: { label: "Email", placeholder: "you@example.com" },
        password: { label: "Password", placeholder: "••••••••" },
      }}
    />
  ),
}

export const PartialFields: Story = {
  name: "Partial fields (include/exclude)",
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-4">
          Only email + role from registration schema
        </p>
        <AutoForm
          schema={registrationSchema}
          include={["email", "role"]}
          onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          submitText="Invite user"
          fieldConfig={{
            email: { label: "Email address", placeholder: "colleague@company.com" },
            role: {
              label: "Role",
              options: [
                { label: "Admin", value: "admin" },
                { label: "Editor", value: "editor" },
                { label: "Viewer", value: "viewer" },
              ],
            },
          }}
        />
      </div>
    </div>
  ),
}

export const CustomFieldOrder: Story = {
  render: () => (
    <AutoForm
      schema={registrationSchema}
      order={["role", "email", "firstName", "lastName", "password"]}
      exclude={["bio", "agreeToTerms"]}
      onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
      submitText="Create account"
      fieldConfig={{
        firstName: { label: "First name" },
        lastName: { label: "Last name" },
        email: { label: "Email" },
        password: { label: "Password" },
        role: {
          label: "Role",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Editor", value: "editor" },
            { label: "Viewer", value: "viewer" },
          ],
        },
      }}
    />
  ),
}
