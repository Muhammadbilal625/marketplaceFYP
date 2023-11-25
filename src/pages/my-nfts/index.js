import React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  CardActions,
  TextField,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { ethers } from "ethers";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { marketplaceAddress } from "../../config";
import { NFTMarketplace as NFT } from "../../../NFTMarketplace";
import AppContext from "../../AppContext";
import makeStyles from "@mui/styles/makeStyles";
import { parseEther } from "ethers/lib/utils";

const useStyles = makeStyles({
  filters: { backgroundColor: "#f0f0f0" },
  main: {
    backgroundColor: "#14141F",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: "center",
    height: "100vh",
  },
  inputColor: {
    color: "white",
    // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
    '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
      // Default left padding is 6px
      paddingLeft: 26,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "green",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "red",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "purple",
    },
  },
});

export default function MyAssets() {
  // array of nfts
  const classes = useStyles();
  const [nfts, setNFts] = useState([]);
  const [loaderMessage, setLoaderMessage] = useState(null);
  const [nftsLoaded, setNFTsLoaded] = useState(false);
  const [listingToken, setListingToken] = useState(null);

  const [openMetamaskExt, setOpenMetamaskExt] = useState(false);
  const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
  const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

  const value = useContext(AppContext);
  var { metamaskinstalled } = value.state;

  useEffect(() => {
    if (!metamaskinstalled) {
      handleOpenMetamaskExt();
    } else {
      loadNFTs();
    }
  }, [metamaskinstalled]);

  async function loadNFTs() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nfts

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    let walletAddress = await signer.getAddress();
    const marketContract = new ethers.Contract(
      marketplaceAddress,
      NFT.abi,
      signer
    );
    const data = await marketContract.fetchMyNFTs();
    console.log("my nfts", data);

    const items = await Promise.all(
      data.map(async (element) => {
        let tokenId = parseInt(element);
        const tokenUri = await marketContract.tokenURI(tokenId);
        // we want get the token metadata - json
        const meta = await axios.get(tokenUri);
        console.log("metadata is ", meta);
        let item = {
          price:null,
          tokenId: tokenId,
          seller: null,
          owner: walletAddress,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    setNFts(items);
    setNFTsLoaded(true);
    console.log();
    setLoaderMessage(null)

  }

  async function createListing() {
    try {
      setLoaderMessage(" Listing your NFT Now!");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      // let walletAddress = await signer.getAddress();
      const marketContract = new ethers.Contract(
        marketplaceAddress,
        NFT.abi,
        signer
      );
      let listingPrice = await marketContract.getListingPrice();
      listingPrice=parseFloat(parseFloat(listingPrice)/10**18)+'';
     console.log(listingPrice);
      
      

      setLoaderMessage("Listing Price is Getting Paid...");

      let tx = await marketContract.makeMarketToken(listingToken.tokenId,parseEther(""+listingToken.price), {
        value:parseEther(listingPrice)
      }
      
      );
      setLoaderMessage("Waiting for confirmation...");

      await tx.wait();
      alert("Created Listing Successfully 🎉");
      await loadNFTs();
      setListingToken(null);

    } catch (e) {
      alert("NFT Listing Failed ");
      console.log(e);
      setLoaderMessage(null);
    }
  }
  if (nftsLoaded && !nfts.length)
    return <h1>You do not own any NFTs currently!</h1>;

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item md={12} xs={12} className={classes.main} sx={{ mt: 2 }}>
          <h1>MY NFT COLLECTION</h1>
          <Grid container spacing={2} sx={{ p: 5 }}>
            {!nfts.length ? (
              <>
                <Grid item sm={12} sx={{ mt: 15 }}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              </>
            ) : (
              <>
                {nfts.map((nft, i) => {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            height="250"
                            image={nft.image}
                            alt="green iguana"
                          />
                          <CardContent sx={{ backgroundColor: "lightgray" }}>
                            <Box sx={{ display: "flex" }}>
                              <Typography
                                sx={{ flexGrow: 1 }}
                                gutterBottom
                                variant="h6"
                                component="div">
                                {nft.name}
                              </Typography>
                              {/* <Typography
                                sx={{ color: "red" }}
                                gutterBottom
                                variant="h6"
                                component="div">
                                {nft.price} MATIC
                              </Typography> */}
                            </Box>
                            <Box sx={{ display: "flex" }}>
                              <Typography
                                sx={{ flexGrow: 1 }}
                                gutterBottom
                                component="div">
                                {nft.description}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <ButtonGroup>
                              <Button
                                onClick={() => {
                                  setListingToken(nft);
                                }}
                                color="success">
                                {" "}
                                Create Listing
                              </Button>
                            </ButtonGroup>
                          </CardActions>
                        </CardActionArea>
                      </Card>
                    </Grid>

                  );
                })}
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      {listingToken != null && (
        <Box
          position={"absolute"}
          top={"0"}
          left={"0"}
          bgcolor={"rgba(0,0,0,0.5)"}
          width={"100vw"}
          minHeight={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}>
          <Box
            bgcolor={"white"}
            color={"black"}
            borderRadius={"10px"}
            width={"90vw"}
            height={"fit-content"}
            minHeight={"80vh"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            padding={"50px"}
            pt={"10vh"}
            pb={"5vh"}>
            <Typography fontSize={"3em"}>List your Token</Typography>
            <TextField
              label={"Token ID"}
              disabled
              value={listingToken.tokenId}
            />
            <TextField
              label={"Listing Price in MATIC"}
              onChange={(e) =>
                setListingToken({ ...listingToken, price: e.target.value })
              }
            />

            <ButtonGroup>
              <Button
                onClick={createListing}
                variant="contained"
                color="success">
                Create Listing
              </Button>
              <Button
                onClick={() => setListingToken(null)}
                style={{ marginLeft: "20px" }}
                variant="contained"
                color="error">
                Close
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      )}

      {loaderMessage != null && (
        <Box
          position={"absolute"}
          top={"0"}
          left={"0"}
          bgcolor={"rgba(0,0,0,0.5)"}
          width={"100vw"}
          minHeight={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}>
          <Box
            bgcolor={"white"}
            color={"black"}
            borderRadius={"10px"}
            width={"50vw"}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}>
            <Box padding={"20px"} display={"flex"} width={"fit-content"}>
              <CircularProgress />
              <Typography marginLeft={"20px"} fontSize={"20px"}>
                { loaderMessage }
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}
