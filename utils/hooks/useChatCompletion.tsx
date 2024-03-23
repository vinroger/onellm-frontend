import { useState } from "react";
import { set } from "react-hook-form";

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

    if (res.ok && res.body) {
      const reader2 = res.body.getReader();

      const processStream = async (
        reader: ReadableStreamDefaultReader<Uint8Array>
      ) => {
        const { done, value } = await reader.read();

        const chunk = new TextDecoder("utf-8").decode(value);

        /* Check if the response is complete. Hacky stuff here */
        const endResponse = chunk.includes("2wJn!HPnjhQnAS#hWDU3DWf3yZk%oB@x@");
        const data = chunk.replace("2wJn!HPnjhQnAS#hWDU3DWf3yZk%oB@x@", "");

        setResponse((prev) => prev + data);

        if (endResponse) {
          setStatus("Idle");
          return;
        }
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
  };

  return {
    response,
    status,
    sendMessage,
    setResponse,
  };
}

export default useChatCompletion;
