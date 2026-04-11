import { useState, useEffect } from "react";
import { SlideComponent as Slide } from "@repo/present";
import { SlideHeader } from "../components";

interface FileItem {
  name: string;
  icon: string;
  type: "folder" | "file";
  children?: FileItem[];
  monitored?: boolean;
}

const fileTree: FileItem = {
  name: "my-turborepo",
  icon: "📁",
  type: "folder",
  monitored: true,
  children: [
    {
      name: "apps",
      icon: "📂",
      type: "folder",
      monitored: true,
      children: [
        { name: "web-app-1", icon: "🖥️", type: "file", monitored: true },
        { name: "web-app-2", icon: "🖥️", type: "file", monitored: true },
        { name: "web-app-3", icon: "🖥️", type: "file", monitored: true },
        { name: "3d-portfolio", icon: "🎮", type: "file", monitored: true },
      ],
    },
    {
      name: "packages",
      icon: "📂",
      type: "folder",
      monitored: true,
      children: [
        { 
          name: "ui", 
          icon: "📂", 
          type: "folder", 
          monitored: true,
          children: [
            {
              name: "Button",
              icon: "📂",
              type: "folder",
              children: [
                { name: "Button.tsx", icon: "⚛️", type: "file" },
                { name: "Button.types.ts", icon: "📘", type: "file" },
                { name: "Button.test.tsx", icon: "🧪", type: "file" },
                { name: "Button.stories.tsx", icon: "📖", type: "file" },
                { name: "Button.docs.md", icon: "📄", type: "file" },
                { name: "index.ts", icon: "📦", type: "file" },
              ],
            },
            {
              name: "Input",
              icon: "📂",
              type: "folder",
              children: [
                { name: "Input.tsx", icon: "⚛️", type: "file" },
                { name: "Input.types.ts", icon: "📘", type: "file" },
                { name: "Input.test.tsx", icon: "🧪", type: "file" },
                { name: "Input.stories.tsx", icon: "📖", type: "file" },
                { name: "Input.docs.md", icon: "📄", type: "file" },
                { name: "index.ts", icon: "📦", type: "file" },
              ],
            },
            { name: "index.ts", icon: "📦", type: "file" },
          ],
        },
        { name: "dashcraft", icon: "📊", type: "file", monitored: true },
        { name: "present", icon: "📽️", type: "file", monitored: true },
        { name: "eslint-config", icon: "⚙️", type: "file", monitored: true },
        { name: "tailwind-config", icon: "🎭", type: "file", monitored: true },
        { name: "typescript-config", icon: "📘", type: "file", monitored: true },
      ],
    },
    {
      name: "tools",
      icon: "📂",
      type: "folder",
      monitored: true,
      children: [
        { name: "component-factory", icon: "🤖", type: "file", monitored: true },
        { name: "typescript-enforcer", icon: "🤖", type: "file", monitored: true },
        { name: "test-generator", icon: "🤖", type: "file", monitored: true },
        { name: "code-modernizer", icon: "🤖", type: "file", monitored: true },
        { name: "20+ more...", icon: "⚡", type: "file", monitored: true },
      ],
    },
    {
      name: "assets",
      icon: "📂",
      type: "folder",
      children: [
        { name: "documents", icon: "📄", type: "file" },
        { name: "images", icon: "🖼️", type: "file" },
      ],
    },
    {
      name: "docs",
      icon: "📂",
      type: "folder",
      children: [
        { name: "architecture", icon: "📐", type: "file" },
        { name: "guides", icon: "📖", type: "file" },
      ],
    },
    {
      name: "package.json",
      icon: "📦",
      type: "file",
    },
    {
      name: "turbo.json",
      icon: "⚡",
      type: "file",
    },
    {
      name: "pnpm-workspace.yaml",
      icon: "📄",
      type: "file",
    },
  ],
};

