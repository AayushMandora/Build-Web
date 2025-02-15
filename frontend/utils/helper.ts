import { FileItem } from "./types";

const cleanContent = (content?: string) => {
  return (
    content && content.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "")
  );
};

export function transformFiles(filesArray: FileItem[]): Record<string, any> {
  const result: Record<string, any> = {};

  function addFileOrFolder(file: FileItem, parent: Record<string, any>) {
    if (file.type === "folder") {
      parent[file.name] = { directory: {} };
      file.children?.forEach((child) =>
        addFileOrFolder(child, parent[file.name].directory)
      );
    } else {
      parent[file.name] = {
        file: {
          contents: cleanContent(file.content) || "",
        },
      };
    }
  }

  filesArray.forEach((file) => addFileOrFolder(file, result));
  return result;
}
