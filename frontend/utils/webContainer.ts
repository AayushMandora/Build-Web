import { useEffect, useState } from "react";
import { WebContainer } from "@webcontainer/api";

let webContainerInstance: WebContainer | null = null;

const useWebContainer = () => {
  const [webContainer, setWebContainer] = useState<WebContainer | null>(null);

  useEffect(() => {
    async function main() {
      if (!webContainerInstance) {
        webContainerInstance = await WebContainer.boot();
      }
      setWebContainer(webContainerInstance);
    }

    main();
  }, []);

  return webContainer;
};

export default useWebContainer;
