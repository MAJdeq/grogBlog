import { useRef } from "react";
import { useEffect } from "react";
import { BoldButton, UnderlineButton, ItalicButton, FontSize, UnorderedListButton, OrderedListButton } from "./WordButtons";
type WordTextProps = {
  value: string;
  onChange: (value: string) => void;
};

export const WordText = ({ value, onChange }: WordTextProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync value from form to contenteditable
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  return (
    <div className="p-2 border-2 bg-card">
        <div className="flex justify-end p-3">
            <BoldButton />
            <UnderlineButton />
            <ItalicButton />
            <FontSize />
            <UnorderedListButton />
            <OrderedListButton />
        </div>
        <div
            ref={contentRef}
            contentEditable
            onInput={handleInput}
            className="min-h-[200px] border rounded p-2 bg-border"
        />
    </div>
  );
};