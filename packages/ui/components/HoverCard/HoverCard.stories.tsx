import type { Meta, StoryObj } from "@storybook/react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard"
import { Button } from "../Button/Button"
import { Avatar, AvatarImage, AvatarFallback } from "../Avatar/Avatar"
import { Calendar } from "../Calendar/Calendar"

const meta: Meta<typeof HoverCard> = {
  title: "Components/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="link">@nextjs</Button></HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">The React Framework – created and maintained by @vercel.</p>
            <div className="flex items-center pt-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2 opacity-70">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="text-xs text-muted-foreground">Joined December 2021</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const WithAvatar: Story = {
  render: () => (
    <div className="flex gap-4">
      <HoverCard>
        <HoverCardTrigger asChild><Button variant="link" className="p-0">John Doe</Button></HoverCardTrigger>
        <HoverCardContent className="w-64">
          <div className="flex space-x-4">
            <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">John Doe</h4>
              <p className="text-sm text-muted-foreground">Software engineer building great products.</p>
              <p className="text-xs text-muted-foreground">500 followers</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
}

export const WithList: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">3 new notifications</Button></HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Notifications</h4>
          {['Alice commented on your post', 'Bob liked your photo', 'Charlie mentioned you'].map((n, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0" />
              <p>{n}</p>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const AlignStart: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">Aligned Start</Button></HoverCardTrigger>
      <HoverCardContent align="start" className="w-48">
        <p className="text-sm">This popover is aligned to the start.</p>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const AlignEnd: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">Aligned End</Button></HoverCardTrigger>
      <HoverCardContent align="end" className="w-48">
        <p className="text-sm">This popover is aligned to the end.</p>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const WithCalendar: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild><Button variant="outline">View Calendar</Button></HoverCardTrigger>
      <HoverCardContent className="w-auto p-0" align="start">
        <Calendar mode="single" />
      </HoverCardContent>
    </HoverCard>
  ),
}
