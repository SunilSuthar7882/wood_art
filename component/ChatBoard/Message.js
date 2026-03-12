"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Skeleton,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})(({ isSelected }) => ({
  backgroundColor: isSelected ? "#34D399" : "#ECFDF5",
  borderRadius: "8px",
  padding: "0px 4px 0px 8px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  display: "flex",
  alignItems: "center",
  width: "100%",
  boxSizing: "border-box",
  "&:hover": {
    backgroundColor: isSelected ? "#10B981" : "#D1FAE5",
  },
  "& .MuiListItemText-primary": {
    fontWeight: 600,
    fontSize: "14px",
    color: isSelected ? "#ffffff" : "#111827",
  },
  "& .MuiListItemText-secondary": {
    fontSize: "14px",
    fontWeight: 400,
    color: isSelected ? "rgba(255, 255, 255, 0.9)" : "#4B5563",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const StyledAvatar = styled(Avatar)(() => ({
  backgroundColor: "#059669",
  color: "#ffffff",
  fontWeight: 600,
  width: 40,
  height: 40,
  fontSize: "16px",
}));

const UnreadBadge = styled(Chip)(() => ({
  backgroundColor: "#ef4444",
  color: "#ffffff",
  height: 18,
  fontSize: "10px",
  fontWeight: 600,
  minWidth: "18px",
  "& .MuiChip-label": {
    padding: "0 4px",
  },
}));

const Message = ({
  conversationData = [],
  handleConversationClick,
  isLoading = false,
}) => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const handleUserClick = (conversationId, userId) => {
    setSelectedConversationId(conversationId);
    handleConversationClick(userId);
  };

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "U";
  };

  const getLastMessage = (conversation) =>
    conversation.conversation_chats?.[
      conversation.conversation_chats.length - 1
    ];

  const getLastMessageTime = (conversation) => {
    const lastMessage = getLastMessage(conversation);
    return dayjs(lastMessage?.created_at || conversation.created_at).format(
      "h:mm A"
    );
  };

  const getLastMessageText = (conversation) => {
    const lastMessage = getLastMessage(conversation);
    return lastMessage
      ? lastMessage.message.replace(/<[^>]*>/g, "") || "No messages yet"
      : "No messages yet";
  };

  const uniqueConversations = conversationData.reduce((acc, current) => {
    const existingIndex = acc.findIndex((c) => c.user?.id === current.user?.id);
    const hasMessages = current.conversation_chats?.length > 0;

    if (existingIndex >= 0) {
      const existing = acc[existingIndex];
      const existingHasMessages = existing.conversation_chats?.length > 0;
      const currentTime = new Date(current.updated_at || current.created_at);
      const existingTime = new Date(existing.updated_at || existing.created_at);

      if (
        (hasMessages && !existingHasMessages) ||
        (hasMessages && existingHasMessages && currentTime > existingTime)
      ) {
        acc[existingIndex] = current;
      }
    } else {
      acc.push(current);
    }

    return acc;
  }, []);

  const renderSkeletons = () => (
    <Box sx={{ p: 2 }}>
      {[...Array(5)].map((_, idx) => (
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={16} />
            <Skeleton variant="text" width="80%" height={14} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ height: "100%", display: "flex", bgcolor: "#F9FAFB" }}>
      <Box
        sx={{
          width: { xs: "100%", sm: "293px" },
          bgcolor: "#F9FAFB",
          borderRight: "1px solid #E5E7EB",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          p: "0 8px",
        }}
      >
        <Box sx={{ p: 1, borderBottom: "1px solid #E5E7EB" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#1F2937", mb: 2, fontSize: "30px" }}
          >
            Messages
          </Typography>
        </Box>

        <Box sx={{ flex: 1, overflow: "hidden", width: "100%" }}>
          {isLoading || uniqueConversations.length === 0 ? (
            renderSkeletons()
          ) : (
            // <List sx={{ p: 0 }}>
            //   {uniqueConversations.map((elem) => {
            //     const isSelected = selectedConversationId === elem.id;
            //     const lastMessageText = getLastMessageText(elem);
            //     const lastMessageTime = getLastMessageTime(elem);

            //     return (
            //       <StyledListItem
            //         key={`conversation-${elem.id}-${elem.user?.id}`}
            //         isSelected={isSelected}
            //         onClick={() => handleUserClick(elem.id, elem.user?.id)}
            //         disableGutters
            //       >
            //         <ListItemAvatar>
            //           <StyledAvatar src={elem.user?.profile_image}>
            //             {getInitials(elem.user?.full_name)}
            //           </StyledAvatar>
            //         </ListItemAvatar>

            //         <ListItemText
            //           primary={
            //             <Box
            //               sx={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //               }}
            //             >
            //               <Typography
            //                 component="span"
            //                 variant="body2"
            //                 sx={{ fontWeight: 500 }}
            //               >
            //                 {elem.user?.full_name || "Unknown User"}
            //               </Typography>
            //               <Typography component="span" variant="caption">
            //                 {lastMessageTime}
            //               </Typography>
            //             </Box>
            //           }
            //           secondary={
            //             <Box
            //               sx={{
            //                 display: "flex",
            //                 justifyContent: "space-between",
            //                 alignItems: "center",
            //               }}
            //             >
            //               <Typography component="span" variant="body2">
            //                 {lastMessageText}
            //               </Typography>
            //               {elem.total_unread_messages > 0 && !isSelected && (
            //                 <UnreadBadge
            //                   label={elem.total_unread_messages}
            //                   size="small"
            //                 />
            //               )}
            //             </Box>
            //           }
            //           primaryTypographyProps={{ component: "div" }}
            //           secondaryTypographyProps={{ component: "div" }}
            //         />
            //       </StyledListItem>
            //     );
            //   })}
            // </List>

        //     <List sx={{ p: 0 }}>
        //       {uniqueConversations.map((elem) => {
        //         const isSelected = selectedConversationId === elem.id;
        //         const lastMessageText = getLastMessageText(elem);
        //         const lastMessageTime = getLastMessageTime(elem);

        //         return (
        //           <StyledListItem
        //             key={`conversation-${elem.id}-${elem.user?.id}`}
        //             isSelected={isSelected}
        //             onClick={() => handleUserClick(elem.id, elem.user?.id)}
        //             disableGutters
        //           >
        //             <ListItemAvatar>
        //               <StyledAvatar src={elem.user?.profile_image}>
        //                 {getInitials(elem.user?.full_name)}
        //               </StyledAvatar>
        //             </ListItemAvatar>

        //             {/* <Box sx={{ flex: 1, overflow: "hidden" }}>
        //   <Box
        //     sx={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //       alignItems: "center",
        //     }}
        //   >
        //     <Typography
        //       component="span"
        //       variant="body2"
        //       sx={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        //     >
        //       {elem.user?.full_name || "Unknown User"}
        //     </Typography>
        //     <Typography component="span" variant="caption" sx={{ ml: 1 }}>
        //       {lastMessageTime}
        //     </Typography>
        //   </Box>

        //   <Box
        //     sx={{
        //       display: "flex",
        //       justifyContent: "space-between",
        //       alignItems: "center",
        //       mt: 0.5,
        //     }}
        //   >
        //     <Typography
        //       component="span"
        //       variant="body2"
        //       sx={{ color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        //     >
        //       {lastMessageText}
        //     </Typography>
        //     {elem.total_unread_messages > 0 && !isSelected && (
        //       <UnreadBadge label={elem.total_unread_messages} size="small" />
        //     )}
        //   </Box>
        // </Box> */}

        //             <Box sx={{ flex: 1, overflow: "hidden" }}>
        //               {/* Top row: name + time */}
        //               <Box
        //                 sx={{
        //                   display: "flex",
        //                   justifyContent: "space-between",
        //                   alignItems: "center",
        //                 }}
        //               >
        //                 <Typography
        //                   component="span"
        //                   variant="body2"
        //                   sx={{
        //                     fontWeight: 500,
        //                     whiteSpace: "nowrap",
        //                     overflow: "hidden",
        //                     textOverflow: "ellipsis",
        //                     flex: 1, // allow shrinking
        //                     minWidth: 0, // important for ellipsis
        //                     mr: 1, // spacing before time
        //                   }}
        //                 >
        //                   {elem.user?.full_name || "Unknown User"}
        //                 </Typography>
        //                 <Typography
        //                   component="span"
        //                   variant="caption"
        //                   sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
        //                 >
        //                   {lastMessageTime}
        //                 </Typography>
        //               </Box>

        //               {/* Bottom row: last message + badge */}
        //               <Box
        //                 sx={{
        //                   display: "flex",
        //                   justifyContent: "space-between",
        //                   alignItems: "center",
        //                   mt: 0.5,
        //                 }}
        //               >
        //                 <Typography
        //                   component="span"
        //                   variant="body2"
        //                   sx={{
        //                     color: "text.secondary",
        //                     whiteSpace: "nowrap",
        //                     overflow: "hidden",
        //                     textOverflow: "ellipsis",
        //                     flex: 1,
        //                     minWidth: 0,
        //                     mr: 1,
        //                   }}
        //                 >
        //                   {lastMessageText}
        //                 </Typography>
        //                 {elem.total_unread_messages > 0 && !isSelected && (
        //                   <UnreadBadge
        //                     label={elem.total_unread_messages}
        //                     size="small"
        //                   />
        //                 )}
        //               </Box>
        //             </Box>
        //           </StyledListItem>
        //         );
        //       })}
        //     </List>







        <List sx={{ p: 0 }}>
  {uniqueConversations.map((elem) => {
    const isSelected = selectedConversationId === elem.id;
    const lastMessageText = getLastMessageText(elem);
    const lastMessageTime = getLastMessageTime(elem);

    return (
      <StyledListItem
        key={`conversation-${elem.id}-${elem.user?.id}`}
        isSelected={isSelected}
        onClick={() => handleUserClick(elem.id, elem.user?.id)}
        disableGutters
        sx={{
          px: 1,              // horizontal padding
          py: 1.5,            // vertical padding
          gap: 0.5,           // space between avatar & text
          alignItems: "flex-start",
        }}
      >
        <ListItemAvatar sx={{ minWidth: 44 }}>
          <StyledAvatar src={elem.user?.profile_image}>
            {getInitials(elem.user?.full_name)}
          </StyledAvatar>
        </ListItemAvatar>

        <Box sx={{ flex: 1, overflow: "hidden" }}>
          {/* Top row: name + time */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5, // space between name/time and message
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
                minWidth: 0,
                mr: 0.5,
              }}
            >
              {elem.user?.full_name || "Unknown User"}
            </Typography>
            <Typography
              component="span"
              variant="caption"
              sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {lastMessageTime}
            </Typography>
          </Box>

          {/* Bottom row: last message + badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: "text.secondary",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flex: 1,
                minWidth: 0,
                mr: 1,
              }}
            >
              {lastMessageText}
            </Typography>
            {elem.total_unread_messages > 0 && !isSelected && (
              <UnreadBadge label={elem.total_unread_messages} size="small" />
            )}
          </Box>
        </Box>
      </StyledListItem>
    );
  })}
</List>

          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
