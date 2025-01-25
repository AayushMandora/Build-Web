"use client";

import { useState, useEffect } from "react";
import Split from "react-split";
import { Terminal } from "./terminal";
import { CodePreview } from "./code-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BuildInterface({ projectName }: { projectName: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Split
      sizes={[30, 70]}
      minSize={300}
      expandToMin={false}
      gutterSize={8}
      gutterAlign="center"
      snapOffset={30}
      dragInterval={1}
      direction="horizontal"
      className="flex h-[100%]"
    >
      <div className="h-full bg-black p-4">
        <Terminal projectName={projectName} />
      </div>
      <div className="h-full border-l">
        <Tabs defaultValue="preview" className="h-full">
          <div className="pt-1 px-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="preview" className="h-[calc(100%-48px)]">
            <iframe
              src="about:blank"
              className="w-full h-full border-0"
              title="Preview"
            />
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-48px)] p-4">
            <CodePreview />
          </TabsContent>
        </Tabs>
      </div>
    </Split>
  );
}
