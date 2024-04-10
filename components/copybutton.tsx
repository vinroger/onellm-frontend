import { Copy } from "lucide-react";
import useCopyToClipboard from "@/utils/hooks/useCopyPaste";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type AbsolutePosition =
  | "TOP_LEFT"
  | "TOP_RIGHT"
  | "BOTTOM_LEFT"
  | "BOTTOM_RIGHT"
  | "RIGHT";

const ButtonAbsolutePositionStyles: Record<
  AbsolutePosition,
  React.CSSProperties
> = {
  TOP_LEFT: { position: "absolute", top: 0, left: 0 },
  TOP_RIGHT: { position: "absolute", top: 0, right: 0 },
  BOTTOM_LEFT: { position: "absolute", bottom: 0, left: 0 },
  BOTTOM_RIGHT: { position: "absolute", bottom: 0, right: 0 },
  RIGHT: { position: "absolute", top: -5, right: 0 },
};

const TagAbsolutePositionStyles: Record<AbsolutePosition, React.CSSProperties> =
  {
    TOP_LEFT: { position: "absolute", top: "35px", left: 0 },
    TOP_RIGHT: { position: "absolute", top: "35px", right: 0 },
    BOTTOM_LEFT: { position: "absolute", bottom: "-35px", left: 0 },
    BOTTOM_RIGHT: { position: "absolute", bottom: "-35px", right: 0 },
    RIGHT: { position: "absolute", top: "10px", right: 0 },
  };
export const CopyButton = ({
  textToCopy,
  absolutePosition,
  minHeight,
  minWidth,
  buttonStyle,
  tagStyle,
  className,
  iconClassName,
}: {
  textToCopy: string;
  absolutePosition?:
    | "TOP_LEFT"
    | "TOP_RIGHT"
    | "BOTTOM_LEFT"
    | "BOTTOM_RIGHT"
    | "RIGHT";
  minHeight?: string;
  minWidth?: string;
  buttonStyle?: React.CSSProperties;
  tagStyle?: React.CSSProperties;
  className?: string;
  iconClassName?: string;
}): JSX.Element => {
  const { copy, status } = useCopyToClipboard();

  return (
    <>
      {status === "copied" && (
        <Badge
          className="absolute text-neutral-800 bg-neutral-300"
          style={
            absolutePosition
              ? { ...TagAbsolutePositionStyles[absolutePosition], ...tagStyle }
              : { ...tagStyle }
          }
        >
          Copied!
        </Badge>
      )}
      <button
        className={cn("h-6 w-6", className)}
        type="button"
        onClick={() => {
          copy(textToCopy);
        }}
        aria-label="copy"
        style={
          absolutePosition
            ? {
                ...ButtonAbsolutePositionStyles[absolutePosition],
                minHeight,
                minWidth,
                ...buttonStyle,
              }
            : { ...buttonStyle }
        }
      >
        <Copy className={cn(iconClassName)} />
      </button>
    </>
  );
};
