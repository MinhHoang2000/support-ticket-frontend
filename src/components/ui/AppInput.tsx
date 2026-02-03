"use client";

import { Input, type InputProps, type InputRef } from "antd";
import { TextAreaRef } from "antd/es/input/TextArea";
import { forwardRef } from "react";

const inputBaseClassName =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

const inputClassName = `${inputBaseClassName} h-10`;

const textAreaClassName = `${inputBaseClassName} min-h-9 resize-y`;

export type AppInputProps = InputProps & {
  className?: string;
};

export const AppInput = forwardRef<InputRef, AppInputProps>(
  function AppInput({ className, ...props }, ref) {
    return (
      <Input
        ref={ref}
        className={`${inputClassName} ${className ?? ""}`}
        {...props}
      />
    );
  }
);

export type AppTextAreaProps = React.ComponentProps<typeof Input.TextArea> & {
  className?: string;
};

export const AppTextArea = forwardRef<TextAreaRef, AppTextAreaProps>(
  function AppTextArea({ className, ...props }, ref) {
    return (
      <Input.TextArea
        ref={ref}
        className={`${textAreaClassName} ${className ?? ""}`}
        {...props}
      />
    );
  }
);
