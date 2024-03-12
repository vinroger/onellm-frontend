"use client";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BreadcrumbDemo({
  breadcrumbs,
}: {
  breadcrumbs: { link?: string; title: string }[];
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <>
            <BreadcrumbItem key={`${String(index)}-bc`}>
              <BreadcrumbLink
                href={breadcrumb.link ? breadcrumb.link : undefined}
              >
                {breadcrumb.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function TopNavbar({
  breadcrumbs,
}: {
  breadcrumbs?: { link?: string; title: string }[];
}) {
  return (
    <div className="flex flex-row items-center justify-between w-full p-3">
      <div>logo</div>
      {breadcrumbs && <BreadcrumbDemo breadcrumbs={breadcrumbs} />}
      TopNavbar
    </div>
  );
}

export default TopNavbar;
