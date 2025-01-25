import { BuildInterface } from "@/app/components/build-interface";

export default function BuildPage({ params }: { params: { name: string } }) {
  return (
    <main className="h-[100%] bg-background">
      <BuildInterface projectName={decodeURIComponent(params.name)} />
    </main>
  );
}
