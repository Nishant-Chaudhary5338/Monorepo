#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const structure = [
  {
    name: "folder",
    type: "folder",
    children: [
      {
        name: "inner-folder",
        type: "folder",
        children: [
          { name: "file1", type: "file" },
          { name: "file2", type: "file" },
        ],
      },
    ],
  },
  {
    name: "folder2",
    type: "folder",
    children: [
      { name: "file1", type: "file" },
      { name: "file2", type: "file" },
    ],
  },
  { name: "outer-file", type: "file" },
];

const OUTPUT_DIR = process.argv[2] || path.join(__dirname, "output");

function create(nodes, basePath) {
  for (const node of nodes) {
    const fullPath = path.join(basePath, node.name);
    if (node.type === "folder") {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`[DIR]  ${fullPath}`);
      if (node.children?.length) {
        create(node.children, fullPath);
      }
    } else {
      fs.writeFileSync(fullPath, "", { flag: "wx" });
      console.log(`[FILE] ${fullPath}`);
    }
  }
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
create(structure, OUTPUT_DIR);
console.log("\nDone. Created in:", OUTPUT_DIR);
