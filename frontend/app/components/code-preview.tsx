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

import { FileItem } from "@/utils/types";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodePreviewProps {
  fileStructure: FileItem[];
}
export function CodePreview(props: CodePreviewProps) {
  const { fileStructure } = props;

  const [selectedFile, setSelectedFile] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([])
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

  const renderFileTree = (structure: FileItem[], path: string = "") => {
    // Sort folders first, then files
    const sortedStructure = [...structure].sort((a, b) =>
      a.type === "folder" && b.type === "file"
        ? -1
        : a.type === "file" && b.type === "folder"
        ? 1
        : 0
    );

    return sortedStructure.map((item) => {
      const currentPath = path ? `${path}/${item.name}` : item.name;

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
              <span className="truncate max-w-[80%]">{item.name}</span>
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
          <span className="truncate max-w-[80%]">{item.name}</span>
        </button>
      );
    });
  };

  const findFile = (
    structure: FileItem[],
    path: string
  ): { content?: string; language?: string } | undefined => {
    const parts = path.split("/");
    let current: FileItem[] = structure;

    for (let i = 0; i < parts.length; i++) {
      const foundItem = current.find((item) => item.name === parts[i]);

      if (!foundItem) return undefined;

      if (foundItem.type === "folder") {
        if (!foundItem.children) return undefined;
        current = foundItem.children;
      } else if (i === parts.length - 1) {
        return { content: foundItem.content };
      } else {
        return undefined;
      }
    }

    return undefined;
  };

  const cleanContent = (content?: string) => {
    return (
      content && content.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "")
    );
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
                {cleanContent(selectedFileData?.content) || ""}
              </SyntaxHighlighter>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
