"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";

export function Terminal({ projectName }: { projectName: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const commands = [
    "Creating a app...",
    "Installing dependencies...",
    "Setting up project structure...",
    "Configuring TypeScript...",
    "Adding essential packages...",
    "Setting up development environment...",
    "Project created successfully! 🎉",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < commands.length - 1) {
          setCompleted((prevCompleted) => [...prevCompleted, true]);
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-sm">
      <h2 className="text-white text-xl font-bold italic mb-3">
        {projectName}
      </h2>
      <h2 className="text-white text-base font-bold mb-3">Steps</h2>
      <div className="border border-gray-800 rounded-lg p-4 bg-black/50">
        <div className="space-y-3">
          {commands.map((command, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 ${
                index > currentStep ? "text-gray-600" : "text-green-400"
              }`}
            >
              <div className="w-6 h-6 flex-shrink-0">
                {index < currentStep ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : index === currentStep ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                )}
              </div>
              <span className={index <= currentStep ? "text-white" : ""}>
                {command}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
