import { useEffect, useState } from "react";
import axios from "axios";
import { useProjectContext } from "../contexts/useProject";

const fetchKeys = async (projectId: string) => {
  const res = await axios.get("/api/v1/model-provider-api-keys", {
    params: {
      projectId,
    },
  });
  return res.data;
};
export const useHasOpenAIKey = () => {
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const { projectId } = useProjectContext();

  const loadKeys = async () => {
    setLoading(true);
    const data = await fetchKeys(projectId);

    if (data.length > 0) {
      setHasOpenAIKey(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hasOpenAIKey, setHasOpenAIKey, loading, loadKeys };
};
