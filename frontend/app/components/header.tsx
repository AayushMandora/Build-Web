"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="size-20" />,
      href: "https://github.com/AayushMandora",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://www.linkedin.com/in/aayush-mandora/",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: "https://x.com/AayushMandora",
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b bg-background/80 backdrop-blur-sm"
    >
      <div className="flex h-16 items-center justify-between px-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold italic">Build-Web</span>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center space-x-1"
        >
          {socialLinks.map((link, index) => (
            <Button
              key={link.name}
              variant="ghost"
              size="icon"
              asChild
              className="hover:bg-transparent hover:opacity-75 transition-opacity"
            >
              <motion.a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </motion.a>
            </Button>
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
}
