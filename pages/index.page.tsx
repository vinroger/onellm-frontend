import { twMerge } from "tailwind-merge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <div className="flex flex-col border-neutral-300 border-e-[1px] min-h-full justify-start">
      <div className="text-xl font-bold p-5">Chatterlytics</div>
      <NavigationMenu className="w-full max-w-full p-3 max-h-fit flex-none">
        <div className="flex flex-col list-none w-full">
          <div>
            <NavigationMenuLink
              className={twMerge(
                navigationMenuTriggerStyle(),
                "w-full justify-start items-center"
              )}
            >
              Dashboard
            </NavigationMenuLink>
          </div>
          <NavigationMenuItem className="w-full">
            <NavigationMenuLink
              className={twMerge(
                navigationMenuTriggerStyle(),
                "w-full justify-start items-center"
              )}
            >
              Logs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </NavigationMenu>
    </div>
  );
}

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-row">
      <div className="w-80">
        <Navbar />
      </div>
      <Button variant="default">Click me</Button>
    </div>
  );
}
