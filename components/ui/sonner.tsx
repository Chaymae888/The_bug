"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--background-secondary)",
          "--normal-text": "text-textPrimary",
          "--normal-border": "border-borderColor",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }