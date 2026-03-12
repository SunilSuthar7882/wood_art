"use client";
import React, { useEffect, useState } from "react";
import { Routes } from "@/config/routes";

import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import addIcon from "../../public/images/add-icon.png";
import { useGetStripePlan } from "@/helpers/hooks/stripeflowapi/getstripeplan";
import { Box, IconButton, Modal, Tooltip, Typography } from "@mui/material";
import { CustomButton } from "../ThemeRegistry";
import CommonDialogBox from "@/component/CommonDialogBox";
import ManageplansFormDetails from "./ManageplansFormDetails";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import ArchiveStripeplan from "./ArchiveStripeplan";

export default function MamAdmin() {
  const [getstripeplandata, setgetstripeplandata] = useState(null);
  const { data, isFetching, refetch } = useGetStripePlan();
  const [addDialogBox, setaddDialogBox] = useState(false);
  const [archiveDialogBox, setarchiveDialogBox] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [openModalId, setOpenModalId] = useState(null);
  const [stripePlanDataStore, setstripePlanDataStore] = useState(null);
  const handleaddOpenDialog = () => {
    setModalMode("add");
    setaddDialogBox(true);
  };
  const handleaddCloseDialog = () => {
    setaddDialogBox(false);
    setstripePlanDataStore(null);
  };
  const handleEditOpenModal = (id, data) => {
    setModalMode("edit");
    setOpenModalId(id);
    setstripePlanDataStore(data);
    setaddDialogBox(true);
  };
  const handleArchiveOpenModal = (id) => {
    setOpenModalId(id);
    setarchiveDialogBox(true);
  };
  const handleArchiveCloseModal = () => {
    setarchiveDialogBox(false);
  };
  useEffect(() => {
    if (data) {
      setgetstripeplandata(data.data);
    }
  }, [data]);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      p={2}
      height={"100%"}
      width={"100%"}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <h1 className="text-2xl font-bold mb-0">Manage Plan</h1>
        <CustomButton variant={"contained"} onClick={handleaddOpenDialog}>
          <Image src={addIcon} alt="add-icon" style={{height:"auto", width:"auto"}}/> Add Customer
        </CustomButton>
      </Box>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"center"}
        gap={2}
        flex={1}
        overflow={"auto"}
        bgcolor={"white"}
        borderRadius={"13px"}
        p={"16px 0px"}
      >
        {isFetching ? (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            Loading...
          </Box>
        ) : (
          <>
            {" "}
            {getstripeplandata?.map((data, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderRadius: "16px",
                  padding: 2,
                  cursor: "pointer",
                  height: "auto",
                  width: 500,
                  transition: "all 0.2s ease",
                  bgcolor: "#F7F7F7",
                  "&:hover": {
                    borderColor: "#2A8E9E",
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Typography fontSize={"20px"} fontWeight={550}>
                    {data?.product?.name}
                  </Typography>
                  <Box display={"flex"} gap={1}>
                    <IconButton
                      onClick={() =>
                        handleEditOpenModal(data?.product?.id, data)
                      }
                    >
                      <EditIcon />
                    </IconButton>{" "}
                    {data?.product?.active === true ? (
                      <Tooltip title="Archive plan">
                        <IconButton
                          onClick={() =>
                            handleArchiveOpenModal(data?.product?.id)
                          }
                        >
                          <DoNotDisturbAltIcon sx={{ color: "green" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <IconButton>
                        <DoNotDisturbAltIcon sx={{ color: "red" }} />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Box display={"flex"} gap={1} flexWrap={"wrap"}>
                  {data?.prices.map((item, idx) => (
                    <Box
                      key={idx}
                      width={"auto"}
                      display={"flex"}
                      border={"1px solid black"}
                      borderRadius={"5px"}
                      p={"2px"}
                    >
                      <Typography>
                        {" "}
                        ${item?.unit_amount}/{item?.recurring?.interval}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </>
        )}
      </Box>
      {/* Modal for this item */}

      <CommonDialogBox
        open={addDialogBox}
        handleClose={handleaddCloseDialog}
        title=""
        content={
          <ManageplansFormDetails
            handleaddCloseDialog={handleaddCloseDialog}
            openModalId={openModalId}
            modalMode={modalMode}
            stripePlanDataStore={stripePlanDataStore}
          />
        }
        width="400px"
        // aria-hidden={addDialogBox ? false : true}
      />
      <CommonDialogBox
        open={archiveDialogBox}
        handleClose={handleArchiveCloseModal}
        title=""
        content={
          <ArchiveStripeplan
            openModalId={openModalId}
            handleArchiveCloseModal={handleArchiveCloseModal}
          />
        }
        width="400px"
        // aria-hidden={archiveDialogBox ? false : true}
      />
    </Box>
  );
}