function FolderItem({
  item,
  depth = 0,
  isLast = false,
  parentLines = [],
  expandedFolders,
  toggleFolder,
  selectedFile,
  setSelectedFile,
}: {
  item: FileItem;
  depth?: number;
  isLast?: boolean;
  parentLines?: boolean[];
  expandedFolders: Set<string>;
  toggleFolder: (name: string) => void;
  selectedFile: string | null;
  setSelectedFile: (name: string | null) => void;
}) {
  const isExpanded = expandedFolders.has(item.name);
  const isSelected = selectedFile === item.name;
  const hasChildren = item.children && item.children.length > 0;

  // Build tree line prefix
  const getTreePrefix = () => {
    let prefix = "";
    for (let i = 0; i < depth; i++) {
      if (parentLines[i]) {
        prefix += "│ ";
      } else {
        prefix += "  ";
      }
    }
    if (depth > 0) {
      prefix += isLast ? "└─" : "├─";
    }
    return prefix;
  };

  return (
    <div className="relative">
      <div
        className={`group flex cursor-pointer items-center gap-1 rounded-md py-1 pl-1 pr-2 font-mono text-xs transition-all duration-200 ${
          isSelected
            ? "bg-purple-500/20 ring-1 ring-purple-400"
            : "hover:bg-purple-50"
        }`}
        onClick={() => {
          if (hasChildren) {
            toggleFolder(item.name);
          } else {
            setSelectedFile(isSelected ? null : item.name);
          }
        }}
      >
        {/* Tree Lines + Icon + Name */}
        <span className="flex items-center gap-0.5 whitespace-pre text-gray-400">
          {getTreePrefix()}
          <span className={`text-sm ${hasChildren ? "text-purple-500" : ""}`}>
            {hasChildren ? (isExpanded ? "📂" : "📂") : item.icon}
          </span>
        </span>

        {/* File/Folder Name */}
        <span
          className={`flex-1 ${
            hasChildren ? "font-semibold text-gray-800" : "text-gray-600"
          }`}
        >
          {item.name}
          {hasChildren && <span className="text-gray-400">/</span>}
        </span>

        {/* AI Monitoring Badge */}
        {item.monitored && (
          <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-600">
            AI ✓
          </span>
        )}

        {/* Item Count for Folders */}
        {hasChildren && (
          <span className="text-[10px] text-gray-400">
            ({item.children!.length})
          </span>
        )}

        {/* Expand/Collapse Indicator */}
        {hasChildren && (
          <span className="text-[10px] text-gray-400">
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children!.map((child, index) => (
            <FolderItem
              key={child.name}
              item={child}
              depth={depth + 1}
              isLast={index === item.children!.length - 1}
              parentLines={[...parentLines, !isLast]}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ArchitectureSlide() {
  // Start with only root folder expanded
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["my-turborepo"]),
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [scanPosition, setScanPosition] = useState(0);

  // AI Scanner Animation
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <Slide layout="center" title="Architecture">
      <div className="bg-gradient-dark flex h-full w-full flex-col items-center justify-center p-8">
        <SlideHeader
          title="Our"
          highlight="Architecture"
          subtitle="AI-powered monorepo with smart monitoring"
        />

        {/* AI Watcher Header */}
        <div className="relative mt-4 flex w-full max-w-4xl items-center justify-between rounded-2xl border border-purple-500/30 bg-linear-to-r from-purple-500/10 via-cyan-500/10 to-green-500/10 px-6 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="text-4xl">🤖</span>
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Watcher</h3>
              <p className="text-xs text-gray-400">
                Monitoring 20/25 modules in real-time
              </p>
            </div>
          </div>

          {/* Scanning Animation */}
          <div className="flex items-center gap-3">
            <div className="relative h-6 w-40 overflow-hidden rounded-full bg-gray-800">
              <div
                className="absolute h-full w-6 animate-pulse bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-60"
                style={{ left: `${scanPosition}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-cyan-400">
                  Scanning...
                </span>
              </div>
            </div>
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-400">
              ✅ Active
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6 flex w-full max-w-4xl gap-6">
          {/* File Tree */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-100 p-4">
            <div className="mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
              <span className="text-xl">📂</span>
              <h3 className="font-mono text-sm font-bold text-gray-800">
                Project Structure
              </h3>
              <span className="ml-auto text-[10px] text-gray-500">
                Click to expand/collapse
              </span>
            </div>

            {/* Scrollable Tree Container */}
            <div className="max-h-[380px] overflow-y-auto pr-2">
              {/* Root folder */}
              <div
                className={`flex cursor-pointer items-center gap-1 rounded-md py-1.5 px-2 font-mono text-xs font-semibold transition-all duration-200 ${
                  expandedFolders.has("my-turborepo")
                    ? "bg-purple-100 text-gray-800"
                    : "text-gray-700 hover:bg-purple-50"
                }`}
                onClick={() => toggleFolder("my-turborepo")}
              >
                <span className="text-sm text-purple-500">
                  {expandedFolders.has("my-turborepo") ? "📂" : "📁"}
                </span>
                <span>my-turborepo</span>
                <span className="text-gray-400">/</span>
                {fileTree.monitored && (
                  <span className="ml-1 rounded-full bg-green-500/20 px-1.5 py-0.5 text-[9px] font-bold text-green-600">
                    AI ✓
                  </span>
                )}
                <span className="ml-auto text-[10px] text-gray-500">
                  ({fileTree.children?.length} items)
                </span>
                <span className="text-[10px] text-gray-400">
                  {expandedFolders.has("my-turborepo") ? "▼" : "▶"}
                </span>
              </div>

              {/* Children with tree lines */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFolders.has("my-turborepo")
                    ? "max-h-[800px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {fileTree.children?.map((child, index) => (
                  <FolderItem
                    key={child.name}
                    item={child}
                    depth={1}
                    isLast={index === fileTree.children!.length - 1}
                    parentLines={[]}
                    expandedFolders={expandedFolders}
                    toggleFolder={toggleFolder}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="flex w-56 flex-col gap-4">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖥️</span>
                <span className="font-mono text-sm font-bold text-cyan-400">
                  Apps
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white">
                4
              </p>
              <p className="font-mono text-xs text-gray-400">
                Frontend applications
              </p>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <span className="font-mono text-sm font-bold text-purple-400">
                  Packages
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white">
                6
              </p>
              <p className="font-mono text-xs text-gray-400">Shared libraries</p>
            </div>

            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="font-mono text-sm font-bold text-green-400">
                  AI Tools
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white">
                20+
              </p>
              <p className="font-mono text-xs text-gray-400">
                Automated agents
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-mono text-sm font-bold text-amber-400">
                  Build
                </span>
              </div>
              <p className="mt-2 font-mono text-3xl font-extrabold text-white">
                75%
              </p>
              <p className="font-mono text-xs text-gray-400">
                Faster with Turborepo
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center gap-4">
          <div className="rounded-full border border-purple-300 bg-linear-to-r from-purple-100 to-cyan-100 px-6 py-2">
            <span className="font-mono text-sm font-bold text-gray-800">
              One codebase ·{" "}
              <span className="text-purple-600">AI-monitored</span> ·{" "}
              <span className="text-cyan-600">Infinitely scalable</span>
            </span>
          </div>
        </div>
      </div>
    </Slide>
  );
}