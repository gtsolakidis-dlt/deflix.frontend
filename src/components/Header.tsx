import { ProfileCircle } from "iconoir-react";
import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/header.module.scss";
import { navLinks } from "./MobileNav";
import { movieGenreList } from "../lib/constants";
import useMediaQuery from "../hooks/useMediaQuery";
import { useAuth } from "../contexts/AuthContext";
import { j } from "../utils";
// import { useModalDispatcher } from "../contexts/ModalContext";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname === "/";
  const isLoginPage = useLocation().pathname === "/login";
  const isSignUpPage = useLocation().pathname === "/signup";
  const navigate = useNavigate();
  const matches = useMediaQuery("tablet-up");
  const popRef = useRef<HTMLDivElement>(null);
  const { setIsLoggedIn, setUsername } = useAuth();
  // const setModalData = useModalDispatcher();

  const { isLoggedIn, username } = useAuth();

  const scrollHandler = () => {
    if (headerRef.current && window.scrollY > 30) {
      headerRef.current?.classList.add(styles["header-blur"]);
    } else {
      headerRef.current?.classList.remove(styles["header-blur"]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles["nav-left"]}>
        <Link to="/" className={styles["nf-logo"]}>
          <img src="/logo.png" alt="deflix logo" />
        </Link>
        {isLandingPage && !isLoginPage && !isSignUpPage && (
          <>
            {isLoggedIn && (
              <Link to="/browse" className={j(styles["link"])}>
                Home
              </Link>
            )}
          </>
        )}
        {matches && !isLandingPage && !isLoginPage && !isSignUpPage && (
          <ul className={styles["nav-left__list"]}>
            {navLinks.map((link) => (
              <li key={link.text}>
                <NavLink to={link.to}>{link.text}</NavLink>
              </li>
            ))}
            <li>
              <div
                className={styles.genre}
                onMouseOver={() => {
                  if (popRef.current) {
                    popRef.current.style.display = "block";
                  }
                }}
                onMouseLeave={() => {
                  setTimeout(() => {
                    if (popRef.current && !popRef.current.matches(":hover")) {
                      popRef.current.style.display = "none";
                    }
                  }, 300);
                }}>
                <span>Browse By Genres</span>
                <div className={styles["genre-popup"]} ref={popRef}>
                  {[movieGenreList].map((genre) => (
                    <div key={genre.title}>
                      <span>{genre.title}</span>
                      <ul>
                        {genre.list.map((link) => (
                          <li key={link.text}>
                            <Link to={link.link}>{link.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          </ul>
        )}
      </div>
      <div className={styles["nav-right"]}>
        {isLandingPage && !isLoginPage && !isSignUpPage && (
          <>
            {!isLoggedIn ? (
              <button
                className={styles["sign-in-btn"]}
                onClick={() => {
                  navigate("/login");
                }}>
                Sign In
              </button>
            ) : (
              <>
                <button
                  className={j(styles["sign-in-btn"], styles["logged-out"])}
                  onClick={() => {
                    setIsLoggedIn(false);
                    setUsername("");
                  }}>
                  Logout
                </button>
              </>
            )}
          </>
        )}
        {!isLandingPage && !isLoginPage && !isSignUpPage && (
          <button
            className={styles["profile-btn"]}
            aria-label="Profile"
            onClick={() => {
              navigate("/settings");
            }}>
            <ProfileCircle />{" "}
            {username
              ? username.length > 13
                ? `${username.slice(0, 13)}...`
                : username
              : "User"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
