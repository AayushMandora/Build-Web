"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const [projectName, setProjectName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      router.push(`/build/${encodeURIComponent(projectName)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 flex flex-col justify-center items-center h-[100%]"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl h-16 sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-primary/50"
      >
        Build Your Web App
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-muted-foreground"
      >
        Prompt, run, and view your web apps.
      </motion.p>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="flex gap-4 w-[40%] justify-center items-center"
      >
        <Textarea
          placeholder="Write your amazing thing..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          rows={4}
          className="resize-none bg-gradient-to-b from-black/10 to-transparent focus-visible:ring-0 "
        />
        <Button
          type="submit"
          size="lg"
          className="h-12 px-6"
          disabled={!projectName.trim()}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Build
        </Button>
      </motion.form>
    </motion.div>
  );
}
