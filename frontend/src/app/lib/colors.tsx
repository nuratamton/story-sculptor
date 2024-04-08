// src/app/lib/useColors.ts
import { useColorModeValue } from "@chakra-ui/react";

export function useColors() {
  const bgSecondary = useColorModeValue("gray.300", "blackAlpha.400");
  const fg = useColorModeValue("blackAlpha.700", "gray.100");

  return { bgSecondary, fg };
}
