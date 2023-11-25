import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  homepage: {},
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width:"100vw",
    height:"100vh",
  },
});

function AboutUs() {
  const classes = useStyles();
  return (
    <div className={classes.main}>
            <Typography fontSize={"3.5em"} fontWeight={"800"}>Coming Soon... </Typography>

    </div>
  );
}
export default AboutUs;
