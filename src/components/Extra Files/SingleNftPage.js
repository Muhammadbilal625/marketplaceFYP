/* eslint-disable react/jsx-key */
// import React, { useState } from "react";
// import { Box } from "@mui/material";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Typography from "@mui/material/Typography";
// import { CardActionArea } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// // import  useStyles from "./styles.js";
// import { useRouter } from "next/router";
// import { ethers } from "ethers";
// import Link from "next/link";

// import Web3Modal from "web3modal";
// import { nftaddress, marketplaceAddress } from "../../config";
// import HASHMarket from "../../../backend/artifacts/contracts/HASHMarket.sol/HASHMarket.json";

// import makeStyles from "@mui/styles/makeStyles";

// const useStyles = makeStyles({
//   homepage: {},
//   main: {
//     backgroundColor: "#14141F",
//     color: "white",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingLeft: "13%",
//     paddingRight: "13%",
//   },
// });

// const numbers = [1, 2, 3, 4, 5, 6];

// function SingleNFT() {
//   const classes = useStyles();
//   const router = useRouter();
//   const nftData = JSON.parse(router.query.nft);
//   const [nftSold, setnftSold] = useState(false);
//   const [nftStatus, setnftStatus] = useState("BUY NFT");

//   // function to buy nfts for market

//   async function buyNFT(nft) {
//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(
//       marketplaceAddress,
//       HASHMarket.abi,
//       signer
//     );

//     const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
//     const transaction = await contract.createMarketSale(
//       nftaddress,
//       nft.tokenId,
//       {
//         value: price,
//       }
//     );

//     await transaction.wait();
//     setnftSold(true);
//     setnftStatus("Sold (Go back to Collection)");
//     // router.push("./NFTsOneCollection");
//     // loadNFTs();
//   }

//   return (
//     <div className={classes.main}>
//       <Typography variant='h4'>Purchase Your NFT</Typography>
//       <Grid container spacing={2} sx={{ mt: 3 }}>
//         <Grid item xs={12} sm={12} md={6}>
//           <Card sx={{ maxWidth: 500 }}>
//             <CardActionArea>
//               <CardContent sx={{ backgroundColor: "#191E3B", color: "white" }}>
//                 <Typography gutterBottom variant='h6' component='div'>
//                   (Collection Logo)
//                 </Typography>
//               </CardContent>
//               <CardMedia
//                 component='img'
//                 height='410'
//                 image={nftData.image}
//                 alt='green iguana'
//                 sx={{ backgroundColor: "#0E1118" }}
//               />
//             </CardActionArea>
//           </Card>
//         </Grid>
//         <Grid item xs={12} sm={12} md={5}>
//           <Box sx={{ display: "flex" }}>
//             <Typography
//               sx={{ flexGrow: 1 }}
//               gutterBottom
//               variant='h6'
//               component='div'
//             >
//               #1234567
//             </Typography>
//             <Typography
//               sx={{ color: "red" }}
//               gutterBottom
//               variant='h6'
//               component='div'
//             >
//               Available
//             </Typography>
//           </Box>
//           <Typography gutterBottom variant='h4' component='div'>
//             {nftData.name}
//           </Typography>
//           <Box sx={{ display: "flex" }}>
//             <image
//               height='32px'
//               width='32px'
//               src='https://images.godsunchained.com/misc/gu-sigel.png'
//               alt='Collection Icon'
//             ></image>
//             <Typography
//               sx={{ px: 2 }}
//               gutterBottom
//               variant='h6'
//               component='div'
//             >
//               Gods Unchained
//             </Typography>
//           </Box>
//           <Box sx={{ display: "flex", mt: 32 }}>
//             <image
//               height='32px'
//               width='32px'
//               src='https://design-system.immutable.com/currency_icons/currency--eth.svg'
//               alt='Collection Icon'
//             ></image>
//             <Typography
//               sx={{ px: 2 }}
//               gutterBottom
//               variant='h4'
//               component='div'
//             >
//               {nftData.price}
//             </Typography>
//           </Box>
//           <Stack direction='row' spacing={2}>
//             {nftSold ? (
//               <Link href='/NFTsOneCollection'>
//                 <Button
//                   style={{ width: 500, height: 40 }}
//                   variant='contained'
//                   color='error'
//                 >
//                   {nftStatus}
//                 </Button>
//               </Link>
//             ) : (
//               <Button
//                 style={{ width: 500, height: 40 }}
//                 variant='contained'
//                 color='success'
//                 onClick={() => buyNFT(nftData)}
//               >
//                 {nftStatus}
//               </Button>
//             )}
//           </Stack>
//         </Grid>
//       </Grid>
//       <Typography
//         sx={{ mt: 5, mb: 4, textDecoration: "underline" }}
//         variant='h4'
//       >
//         Properties
//       </Typography>
//       <Grid container spacing={2}>
//         {numbers.map((number, i) => {
//           return (
//             <Grid item xs={6} key={i}>
//               <Card sx={{ minWidth: 275, backgroundColor: "#0E1118" }}>
//                 <CardContent sx={{ fontSize: 20, textAlign: "center" }}>
//                   <Typography color='white' gutterBottom variant='h5'>
//                     Color
//                   </Typography>
//                   <Typography color='#C1C1C1' gutterBottom variant='h6'>
//                     Black
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>
//     </div>
//   );
// }

// export default SingleNFT;

////[nft].js
