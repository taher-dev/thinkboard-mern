import { Link, useNavigate } from "react-router";
import { PlusIcon, LogOut, User, ArrowRight } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured =
    Boolean(googleClientId) &&
    googleClientId.includes(".apps.googleusercontent.com") &&
    !googleClientId.startsWith("your_");

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate("/login");
  };

  const triggerLiveGoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        if (tokenResponse.access_token) {
          await loginWithGoogle({ access_token: tokenResponse.access_token });
          setShowUpgradeModal(false);
        }
      } catch {
        // Error handled by AuthContext toast
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (errorResponse) => {
      if (
        errorResponse?.type === "popup_failed_to_open" ||
        errorResponse?.type === "popup_closed"
      ) {
        toast.error(
          "Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.",
          { duration: 5000 },
        );
      } else {
        toast.error("Google Sign-In failed or was cancelled.");
      }
      setGoogleLoading(false);
    },
    onNonOAuthError: (error) => {
      if (error?.type === "popup_failed_to_open") {
        toast.error(
          "Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.",
          { duration: 5000 },
        );
      } else {
        toast.error("Google Sign-In failed or was cancelled.");
      }
      setGoogleLoading(false);
    },
  });

  const handleDevMockGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const mockPayload = {
        sub: "google_user_upgraded_101",
        email: "upgraded.user@gmail.com",
        name: "Google Upgraded Account",
        picture: "",
      };
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(mockPayload));
      const mockCredential = `${header}.${payload}.mock_signature`;
      await loginWithGoogle(mockCredential);
      setShowUpgradeModal(false);
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleClick = () => {
    if (isGoogleConfigured) {
      triggerLiveGoogleLogin();
    } else {
      handleDevMockGoogleLogin();
    }
  };

  return (
    <>
      <header className="bg-base-300 border-b border-base-content/10">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* App Logo */}
            <Link to="/" className="inline-flex items-center">
              <img
                src={thinkboardLogo}
                alt="ThinkBoard"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* New Note CTA */}
              <Link to="/create" className="btn btn-primary btn-sm sm:btn-md gap-1.5">
                <PlusIcon className="size-4 sm:size-5" />
                <span className="hidden sm:inline">New Note</span>
              </Link>

              {/* User Profile Avatar & Toggle Dropdown */}
              {user && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="btn btn-ghost btn-circle p-0 min-h-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center focus:outline-none active:scale-95 transition-transform"
                    title={user.isGuest ? "Guest Account" : user.name}
                  >
                    <div className="w-full h-full rounded-full border border-base-content/15 hover:border-primary/40 transition-colors flex items-center justify-center bg-base-200 overflow-hidden">
                      {user.isGuest ? (
                        <User size={20} className="text-base-content/70 m-auto" />
                      ) : user.avatar && !avatarError ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span className="font-bold text-sm text-primary">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Animated Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full mt-2.5 z-50 w-64 sm:w-72 p-2 shadow-2xl bg-base-200/95 border border-base-content/10 backdrop-blur-xl rounded-2xl transition-all duration-150 ease-out origin-top-right ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <ul className="space-y-1 text-sm font-medium">
                      {user.isGuest ? (
                        <>
                          <li>
                            <button
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setShowUpgradeModal(true);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors text-left font-medium"
                            >
                              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                  fill="currentColor"
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                              </svg>
                              <span>Save with Google</span>
                            </button>
                          </li>
                          <div className="divider my-0 border-base-content/5 opacity-40"></div>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors text-left font-medium"
                            >
                              <LogOut size={16} />
                              <span>Logout</span>
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-2.5 border-b border-base-content/10 mb-1">
                            <div className="flex items-start gap-2.5">
                              {user.avatar && !avatarError ? (
                                <img
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-base-content/10 mt-0.5"
                                  onError={() => setAvatarError(true)}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-base-content font-bold text-sm leading-tight break-words">
                                  {user.name}
                                </div>
                                {user.email && (
                                  <div className="text-[11px] text-base-content/60 leading-tight mt-0.5 break-all font-normal">
                                    {user.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors text-left font-medium"
                            >
                              <LogOut size={16} />
                              <span>Logout</span>
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Save with Google Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card w-full max-w-md bg-base-200 border border-base-content/15 shadow-2xl rounded-3xl p-6 sm:p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-base-content">
                Save Notes Permanently
              </h2>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Sign in with Google to transfer all your current guest notes into your
                account so you never lose them.
              </p>

              <div className="pt-4 flex flex-col items-center justify-center space-y-3">
                {/* Custom Google Button matching LoginPage design */}
                <button
                  type="button"
                  onClick={handleGoogleClick}
                  disabled={googleLoading}
                  className="group relative w-full flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-primary text-primary-content hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold text-xs sm:text-sm disabled:opacity-60"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-xl bg-white/20 text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div className="text-left min-w-0">
                      <div className="font-bold text-white text-xs sm:text-sm truncate">
                        Save with Google
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-white/80 font-normal truncate">
                        Transfer notes & sign in
                      </div>
                    </div>
                  </div>

                  {googleLoading ? (
                    <span className="loading loading-spinner loading-xs sm:loading-sm text-white shrink-0 ml-1"></span>
                  ) : (
                    <ArrowRight size={16} className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-1" />
                  )}
                </button>

                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
