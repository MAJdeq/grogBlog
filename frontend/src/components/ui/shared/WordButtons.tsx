
import { Button } from "../button";
import { Bold, Underline, Italic, ListOrdered, List } from "lucide-react";

export const BoldButton = () => {
    const toggleBold = () => {
        document.execCommand("bold");
    }
    return (
        <>
            <Button className="mx-1" onClick={toggleBold}> <Bold /> </Button>
        </>

    )
}

export const UnderlineButton = () => {
    const toggleUnderline = () => {
        document.execCommand("underline");
    }
    return (
        <>
            <Button className=" mx-1" onClick={toggleUnderline}> <Underline /> </Button>
        </>

    )
}

export const ItalicButton = () => {
    const toggleItalics = () => {
        document.execCommand("italic");
    }
    return (
        <Button className="mx-1" onClick={toggleItalics}> <Italic /> </Button>
    )
}

export const OrderedListButton = () => {
    const toggleList = () => {
        document.execCommand("insertOrderedList")
    };
    
    return (
        <Button className="mx-1" onClick={toggleList}>
            <ListOrdered />
        </Button>
    );
};

export const UnorderedListButton = () => {
    const toggleList = () => {
        document.execCommand("insertUnorderedList")
    };
    
    return (
        <Button className="mx-1" onClick={toggleList}>
            <List />
        </Button>
    );
};


function applyFontSize(size: number) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
        // No selection, just set typing style
        // Insert a zero-width span with font-size at caret
        const span = document.createElement("span");
        span.style.fontSize = `${size}px`;
        span.appendChild(document.createTextNode("\u200B")); // zero-width space
        range.insertNode(span);

        // Move cursor inside the span
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.setStart(span.firstChild!, 0);
        newRange.collapse(true);
        selection.addRange(newRange);

        return;
    }

    // Selection exists → wrap it in span
    const fragment = range.extractContents();
    const span = document.createElement("span");
    span.style.fontSize = `${size}px`;
    span.appendChild(fragment);
    range.insertNode(span);

    // Restore selection
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
}
export const FontSize = () => {
  return (
    <input
      type="number"
      min={0}
      max={100}
      defaultValue={12}
      className="mx-1"
      onChange={(e) => applyFontSize(Number(e.target.value))}
    />
  );
};

