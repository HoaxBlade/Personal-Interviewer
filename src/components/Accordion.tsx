import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Lock, Check, Flag } from "lucide-react";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

// Add required value prop for AccordionItem
interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  value: string;
}

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => (
    <AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
  )
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  iconState?: "locked" | "unlocked" | "completed";
  moduleNumber?: string;
  moduleDescription?: string;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  (
    {
      className,
      children,
      iconState,
      moduleNumber,
      moduleDescription,
      ...props
    },
    ref
  ) => {
    // Determine the icon and color based on the iconState prop
    let Icon;
    let iconBgClass = "bg-gray-100";
    let iconBorderClass = "border-gray-300";
    let iconColorClass = "text-gray-400";
    let triggerTextClass = "text-gray-900";
    let triggerBgClass = "bg-white";
    let triggerHoverClass = "hover:bg-gray-50";
    let triggerCursor = "cursor-pointer";
    let triggerOpacity = "";

    switch (iconState) {
      case "locked":
        Icon = Lock;
        iconColorClass = "text-gray-400";
        triggerCursor = "cursor-not-allowed";
        triggerOpacity = "opacity-50";
        break;
      case "unlocked":
        Icon = Flag;
        iconColorClass = "text-blue-500";
        break;
      case "completed":
        Icon = Check;
        iconBgClass = "bg-green-100";
        iconBorderClass = "border-green-500";
        iconColorClass = "text-green-600";
        break;
      default:
        Icon = null;
    }

    // Prevent opening if the iconState is "locked"
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (iconState === "locked") {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    return (
      <AccordionPrimitive.Header className="flex pt-4">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            `flex flex-1 items-center justify-between p-4 font-medium transition-all rounded-lg border border-gray-200 ${triggerBgClass} ${triggerHoverClass} ${triggerCursor} ${triggerOpacity}`,
            className
          )}
          onClick={handleClick}
          {...props}
        >
          <div className="flex items-center">
            <div
              className={cn(
                `border-2 rounded-full mr-2 flex justify-center items-center h-10 w-10 aspect-square ${iconBgClass} ${iconBorderClass}`
              )}
            >
              {Icon && <Icon className={`h-6 w-6 ${iconColorClass}`} />}
            </div>
            <div className="flex flex-col items-start ml-2">
              <div className="text-xs text-gray-500">{moduleNumber}</div>
              <div className={`text-base font-bold ${triggerTextClass}`}>
                {moduleDescription}
              </div>
            </div>
          </div>
          <ChevronDown className="h-6 w-6 shrink-0 transition-transform ease-in-out duration-300 text-gray-400" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  }
);

const AccordionContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden bg-white border border-gray-200 rounded-b-lg text-sm transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 pt-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }; 