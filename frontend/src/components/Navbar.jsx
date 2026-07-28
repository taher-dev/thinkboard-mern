import { Link, useNavigate } from "react-router";
import { PlusIcon, LogOut, Sparkles } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (credentialResponse.credential) {
      await loginWithGoogle(credentialResponse.credential);
      setShowUpgradeModal(false);
    }
  };

  return (
    <>
      <header className="bg-base-300 border-b border-base-content/10">
        <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="inline-flex items-center">
              <img
                src={thinkboardLogo}
                alt="ThinkBoard"
                className="h-12 w-auto sm:h-14 md:h-16"
              />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* New Note CTA */}
              <Link to="/create" className="btn btn-primary btn-sm sm:btn-md gap-1.5">
                <PlusIcon className="size-4 sm:size-5" />
                <span className="hidden sm:inline">New Note</span>
              </Link>

              {/* User Profile & Account Status */}
              {user && (
                <div className="flex items-center gap-2">
                  {user.isGuest ? (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="btn btn-sm btn-outline border-warning/40 hover:bg-warning/10 text-warning gap-1 px-2.5 sm:px-3 text-xs sm:text-sm"
                      title="Click to sign in with Google and save guest notes permanently"
                    >
                      <Sparkles size={14} className="text-warning" />
                      <span className="hidden xs:inline">Guest</span>
                      <span className="font-semibold underline">Save to Google</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-base-200/80 border border-base-content/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-base-content max-w-[100px] sm:max-w-[150px] truncate">
                        {user.name}
                      </span>
                    </div>
                  )}

                  {/* Sign Out Button */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-error hover:bg-error/10"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Upgrade / Merge Guest Notes Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="card w-full max-w-md bg-base-200 border border-base-content/15 shadow-2xl rounded-3xl p-6 sm:p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles size={28} />
              </div>

              <h2 className="text-2xl font-bold text-base-content">
                Save Notes Permanently
              </h2>

              <p className="text-sm text-base-content/70 leading-relaxed">
                Sign in with Google to transfer all your current guest notes into your
                account so you never lose them.
              </p>

              <div className="pt-4 flex flex-col items-center justify-center space-y-3">
                {import.meta.env.VITE_GOOGLE_CLIENT_ID?.includes(".apps.googleusercontent.com") ? (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {}}
                    theme="filled_blue"
                    shape="pill"
                    size="large"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={async () => {
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
                    }}
                    className="btn btn-primary w-full rounded-full gap-2"
                  >
                    Transfer Notes & Sign In with Google
                  </button>
                )}

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
