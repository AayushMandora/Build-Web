import { BuildInterface } from "@/app/components/build-interface";

export default async function BuildPage({
  params,
}: {
  params: { name: string };
}) {
  const { name } = await params;
  return (
    <main className="h-[100%] bg-background">
      <BuildInterface prompt={decodeURIComponent(name)} />
    </main>
  );
}
