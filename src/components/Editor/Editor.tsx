import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";

import "suneditor/dist/css/suneditor.min.css";
import { buttonListHaveImage, buttonListNoImage } from "./ButtonList";

type TEditorProps = {
  handleEditorChange: (text: string) => void;
  value: string;
  height?: string;
  hasImage?: boolean;
};

export default function Editor({ handleEditorChange, value, height, hasImage }: TEditorProps) {
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
        setDefaultStyle={`height: ${
          height ? height : "400px"
        }; font-family: Arial, Helvetica, sans-serif;`}
        setOptions={{
          formats: ["p", "div", "blockquote", "pre", "h3", "h4", "h5", "h6"],
          buttonList: hasImage ? buttonListHaveImage : buttonListNoImage,
        }}
      />
    </div>
  );
}
