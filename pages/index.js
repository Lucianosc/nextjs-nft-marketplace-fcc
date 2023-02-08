import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Header from "@/components/Header";
import NFTBox from "@/components/NFTBox";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import { useQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // show recently listed NFTs

  // we will index the events off-chain and then read from our database.
  // setup a server to listen for this events to be fired, and we will add them to a database to query.
  const { isWeb3Enabled, chainId } = useMoralis();
  const {
    loading: loadingListedNfts,
    error,
    data: listedNfts,
  } = useQuery(GET_ACTIVE_ITEMS);
  const chainIdString = chainId ? parseInt(chainId).toString() : null;
  const marketplaceAddress = chainId
    ? networkMapping[chainIdString].NftMarketplace[0]
    : null;

  return (
    <div className="container mx-auto m-8">
      <h1 className="text-3xl font-bold underline mb-4">Recently listed</h1>
      <div className="flex flex-wrap gap-4">
        {isWeb3Enabled ? (
          loadingListedNfts ? (
            <div>
              <h3>Loading...</h3>
            </div>
          ) : (
            listedNfts?.activeItems.map((elem, i) =>
              marketplaceAddress ? (
                <NFTBox
                  key={`${i}_${elem?.nftAddress}`}
                  elem={elem}
                  marketplaceAddress={marketplaceAddress}
                ></NFTBox>
              ) : (
                <div key={`${i}_${elem?.nftAddress}`}>
                  Network error, please switch to supported network.
                </div>
              )
            )
          )
        ) : (
          <div>Web3 currently not enabled</div>
        )}
      </div>
    </div>
  );
}
