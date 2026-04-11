import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "./Command"
import { Badge } from "../Badge/Badge"
import { Skeleton } from "../Skeleton/Skeleton"

const meta: Meta<typeof Command> = {
  title: "Components/Command",
  component: Command,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Command>

// ─── Icons ────────────────────────────────────────────────────────────────────

function Icon({ d, children, size = 16 }: { d?: string; children?: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d && <path d={d} />}
      {children}
    </svg>
  )
}

const CalendarIcon = () => <Icon><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></Icon>
const SearchIcon = () => <Icon><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></Icon>
const SettingsIcon = () => <Icon><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></Icon>
const UserIcon = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"><circle cx="12" cy="7" r="4" /></Icon>
const FileIcon = () => <Icon><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></Icon>
const PlusIcon = () => <Icon d="M5 12h14"><path d="M12 5v14" /></Icon>
const InboxIcon = () => <Icon d="M22 12h-6l-2 3h-4l-2-3H2"><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></Icon>
const StarIcon = () => <Icon d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
const GridIcon = () => <Icon><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></Icon>
const SunIcon = () => <Icon><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Icon>
const MoonIcon = () => <Icon d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
const MonitorIcon = () => <Icon><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>
const CheckIcon = () => <Icon d="M20 6 9 17l-5-5" />

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── With Shortcuts ───────────────────────────────────────────────────────────

export const WithShortcuts: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar <CommandShortcut>⌘P</CommandShortcut></CommandItem>
          <CommandItem>Search Emoji <CommandShortcut>⌘J</CommandShortcut></CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile <CommandShortcut>⌘S</CommandShortcut></CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings <CommandShortcut>⌘,</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── With Icons ───────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><CalendarIcon /> Calendar</CommandItem>
          <CommandItem><SearchIcon /> Search Emoji</CommandItem>
          <CommandItem><SettingsIcon /> Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem><UserIcon /> Profile <CommandShortcut>⌘P</CommandShortcut></CommandItem>
          <CommandItem><FileIcon /> Documents <CommandShortcut>⌘D</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── With Multiple Groups ─────────────────────────────────────────────────────

export const WithMultipleGroups: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem>Home</CommandItem>
          <CommandItem>About</CommandItem>
          <CommandItem>Contact</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>New File</CommandItem>
          <CommandItem>New Folder</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent">
          <CommandItem>project.tsx</CommandItem>
          <CommandItem>README.md</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── Minimal Search ───────────────────────────────────────────────────────────

export const MinimalSearch: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[300px]">
      <CommandInput placeholder="Quick search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Projects</CommandItem>
          <CommandItem>Team</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── CommandDialog (⌘K Modal) ─────────────────────────────────────────────────

export const CommandDialogDemo: Story = {
  name: "CommandDialog — ⌘K Modal",
  render: () => {
    function DialogDemo() {
      const [open, setOpen] = React.useState(false)

      React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
      }, [])

      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>{" "}
            or click to open.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent"
          >
            <SearchIcon />
            Search...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                <CommandItem onSelect={() => setOpen(false)}><GridIcon /> Dashboard <CommandShortcut>⌘D</CommandShortcut></CommandItem>
                <CommandItem onSelect={() => setOpen(false)}><UserIcon /> Team <CommandShortcut>⌘T</CommandShortcut></CommandItem>
                <CommandItem onSelect={() => setOpen(false)}><FileIcon /> Documents</CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Actions">
                <CommandItem onSelect={() => setOpen(false)}><PlusIcon /> New Project <CommandShortcut>⌘N</CommandShortcut></CommandItem>
                <CommandItem onSelect={() => setOpen(false)}><SearchIcon /> Advanced Search <CommandShortcut>⌘⇧F</CommandShortcut></CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem onSelect={() => setOpen(false)}><SettingsIcon /> Preferences <CommandShortcut>⌘,</CommandShortcut></CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      )
    }
    return <DialogDemo />
  },
}

// ─── Stateful Selection ───────────────────────────────────────────────────────

