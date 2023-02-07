import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    itemListeds(first: 10) {
      id
      nftAddress
      tokenId
      price
      seller
    }
  }
`;
export default GET_ACTIVE_ITEMS;
