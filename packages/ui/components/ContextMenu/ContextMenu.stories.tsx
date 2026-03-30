import type { Meta, StoryObj } from '@storybook/react'
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem,
  ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut,
  ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger,
  ContextMenuRadioGroup, ContextMenuGroup,
} from './ContextMenu'

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem disabled>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Save As</ContextMenuItem>
        <ContextMenuItem>Print</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>View Source</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithShortcuts: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Cut <ContextMenuShortcut>⌘X</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Copy <ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Paste <ContextMenuShortcut>⌘V</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Select All <ContextMenuShortcut>⌘A</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Share</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>Email</ContextMenuItem>
            <ContextMenuItem>Messages</ContextMenuItem>
            <ContextMenuItem>AirDrop</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Move to Trash</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithCheckboxAndRadio: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>View Options</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show Toolbar</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Sidebar</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked>Show Status Bar</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Sort By</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="name">
          <ContextMenuRadioItem value="name">Name</ContextMenuRadioItem>
          <ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
          <ContextMenuRadioItem value="size">Size</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuGroup>
          <ContextMenuItem>New File <ContextMenuShortcut>⌘N</ContextMenuShortcut></ContextMenuItem>
          <ContextMenuItem>New Folder</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem>Cut</ContextMenuItem>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-600">Delete <ContextMenuShortcut>⌘⌫</ContextMenuShortcut></ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

export const FileExplorer: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[300px] items-center justify-center rounded-md border text-sm">
        <div className="text-center">
          <p className="font-medium">project-folder/</p>
          <p className="text-xs text-muted-foreground mt-1">Right click for options</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>Open</ContextMenuItem>
        <ContextMenuItem>Open in New Tab</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Duplicate</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Rename</ContextMenuItem>
            <ContextMenuItem>Compress</ContextMenuItem>
            <ContextMenuItem>Get Info</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Move to Trash</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
