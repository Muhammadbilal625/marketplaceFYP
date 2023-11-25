/* eslint-disable @next/next/link-passhref */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaidIcon from "@mui/icons-material/Paid";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import MetaMaskOnboarding from "@metamask/onboarding";
const pages = ["NFTsCollections", "MintNFT", "my-nfts", "AboutUs"];
const menuItemsMapping={"NFTsCollections":"Home", "MintNFT":"Mint", "my-nfts":"Dashboard", "AboutUs":"Careers"}
const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();
  const [WalletAddress, setWalletAddress] = useState();
  const [WalletBalance, setWalletBalance] = useState();

  async function fetchMyAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletAddress(accounts);
    const balance = await provider.getBalance(accounts[0]);
    setWalletBalance(ethers.utils.formatEther(balance));
  }
  useEffect(() => {
    fetchMyAddress();
  }, [fetchMyAddress]);

  //MetaMaskWallet Extension Button
  useEffect(() => {
    const onboarding = new MetaMaskOnboarding();
    const btn = document.querySelector(".onboard");
    const statusText = document.querySelector(".h1");

    const isMetaMaskInstalled = () => {
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };

    let connected = (accounts) => {
      statusText.innerHTML = "Connected!";
      btn.style.display = "none";
    };

    async function connectWallet() {
      return await ethereum.request({ method: "eth_accounts" });
    }

    const onClickInstallMetaMask = () => {
      onboarding.startOnboarding();
    };
    if (btn) {
      btn.addEventListener("click", async () => {
        // btn.style.backgroundColor = "#FFD450";

        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          connected(accounts);
        } catch (error) {
          console.error(error);
        }
      });
    }
    const MetaMaskClientCheck = () => {
      if (!isMetaMaskInstalled()) {
        statusText.innerText = "You need to Install a Wallet !";
        btn.innerText = "Install MetaMask";
        // btn.style.backgroundColor = "#FFD450";
        btn.onclick = onClickInstallMetaMask;
      } else {
        connectWallet().then((accounts) => {
          if (accounts && accounts[0] > 0) {
            connected(accounts);
          } else {
            statusText.innerHTML = "Open Metamask Extension Please!";
            // btn.style.display = "none";
            btn.innerText = "Connect MetaMask";
          }
        });
      }
    };
    MetaMaskClientCheck();
  }, []);

  return (
    <Box>
      <CssBaseline />
      <AppBar position='static' sx={{ bgcolor: "#0e1118" }}>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Link passHref href='/NFTsCollections'>
              <Image
                src='data:image/png;base64,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'
                alt='NFT Connect'
                width={40}
                height={40}
                style={{borderRadius:"50%"}}
              />
            </Link>
            <Link passHref href='/NFTsCollections'>
              <Typography
                variant='h5'
                noWrap
                component='div'
                sx={{ mx: 2, mr: 2, display: { xs: "none", md: "flex" } }}
              >
                NFT Connect
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <Link  key={page} passHref href={`/${page}`}>
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign='center'>{menuItemsMapping[page]}</Typography>
                    </MenuItem>
                  </Link>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h6'
              noWrap
              component='div'
              fontSize={"16px"}
              fontWeight={"800"}
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              NFT Connect 
            </Typography>
            <Box
              sx={{ mx: 2, flexGrow: 1, display: { xs: "none", md: "flex" } }}
            >
              {pages.map((page) => (
                <Link key={page} passHref href={`/${page}`}>
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block", mt: 3 }}
                    style={{
                      textDecoration: "underline",
                      textDecorationThickness: "2px",
                      textUnderlinePosition: "under",
                    }}
                  >
                    {menuItemsMapping[page]}
                  </Button>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex" }}>
              <Box sx={{ mx: 5, mt: -2 }}>
                <Typography>
                  <span
                    style={{ fontSize: "9px", color: "#F30004" }}
                    className='h1'
                  ></span>
                </Typography>
                <button
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    backgroundColor: "#FFD450",
                  }}
                  className='onboard'
                ></button>
              </Box>
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt='Remy Sharp'
                    src='https://res.cloudinary.com/teepublic/image/private/s--DVJyzCco--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_484849,e_outline:48/co_484849,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_auto,h_630,q_90,w_630/v1536020712/production/designs/3104958_1.jpg'
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Box sx={{ display: "flex" }}>
                    <AccountBalanceWalletIcon
                      sx={{ flexGrow: 1 }}
                    ></AccountBalanceWalletIcon>
                    {WalletAddress ? (
                      <Typography>&nbsp;{WalletAddress}</Typography>
                    ) : (
                      <Typography>&nbsp;Connect Wallet</Typography>
                    )}
                  </Box>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Box sx={{ display: "flex", mx: 0 }}>
                    <PaidIcon sx={{ flexGrow: 1 }}></PaidIcon>
                    {WalletBalance ? (
                      <Typography>
                        <strong>&nbsp;{WalletBalance} ETH</strong>
                      </Typography>
                    ) : (
                      <Typography>&nbsp;0.00 ETH</Typography>
                    )}
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
export default ResponsiveAppBar;