export const WithStatefulSelection: Story = {
  name: "Stateful Selection",
  render: () => {
    const workspaces = ["Personal", "Team Alpha", "Marketing", "Engineering", "Design"]

    function SelectionDemo() {
      const [selected, setSelected] = React.useState("Team Alpha")
      const [open, setOpen] = React.useState(false)

      return (
        <div className="space-y-4">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm shadow-sm hover:bg-accent"
          >
            <GridIcon />
            {selected}
            <span className="ml-1 text-muted-foreground">▾</span>
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Switch workspace..." />
            <CommandList>
              <CommandEmpty>No workspaces found.</CommandEmpty>
              <CommandGroup heading="Workspaces">
                {workspaces.map((ws) => (
                  <CommandItem
                    key={ws}
                    onSelect={() => { setSelected(ws); setOpen(false) }}
                    className="justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <GridIcon />
                      {ws}
                    </span>
                    {selected === ws && <CheckIcon />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <p className="text-xs text-muted-foreground">Active workspace: <strong>{selected}</strong></p>
        </div>
      )
    }
    return <SelectionDemo />
  },
}

// ─── With Badges ──────────────────────────────────────────────────────────────

export const WithBadges: Story = {
  name: "With Badges",
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Search messages..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Mailboxes">
          <CommandItem className="justify-between">
            <span className="flex items-center gap-2"><InboxIcon /> Inbox</span>
            <Badge variant="default">12</Badge>
          </CommandItem>
          <CommandItem className="justify-between">
            <span className="flex items-center gap-2"><StarIcon /> Starred</span>
            <Badge variant="secondary">3</Badge>
          </CommandItem>
          <CommandItem className="justify-between">
            <span className="flex items-center gap-2"><FileIcon /> Drafts</span>
            <Badge variant="outline">5</Badge>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Labels">
          {["Important", "Work", "Personal", "Travel"].map((label) => (
            <CommandItem key={label}>{label}</CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── With Avatars (User Search) ───────────────────────────────────────────────

export const WithAvatars: Story = {
  name: "User Search",
  render: () => {
    const users = [
      { name: "Alice Johnson", email: "alice@corp.com", initials: "AJ", color: "bg-blue-100 text-blue-700" },
      { name: "Bob Martinez", email: "bob@corp.com", initials: "BM", color: "bg-green-100 text-green-700" },
      { name: "Carol White", email: "carol@corp.com", initials: "CW", color: "bg-purple-100 text-purple-700" },
      { name: "David Lee", email: "david@corp.com", initials: "DL", color: "bg-orange-100 text-orange-700" },
      { name: "Eva Chen", email: "eva@corp.com", initials: "EC", color: "bg-pink-100 text-pink-700" },
    ]
    return (
      <Command className="rounded-lg border shadow-md max-w-[450px]">
        <CommandInput placeholder="Search people..." />
        <CommandList>
          <CommandEmpty>No people found.</CommandEmpty>
          <CommandGroup heading="Team Members">
            {users.map((user) => (
              <CommandItem key={user.email} className="gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${user.color}`}>
                  {user.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <CommandShortcut>→</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    )
  },
}

// ─── With Disabled Items ──────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  name: "Disabled Items",
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-[450px]">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem><PlusIcon /> New Project</CommandItem>
          <CommandItem><FileIcon /> New Document</CommandItem>
          <CommandItem disabled>
            <span className="flex items-center gap-2 opacity-50">
              <SearchIcon /> Import (requires upgrade)
            </span>
            <CommandShortcut className="opacity-50">Pro</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Team">
          <CommandItem><UserIcon /> Invite Member</CommandItem>
          <CommandItem disabled>
            <span className="flex items-center gap-2 opacity-50">
              <GridIcon /> Manage Roles (requires upgrade)
            </span>
            <CommandShortcut className="opacity-50">Pro</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}

// ─── Async Search ─────────────────────────────────────────────────────────────

export const AsyncSearch: Story = {
  name: "Async / Dynamic Search",
  render: () => {
    const allResults = [
      "Authentication service", "Billing module", "Cache layer", "Dashboard API",
      "Email notifications", "Feature flags", "GraphQL schema", "Health checks",
      "Integration tests", "Job scheduler", "Kafka consumer", "Load balancer",
    ]

    function AsyncSearchDemo() {
      const [query, setQuery] = React.useState("")
      const [loading, setLoading] = React.useState(false)
      const [results, setResults] = React.useState<string[]>([])
      const timerRef = React.useRef<ReturnType<typeof setTimeout>>()

      const handleSearch = (value: string) => {
        setQuery(value)
        clearTimeout(timerRef.current)
        if (!value) { setResults([]); setLoading(false); return }
        setLoading(true)
        timerRef.current = setTimeout(() => {
          setResults(allResults.filter((r) => r.toLowerCase().includes(value.toLowerCase())))
          setLoading(false)
        }, 400)
      }

      return (
        <Command className="rounded-lg border shadow-md max-w-[450px]" shouldFilter={false}>
          <CommandInput placeholder="Search services..." value={query} onValueChange={handleSearch} />
          <CommandList>
            {loading ? (
              <div className="p-2 space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            ) : query && results.length === 0 ? (
              <CommandEmpty>No services matching &ldquo;{query}&rdquo;</CommandEmpty>
            ) : results.length > 0 ? (
              <CommandGroup heading={`Results (${results.length})`}>
                {results.map((r) => (
                  <CommandItem key={r}><SearchIcon /> {r}</CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <CommandGroup heading="Popular">
                {allResults.slice(0, 4).map((r) => (
                  <CommandItem key={r}><StarIcon /> {r}</CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      )
    }
    return <AsyncSearchDemo />
  },
}

// ─── App Launcher ─────────────────────────────────────────────────────────────

export const AppLauncher: Story = {
  name: "App Launcher",
  render: () => {
    function AppLauncherDemo() {
      const [open, setOpen] = React.useState(false)

      const apps = {
        recent: [
          { name: "Analytics", icon: <GridIcon />, desc: "Dashboard & reports" },
          { name: "Documents", icon: <FileIcon />, desc: "File management" },
        ],
        pinned: [
          { name: "Inbox", icon: <InboxIcon />, desc: "12 unread messages" },
          { name: "Calendar", icon: <CalendarIcon />, desc: "3 events today" },
        ],
        all: [
          { name: "People", icon: <UserIcon />, desc: "Team directory" },
          { name: "Settings", icon: <SettingsIcon />, desc: "Account & preferences" },
          { name: "Search", icon: <SearchIcon />, desc: "Global search" },
        ],
      }

      return (
        <div className="space-y-4">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm shadow-sm hover:bg-accent"
          >
            <GridIcon /> Apps
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Open app..." />
            <CommandList>
              <CommandEmpty>No apps found.</CommandEmpty>
              {(Object.entries(apps) as [string, { name: string; icon: React.ReactNode; desc: string }[]][]).map(([group, items], gi) => (
                <React.Fragment key={group}>
                  {gi > 0 && <CommandSeparator />}
                  <CommandGroup heading={group.charAt(0).toUpperCase() + group.slice(1)}>
                    {items.map((app) => (
                      <CommandItem key={app.name} onSelect={() => setOpen(false)} className="gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted">
                          {app.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{app.name}</p>
                          <p className="text-xs text-muted-foreground">{app.desc}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
          </CommandDialog>
        </div>
      )
    }
    return <AppLauncherDemo />
  },
}

// ─── Theme Switch ─────────────────────────────────────────────────────────────

export const ThemeSwitch: Story = {
  name: "Theme Switcher",
  render: () => {
    type Theme = "light" | "dark" | "system"
    const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
      { value: "light", label: "Light", icon: <SunIcon /> },
      { value: "dark", label: "Dark", icon: <MoonIcon /> },
      { value: "system", label: "System", icon: <MonitorIcon /> },
    ]

    function ThemeSwitcherDemo() {
      const [theme, setTheme] = React.useState<Theme>("system")
      const [open, setOpen] = React.useState(false)
      const current = themes.find((t) => t.value === theme)!

      return (
        <div className="space-y-4">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm hover:bg-accent"
          >
            {current.icon}
            {current.label}
          </button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Choose theme..." />
            <CommandList>
              <CommandGroup heading="Theme">
                {themes.map((t) => (
                  <CommandItem
                    key={t.value}
                    onSelect={() => { setTheme(t.value); setOpen(false) }}
                    className="gap-3 justify-between"
                  >
                    <span className="flex items-center gap-2">
                      {t.icon}
                      {t.label}
                    </span>
                    {theme === t.value && <CheckIcon />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <p className="text-xs text-muted-foreground">Active theme: <strong>{theme}</strong></p>
        </div>
      )
    }
    return <ThemeSwitcherDemo />
  },
}
