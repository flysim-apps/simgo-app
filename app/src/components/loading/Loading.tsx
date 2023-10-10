import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import React from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  p: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const Loading = ({ loading = true }) => (
  <Modal open={loading === true}>
    <Box sx={style}>
      <CircularProgress />
    </Box>
  </Modal>
);
