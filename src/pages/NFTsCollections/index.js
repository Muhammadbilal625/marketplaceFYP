import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  ButtonGroup,
  CardActionArea,
  CardActions,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import NFTsOneCollection from "../NFTsOneCollection/index";
import Web3Modal from "web3modal";

import makeStyles from "@mui/styles/makeStyles";
import { NFTsCollectionData } from "../../NFTsData/NFTsCollectionData";
import Image from "next/image";
import { ethers } from "ethers";
import { marketplaceAddress } from "../../config";
import NFT from "../../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import axios from "axios";
import { parseEther } from "ethers/lib/utils";

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
let componentStyles = {
  minHeight: "100vh",
  height: "fit-content",
  minWidth: "100vw",
  backgroundColor: "#14141F",
  color: "white",
  display: "flex",
  flexDirection: "column",
  // alignItems: "space-between",
  justifyContent: "center",
  padding: "100px",
  paddingTop: "0px",
};

const collections = [
  {
    id: 1,
    name: "GreenPark Sports",
    src: "https://imageio.forbes.com/specials-images/imageserve/628d68c9a21578ec34ea9402/GreenPark-Sports-continues-to-bring-the-fan-inside-the-game-/960x0.jpg?format=jpg&width=960",
  },
  {
    id: 2,
    name: "Gods Unchained",
    src: "https://images.godsunchained.com/misc/gu-cover-photo-1.jpg",
  },
  {
    id: 3,
    name: "Guild of Guardians",
    src: "https://gog-art-assets.s3-ap-southeast-2.amazonaws.com/Content/Thumbnails/Heroes/Lia/Thumbnail_Hero_Lia_Base.png",
  },
  // {
  //   name: "Greature Club",
  //   src: "http://cdn-production.joinhighrise.com/hcc/hcc_collectionimage.png",
  // },
  // {
  //   name: "Nuggets",
  //   src: "https://cdn.niftynuggets.org/assets/icon.png",
  // },
  // {
  //   name: "MistoMan",
  //   src: "https://cryptocollection.s3.ap-northeast-1.amazonaws.com/imx/collection.gif",
  // },
  // {
  //   name: "Baby Ape",
  //   src: "https://bloock.art/icon.jpeg",
  // },
];

