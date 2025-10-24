import MDEditor from "@uiw/react-md-editor";

export function MarkdownEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (value: string) => void;
}) {
  const handleChange = (newValue: string | undefined) => {
    setContent(newValue || "");
  };
  return (
    <div data-color-mode="light">
      <MDEditor
        value={content}
        onChange={handleChange}
        height={400} // optional: adjust editor height
      />
    </div>
  );
}

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div style={{ marginTop: "20px" }} data-color-mode="light">
      <MDEditor.Markdown source={content} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
