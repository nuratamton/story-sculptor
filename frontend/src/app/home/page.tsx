"use client";

import TopBar from "../components/top-bar";
import {
  Center,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { fonts } from "@/app/lib/fonts";
import { useColors } from "@/app/lib/colors";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GlowButton from "../components/glow-button";

export default function Home() {
  const router = useRouter();
  const colors = useColors();
  const [isLoading, setIsLoading] = useState(true);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!isLoading && topBarRef.current) {
      setTopBarHeight(topBarRef.current.clientHeight);
    }
  }, [isLoading, topBarRef.current]);

  useEffect(() => {
    if (!isLoading) {
      const widths = buttonsRef.current.map(
        (button) => button?.offsetWidth ?? 0
      );
      const maxWidth = Math.max(...widths);
      setMaxWidth(maxWidth);
    }
  }, [isLoading]);

  // Chat mutation
  const goToChat = async ({ genre }: { genre: string }) => {
    router.push(`/chat/${genre}`);
  };

  return (
    <>
      {isLoading ? (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          <div ref={topBarRef}>
            <TopBar />
          </div>
          <Center
            color={colors.fg}
            height={`calc(100vh - ${2 * topBarHeight}px)`}
          >
            <VStack spacing="24px">
              <style jsx global>{`
                @import url("https://fonts.googleapis.com/css?family=Cairo");

                .title-text {
                  background-image: url(https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHFkZmU0b3prOTJlMmoycm1qZTFrbHRpNWd4N3p6dmZqcjlyeGYwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dwaeIbBnF6HBu/giphy.gif);
                  background-size: cover;
                  color: transparent;
                  -moz-background-clip: text;
                  -webkit-background-clip: text;
                  line-height: 2;
                  text-align: center;
                }
              `}</style>
              ;
              <Text
                fontSize="5xl"
                fontFamily={fonts.pacifico}
                className="title-text"
              >
                Story Sculptor
              </Text>
              <Text fontSize="xl">Select your poison</Text>
              <Wrap spacing="24px" justify="center">
                {["Adventure", "Mystery", "Horror", "Sci-fi"].map(
                  (genre, index) => (
                    <WrapItem key={genre}>
                      <GlowButton
                        ref={(el: HTMLButtonElement) => {
                          buttonsRef.current[index] = el;
                        }}
                        size="lg"
                        width={maxWidth ? `${maxWidth}px` : "auto"}
                        fontWeight="normal"
                        onClick={() => goToChat({ genre: genre.toLowerCase() })}
                      >
                        {genre}
                      </GlowButton>
                    </WrapItem>
                  )
                )}
              </Wrap>
            </VStack>
          </Center>
        </>
      )}
    </>
  );
}