function NFTsCollections() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loader, setloader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingsLoaded, setListingsLoaded] = useState(false);

  let selectedCollectionNFTs;

  if (selectedCollection)
    selectedCollectionNFTs = NFTsCollectionData[selectedCollection.id];

  console.log({ selectedCollectionNFTs });

  async function createMarket(nft) {
    setloader(true);
    // upload to IPFS
    const data = JSON.stringify({
      NftCollection: nft.collectionName,
      name: nft.assetName,
      description: nft.description,
      image: nft.img,
    });
    try {
      console.log("adding to ipfs ", data);
      const added = await client.add(data);
      // debugger;
      const url = `https://ipfs.io/ipfs/${added.path}`;
      // run a function that creates sale and passes in the url
      console.log("uploaded to ", url);
      return url;
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  }

  //remove url form function calling
  async function createSale(nft) {
    try {
      const url = await createMarket(nft);
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);

      const signer = provider.getSigner();

      const price = ethers.utils.parseUnits("" + nft.price, "ether");
      // we want to create the token
      let contract = new ethers.Contract(marketplaceAddress, NFT.abi, signer);
      console.log("making call");
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      let transaction = await contract.mintToken(url, price, {
        value: 0,
      });

      await transaction.wait();

      setloader(false);
      setSelectedCollection(null);
    } catch (e) {
      alert("NFT Minting failed due to " + e);
      setloader(false);
      setSelectedCollection(null);
    }
  }

  async function loadListings() {
    // what we want to load:
    // we want to get the msg.sender hook up to the signer to display the owner nftstry

    try {
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
      console.log("fetching tokens");
      const data = await marketContract.fetchMarketTokens();
      /**
     *  uint256 tokenId;
      address payable seller;
      address payable owner;
      uint256 price;
      bool sold;
     */
      console.log("fetched ", { data });
      let items = [];
      await Promise.all(
        data.map(async (element) => {
          try {
            if (parseInt(element.tokenId) > 0) {
              const tokenUri = await marketContract.tokenURI(
                parseInt(element.tokenId)
              );
              // we want get the token metadata - json
              const meta = await axios.get(tokenUri);
              console.log("metadata is ", meta);
              let item = {
                price: parseFloat(parseInt(element.price) / 10 ** 18),
                tokenId: element.tokenId,
                seller: element.seller,
                owner: element.owner,
                sold: element.sold,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
              };
              items.push(item);
            }
          } catch (e) {
            console.log(e);
          }
        })
      );
      console.log("marketplace nfts", items);

      setListings(items);
      setListingsLoaded(true);
    } catch (e) {
      console.log(e);
      setListingsLoaded(true);
    }
  }

  async function BuyNFT(nft) {
    try {
      setloader(true);
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

      setLoaderMessage("Paying " + nft.price + " MATIC " + "to buy the NFT");

      let tx = await marketContract.purchaseToken(nft.tokenId, {
        value: parseEther("" + nft.price),
      });
      await tx.wait();
      alert("Bought NFT Successfully 🎉");
      setLoaderMessage(null);
      await loadListings();
      setloader(false);
    } catch (e) {
      alert("NFT Listing Failed ");
      console.log(e);
      setLoaderMessage(null);
      setloader(null);
    }
  }
  useEffect(() => {
    loadListings();
  }, []);

  return (
    <div style={componentStyles}>
      <Box pt={"5vh"}>
        <Typography fontSize={"3.5em"} fontWeight={"800"}>
          Available Collections{" "}
        </Typography>
      </Box>

      <Grid pt={"5vh"} container spacing={2}>
        {collections.map((e, i) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box
                borderRadius={"20px"}
                onClick={() => setSelectedCollection(e)}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      image={e.src}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {e.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {selectedCollection != null && (
        <Box
          zIndex={"100"}
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
            <Typography fontSize={"3em"}>{selectedCollection.name}</Typography>
            <hr />
            <Grid padding={"20px"} container spacing={4}>
              {/* <NFTsOneCollection /> */}
              {selectedCollectionNFTs &&
                selectedCollectionNFTs.length > 0 &&
                selectedCollectionNFTs.map((item, index) => {
                  return (
                    <Grid
                      key={"selected NFTs#" + index}
                      height={"40vh"}
                      item
                      xs={8}
                      md={6}
                      lg={4}>
                      <Box height={"200px"}>
                        <img
                          style={{
                            width: "400px",
                            height: "200px",
                            borderRadius: "20px",
                          }}
                          src={item.img}
                        />
                        <Typography fontSize={"1.5em"}>
                          {item.assetName}
                        </Typography>
                        <button
                          style={{
                            padding: "10px",
                            borderRadius: "20px",
                            backgroundColor: "#00FFFF ",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                          onClick={() => createSale(item)}>
                          Mint
                        </button>
                      </Box>
                    </Grid>
                  );
                })}
            </Grid>
            <ButtonGroup>
              <Button
                variant="contained"
                color="error"
                onClick={() => setSelectedCollection(null)}>
                Close Modal
              </Button>
            </ButtonGroup>
          </Box>
        </Box>
      )}

      {loader && (
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
                {loaderMessage}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Box pt={"5vh"}>
        <Typography fontSize={"3.5em"} fontWeight={"800"}>
          Current Listings{" "}
        </Typography>

        {listings.length > 0 ? (
          <Grid pt={"5vh"} container spacing={2}>
            {listings.map((e, i) => {
              return (
                <Grid item key={"listing NFT#" + i}>
                  <Box borderRadius={"20px"}>
                    <Card>
                      <CardActionArea>
                        <CardMedia
                          component="img"
                          height="300"
                          image={e.image}
                          alt="green iguana"
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            {e.name}
                          </Typography>
                          <Typography
                            sx={{ color: "red" }}
                            gutterBottom
                            variant="h6"
                            component="div">
                            {e.price} ETH
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            onClick={() => BuyNFT(e)}
                            variant="contained"
                            color="success">
                            Buy NFT
                          </Button>
                        </CardActions>
                      </CardActionArea>
                    </Card>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : listingsLoaded ? (
          <Typography fontSize={"2em"}>
            We do not have any listings at the moment.
          </Typography>
        ) : (
          <Box padding={"20px"} display={"flex"} width={"fit-content"}>
            <CircularProgress />
            <Typography marginLeft={"20px"} fontSize={"20px"}>
              Loading available listings...
            </Typography>
          </Box>
        )}
      </Box>
    </div>
  );
}

export default NFTsCollections;
