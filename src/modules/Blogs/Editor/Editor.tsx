import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css";

type TEditorProps = {
  handleEditorChange: (text: string) => void;
  value: string;
};

export default function Editor({ handleEditorChange, value }: TEditorProps) {
  const [content, setContent] = useState<string>(value);
  useEffect(() => {
    setContent(value);
  }, [value]);
  return (
    <div>
      <SunEditor
        setContents={content}
        defaultValue={content}
        onChange={text => {
          handleEditorChange(text);
          setContent(text);
        }}
        setDefaultStyle="height: 400px; font-family: Arial, Helvetica, sans-serif;"
        setOptions={{
          formats: ["p", "div", "blockquote", "pre", "h3", "h4", "h5", "h6"],
          buttonList: [
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "list",
              "fontColor",
              "align",
              "fontSize",
              "formatBlock",
              "table",
              "image",
            ],
          ],
        }}
      />
    </div>
  );
}
