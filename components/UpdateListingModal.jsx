import React, { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Modal, Input, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import { ethers } from "ethers";

export default function UpdateListingModal({
  nftAddress,
  tokenId,
  isVisible,
  marketplaceAddress,
  closeModal,
}) {
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);
  const dispatch = useNotification();

  const handleUpdateListingSuccess = async (tx) => {
    await tx.wait(1);

    dispatch({
      type: "success",
      message: "listing updated",
      title: "Listing updated - please refresh (and move blocks)",
      position: "topR",
    });
    onclose && onclose();
    setPriceToUpdateListingWith("");
  };
  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils
        .parseEther(priceToUpdateListingWith || "0")
        .toString(),
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onCancel={closeModal}
      onCloseButtonPressed={closeModal}
      onOk={() => {
        console.log({
          abi: nftMarketplaceAbi,
          contractAddress: marketplaceAddress,
          functionName: "updateListing",
          params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils
              .parseEther(priceToUpdateListingWith)
              .toString(),
          },
        });
        updateListing({
          onerror: (e) => {
            console.log(e);
          },
          onSuccess: handleUpdateListingSuccess,
        });
      }}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New listing price"
        type="number"
        onChange={(e) => {
          setPriceToUpdateListingWith(e.target.value);
        }}
      ></Input>
    </Modal>
  );
}
