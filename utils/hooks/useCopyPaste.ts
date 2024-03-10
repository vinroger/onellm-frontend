import { useCallback, useEffect, useState } from "react";

type CopyStatus = "inactive" | "copied" | "failed" | "loading";

// this hook is inspired by the following hooks
// https://www.benmvp.com/blog/copy-to-clipboard-react-custom-hook/
// https://usehooks-ts.com/react-hook/use-copy-to-clipboard

const useCopyToClipboard = (): {
  copy: (text: string) => void;
  status: CopyStatus;
  supported: boolean;
} => {
  const [status, setStatus] = useState<CopyStatus>("inactive");

  const copy = useCallback((text: string) => {
    setStatus("loading");

    navigator?.clipboard?.writeText(text).then(
      () => setStatus("copied"),
      () => setStatus("failed")
    );
  }, []);

  useEffect(() => {
    if (status === "copied") {
      setTimeout(() => {
        setStatus("inactive");
      }, 1000);
    }
  }, [status]);

  return { copy, status, supported: !navigator?.clipboard };
};

export default useCopyToClipboard;
