"use client";

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { fonts } from "./fonts";

// 3. extend the theme
export const theme = extendTheme({
  fonts: {
    body: fonts.rubik,
    heading: fonts.rubik,
  },
  initialColorMode: "light",
  useSystemColorMode: false,
});
