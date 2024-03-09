import { FaHome, FaTable } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { useRouter } from "next/router";
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ICON_SIZE = 19;

function NavItem({
  item,
  onClick,
  itemKey,
}: {
  item: React.ReactNode;
  onClick: () => void;
  itemKey: string;
}) {
  const { pathname } = useRouter();

  return (
    <NavigationMenuLink
      className={cn(
        navigationMenuTriggerStyle(),
        "w-full justify-start items-center cursor-pointer font-normal"
      )}
      onClick={onClick}
      active={pathname.split("/")[1] === itemKey.toLowerCase()}
    >
      {item}
    </NavigationMenuLink>
  );
}

export function Navbar() {
  const router = useRouter();

  return (
    <div className="flex flex-col border-neutral-300 border-e-[1px] min-h-full justify-start">
      <div className="p-5 text-xl font-bold">OneGPT</div>
      <NavigationMenu className="flex-none w-full max-w-full p-3 max-h-fit">
        <div className="flex flex-col w-full list-none">
          <NavItem
            item={
              <div className="flex flex-row items-center">
                <FaHome className={`h-6 mr-1.5 text-[${ICON_SIZE}px]`} />
                Dashboard
              </div>
            }
            onClick={() => {
              router.push("/dashboard");
            }}
            itemKey="dashboard"
          />
          <NavItem
            item={
              <div className="flex flex-row items-center">
                <FaTable className={`h-6 mr-1.5 text-[${ICON_SIZE}px]`} />
                Logs Table
              </div>
            }
            onClick={() => {
              router.push("/logs");
            }}
            itemKey={"logs"}
          />
          <NavItem
            item={
              <div className="flex flex-row items-center">
                <IoMdSettings className={`h-6 mr-1.5 text-[${ICON_SIZE}px]`} />
                Settings
              </div>
            }
            onClick={() => {
              router.push("/settings");
            }}
            itemKey={"settings"}
          />
        </div>
      </NavigationMenu>
    </div>
  );
}
