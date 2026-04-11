import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./Form"
import { Input } from "../Input/Input"
import { Textarea } from "../Textarea/Textarea"
import { Checkbox } from "../Checkbox/Checkbox"
import { Switch } from "../Switch/Switch"
import { Button } from "../Button/Button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Select/Select"
import {
  RadioGroup,
  RadioGroupItem,
} from "../RadioGroup/RadioGroup"
import { Label } from "../Label/Label"

const meta: Meta<typeof Form> = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-lg p-6">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Form>

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => {
    function BasicForm() {
      const form = useForm({ defaultValues: { username: "" } })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <BasicForm />
  },
}

// ─── Login ───────────────────────────────────────────────────────────────────

export const LoginExample: Story = {
  render: () => {
    function LoginForm() {
      const form = useForm({ defaultValues: { email: "", password: "" } })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Enter your registered email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ required: "Password is required", minLength: { value: 8, message: "Min 8 characters" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Form>
      )
    }
    return <LoginForm />
  },
}

// ─── With descriptions ────────────────────────────────────────────────────────

export const WithDescriptions: Story = {
  render: () => {
    function ProfileForm() {
      const form = useForm({ defaultValues: { name: "", bio: "" } })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>Enter your full legal name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormDescription>Brief description for your profile.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Profile</Button>
          </form>
        </Form>
      )
    }
    return <ProfileForm />
  },
}

// ─── With Select ─────────────────────────────────────────────────────────────

export const WithSelect: Story = {
  render: () => {
    const schema = z.object({
      role: z.enum(["admin", "editor", "viewer"], { required_error: "Please select a role" }),
    })
    function SelectForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { role: undefined },
      })
      const [submitted, setSubmitted] = React.useState<string | null>(null)
      return (
        <div className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => setSubmitted(v.role))}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>This controls what the user can do.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
          {submitted && <p className="text-sm text-muted-foreground">Saved role: <strong>{submitted}</strong></p>}
        </div>
      )
    }
    return <SelectForm />
  },
}

// ─── With Checkbox ────────────────────────────────────────────────────────────

export const WithCheckbox: Story = {
  render: () => {
    const schema = z.object({
      terms: z.boolean().refine((v) => v === true, { message: "You must accept the terms" }),
      marketing: z.boolean().optional(),
    })
    function CheckboxForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { terms: false, marketing: false },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Accept terms and conditions</FormLabel>
                    <FormDescription>
                      You agree to our Terms of Service and Privacy Policy.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketing"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Receive marketing emails</FormLabel>
                    <FormDescription>Optional. We send product updates monthly.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Continue</Button>
          </form>
        </Form>
      )
    }
    return <CheckboxForm />
  },
}

// ─── With RadioGroup ──────────────────────────────────────────────────────────

export const WithRadioGroup: Story = {
  render: () => {
    const schema = z.object({
      plan: z.enum(["free", "pro", "enterprise"], { required_error: "Please select a plan" }),
    })
    function RadioForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { plan: "pro" },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Subscription Plan</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {[
                        { value: "free", label: "Free", desc: "Up to 3 projects, 1 GB storage" },
                        { value: "pro", label: "Pro — $12/mo", desc: "Unlimited projects, 50 GB storage" },
                        { value: "enterprise", label: "Enterprise", desc: "Custom limits, SSO, SLA" },
                      ].map(({ value, label, desc }) => (
                        <FormItem key={value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={value} />
                          </FormControl>
                          <div>
                            <FormLabel className="font-medium">{label}</FormLabel>
                            <p className="text-xs text-muted-foreground">{desc}</p>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Upgrade Plan</Button>
          </form>
        </Form>
      )
    }
    return <RadioForm />
  },
}

// ─── With Switch ──────────────────────────────────────────────────────────────

export const WithSwitch: Story = {
  render: () => {
    const schema = z.object({
      emailNotifs: z.boolean(),
      pushNotifs: z.boolean(),
      smsNotifs: z.boolean(),
    })
    function SwitchForm() {
      const form = useForm<z.infer<typeof schema>>({
        defaultValues: { emailNotifs: true, pushNotifs: false, smsNotifs: false },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <div className="space-y-4">
              {(["emailNotifs", "pushNotifs", "smsNotifs"] as const).map((name, i) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {["Email notifications", "Push notifications", "SMS notifications"][i]}
                        </FormLabel>
                        <FormDescription>
                          {["Receive emails for activity.", "Browser push alerts.", "Text message alerts."][i]}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <Button type="submit">Save Preferences</Button>
          </form>
        </Form>
      )
    }
    return <SwitchForm />
  },
}

// ─── With Textarea ────────────────────────────────────────────────────────────

export const WithTextarea: Story = {
  render: () => {
    const schema = z.object({
      bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Max 500 characters"),
      notes: z.string().optional(),
    })
    function TextareaForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { bio: "", notes: "" },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length ?? 0}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Optional notes..." rows={3} {...field} />
                  </FormControl>
                  <FormDescription>Visible only to admins.</FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      )
    }
    return <TextareaForm />
  },
}

// ─── With Date Input ──────────────────────────────────────────────────────────

export const WithDateInput: Story = {
  render: () => {
    const schema = z.object({
      startDate: z.string().min(1, "Start date is required"),
      endDate: z.string().min(1, "End date is required"),
    })
    function DateForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { startDate: "", endDate: "" },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Must be after start date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Schedule</Button>
          </form>
        </Form>
      )
    }
    return <DateForm />
  },
}

