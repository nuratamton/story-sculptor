"use client";

import { Flex, Text, useColorMode, Button } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { fonts } from "../lib/fonts";
import { useColors } from "../lib/colors";
import Link from "next/link";

const TopBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colors = useColors();

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg={colors.bgSecondary}
      color={colors.fg}
      boxShadow="md"
    >
      <Link href="/">
        <Text fontSize="2xl" fontFamily={fonts.pacifico}>
          Story Sculptor
        </Text>
      </Link>
      <Flex align="center">
        <Button onClick={toggleColorMode}>
          {colorMode === "dark" ? (
            <SunIcon color="orange.200" />
          ) : (
            <MoonIcon color="gray.800" />
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default TopBar;
