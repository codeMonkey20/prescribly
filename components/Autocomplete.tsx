import React, { useEffect, useRef, useState } from "react";
import { Input, InputProps } from "./ui/input";
import { Prescription } from "@/types/Prescription";

type Props = InputProps & {
  data: string[];
  setValue: React.Dispatch<React.SetStateAction<Prescription[]>>;
  index: number;
};

export default function Autocomplete({ data, onChange, setValue, index, ...props }: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [content, setContent] = useState<string[]>(data);
  const input = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (contentRef.current !== e.target || input.current !== e.target) {
        setShowDialog(false);
      }
    };
    window.addEventListener("click", handler, false);
    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  useEffect(() => {
    setContent(
      data.filter((e: string) => {
        const regex = new RegExp(`.*${inputValue}.*`, "i");
        return regex.test(e);
      })
    );
  }, [data, inputValue]);

  return (
    <div className="">
      <Input
        ref={input}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowDialog(e.target.value !== "");
          if (onChange) onChange(e);
        }}
        {...props}
      />
      {showDialog && content.length !== 0 ? (
        <div
          ref={contentRef}
          className="absolute z-50 max-h-44 bg-white overflow-y-auto border w-fit p-2 rounded shadow"
        >
          {content.map((e: string, i: number) => (
            <p
              key={`auto-${i}`}
              className="p-1 select-none cursor-pointer hover:bg-muted rounded"
              onClick={() => {
                setValue((old) => {
                  const copy: Prescription[] = JSON.parse(JSON.stringify(old));
                  copy[index].medicationName = e;
                  return copy;
                });
              }}
            >
              {e}
            </p>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
