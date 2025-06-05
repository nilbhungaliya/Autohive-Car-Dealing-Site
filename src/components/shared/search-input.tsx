"use client";

import { useQueryState } from "nuqs";
import { type ChangeEvent, useCallback, useRef } from "react";
import debounce from "debounce";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

function debounceFunc<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  opts: { immediate: boolean }
) {
  return debounce(fn, wait, opts);
}

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const SearchInput = (props: SearchInputProps) => {
  const { className, ...rest } = props;

  const [q, setSearch] = useQueryState("q", { shallow: false });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    debounceFunc(
      (value: string) => {
        setSearch(value);
      },
      1000,
      { immediate: true }
    ),
    []
  );

  const onchange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearch(value);
  };

  const clearSearch = () => {
    setSearch(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <form className="relative flex-1 text-foreground">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        defaultValue={q || ""}
        className={cn(className, "pl-8 bg-background text-foreground placeholder:text-muted-foreground")}
        onChange={onchange}
        type="text"
        {...rest}
      />
      {q && (
        <XIcon
          className="absolute right-2.5 top-2.5 h-4 w-4 text-foreground bg-muted p-0.5 rounded-full cursor-pointer"
          onClick={clearSearch}
        />
      )}
    </form>
  );
};
