import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProjectContext } from "@/utils/contexts/useProject";
import axios from "axios";
import React from "react";
import { toast } from "sonner";

function GeneralSettings() {
  const { projectId, name, description } = useProjectContext();

  const [newDescription, setNewDescription] = React.useState(description);
  const [newName, setNewName] = React.useState(name);

  const [loading, setLoading] = React.useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const res = await axios.put(`/api/v1/projects/${projectId}`, {
      name: newName,
      description: newDescription,
    });

    if (res.status === 200) {
      toast.success("Project updated successfully");
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="p-0 m-0 text-lg font-bold">General</h1>
      <p className="p-0 m-0 mb-4 text-sm text-neutral-600">
        Modify your project details and settings.
      </p>

      <div className="flex flex-col justify-start w-3/4 space-y-2">
        <div className="flex flex-row justify-between">
          <p>Name</p>
          <Input
            value={newName}
            defaultValue={name}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            className="w-2/3"
          />
        </div>
        <div className="flex flex-row justify-between">
          <p>Description</p>
          <Input
            value={newDescription}
            onChange={(e) => {
              setNewDescription(e.target.value);
            }}
            defaultValue={description}
            // placeholder="Description"
            className="w-2/3"
          />
        </div>
        <Button
          onClick={() => handleUpdate()}
          className="w-1/4"
          disabled={loading}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export default GeneralSettings;
