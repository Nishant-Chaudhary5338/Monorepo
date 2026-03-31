import type { Meta, StoryObj } from "@storybook/react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./Select"
import { Label } from "../Label/Label"

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
          <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
          <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
          <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe</SelectLabel>
          <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
          <SelectItem value="cet">Central European Time (CET)</SelectItem>
          <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-[200px] gap-1.5">
      <Label htmlFor="fruit-select">Favorite Fruit</Label>
      <Select>
        <SelectTrigger id="fruit-select">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Scrollable: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Countries</SelectLabel>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="cn">China</SelectItem>
          <SelectItem value="in">India</SelectItem>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="se">Sweden</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const StatusSelect: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Active
          </div>
        </SelectItem>
        <SelectItem value="inactive">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            Inactive
          </div>
        </SelectItem>
        <SelectItem value="pending">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            Pending
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const FormExample: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-[350px] p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Project Settings</h3>
      <div className="grid gap-1.5">
        <Label htmlFor="project-type">Project Type</Label>
        <Select>
          <SelectTrigger id="project-type">
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="visibility">Visibility</Label>
        <Select>
          <SelectTrigger id="visibility">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="internal">Internal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="language">Language</Label>
        <Select>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="go">Go</SelectItem>
            <SelectItem value="rust">Rust</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="free">
          <div className="flex flex-col items-start">
            <span>Free</span>
            <span className="text-xs text-muted-foreground">
              $0/month - Basic features
            </span>
          </div>
        </SelectItem>
        <SelectItem value="pro">
          <div className="flex flex-col items-start">
            <span>Pro</span>
            <span className="text-xs text-muted-foreground">
              $19/month - Advanced features
            </span>
          </div>
        </SelectItem>
        <SelectItem value="enterprise">
          <div className="flex flex-col items-start">
            <span>Enterprise</span>
            <span className="text-xs text-muted-foreground">
              $99/month - All features + support
            </span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="grid gap-1.5">
        <Label>Default</Label>
        <Select>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>With Default Value</Label>
        <Select defaultValue="option2">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label>Disabled</Label>
        <Select disabled>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
}