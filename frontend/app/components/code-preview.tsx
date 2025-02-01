"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Check,
  Copy,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FileStructure {
  [key: string]: {
    type: "file" | "folder";
    content?: string;
    language?: string;
    children?: FileStructure;
  };
}

const fileStructure: FileStructure = {
  app: {
    type: "folder",
    children: {
      "page.tsx": {
        type: "file",
        language: "tsx",
        content: `export default function Home() {
return (
  <main className="flex min-h-screen flex-col items-center justify-center p-24">
    <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
  </main>
)
}`,
      },
      "layout.tsx": {
        type: "file",
        language: "tsx",
        content: `export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return (
  <html lang="en">
    <body>{children}</body>
  </html>
)
}`,
      },
      "globals.css": {
        type: "file",
        language: "css",
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
      },
    },
  },
  components: {
    type: "folder",
    children: {
      ui: {
        type: "folder",
        children: {
          "button.tsx": {
            type: "file",
            language: "tsx",
            content: `export function Button() {
return <button>Click me</button>
}`,
          },
        },
      },
    },
  },
};

export function CodePreview() {
  const [selectedFile, setSelectedFile] = useState("app/page.tsx");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["app"])
  );
  const [copying, setCopying] = useState(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const copyCode = async (content: string) => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(content);
      alert("Code copied to clipboard!");
    } catch (error) {
      alert("Failed to copy code");
    } finally {
      setCopying(false);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const renderFileTree = (structure: FileStructure, path: string = "") => {
    return Object.entries(structure).map(([name, item]) => {
      const currentPath = path ? `${path}/${name}` : name;

      if (item.type === "folder") {
        const isExpanded = expandedFolders.has(currentPath);
        return (
          <div key={currentPath}>
            <button
              onClick={() => toggleFolder(currentPath)}
              className={cn(
                "flex items-center w-full px-2 py-1 text-sm hover:bg-muted/50 rounded",
                selectedFile === currentPath && "bg-muted"
              )}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 mr-2 text-white" />
              {name}
            </button>
            {isExpanded && item.children && (
              <div className="ml-4">
                {renderFileTree(item.children, currentPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={currentPath}
          onClick={() => setSelectedFile(currentPath)}
          className={cn(
            "flex items-center w-full px-2 py-1 text-sm hover:bg-muted/50 rounded",
            selectedFile === currentPath && "bg-muted"
          )}
        >
          <File className="h-4 w-4 mr-2 text-muted-foreground" />
          {name}
        </button>
      );
    });
  };

  const findFile = (
    structure: FileStructure,
    path: string
  ): { content?: string; language?: string } | undefined => {
    const parts = path.split("/");
    let current = structure;

    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]]?.type === "folder" && current[parts[i]]?.children) {
        current = current[parts[i]].children!;
      } else {
        return undefined;
      }
    }

    const file = current[parts[parts.length - 1]];
    return file
      ? { content: file.content, language: file.language }
      : undefined;
  };

  const selectedFileData = findFile(fileStructure, selectedFile);

  return (
    <div className="h-full border rounded-lg overflow-hidden bg-[#1e1e1e]">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15}>
          <div className="h-full bg-[#252526] p-2">
            <div className="text-sm font-medium mb-2 text-gray-400">
              Explorer
            </div>
            <div className="space-y-1">{renderFileTree(fileStructure)}</div>
          </div>
        </Panel>
        <PanelResizeHandle className="w-1.5 bg-[#2d2d2d] hover:bg-[#404040] transition-colors" />
        <Panel>
          <div className="h-full relative">
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  selectedFileData?.content &&
                  copyCode(selectedFileData.content)
                }
                className="h-8 w-8 hover:bg-white/10"
              >
                {copying ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            <div className="h-full overflow-auto">
              <SyntaxHighlighter
                language={selectedFileData?.language || "typescript"}
                style={atomDark}
                customStyle={{
                  margin: 0,
                  padding: "2rem",
                  background: "#1e1e1e",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
                showLineNumbers
              >
                {selectedFileData?.content || ""}
              </SyntaxHighlighter>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
