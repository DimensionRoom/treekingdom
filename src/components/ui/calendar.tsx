import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  lang?: "th" | "en";
};

function Calendar({ className, classNames, showOutsideDays = true, lang = "en", ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label: "hidden",
        caption_dropdowns: "flex gap-1.5",
        dropdown:
          "h-8 rounded-full border-2 border-border bg-muted px-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors hover:bg-accent/20 cursor-pointer",
        dropdown_month: "",
        dropdown_year: "",
        vhidden: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-background border-2 p-0 rounded-full opacity-80 hover:opacity-100 hover:bg-accent/20 transition-all hover:scale-110",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 sm:w-10 font-semibold text-[0.7rem] uppercase tracking-wide",
        row: "flex w-full mt-1.5",
        cell: "h-9 w-9 sm:h-10 sm:w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/30 [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-9 w-9 sm:h-10 sm:w-10 p-0 font-medium rounded-full transition-all hover:scale-110 hover:bg-accent/30 aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md hover:from-primary hover:to-primary/80 hover:text-primary-foreground focus:from-primary focus:to-primary/80 focus:text-primary-foreground",
        day_today: "bg-accent/30 text-accent-foreground font-bold ring-2 ring-accent/50",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      formatters={{
        formatYearCaption: (date, options) => {
          const year = date.getFullYear();
          return lang === "th" ? String(year + 543) : String(year);
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
