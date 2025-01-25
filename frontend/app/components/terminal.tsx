"use client";

import Typewriter from "typewriter-effect";

export function Terminal({ projectName }: { projectName: string }) {
  const commands = [
    `Creating a app...`,
    "Installing dependencies...",
    "Setting up project structure...",
    "Configuring TypeScript...",
    "Adding essential packages...",
    "Setting up development environment...",
    "Project created successfully! 🎉",
  ];

  return (
    <div className="font-mono text-sm text-green-400">
      <h2 className="text-white text-2xl font-bold italic mb-3">Steps</h2>
      <div className="border p-3">
        <Typewriter
          options={{
            strings: commands,
            autoStart: true,
            delay: 40,
            deleteSpeed: 999999999,
          }}
        />
      </div>
    </div>
  );
}
