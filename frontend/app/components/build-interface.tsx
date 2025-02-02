"use client";

import { useState, useEffect } from "react";
import Split from "react-split";

import axios from "axios";

import { Terminal } from "./terminal";
import { CodePreview } from "./code-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseXML, Step, StepType } from "@/utils/steps";

export function BuildInterface({ prompt }: { prompt: string }) {
  const [steps, setSteps] = useState<Array<Step>>([]);

  const init = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/template`,
      {
        prompt,
      }
    );

    const { prompts, uiPrompts } = response.data;

    setSteps(parseXML(uiPrompts[0]));
    console.log("Steps", parseXML(uiPrompts[0]));

    // const stepsResponse = await axios.post(
    //   `${process.env.NEXT_PUBLIC_BASE_URL}/chat`,
    //   {
    //     messages: [
    //       prompts.map((step: string) => {
    //         return { role: "user", parts: [{ text: step }] };
    //       }),
    //       {
    //         role: "user",
    //         parts: [{ text: prompt }],
    //       },
    //     ],
    //   }
    // );
  };

  useEffect(() => {
    init();
  }, []);

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
        <Terminal steps={steps} projectName={prompt} />
      </div>
      <div className="h-full border-l">
        <Tabs defaultValue="code" className="h-full">
          <div className="pt-1 px-4">
            <TabsList>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
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
