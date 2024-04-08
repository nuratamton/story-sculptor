"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/top-bar";
import client from "@/app/lib/axios-service";
import { BeatLoader } from "react-spinners";
import { css, keyframes } from "@emotion/react";
import { IoExitOutline, IoSend } from "react-icons/io5";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  HStack,
  useToast,
  useColorModeValue,
  Center,
  Spinner,
  Icon,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { useColors } from "@/app/lib/colors";

export default function Chat({ params }: { params: { genre: string } }) {
  const router = useRouter();
  const toast = useToast();
  const colors = useColors();
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const topBarRef = useRef<HTMLDivElement>(null);
  const [topBarHeight, setTopBarHeight] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const bottomMessageRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

  const scrollToBottom = () => {
    if (bottomMessageRef.current) {
      bottomMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const formatGenre = (genre: string) => {
    if (!genre) return "";
    return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (!isLoading && topBarRef.current !== null) {
      setTopBarHeight(topBarRef.current.clientHeight);
    }
  }, [isLoading, topBarRef.current]);

  useEffect(() => {
    if (!isLoading && params.genre) {
      setNewMessage(formatGenre(params.genre));
      sendMessage();
    }
  }, [isLoading, params.genre]);

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async () => {
      if (newMessage.toLowerCase() === "quit") {
        router.push("/");
      }
      if (newMessage.trim() === "") {
        toast({
          title: "Empty message",
          description: "Please enter a message before sending",
          status: "error",
          position: "top",
          duration: 5000,
          isClosable: true,
        });
        return { data: { response: "emptymessage" } };
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
      return await client.post("/generate/", { message: newMessage });
      // return { data: { response: "This is a placeholder response." } };
    },
    onSuccess: (response) => {
      if (response?.data.response !== "emptymessage") {
        setMessages((prevMessages) => [
          ...prevMessages,
          response?.data.response,
        ]);
      }
    },
    onError: () => {
      toast({
        title: "Server Error",
        description:
          "An error occurred while sending the message. Please try again later.",
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });

      setMessages((prevMessages) => [...prevMessages, "emptymessage"]);
    },
  });

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
          <Flex
            flexDirection="column"
            height={`calc(100vh - ${topBarHeight}px)`}
          >
            <VStack spacing={4} flex="1" p={4} overflowY="auto">
              {messages.map(
                (message, index) =>
                  message !== "emptymessage" && (
                    <Flex
                      width="full"
                      justifyContent={
                        index % 2 === 0 ? "flex-end" : "flex-start"
                      }
                      key={index}
                    >
                      <Box
                        ref={
                          index === messages.length - 1
                            ? bottomMessageRef
                            : null
                        }
                        bg={
                          index % 2 === 0
                            ? useColorModeValue("blue.200", "blue.500")
                            : useColorModeValue("gray.300", "gray.700")
                        }
                        p={3}
                        rounded="lg"
                        maxWidth={{ base: "80%", md: "60%" }}
                        alignSelf={index % 2 === 0 ? "flex-end" : "flex-start"}
                        css={css`
                          animation: ${fadeIn} 0.5s ease-in-out forwards;
                        `}
                      >
                        <Text textAlign="left">{message}</Text>
                      </Box>
                    </Flex>
                  )
              )}
            </VStack>
            <HStack
              as="form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <HStack spacing={4} flex="1" p={4} overflowY="auto">
                <Input
                  disabled={isPending}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type something here..."
                  size="lg"
                />
                <Button
                  isLoading={isPending}
                  spinner={<BeatLoader size={8} color="white" />}
                  colorScheme="blue"
                  size="lg"
                  type="submit"
                >
                  <Icon as={IoSend} />
                </Button>
                <Button colorScheme="red" size="lg" onClick={onOpen}>
                  <Icon as={IoExitOutline} />
                </Button>
              </HStack>
            </HStack>
          </Flex>

          <>
            <AlertDialog
              isCentered
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Exit Game
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure you want to exit the game?
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => {
                        router.push("/");
                      }}
                      ml={3}
                    >
                      Exit
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        </>
      )}
    </>
  );
}
