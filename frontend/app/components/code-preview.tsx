
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CodePreview() {
  const files = {
    "app/page.tsx": `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js</h1>
    </main>
  )
}`,
    "app/layout.tsx": `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
  };

  return (
    <div className="h-full">
      <Tabs defaultValue="app/page.tsx" className="h-full">
        <TabsList className="mb-4">
          {Object.keys(files).map((file) => (
            <TabsTrigger key={file} value={file}>
              {file}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(files).map(([file, content]) => (
          <TabsContent key={file} value={file} className="h-[calc(100%-48px)]">
            <pre className="h-full overflow-auto p-4 rounded-lg bg-muted">
              <code>{content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
