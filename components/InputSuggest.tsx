import React, { useState, useRef } from "react";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {};

export default function InputSuggest({}: Props) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputref = useRef<HTMLInputElement>(null);

  return (
    <div className="w-fit p-2">
      <Popover open={open}>
        <PopoverTrigger>
          <Input
            value={inputValue}
            ref={inputref}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
        </PopoverTrigger>
        <PopoverContent className="p-2 max-h-72 overflow-y-auto">
          <div className="p-2 cursor-pointer rounded hover:bg-muted transition-colors duration-150">test</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
