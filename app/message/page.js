"use client";
import Message from "@/component/ChatBoard/Message";
import { useGetChat } from "@/helpers/hooks/getchat/getchat";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import InfiniteScroll from "react-infinite-scroll-component";
import QuillMessageInput from "@/component/ChatBoard/QuillMessageInput";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
let socket;

const Page = () => {
  const token = cookies.get("auth_token");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationData, setConversationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [loadMoreChat, setLoadMoreChat] = useState(1);
  const [storelastpageCount, setstorelastpageCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoadingMoreMessages, setIsLoadingMoreMessages] = useState(false);

  const { data, isFetching } = useGetChat(
    // refetch
    selectedConversationId,
    loadMoreChat
  );

  const chatScrollRef = useRef(null);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("loginId"));
  }, []);

  useEffect(() => {
    let isMounted = true;

    socket = io(SOCKET_URL, {
      extraHeaders: {
        authorization: `${token}`,
        version: 2,
      },
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("conversation", (data) => {
      if (isMounted) {
        setConversationData((prev) => [...prev, ...data.page_data]);
        setstorelastpageCount(data?.page_information?.last_page);
      }
    });

    socket.on("receive-message", (data) => {
      if (isMounted) {
        setMessages((prev) => [...prev, data]);
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }
    });

    fetchConversations();

    return () => {
      isMounted = false;
      socket.off("conversation");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedConversationId && data?.data?.page_data?.length) {
      const chatScrollArea = chatScrollRef.current;
      if (!chatScrollArea) return;

      const previousScrollHeight = chatScrollArea.scrollHeight;
      const previousScrollTop = chatScrollArea.scrollTop;

      setMessages((prevMessages) => {
        // Reverse to get oldest first
        const newMessages = [...data.data.page_data].reverse();
        // Prepend new messages
        return [...newMessages, ...prevMessages];
      });

      // Adjust scrollTop to keep scroll position stable after prepending
      setTimeout(() => {
        if (loadMoreChat > 1 && chatScrollArea && previousScrollHeight) {
          const newScrollHeight = chatScrollArea.scrollHeight;
          const heightDiff = newScrollHeight - previousScrollHeight;
          chatScrollArea.scrollTop = previousScrollTop + heightDiff;
        }
      }, 50);
    }
  }, [data, selectedConversationId]);

  useEffect(() => {
    if (loadMoreChat === 1) return; // no need to load more on initial load

    if (
      data?.data?.page_information &&
      loadMoreChat <= data.data.page_information.last_page
    ) {
      setIsLoadingMoreMessages(true);

      // fetch new page of messages
      socket.emit(
        "get-conversation",
        { page: loadMoreChat, limit },
        (response) => {
          const chatScrollArea = chatScrollRef.current;
          const previousScrollHeight = chatScrollArea?.scrollHeight || 0;
          const previousScrollTop = chatScrollArea?.scrollTop || 0;

          setConversationData((prev) => [...response.page_data, ...prev]); // prepend older messages

          // Maintain scroll position after prepending
          setTimeout(() => {
            if (chatScrollArea && previousScrollHeight) {
              const newScrollHeight = chatScrollArea.scrollHeight;
              const heightDiff = newScrollHeight - previousScrollHeight;
              chatScrollArea.scrollTop = previousScrollTop + heightDiff;
            }
            setIsLoadingMoreMessages(false);
          }, 50);
        }
      );
    }
  }, [loadMoreChat]);

  const fetchConversations = () => {
    const payload = { page: currentPage, limit };
    socket.emit("get-conversation", payload, (response) => {
      if (!response?.page_data) return;
      setConversationData((prev) => [...prev, ...response.page_data]);
    });
  };

  const sendMsg = () => {
    if (!input.trim()) return;

    const msgobj = {
      sender_id: currentUserId,
      receiver_id: selectedConversationId,
      message: input,
    };

    socket.emit("send-message", msgobj, (res) => {});

    setInput("");
  };

  const handleConversationClick = (conversationId) => {
    setSelectedConversationId(conversationId);
    setMessages([]);
    setCurrentPage(1);
    setLoadMoreChat(1);
    setInput("");
    setIsLoadingMoreMessages(false);
  };

  const isLoadingMessages =
    isFetching || (selectedConversationId && messages === undefined);

  return (
    <div className="flex flex-col h-[100%] overflow-hidden">
      <div className="flex h-full m-4 border border-gray-400 rounded-lg overflow-hidden p-4 bg-white">
        <Message
          conversationData={conversationData}
          handleConversationClick={handleConversationClick}
        />
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          p="0 0 0 8px"
          borderRadius="8px"
          sx={{ minHeight: 0 }}
        >
          <Box
            id="chatScrollArea"
            ref={chatScrollRef}
            flex={1}
            overflow="auto"
            display="flex"
            flexDirection="column-reverse"
            sx={{ minHeight: 0, position: "relative" }}
          >
            {/* Loading spinner positioned at actual top */}
            {isLoadingMoreMessages && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                  backgroundColor: "white",
                  zIndex: 10,
                }}
              >
                <CircularProgress size={24} sx={{ color: "#109A4E" }} />
              </Box>
            )}

            {!selectedConversationId ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                Please select a chat to start conversation
              </Box>
            ) : isLoadingMessages && loadMoreChat === 1 ? (
              [...Array(18)].map((_, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent={index % 2 === 0 ? "flex-end" : "flex-start"}
                  px={1}
                  mb="12px"
                >
                  {index % 2 !== 0 && (
                    <Skeleton
                      key={`avatar-left-${index}`}
                      variant="circular"
                      width={14}
                      height={14}
                    />
                  )}
                  <Skeleton
                    key={`main-${index}`}
                    variant="rounded"
                    width="40%"
                    height={20}
                    sx={{ borderRadius: "11px", mx: 1 }}
                  />
                  {index % 2 === 0 && (
                    <Skeleton
                      key={`avatar-right-${index}`}
                      variant="circular"
                      width={14}
                      height={14}
                    />
                  )}
                </Box>
              ))
            ) : messages?.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
                width="100%"
              >
                No messages yet
              </Box>
            ) : (
              <InfiniteScroll
                dataLength={messages.length}
                next={() => {
                  if (!isLoadingMoreMessages) {
                    setLoadMoreChat((prev) => prev + 1);
                  }
                }}
                hasMore={
                  loadMoreChat < data?.data?.page_information?.last_page &&
                  !isLoadingMoreMessages
                }
                inverse={true}
                scrollableTarget="chatScrollArea"
                loader={
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={2}
                    width="100%"
                  >
                    <CircularProgress size={24} />
                  </Box>
                }
              >
                {messages.map((message) => (
                  <Box key={message.id} mb="12px" px={1}>
                    {message.sender_id === Number(currentUserId) ? (
                      <Box
                        display="flex"
                        gap={1}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                      >
                        <Box
                          sx={{
                            bgcolor: "#109A4E",
                            color: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: "60%",
                            borderRadius: "11px",
                            p: "10px 12px",
                            textAlign: "right",
                          }}
                        >
                          <Typography
                            color="#fff"
                            fontSize={14}
                            fontWeight={600}
                          >
                            {message?.user?.full_name}
                          </Typography>
                          <Typography
                            component="div"
                            color="#fff"
                            fontSize={13}
                            fontWeight={400}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.message,
                              }}
                            />
                          </Typography>
                          <Typography
                            display="flex"
                            justifyContent="flex-end"
                            color="#e8e6e6"
                            fontSize={10}
                            fontWeight={300}
                          >
                            {dayjs(message?.created_at).format(
                              "DD-ddd, h:mm A"
                            )}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{ width: 27, height: 27 }}
                          src={message?.user?.profile_image}
                        />
                      </Box>
                    ) : (
                      <Box display="flex" gap={1} alignItems="flex-end">
                        <Avatar
                          sx={{
                            width: 27,
                            height: 27,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            lineHeight: 1,
                            bgcolor: message?.user?.profile_image
                              ? "transparent"
                              : "#ccc",
                            color: "#fff",
                          }}
                          src={message?.user?.profile_image}
                        >
                          {!message?.user?.profile_image &&
                            message?.user?.full_name
                              ?.split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                        </Avatar>

                        <Box
                          sx={{
                            bgcolor: "#F5F5F5",
                            display: "flex",
                            flexDirection: "column",
                            maxWidth: "60%",
                            borderRadius: "11px",
                            p: "10px 12px",
                            textAlign: "left",
                          }}
                        >
                          <Typography
                            color="#2C2C2C"
                            fontSize={14}
                            fontWeight={600}
                          >
                            {message?.user?.full_name}
                          </Typography>
                          <Typography
                            component="div"
                            color="#6F767E"
                            fontSize={13}
                            fontWeight={400}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.message,
                              }}
                            />
                          </Typography>
                          <Typography
                            display="flex"
                            justifyContent="flex-end"
                            color="#6F767E"
                            fontSize={10}
                            fontWeight={400}
                          >
                            {dayjs(message?.created_at).format(
                              "DD-ddd, h:mm A"
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </InfiniteScroll>
            )}
          </Box>

          <Box sx={{ mt: 1 }}>
            <Box
              sx={{
                border: "1px solid #E0E0E0",
                borderRadius: "10px",
                "&:focus-within": {
                  borderColor: "#109A4E",
                  boxShadow: "0 0 0 2px rgba(16, 154, 78, 0.2)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <QuillMessageInput input={input} onChange={setInput} />
            </Box>

            <Button
              variant="contained"
              sx={{
                width: "200px",
                mt: 1,
                backgroundColor: "#109A4E",
                "&:hover": {
                  backgroundColor: "#0e8c46",
                },
              }}
              onClick={sendMsg}
              disabled={
                !input ||
                (input.replace(/<[^>]+>/g, "").trim() === "" &&
                  !/<img\s+[^>]*src=['"][^'"]+['"]/.test(input)) ||
                !selectedConversationId
              }
            >
              Send
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Page;
