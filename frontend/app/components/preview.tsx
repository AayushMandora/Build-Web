import React, { useState, useEffect } from "react";
import { WebContainer } from "@webcontainer/api";
import { ThreeDots } from "react-loader-spinner";

interface PreviewProps {
  webContainer: WebContainer | null;
}

const Preview = (props: PreviewProps) => {
  const { webContainer } = props;

  const [url, setUrl] = useState<string>("");

  async function installDependencies() {
    // install dependencies
    const installProcess = await webContainer?.spawn("npm", ["install"]);

    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    // wait for install command to exit
    return installProcess?.exit;
  }

  async function startDevServer() {
    // run `npm run start` to start the express app
    await webContainer?.spawn("npm", ["run", "dev"]);

    // wait for `server-ready` event
    webContainer?.on("server-ready", (port, url) => {
      setUrl(url);
      console.log(url);
    });
  }

  const init = async () => {
    const exitCode = await installDependencies();

    if (exitCode !== 0) {
      throw new Error("Installation failed");
    }

    startDevServer();
  };

  useEffect(() => {
    init();
  }, []);

  return !url ? (
    <div className="w-full h-full border-0 flex flex-col justify-center items-center">
      <h4 className="text-lg font-semibold">Your app is getting ready</h4>
      <ThreeDots height={50} width={80} color="#4fa94d" visible={true} />
    </div>
  ) : (
    <iframe src={url} className="w-full h-full border-0" title="Preview" />
  );
};

export default Preview;
