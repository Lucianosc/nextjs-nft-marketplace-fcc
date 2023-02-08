import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(first: 10) {
      id
      buyer
      seller
      nftAddress
      price
      tokenId
    }
  }
`;
export default GET_ACTIVE_ITEMS;
