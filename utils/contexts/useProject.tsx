"use client";

import React, { createContext, useEffect, useMemo } from "react";
import axios from "axios";
import useAsync from "../hooks/useAsync";

type ProjectContextType = {
  data: any;
  description: string;
  id: string;
  name: string;
  owner_id: string;
  projectId: string;
};

const ProjectContext = createContext<ProjectContextType>({
  data: {},
  description: "",
  id: "",
  name: "",
  owner_id: "",
  projectId: "",
});

const ProjectProvider = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: string;
}): JSX.Element => {
  const {
    value: data,
    execute: getProjectInfo,
    status: fetchStatus,
  } = useAsync(() => {
    return axios.get(`/api/v1/projects/${projectId}`).then((response) => {
      return response.data;
    });
  });

  useEffect(() => {
    getProjectInfo();
  }, [getProjectInfo]);

  const value = useMemo(() => {
    return {
      id: projectId,
      projectId,
      data: data?.data,
      description: data?.description,
      name: data?.name,
      owner_id: data?.owner_id,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, projectId, fetchStatus]);

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export function useProjectContext(): ProjectContextType {
  const context = React.useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a Project Provider");
  }

  return context;
}

export default ProjectProvider;
