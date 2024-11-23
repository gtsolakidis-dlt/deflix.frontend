import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import WithHeader from "./layout/WithHeader";
import WithModalListener from "./layout/WithModalListener";
import WithNavBar from "./layout/WithNavBar";
import ErrorPage from "./pages/ErrorPage";
import GenresPage from "./pages/GenresPage";
import Homepage from "./pages/Homepage";
import InfoPage from "./pages/InfoPage";
import LandingPage from "./pages/LandingPage";
import List from "./pages/List";
import WithMyList from "./layout/WithMyList";
import { ModalProvider } from "./contexts/ModalContext";
import WithProtectedRoute from "./layout/WithProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import Configuration from "./components/Configuration";
import { BaseUrlProvider } from "./contexts/BaseUrlContext";
import WithWishlist from "./layout/WithWishlist";
import WishlistPage from "./pages/WishlistPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<ErrorPage />}>
      {/* Login Page wrapped in WithHeader */}
      <Route element={<WithHeader />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
      </Route>

      {/* All other routes */}
      <Route element={<WithMyList />}>
        <Route element={<WithWishlist />}>
          <Route element={<WithModalListener />}>
            <Route element={<WithHeader />}>
              <Route index element={<LandingPage />} />

              {/* Protected Routes */}
              <Route element={<WithProtectedRoute />}>
                <Route element={<WithNavBar />}>
                  <Route path="browse" element={<Homepage />} />
                  {/* <Route path="movie" element={<MoviePage />} /> */}
                  <Route path="genres/:category/:id" element={<GenresPage />} />
                  <Route path=":category/:id" element={<InfoPage />} />
                  <Route path="list" element={<List />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <ModalProvider>
      <BaseUrlProvider>
        <RouterProvider router={router} />
        <Configuration />
      </BaseUrlProvider>
    </ModalProvider>
  );
};

export default App;
