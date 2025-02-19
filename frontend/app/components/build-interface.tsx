"use client";

import { useState, useEffect, useCallback } from "react";
import Split from "react-split";

import axios from "axios";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { Oval } from "react-loader-spinner";

import { parseXML, Step, StepType } from "@/utils/steps";
import { FileItem } from "@/utils/types";
import { transformFiles } from "@/utils/helper";
import useWebContainer from "@/utils/webContainer";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Terminal } from "./terminal";
import { CodePreview } from "./code-preview";
import Preview from "./preview";

export function BuildInterface({ prompt }: { prompt: string }) {
  const webContainer = useWebContainer();

  const [loading, setLoading] = useState(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [flowUpPrompt, setFlowUpPrompt] = useState<string>("");

  const [llmResponse, setLlmResponse] = useState<
    {
      role: "user" | "assistant";
      parts: [{ text: string }];
    }[]
  >([]);

  // init
  const init = useCallback(async () => {
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

    setSteps([...parseXML(result)]);

    setLlmResponse([
      prompts.map((step: string) => {
        return { role: "user", parts: [{ text: step }] };
      }),
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ]);

    setLlmResponse((data) => [
      ...data,
      { role: "assistant", parts: [{ text: result }] },
    ]);
  }, []);

  // make fileStructure
  const buildFileStructure = useCallback(() => {
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
  }, [steps]);

  // mount files to web container
  const processFiles = useCallback(async () => {
    const result = transformFiles(files);
    await webContainer?.mount(result);
  }, [files]);

  const flowUp = async () => {
    setLoading(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/chat`,
      {
        messages: [
          llmResponse,
          {
            role: "user",
            parts: [{ text: flowUpPrompt }],
          },
        ],
      }
    );

    const result = response.data.result;

    setSteps([...parseXML(result)]);

    setLlmResponse((data) => [
      ...data,
      { role: "assistant", parts: [{ text: result }] },
    ]);

    setFlowUpPrompt("");
    setLoading(false);
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
        <Terminal steps={steps} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-4 justify-center items-center mt-3"
        >
          <Textarea
            placeholder="Write your amazing thing..."
            value={flowUpPrompt}
            onChange={(e) => setFlowUpPrompt(e.target.value)}
            rows={4}
            className="resize-none bg-gradient-to-b from-black/10 to-transparent focus-visible:ring-0 "
          />
          <Button
            type="submit"
            size="sm"
            className="h-12 px-4"
            disabled={!flowUpPrompt.trim()}
            onClick={flowUp}
          >
            {loading ? (
              <Oval color="#fff" height={20} width={20} />
            ) : (
              <>
                <ArrowRight className="mr-2 h-4 w-4" />
                Send
              </>
            )}
          </Button>
        </motion.div>
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
            <Preview webContainer={webContainer} files={files} />
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-48px)] p-4">
            <CodePreview fileStructure={files} />
          </TabsContent>
        </Tabs>
      </div>
    </Split>
  );
}
