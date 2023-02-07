import Head from "next/head";
import { Inter } from "@next/font/google";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.json";
import NftMarketplaceAbi from "../constants/NftMarketplace.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { chainId } = useMoralis();
  // chainID comes in hex form we need to convert it to string
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainIdString].NftMarketplace[0];
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  async function approveAndList(data) {
    console.log("Approving...");

    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();
    console.log(price);

    const ApproveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };
    await runContractFunction({
      params: ApproveOptions,
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
      onError: (e) => console.log(e),
    });
  }
  async function handleApproveSuccess(nftAddress, tokenId, price) {
    console.log("Time to List!");
    const listOptions = {
      abi: NftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };
    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (e) => console.log(e),
    });
  }

  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "NFT listed",
      title: "NFT listed",
      position: "topR",
    });
  }

  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "50%",
            value: "",
            key: "nftAddress",
          },
          { name: "Token Id", type: "number", value: "", key: "tokenId" },
          { name: "Price (in ETH)", type: "number", value: "", key: "price" },
        ]}
        title="Sell your NFT!"
        id="mainForm"
      ></Form>
    </div>
  );
}
