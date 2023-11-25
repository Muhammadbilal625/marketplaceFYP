import * as React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import makeStyles from "@mui/styles/makeStyles";
import MetaMaskOnboarding from "@metamask/onboarding";
import AppContext from "../../AppContext";

const useStyles = makeStyles({
  homepage: {},
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: "2%",
    borderRadius: "25px",
  },
});

export default function MetaMaskExtensionModel({
  openMetamaskExt,
  handleCloseMetamaskExt,
}) {
  //   const [openMetamaskExt, setOpenMetamaskExt] = React.useState(false);
  //   const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
  //   const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

  const classes = useStyles();

  const value = useContext(AppContext);
  var { metamaskinstalled } = value.state;

  const onboardings = new MetaMaskOnboarding();

  const onClickInstallMetaMask = () => {
    onboardings.startOnboarding();
  };

  return (
    <div>
      {/* <Button onClick={handleOpenMetamaskExt}>Open modal</Button> */}
      <Modal
        open={openMetamaskExt}
        onClose={handleCloseMetamaskExt}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{ my: 35, mx: 70 }}
      >
        <div className={classes.main}>
          <Box sx={{ my: 4, mx: 4 }}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Please Download MetaMask
            </Typography>
            <Box sx={{ mx: 4, mt: 2 }}>
              <Button
                onClick={onClickInstallMetaMask}
                style={{ backgroundColor: "orange" }}
                variant='contained'
                color='error'
              >
                Install MetaMask
              </Button>
            </Box>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
