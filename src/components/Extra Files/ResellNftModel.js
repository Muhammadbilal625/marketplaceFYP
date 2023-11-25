// import React, { useState, useEffect, useContext } from "react";
// import Button from "@mui/material/Button";
// import Input from "@mui/material/Input";
// import TextField from "@mui/material/TextField";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useRouter } from "next/router";
// import Modal from "@mui/material/Modal";
// import Image from "next/image";
// import makeStyles from "@mui/styles/makeStyles";
// import { ethers } from "ethers";
// import axios from "axios";
// import { marketplaceAddress } from "../../config";
// import NFTMarketplace from "../../../backend/artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
// import Web3Modal from "web3modal";

// const useStyles = makeStyles({
//   homepage: {},
//   main: {
//     backgroundColor: "#14141F",
//     color: "white",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingLeft: "2%",
//     borderRadius: "25px",
//   },
// });

// export default function BasicModalReSell({ ModelOpen, nftData, ModelClose }) {
//   const [open, setOpen] = useState(ModelOpen);
//   const [loader, setloader] = useState(false);
//   const classes = useStyles();

//   const [formInput, updateFormInput] = useState({ price: "", image: "" });
//   const router = useRouter();
//   const { id, tokenURI } = router.query;
//   const { image, price } = formInput;

//   // async function fetchNFT() {
//   //   if (!tokenURI) return;
//   //   const meta = await axios.get(tokenURI);
//   //   updateFormInput((state) => ({ ...state, image: meta.data.image }));
//   // }
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     ModelClose();
//   };

//   useEffect(() => {
//     if (ModelOpen) {
//       setOpen(true);
//     }
//   }, [ModelOpen]);

//   async function listNFTForSale() {
//     if (!price) return;
//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();

//     const priceFormatted = ethers.utils.parseUnits(formInput.price, "ether");
//     let contract = new ethers.Contract(
//       marketplaceAddress,
//       NFTMarketplace.abi,
//       signer
//     );
//     let listingPrice = await contract.getListingPrice();

//     listingPrice = listingPrice.toString();
//     let transaction = await contract.resellToken(id, priceFormatted, {
//       value: listingPrice,
//     });
//     await transaction.wait();

//     if (!tokenURI) return;
//     const meta = await axios.get(tokenURI);
//     updateFormInput((state) => ({ ...state, image: meta.data.image }));

//     router.push("./NFTsCollections");
//   }

//   return (
//     <div>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby='modal-modal-title'
//         aria-describedby='modal-modal-description'
//         sx={{ my: 5, mx: 30 }}
//       >
//         <div>
//           <div>
//             {/* <TextField label='Outlined secondary' color='secondary' focused /> */}
//             <TextField
//               label='Outlined secondary'
//               variant='filled'
//               color='success'
//               focused
//               onChange={(e) =>
//                 updateFormInput({ ...formInput, price: e.target.value })
//               }
//             />
//             {image && <img width='350' src={image} alt='pic' />}
//             <Button variant='contained' onClick={listNFTForSale}>
//               List NFT
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
