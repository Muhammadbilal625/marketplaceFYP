import "./app.css";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AppContext from "../AppContext";
import Snackbar from "@mui/material/Snackbar";
import Head from "next/head";

function HASHMarket({ Component, pageProps }) {
  const router = useRouter();
  const [metamaskinstalled, setmetamaskinstalled] = useState(false);

  useEffect(() => {
    router.push("/NFTsCollections");
  }, []);

  useEffect(() => {
    const isMetaMaskInstalled = () => {
      const { ethereum } = window;
      return Boolean(ethereum && ethereum.isMetaMask);
    };
    const MetaMaskClientCheck = () => {
      if (isMetaMaskInstalled()) {
        setmetamaskinstalled(true);
      } else {
        setmetamaskinstalled(false);
      }
    };
    MetaMaskClientCheck();
    
  }, []);

  return (
    <div>
            <Head>
        <title>NFT Connect </title>
      </Head>

      <Header />
      <AppContext.Provider
        value={{
          setmetamaskinstalled: setmetamaskinstalled,
          state: { metamaskinstalled: metamaskinstalled },
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={true}
        message="Website Currently working on Mumbai Testnet"
      />
    </div>
  );
}

export default HASHMarket;
