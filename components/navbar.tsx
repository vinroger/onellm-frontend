/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

"use client";

import { FaHome, FaTable } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useRouter, usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Boxes,
  Database,
  AreaChart,
  MonitorDown,
  FlaskConical,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ellipsisString, toTitleCase } from "@/utils/functions/string";
import Image from "next/image";
import { useProjectContext } from "@/utils/contexts/useProject";
import { useRef } from "react";

function NavItem({
  item,
  onClick,
  itemKey,
}: {
  item: React.ReactNode;
  onClick: () => void;
  itemKey: string;
}) {
  const pathname = usePathname();

  const isActive =
    !!pathname && pathname.split("/")[2] === itemKey.toLowerCase();

  return (
    <NavigationMenuLink
      className={cn(
        navigationMenuTriggerStyle(),
        "w-full justify-start items-center cursor-pointer font-normal"
      )}
      onClick={onClick}
      active={isActive}
    >
      {item}
    </NavigationMenuLink>
  );
}

function NavItemRenderer({
  itemName,
  itemKey,
  icon,
}: {
  itemKey: string;
  itemName: string;
  icon: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive =
    !!pathname && pathname.split("/")[1] === itemKey.toLowerCase();

  const { projectId } = useProjectContext();
  return (
    <NavItem
      item={
        <div
          className={cn(
            "flex flex-row items-center",
            isActive && "font-bold text-[14.5px]"
          )}
        >
          {icon}
          {toTitleCase(itemName)}
        </div>
      }
      onClick={() => {
        router.push(`/${projectId}/${itemName.toLowerCase()}`);
      }}
      itemKey={itemName.toLowerCase()}
    />
  );
}

const navItems = [
  {
    name: "dashboard",
    icon: <FaHome className={"mr-2 w-3.5 "} />,
  },
  {
    name: "logs",
    icon: <FaTable className={"mr-2.5 w-3.5 "} />,
  },
  {
    name: "dataset",
    icon: <Database strokeWidth="2.8px" className={"mr-2 w-3.5 "} />,
  },
  {
    name: "model",
    icon: <Boxes className={"mr-2.5 w-3.5 "} />,
  },
  {
    name: "training",
    icon: <AreaChart strokeWidth="2.8px" className={"mr-2 w-3.5 "} />,
  },

  {
    name: "experiment",
    icon: <FlaskConical className={"mr-2 w-3.5 "} />,
  },
  {
    name: "settings",
    icon: <IoMdSettings className={"mr-2 w-3.5 "} />,
  },
  {
    name: "how-to-install",
    icon: <MonitorDown className={"mr-2 w-3.5 "} />,
  },
];

export function Navbar() {
  const { user } = useUser();
  const { name: projectName } = useProjectContext();
  const userButtonRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col border-neutral-300 border-e-[1px] min-h-full justify-start">
      <a
        className="flex flex-row items-center p-5 ml-2 space-x-3 text-xl font-bold cursor-pointer hover:opacity-50"
        href={"/workspace"}
      >
        <Image
          src="/onellmlogocropped.png"
          alt="onellm logo"
          className="w-6"
          width={50}
          height={50}
        />

        <p>OneLLM</p>
      </a>
      <p className="mt-4 ml-4 text-sm font-semibold text-neutral-500">
        {ellipsisString(projectName, 20).toUpperCase()}
      </p>
      <NavigationMenu className="flex-col items-start justify-between flex-1 w-full max-w-full px-3 mt-3 max-h-fit">
        <div className="flex flex-col w-full list-none">
          {navItems.map((item) => (
            <NavItemRenderer
              key={item.name}
              itemKey={item.name}
              itemName={item.name}
              icon={item.icon}
            />
          ))}
        </div>
        <div className="flex flex-row items-center w-full space-x-2 min-h-[60px]">
          <div ref={userButtonRef}>
            <UserButton />
          </div>
          <div
            className="flex flex-col max-w-full overflow-scroll cursor-pointer hover:opacity-50 "
            onClick={() => {
              (document.querySelector(".cl-userButtonTrigger") as any)?.click();
            }}
          >
            <p className="overflow-scroll text-sm font-semibold text-wrap">
              {user?.fullName}
            </p>
            <p className="text-xs text-neutral-500">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </NavigationMenu>
    </div>
  );
}
