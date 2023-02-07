import { React, useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../constants/BasicNft.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import Image from "next/image";
import { Card, useNotification } from "web3uikit";
import { ethers } from "ethers";
import UpdateListingModal from "./UpdateListingModal";

const truncateStr = (fullStr, strLength) => {
  if (fullStr <= strLength) return fullStr;
  const separator = "...";
  const charsToShow = strLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};
export default function NFTBox({
  marketplaceAddress,
  elem: { nftAddress, price, seller, tokenId },
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { tokenId: tokenId },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    msgValue: price,
    params: { nftAddress: nftAddress, tokenId: tokenId },
  });

  const handleCardClick = () => {
    console.log({
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "buyItem",
      msgValue: price,
      params: { nftAddress: nftAddress, tokenId: tokenId },
    });
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (e) => console.log(e),
          onSuccess: () => handleBuyItemSuccess(),
        });
  };

  const handleBuyItemSuccess = () => {
    dispatch({
      type: "success",
      message: "Item bought",
      title: "Item bought",
      position: "topR",
    });
  };

  const updateUI = async () => {
    const tokenURI = await getTokenURI();
    if (tokenURI) {
      // IPFS gateway: A server will return ipfs files from a "normal" URL.
      const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      // Are other ways we can do this?
      // We could render the image in our server and call our server
      // For testnets & mainnet => use moralis server hook
      // Have the world adopt IPFS
    }
    // get token URI
    // using the image tag from tokenURI, get the image
  };
  useEffect(() => {
    if (isWeb3Enabled) updateUI();
  }, [isWeb3Enabled]);

  return (
    <div>
      {imageURI ? (
        <div>
          <UpdateListingModal
            isVisible={showModal}
            nftAddress={nftAddress}
            tokenId={tokenId}
            marketplaceAddress={marketplaceAddress}
            closeModal={() => setShowModal(false)}
          />
          <Card
            title={tokenName}
            description={tokenDescription}
            onClick={handleCardClick}
          >
            <div className="p-2 inline-block">
              <div>TokenId: {tokenId}</div>
              <div className="italic text-sm">
                Owned by: {formattedSellerAddress}
              </div>
              <Image
                unoptimized={true}
                loader={() => imageURI}
                src={imageURI}
                height="200"
                width="200"
                alt="NFT image"
              />
              <div className="font-bold">
                Price: ${ethers.utils.formatUnits(price, "ether")}
              </div>{" "}
            </div>
          </Card>{" "}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
