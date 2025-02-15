"use client";

import { useState, useEffect } from "react";
import Split from "react-split";

import axios from "axios";

import { parseXML, Step, StepType } from "@/utils/steps";
import { FileItem } from "@/utils/types";
import { transformFiles } from "@/utils/helper";
import useWebContainer from "@/utils/webContainer";

import { Terminal } from "./terminal";
import { CodePreview } from "./code-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Preview from "./preview";

export function BuildInterface({ prompt }: { prompt: string }) {
  const webContainer = useWebContainer();

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // init
  const init = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/template`,
      {
        prompt,
      }
    );

    const { prompts, uiPrompts } = response.data;

    setSteps(parseXML(uiPrompts[0]));

    const chatResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/chat`,
      {
        messages: [
          prompts.map((step: string) => {
            return { role: "user", parts: [{ text: step }] };
          }),
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const result = chatResponse.data.result;

    setSteps((prevSteps) => [...prevSteps, ...parseXML(result)]);
  };

  // make fileStructure
  const buildFileStructure = () => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
  };

  const processFiles = async () => {
    const result = transformFiles(files);
    await webContainer?.mount(result);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    buildFileStructure();
  }, [steps]);

  useEffect(() => {
    processFiles();
  }, [files]);

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
            <Preview webContainer={webContainer} />
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-48px)] p-4">
            <CodePreview fileStructure={files} />
          </TabsContent>
        </Tabs>
      </div>
    </Split>
  );
}
