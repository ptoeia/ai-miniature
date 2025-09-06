"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// TODO: Verify this import path if build issues persist. Changed from 'next-themes/dist/types'.
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}