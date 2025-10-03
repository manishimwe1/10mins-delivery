import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ListFilter } from "lucide-react";
import { Button } from "./ui/button";

interface DropDownFilterProps {
  items: string[];
  selectedItem: string;
  onSelect: (item: string) => void;
  label: string;
}

const DropDownFilter: React.FC<DropDownFilterProps> = ({
  items,
  selectedItem,
  onSelect,
  label,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter className="h-4 w-4" />
          {/* {selectedItem === "all" ? label : selectedItem} */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by {label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => onSelect(item)}
            className={selectedItem === item ? "bg-accent text-accent-foreground" : ""}
          >
            {item === "all" ? `All ${label}` : item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownFilter;
