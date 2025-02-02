import { Check, Loader2 } from "lucide-react";
import { Step } from "@/utils/steps";

interface terminalProps {
  projectName: string;
  steps: Array<Step>;
}

export function Terminal(props: terminalProps) {
  const { projectName, steps } = props;

  return (
    <div className="font-mono text-sm">
      <h2 className="text-white text-xl font-bold italic mb-3">
        {projectName}
      </h2>
      <h2 className="text-white text-base font-bold mb-3">Steps</h2>
      <div className="border border-gray-800 rounded-lg p-4 bg-black/50 h-[60vh] overflow-y-scroll">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 ${
                step.status === "completed" ? "text-gray-600" : "text-green-400"
              }`}
            >
              <div className="w-6 h-6 flex-shrink-0">
                {step.status === "completed" ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : step.status === "in-progress" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
                )}
              </div>
              <span className={step.status === "pending" ? "text-white" : ""}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
