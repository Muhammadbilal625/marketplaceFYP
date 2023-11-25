import React from "react";
import dynamic from "next/dynamic";

const AccountDashBoard = dynamic(
  () => import("../../components/AccountDashboard"),
  { ssr: false }
);

export default function AccountDashBoardPage() {
  return <AccountDashBoard />;
}

// import React from "react";
// import { Box } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import CircularProgress from "@mui/material/CircularProgress";
// import { ethers } from "ethers";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import Web3Modal from "web3modal";
// import { nftaddress, marketplaceAddress } from "../../config";
// import NFT from "../../../backend/artifacts/contracts/NFT.sol/NFT.json";
// import HASHMarket from "../../../backend/artifacts/contracts/HASHMarket.sol/HASHMarket.json";
// import MetaMaskExtensionModel from "../../components/MetaMaskExtensionModel";
// import AppContext from "../../AppContext";

// import makeStyles from "@mui/styles/makeStyles";

// const useStyles = makeStyles({
//   filters: { backgroundColor: "#f0f0f0" },
//   main: {
//     backgroundColor: "#14141F",
//     color: "white",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     // justifyContent: "center",
//     height: "100vh",
//   },
//   inputColor: {
//     color: "white",
//     // This matches the specificity of the default styles at https://github.com/mui-org/material-ui/blob/v4.11.3/packages/material-ui-lab/src/Autocomplete/Autocomplete.js#L90
//     '&[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child': {
//       // Default left padding is 6px
//       paddingLeft: 26,
//     },
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: "green",
//     },
//     "&:hover .MuiOutlinedInput-notchedOutline": {
//       borderColor: "red",
//     },
//     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//       borderColor: "purple",
//     },
//   },
// });

// export default function AccountDashBoard() {
//   // array of nfts
//   const classes = useStyles();
//   const [nfts, setNFts] = useState([]);
//   const [sold, setSold] = useState([]);
//   const [loadingState, setLoadingState] = useState("not-loaded");

//   // metamask extension check model
//   const [openMetamaskExt, setOpenMetamaskExt] = useState(false);
//   const handleOpenMetamaskExt = () => setOpenMetamaskExt(true);
//   const handleCloseMetamaskExt = () => setOpenMetamaskExt(false);

//   //Metamask Wallet checking
//   const value = useContext(AppContext);
//   var { metamaskinstalled } = value.state;

//   useEffect(() => {
//     if (!metamaskinstalled) {
//       handleOpenMetamaskExt();
//     } else {
//       loadNFTs();
//     }
//   }, [metamaskinstalled]);

//   async function loadNFTs() {
//     // what we want to load:
//     // we want to get the msg.sender hook up to the signer to display the owner nfts

//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();

//     const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
//     const marketContract = new ethers.Contract(
//       marketplaceAddress,
//       HASHMarket.abi,
//       signer
//     );
//     const data = await marketContract.fetchItemsCreated();

//     const items = await Promise.all(
//       data.map(async (i) => {
//         const tokenUri = await tokenContract.tokenURI(i.tokenId);
//         // we want get the token metadata - json
//         const meta = await axios.get(tokenUri);
//         let price = ethers.utils.formatUnits(i.price.toString(), "ether");
//         let item = {
//           price,
//           tokenId: i.tokenId.toNumber(),
//           seller: i.seller,
//           owner: i.owner,
//           image: meta.data.image,
//           name: meta.data.name,
//           description: meta.data.description,
//         };
//         return item;
//       })
//     );

//     // create a filtered aray of items that have been sold
//     const soldItems = items.filter((i) => i.sold);
//     setSold(soldItems);
//     setNFts(items);
//     setLoadingState("loaded");
//   }

//   if (loadingState === "loaded" && !nfts.length)
//     return (
//       <h1 className="px-20 py-7 text-4x1">You have not minted any NFTs!</h1>
//     );

//   return (
//     <div>
//       <Grid container spacing={2}>
//         <Grid item md={12} xs={12} className={classes.main} sx={{ mt: 2 }}>
//           <h1>MINTED NFTs</h1>
//           <Grid container spacing={2} sx={{ p: 5 }}>
//             {!nfts.length ? (
//               <>
//                 <Grid item sm={12} sx={{ mt: 15 }}>
//                   <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <CircularProgress />
//                   </Box>
//                 </Grid>
//               </>
//             ) : (
//               <>
//                 {nfts.map((nft, i) => {
//                   return (
//                     <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
//                       <Card sx={{ maxWidth: 345 }}>
//                         <CardActionArea>
//                           <CardMedia
//                             component="img"
//                             height="250"
//                             image={nft.image}
//                             alt="green iguana"
//                           />
//                           <CardContent sx={{ backgroundColor: "lightgray" }}>
//                             <Box sx={{ display: "flex" }}>
//                               <Typography
//                                 sx={{ flexGrow: 1 }}
//                                 gutterBottom
//                                 variant="h6"
//                                 component="div"
//                               >
//                                 {nft.name}
//                               </Typography>
//                               <Typography
//                                 sx={{ color: "red" }}
//                                 gutterBottom
//                                 variant="h6"
//                                 component="div"
//                               >
//                                 {nft.price} ETH
//                               </Typography>
//                             </Box>
//                             <Box sx={{ display: "flex" }}>
//                               <Typography
//                                 sx={{ flexGrow: 1 }}
//                                 gutterBottom
//                                 component="div"
//                               >
//                                 {nft.description}
//                               </Typography>
//                             </Box>
//                           </CardContent>
//                         </CardActionArea>
//                       </Card>
//                     </Grid>
//                   );
//                 })}
//               </>
//             )}
//           </Grid>
//         </Grid>
//       </Grid>
//       <MetaMaskExtensionModel
//         openMetamaskExt={openMetamaskExt}
//         handleCloseMetamaskExt={handleCloseMetamaskExt}
//       ></MetaMaskExtensionModel>
//     </div>
//   );
// }
