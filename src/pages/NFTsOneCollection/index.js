import React from "react";
import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import FilterBar from "../../components/FilterBar";
import BasicModal from "../../components/BuyNftModel";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../../config";
import { NFTMarketplace } from "../../../NFTMarketplace";
import makeStyles from "@mui/styles/makeStyles";

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




function NFTsOneCollection() {
  const classes = useStyles();
  const [nfts, setNFts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [token, settoken] = useState();
  const [dataNft, setdataNft] = useState();

  const [open, setOpen] = useState(false);
  const handleOpen = (i) => {
    setOpen(true);
    setdataNft(nfts[i]);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // what we want to load:
    // **provider, tokenContract, marketContract, data for our marketItems**

    const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/685daa6fa7f94b4b89cdc6d7c5a8639e");
    // "https://kovan.infura.io/v3/b106fe1ebfab4b47b6ea399af4fb6474"
    const tokenContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const marketContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await marketContract.fetchMarketTokens();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);

        settoken(tokenUri);
        // we want get the token metadata - json

        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          NftCollection: meta.data.NftCollection,
        };

        return item;
      })
    );

    setNFts(items);
    setLoadingState("loaded");
  }

  // function to buy nfts for market

  async function buyNFT(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      marketplaceAddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>;
  return (
    <>
      <Grid container spacing={2}>
        {/* <Grid item md={3} xs={12} className={classes.filters} sx={{ mt: 2 }}>
          <FilterBar></FilterBar>
        </Grid> */}
        <Grid item md={12} xs={12} className={classes.main} sx={{ mt: 2 }}>
          <h1>Items for Sale</h1>
          <Grid container spacing={0} sx={{ mb: 2, mt: 2 }}>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Stack spacing={2} sx={{ width: 300 }}>
                <Autocomplete
                  freeSolo
                  id='free-solo-2-demo'
                  disableClearable
                  sx={{ width: 300, mx: 4 }}
                  options={SearchNFTs1.map((option) => option.label)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label='Search For NFTs..'
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                        className: classes.inputColor,
                      }}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                    />
                  )}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} sx={{ mb: 2 }}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={SearchNFTs2}
                sx={{ width: 300, mx: 4 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Listing Currency'
                    InputProps={{
                      ...params.InputProps,
                      className: classes.inputColor,
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} sx={{ mb: 2 }}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={SearchNFTs3}
                sx={{ width: 300, mx: 4 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Sort By'
                    InputProps={{
                      ...params.InputProps,
                      className: classes.inputColor,
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3} sx={{ mb: 2 }}>
              <Autocomplete
                disablePortal
                id='combo-box-demo'
                options={SearchNFTs3}
                sx={{ width: 300, mx: 4 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Network'
                    InputProps={{
                      ...params.InputProps,
                      className: classes.inputColor,
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mx: 0 }}>
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
                      <a onClick={() => handleOpen(i)}>
                        <Card sx={{ maxWidth: 345 }}>
                          <CardActionArea>
                            <CardMedia
                              component='img'
                              height='250'
                              image={nft.image}
                              alt='green iguana'
                            />
                            <CardContent>
                              <Box sx={{ display: "flex" }}>
                                <Typography
                                  sx={{ flexGrow: 1 }}
                                  gutterBottom
                                  variant='h6'
                                  component='div'
                                >
                                  {nft.name}
                                </Typography>
                                <Typography
                                  sx={{ color: "red" }}
                                  gutterBottom
                                  variant='h6'
                                  component='div'
                                >
                                  {nft.price} ETH
                                </Typography>
                              </Box>
                              <Box sx={{ display: "flex" }}>
                                <Typography
                                  sx={{ flexGrow: 1, mt: 2 }}
                                  gutterBottom
                                  component='div'
                                >
                                  {nft.NftCollection}
                                </Typography>
                                <Box
                                  style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <Image
                                    src='https://tuomodesign.store/wp-content/uploads/2020/12/tuomodesign_ethereum_3d_model_animated.gif'
                                    width='40px'
                                    height='40px'
                                    alt='ethereum'
                                  />
                                </Box>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </a>
                    </Grid>
                  );
                })}
              </>
            )}
          </Grid>
        </Grid>
        {dataNft ? (
          <BasicModal
            ModelOpen={open}
            ModelClose={handleClose}
            nftData={dataNft}
          ></BasicModal>
        ) : (
          <Typography>.</Typography>
        )}
      </Grid>
    </>
  );
}

export default NFTsOneCollection;

const SearchNFTs1 = [
  { label: "The Syphon", value: 1 },
  { label: "Dapper Apes", value: 2 },
  { label: "Highstreet IHO", value: 3 },
];
const SearchNFTs2 = [
  { label: "Ethers", value: 1 },
  { label: "Polygon", value: 2 },
  { label: "Mumbai", value: 2 },
];
const SearchNFTs3 = [
  { label: "Alphabets", value: 1 },
  { label: "Price", value: 2 },
  { label: "Ratings", value: 2 },
];
