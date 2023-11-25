// import React from "react";
// import dynamic from "next/dynamic";

// const MintItem = dynamic(() => import("../../components/MintNft"), {
//   ssr: false,
// });

// export default function MintNftPage() {
//   return <MintItem />;
// }

import { ethers } from "ethers";
import { useState, useContext } from "react";
import Web3Modal from "web3modal";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import MetaMaskExtensionModel from "../../components/MetaMaskExtensionModel";
import AppContext from "../../AppContext";

import { marketplaceAddress } from "../../config";
import NFTMarketplace from "../../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
const ipfsClient = require("ipfs-http-client");
const projectId = "2QjDGpt8fTC86RyunyZGq9PV9s5";
const projectSecret = "bf2c2c5012140c7b91716b453898cd02";
const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization: auth,
    },
});

const useStyles = makeStyles({
  main: {
    backgroundColor: "#14141F",
    color: "white",
    height: "100vh",
  },
});


export default function MintItem() {
  const classes = useStyles();
  const [fileUrl, setFileUrl] = useState(null);
  const [loader, setloader] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    NftCollection: "",
  });
  const router = useRouter();

  // set up a function to fireoff when we update files in our form - we can add our
  // NFT images - IPFS

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

  async function createMarket() {
    setloader(true);
    const { name, description, price, NftCollection } = formInput;
    if (!name || !description || !price || !fileUrl || !NftCollection) return;
    // upload to IPFS
    const data = JSON.stringify({
      NftCollection,
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      // debugger;
      const url = `https://ipfs.io/ipfs/${added.path}`;
      // run a function that creates sale and passes in the url
      console.log("uploaded to ",url);
      return url;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

  //remove url form function calling
  async function createSale() {
    const url = await createMarket();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInput.price, "ether");
    // we want to create the token
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    let transaction = await contract.mintToken(url, price, {
      value: 0,
    });

    await transaction.wait();

    // // list the item for sale on the marketplace
    // contract = new ethers.Contract(
    //   marketplaceAddress,
    //   NFTMarketplace.abi,
    //   signer
    // );

    // transaction = await contract.makeMarketItem(
    //   marketplaceAddress,
    //   tokenId,
    //   price,
    //   {
    //     value: listingPrice,
    //   }
    // );
    // await transaction.wait();
    setloader(false);
    alert("NFT Minted successfuly 🎉");

  }

  // metamask extension check model
  const [openMetamaskExt, setOpenMetamaskExt] = useState(false);
  const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
  const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

  //Metamask Wallet checking
  const value = useContext(AppContext);
  var { metamaskinstalled } = value.state;

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className={classes.main}>
          <Grid item xs={2}></Grid>
          <Grid item xs={4} sx={{ p: 5, m: 1, textAlign: "center" }}>
            <Autocomplete
              disablePortal
              id='combo-box-demo'
              options={top10NftCollections}
              onInputChange={(e, value) =>
                updateFormInput({
                  ...formInput,
                  NftCollection: value,
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Nft Collections'
                  name=''
                  variant='filled'
                  required
                  fullWidth
                  sx={{ mt: 5, backgroundColor: "white" }}
                />
              )}
            />
            <TextField
              label='Asset Name'
              name=''
              variant='filled'
              required
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
              fullWidth
              sx={{ mt: 5, backgroundColor: "white" }}
            />
            <TextField
              label='Asset Description'
              name=''
              variant='filled'
              required
              onChange={(e) =>
                updateFormInput({ ...formInput, description: e.target.value })
              }
              fullWidth
              sx={{ mt: 5, backgroundColor: "white" }}
            />
            <TextField
              label='Asset Price in Eth'
              name=''
              variant='filled'
              required
              onChange={(e) =>
                updateFormInput({ ...formInput, price: e.target.value })
              }
              fullWidth
              sx={{ mt: 5, backgroundColor: "white" }}
            />
            {metamaskinstalled ? (
              <Stack direction='row' spacing={2} sx={{ mt: 5 }}>
                <Button
                  style={{ width: 500, height: 40 }}
                  variant='contained'
                  color='success'
                  onClick={createSale}
                >
                  Mint NFT
                </Button>
              </Stack>
            ) : (
              <Stack direction='row' spacing={2} sx={{ mt: 5 }}>
                <Button
                  style={{ width: 500, height: 40 }}
                  variant='contained'
                  color='error'
                  onClick={handleOpenMetamaskExt}
                >
                  Buy NFT
                </Button>
              </Stack>
            )}
            {loader ? (
              <Box sx={{ mt: 3, sx: 5 }}>
                <CircularProgress />
                <Typography sx={{ color: "red", mx: -15, mt: 2 }}>
                  Waiting for Your Metamask transaction ...
                </Typography>
              </Box>
            ) : (
              <Box></Box>
            )}
          </Grid>
          <Grid item xs={3} sx={{ mt: 6 }}>
            <TextField
              sx={{ backgroundColor: "white" }}
              type='file'
              name='Asset'
              onChange={onChange}
            />
            {fileUrl && <img width='350px' src={fileUrl} />}
          </Grid>
        </Grid>

      </Box>
      {/* <MetaMaskExtensionModel
        openMetamaskExt={openMetamaskExt}
        handleCloseMetamaskExt={handleCloseMetamaskExt}
      ></MetaMaskExtensionModel> */}
    </div>
  );
}

const top10NftCollections = [
  
  { label: "GreenPark Sports", value: "GPS" },
  { label: "Gods Unchained", value: "GU" },
  { label: "Guild of Guardians", value: "GOG" },
  
];
