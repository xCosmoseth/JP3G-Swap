import { useState, useEffect } from "react";
import { Widget } from "@kyberswap/widgets";
import { init, useWallets, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ethers } from "ethers";
import walletConnectModule from "@web3-onboard/walletconnect";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";

const injected = injectedModule();
const walletConnect = walletConnectModule();
const appMetadata = {
  name: "JP3G Swap",
  icon: "/logo.png",
  logo: "/logo.png",
  description: "JP3G Swap",
  recommendedInjectedWallets: [
    { name: "MetaMask", url: "https://metamask.io" },
  ],
};

// initialize Onboard
init({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: "https://ethereum.kyberengineering.io",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon.kyberengineering.io",
    },
  ],
  appMetadata,
});

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://jp3gvault.xyz/">
        JP3Gvault
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1B322C",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#141414",
    },
  },
});

function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  // create an ethers provider
  let ethersProvider: any;

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
  }

  const connectedWallets = useWallets();

  const [chainId, setChainId] = useState(137);

  useEffect(() => {
    ethersProvider?.getNetwork().then((res: any) => setChainId(res.chainId));
  }, [ethersProvider]);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
  }, [connectedWallets, wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets") || "[]"
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        const walletConnected = await connect({
          autoSelect: previouslyConnectedWallets[0],
        });
      }
      setWalletFromLocalStorage();
    }
  }, [connect]);

  const darkTheme = {
    text: "#FFFFFF",
    subText: "#A9A9A9",
    primary: "#1C1C1C",
    dialog: "#313131",
    secondary: "#0F0F0F",
    interactive: "#292929",
    stroke: "#505050",
    accent: "#28E0B9",
    success: "#189470",
    warning: "#FF9901",
    error: "#FF537B",
    fontFamily: "Roboto",
    borderRadius: "16px",
    buttonRadius: "999px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
  };

  const defaultTokenOut: { [chainId: number]: string } = {
    1: "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202",
    137: "0x4BFcE5A1aCC3B847AFa9579bA91DA33b08e66fb7",
    56: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    43114: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    250: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
    25: "0x66e428c3f67a68878562e79A0234c1F83c208770",
    42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    199: "0x9B5F27f6ea9bBD753ce3793a07CbA3C74644330d",
    106: "0x01445C31581c354b7338AC35693AB2001B50b9aE",
    1313161554: "0x4988a896b1227218e4a686fde5eabdcabd91571f",
    42262: "0x6Cb9750a92643382e020eA9a170AbB83Df05F30B",
    10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#1C1C1C" }}>
            <img width={48} height={48} src="/logo.png"></img>
          </Avatar>
          <Typography component="h1" variant="h5" m={2}>
            JP3G Swap
          </Typography>
          <Button
            onClick={() => (wallet ? disconnect(wallet) : connect())}
            className="button"
            variant="contained"
          >
            {!wallet ? "Connect Wallet" : "Disconnect"}
          </Button>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs="auto">
              <Typography component="p" m={2}>
                {" "}
                Set the slippage to 6.5% using
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <Avatar>
                <img width={48} height={48} src="/slippage.png"></img>
              </Avatar>
            </Grid>
          </Grid>
          <Widget
            client="JP3Gvault"
            theme={darkTheme}
            tokenList={[]}
            provider={ethersProvider}
            defaultTokenOut={defaultTokenOut[chainId]}
          />
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs="auto">
              <Typography component="p" fontSize={12} m={1}>
                {" "}
                <code>JP3G contract address</code>
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <Typography component="p" fontSize={12} m={1}>
                {" "}
                <code>0x4BFcE5A1aCC3B847AFa9579bA91DA33b08e66fb7</code>
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
