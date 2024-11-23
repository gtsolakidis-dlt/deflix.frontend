import { Outlet } from "react-router-dom";
import WishlistProvider from "../contexts/WishlistProvider";

const WithWishlist = () => {
  return (
    <WishlistProvider>
      <Outlet />
    </WishlistProvider>
  );
};

export default WithWishlist;
