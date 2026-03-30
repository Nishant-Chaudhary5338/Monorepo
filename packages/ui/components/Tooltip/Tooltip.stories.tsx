import type { Meta, StoryObj } from "@storybook/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./Tooltip"
import { Button } from "../Button/Button"

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
        <TooltipContent><p>Add to library</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const Positions: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-4">
        <Tooltip><TooltipTrigger asChild><Button variant="outline">Top</Button></TooltipTrigger><TooltipContent side="top"><p>Tooltip on top</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="outline">Right</Button></TooltipTrigger><TooltipContent side="right"><p>Tooltip on right</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="outline">Bottom</Button></TooltipTrigger><TooltipContent side="bottom"><p>Tooltip on bottom</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="outline">Left</Button></TooltipTrigger><TooltipContent side="left"><p>Tooltip on left</p></TooltipContent></Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
            </svg>
          </Button>
        </TooltipTrigger>
        <TooltipContent><p>More information</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const WithRichContent: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Rich Tooltip</Button></TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <p className="font-semibold">Keyboard Shortcut</p>
            <p className="text-xs text-muted-foreground">Press Ctrl+K to open the command palette.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}

export const IconButtons: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          </Button>
        </TooltipTrigger><TooltipContent><p>Save</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" x2="12" y1="2" y2="15" /></svg>
          </Button>
        </TooltipTrigger><TooltipContent><p>Upload</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
          </Button>
        </TooltipTrigger><TooltipContent><p>Download</p></TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg>
          </Button>
        </TooltipTrigger><TooltipContent><p>Search</p></TooltipContent></Tooltip>
      </div>
    </TooltipProvider>
  ),
}

export const Delayed: Story = {
  render: () => (
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger asChild><Button variant="outline">Delayed tooltip</Button></TooltipTrigger>
        <TooltipContent><p>I appear after 700ms</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
