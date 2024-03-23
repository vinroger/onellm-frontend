import { useState } from "react";

function useChatCompletion() {
  const [response, setResponse] = useState<string>("");
  const [status, setStatus] = useState<"Idle" | "Generating" | "Errored">(
    "Idle"
  );

  const sendMessage = async (
    projectId: string,
    model: string,
    messages: any
  ) => {
    setStatus("Generating");
    const res = await fetch("/api/v1/openai/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        projectId,
      }),
    });

    if (res.body) {
      const reader2 = res.body.getReader();

      const processStream = async (
        reader: ReadableStreamDefaultReader<Uint8Array>
      ) => {
        const { done, value } = await reader.read();

        if (done) {
          setStatus("Idle");
          return;
        }
        const chunk = new TextDecoder("utf-8").decode(value);

        if (value.includes("\u0004\u0003")) {
          console.log(
            "%cutils/hooks/useChatCompletion.tsx:53 value",
            "color: #007acc;",
            value
          );
          return;
        }
        if (chunk.length === 0) {
          setStatus("Idle");
          return;
        }
        setResponse((prev) => prev + chunk);
        // Recursively call processStream to handle the next chunk.
        await processStream(reader);
      };

      processStream(reader2).catch((err) => {
        console.error(err);
        setStatus("Errored");
      });
    } else {
      setStatus("Errored");
    }

    setStatus("Idle");
  };

  return {
    response,
    status,
    sendMessage,
    setResponse,
  };
}

export default useChatCompletion;
