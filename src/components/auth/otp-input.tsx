import { cn } from "@/lib/utils";
import type React from "react";
import { forwardRef, useRef } from "react";

interface PinCodeProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value"
  > {
  setValue: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  type?: "text" | "number";
  length?: number;
  center?: boolean;
  inputClassName?: string;
}

const containerClassNames = {
  base: "flex flex-row",
  center: "justify-center align-center",
};

const inputClassNames = {
  base: "block peer text-center bg-transparent mr-2 focus:placeholder:opacity-0 focus:outline-hidden transition duration-200 disabled:bg-muted disabled:placeholder:text-muted-foreground disabled:text-muted-foreground disabled:cursor-not-allowed disabled:border-border rounded focus:outline-hidden focus:border-primary",
  size: "p-2 text-2xl font-medium w-12 h-12 sm:h-[70px] sm: w-[70px]",
  color: {
    base: "bg-transparent focus:ring-[0.6px] border border-border focus-visible:border-secondary focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-secondary placeholder:text-foreground",
    active: "not-read-only:hover:enabled:border-secondary focus:ring-secondary",
  },
};

export const OneTimePasswordInput = forwardRef<HTMLInputElement, PinCodeProps>(
  (props, ref) => {
    const {
      type,
      length = 6,
      center = true,
      defaultValue,
      inputClassName,
      setValue,
      className,
      ...rest
    } = props;
    const inputRefs = useRef<HTMLInputElement[]>([]);

    function addInputRefs(index: number) {
      return (element: HTMLInputElement) => {
        if (element) {
          inputRefs.current[index] = element;
        }
      };
    }

    function setPinValue() {
      setValue(inputRefs.current.map((input) => input.value).join(""));
    }

    function handleChange(
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) {
      const inputValues = event.target.value.split("");
      inputRefs.current[index].value = inputValues[inputValues.length - 1];
      if (index < length - 1) inputRefs.current[index + 1].focus();
      setPinValue();
    }

    function handlePaste(
      event: React.ClipboardEvent<HTMLInputElement>,
      index: number
    ) {
      const copiedValues = event.clipboardData.getData("text").trim().split("");
      const isComplete = copiedValues.length >= length;

      for (let i = 0; i < length - index; i++) {
        inputRefs.current[index + i].value = copiedValues[i] ?? "";
        if (index + i === length - 1) {
          inputRefs.current[index + i].focus();
        } else {
          inputRefs.current[index + i + 1].focus();
        }
      }
      event.preventDefault();
      setPinValue();

      if (isComplete) {
        const form = event.currentTarget.closest("form");
        form?.requestSubmit();
      }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>, index: number) {
      const isBackspace = event.key === 'Backspace';
      const isArrowLeft = event.key === 'ArrowLeft';
      const isArrowRight = event.key === 'ArrowRight';
      const currentInput = inputRefs.current[index];
    
      if (!currentInput) return;
    
      if (isArrowRight && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
        return;
      }
    
      if (isArrowLeft && index > 0) {
        inputRefs.current[index - 1]?.focus();
        return;
      }
    
      if (isBackspace) {
        event.preventDefault(); // prevents default navigation behavior on backspace
    
        if (currentInput.value !== "") {
          currentInput.value = "";
        } else if (index > 0) {
          const prevInput = inputRefs.current[index - 1];
          prevInput.value = "";
          prevInput.focus();
        }
    
        setPinValue();
      }
    }
    

    return (
      <div className="flex flex-col" ref={ref}>
        <div
          className={cn(
            className,
            center && containerClassNames.center,
            containerClassNames.base
          )}
        >
          {Array.from({ length }, (_, i) => i).map((i) => {
            return (
              <input
                key={`otp-input-${i}`}
                ref={addInputRefs(i)}
                type={type}
                inputMode={type === "text" ? type : "numeric"}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                onChange={(event) => handleChange(event, i)}
                onPaste={(event) => handlePaste(event, i)}
                onKeyDown={(event) => handleKeyDown(event, i)}
                className={cn(
                  inputClassNames.base,
                  inputClassNames.size,
                  inputClassNames.color.active,
                  inputClassNames.color.base,
                  inputClassName,
                  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
              />
            );
          })}
        </div>
      </div>
    );
  }
);
