"use client";

import React, { useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { useProjectContext } from "@/utils/contexts/useProject";

export type Breadcrumb = {
  link?: string;
  title: string;
  type: "link" | "editable" | string;
  onEdit?: (value: string) => void;
};

const useDebouncedEffect = (effect: () => void, delay: number, deps: any[]) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, effect, delay]);
};

export function BreadcrumbDemo({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  const [editableValues, setEditableValues] = useState<string[]>(
    breadcrumbs.map((breadcrumb) => breadcrumb.title)
  );

  useEffect(() => {
    setEditableValues(breadcrumbs.map((breadcrumb) => breadcrumb.title));
  }, [breadcrumbs]);

  breadcrumbs.forEach((breadcrumb, index) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDebouncedEffect(
      () => {
        if (editableValues[index] === "") return;
        breadcrumb.onEdit && breadcrumb.onEdit(editableValues[index]);
      },
      500,
      [editableValues[index]]
    );
  });

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...editableValues];
    newValues[index] = event.target.value;
    setEditableValues(newValues);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div
            key={`${String(index)}-bc`}
            className="flex flex-row items-center space-x-2"
          >
            <BreadcrumbItem>
              {breadcrumb.type === "editable" ? (
                <input
                  type="text"
                  value={editableValues[index]}
                  onChange={(event) => handleChange(index, event)}
                  style={{ maxWidth: "500px" }}
                  size={editableValues[index].length || 1}
                />
              ) : (
                <BreadcrumbLink
                  href={breadcrumb.link ? breadcrumb.link : undefined}
                >
                  {breadcrumb.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function TopNavbar({ breadcrumbs }: { breadcrumbs?: Breadcrumb[] }) {
  const { projectId } = useProjectContext();

  return (
    <div className="flex flex-row items-center justify-between w-full p-3 border-neutral-300 border-b-[1px]">
      <a
        className="pl-2 cursor-pointer hover:opacity-50"
        href={`/${projectId}/dashboard`}
      >
        <Image
          src="/onellmlogocropped.png"
          alt="onellm logo"
          className="w-6"
          width={50}
          height={50}
        />
      </a>
      {breadcrumbs && <BreadcrumbDemo breadcrumbs={breadcrumbs} />}
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default TopNavbar;
