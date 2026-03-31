import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./Card"
import { Button } from "../Button/Button"
import { Badge } from "../Badge/Badge"

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center w-full gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="Name of your project"
                className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="framework">Framework</label>
              <select
                id="framework"
                className="flex w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
              >
                <option value="next">Next.js</option>
                <option value="svelte">SvelteKit</option>
                <option value="astro">Astro</option>
                <option value="nuxt">Nuxt.js</option>
              </select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
}

export const Notification: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center p-4 space-x-4 border rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Push Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send notifications to device.
            </p>
          </div>
        </div>
        <div className="flex items-center p-4 space-x-4 border rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Email Notifications
            </p>
            <p className="text-sm text-muted-foreground">
              Send emails to users.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <Card className="flex flex-row w-[500px] overflow-hidden">
      <div className="w-1/3 bg-muted" />
      <div className="w-2/3">
        <CardHeader>
          <CardTitle>Horizontal Card</CardTitle>
          <CardDescription>With image on the left side.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a horizontal card layout with content on the right.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Learn More</Button>
        </CardFooter>
      </div>
    </Card>
  ),
}

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>This is a simple card with only content.</p>
      </CardContent>
    </Card>
  ),
}

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Header Only</CardTitle>
        <CardDescription>
          This card only has a header with title and description.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600" />
      <CardHeader>
        <CardTitle>Beautiful Card</CardTitle>
        <CardDescription>With a gradient image header</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This card features a colorful gradient header image that makes it
          stand out.
        </p>
      </CardContent>
      <CardFooter>
        <Button>Explore</Button>
      </CardFooter>
    </Card>
  ),
}

export const ProductCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <div className="h-48 bg-muted" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Product Name</CardTitle>
          <Badge>New</Badge>
        </div>
        <CardDescription>Short product description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">$99</span>
          <span className="text-sm line-through text-muted-foreground">$149</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1">Add to Cart</Button>
        <Button variant="outline" size="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold rounded-full bg-muted">
            JD
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Building amazing products with modern technologies.
          </p>
          <div className="flex w-full gap-2">
            <Button variant="outline" className="flex-1">
              Message
            </Button>
            <Button className="flex-1">Follow</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">$45,231.89</p>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Subscriptions</p>
            <p className="text-2xl font-bold">+2350</p>
            <p className="text-xs text-green-600">+180.1% from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Active Now</p>
            <p className="text-2xl font-bold">+573</p>
            <p className="text-xs text-green-600">+201 since last hour</p>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InteractiveCard: Story = {
  render: () => (
    <Card className="w-[350px] cursor-pointer transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over me to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects to indicate interactivity.</p>
      </CardContent>
    </Card>
  ),
}

export const CardWithList: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment received</p>
              <p className="text-sm text-muted-foreground">From John Doe</p>
            </div>
            <span className="font-medium text-green-600">+$250.00</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Subscription</p>
              <p className="text-sm text-muted-foreground">Monthly plan</p>
            </div>
            <span className="font-medium text-red-600">-$29.99</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Refund</p>
              <p className="text-sm text-muted-foreground">Order #12345</p>
            </div>
            <span className="font-medium text-green-600">+$49.99</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const PricingCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="text-center">
        <CardDescription>Pro Plan</CardDescription>
        <CardTitle className="text-4xl">
          $19<span className="text-lg font-normal">/mo</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Advanced analytics
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Priority support
          </li>
          <li className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Custom domains
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Get Started</Button>
      </CardFooter>
    </Card>
  ),
}