// ─── With Number Input ────────────────────────────────────────────────────────

export const WithNumberInput: Story = {
  render: () => {
    const schema = z.object({
      age: z.coerce.number().min(18, "Must be at least 18").max(120, "Invalid age"),
      salary: z.coerce.number().min(0, "Must be a positive number"),
    })
    function NumberForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { age: undefined, salary: undefined },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" {...field} />
                  </FormControl>
                  <FormDescription>Must be 18 or older.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Salary ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="80000" min={0} step={1000} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <NumberForm />
  },
}

// ─── Validation Errors ────────────────────────────────────────────────────────

export const ValidationErrors: Story = {
  render: () => {
    const schema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    })
    function ErrorForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { username: "ab", email: "not-an-email", password: "short" },
      })
      // Trigger all errors immediately for demonstration
      React.useEffect(() => {
        form.trigger()
      }, [form])
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      )
    }
    return <ErrorForm />
  },
}

// ─── Async Submission ─────────────────────────────────────────────────────────

export const AsyncSubmission: Story = {
  render: () => {
    const schema = z.object({
      email: z.string().email("Invalid email"),
    })
    function AsyncForm() {
      const [done, setDone] = React.useState(false)
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
      })
      async function onSubmit(values: z.infer<typeof schema>) {
        await new Promise((r) => setTimeout(r, 1500))
        setDone(true)
        console.log(values)
      }
      if (done) {
        return (
          <div className="rounded-lg border p-6 text-center space-y-2">
            <p className="text-sm font-medium text-green-600">Subscribed successfully!</p>
            <button onClick={() => setDone(false)} className="text-xs text-muted-foreground underline">
              Reset
            </button>
          </div>
        )
      }
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>We&apos;ll never share your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
        </Form>
      )
    }
    return <AsyncForm />
  },
}

// ─── Grid Layout ─────────────────────────────────────────────────────────────

export const GridLayout: Story = {
  render: () => {
    const schema = z.object({
      firstName: z.string().min(2, "Required"),
      lastName: z.string().min(2, "Required"),
      email: z.string().email("Invalid email"),
      phone: z.string().optional(),
    })
    function GridForm() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
      })
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1 555-000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
        </Form>
      )
    }
    return <GridForm />
  },
}

// ─── Conditional Field ────────────────────────────────────────────────────────

export const ConditionalField: Story = {
  render: () => {
    const schema = z.discriminatedUnion("accountType", [
      z.object({ accountType: z.literal("personal"), name: z.string().min(2, "Required") }),
      z.object({ accountType: z.literal("business"), name: z.string().min(2, "Required"), companyName: z.string().min(2, "Company name required") }),
    ])
    function ConditionalForm() {
      const form = useForm<z.infer<typeof schema>>({
        defaultValues: { accountType: "personal", name: "" },
      })
      const accountType = form.watch("accountType")
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {accountType === "business" && (
              <FormField
                control={form.control}
                name={"companyName" as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormDescription>The legal name of your business.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit">Register</Button>
          </form>
        </Form>
      )
    }
    return <ConditionalForm />
  },
}

// ─── Settings Form (Kitchen Sink) ─────────────────────────────────────────────

export const SettingsForm: Story = {
  render: () => {
    const schema = z.object({
      displayName: z.string().min(2, "Display name must be at least 2 characters"),
      email: z.string().email("Invalid email"),
      bio: z.string().max(300, "Max 300 characters").optional(),
      website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
      timezone: z.string().min(1, "Please select a timezone"),
      theme: z.enum(["light", "dark", "system"]),
      emailNotifs: z.boolean(),
      marketingEmails: z.boolean(),
    })
    function SettingsFormComponent() {
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
          displayName: "Nishant C.",
          email: "nishant@corp.com",
          bio: "",
          website: "",
          timezone: "America/New_York",
          theme: "system",
          emailNotifs: true,
          marketingEmails: false,
        },
      })
      const [saved, setSaved] = React.useState(false)
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">Manage your account preferences.</p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async () => {
                await new Promise((r) => setTimeout(r, 800))
                setSaved(true)
                setTimeout(() => setSaved(false), 2000)
              })}
              className="space-y-8"
            >
              {/* Profile section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="A short bio…" className="resize-none" {...field} />
                      </FormControl>
                      <FormDescription>{field.value?.length ?? 0}/300</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl><Input type="url" placeholder="https://example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Preferences</h4>
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["America/New_York", "America/Chicago", "America/Los_Angeles", "Europe/London", "Asia/Tokyo"].map((tz) => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          {(["light", "dark", "system"] as const).map((t) => (
                            <FormItem key={t} className="flex items-center space-x-2 space-y-0">
                              <FormControl><RadioGroupItem value={t} /></FormControl>
                              <FormLabel className="font-normal capitalize">{t}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium border-b pb-2">Notifications</h4>
                {(["emailNotifs", "marketingEmails"] as const).map((name, i) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">
                            {["Email notifications", "Marketing emails"][i]}
                          </FormLabel>
                          <FormDescription>
                            {["Activity alerts sent to your email.", "Product updates and promotions."][i]}
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : saved ? "Saved!" : "Save Settings"}
              </Button>
            </form>
          </Form>
        </div>
      )
    }
    return <SettingsFormComponent />
  },
}
