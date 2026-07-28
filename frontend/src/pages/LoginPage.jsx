import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { UserCheck, AlertCircle, ArrowRight } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginAsGuest, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [guestLoading, setGuestLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured =
    Boolean(googleClientId) &&
    googleClientId.includes(".apps.googleusercontent.com") &&
    !googleClientId.startsWith("your_");

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    navigate("/");
  }

  const triggerLiveGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        if (tokenResponse.access_token) {
          await loginWithGoogle({ access_token: tokenResponse.access_token });
          navigate("/");
        }
      } catch {
        // Toast handles error display
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Sign-In failed or was cancelled.");
      setGoogleLoading(false);
    },
  });

  const handleGuestLogin = async () => {
    try {
      setGuestLoading(true);
      await loginAsGuest();
      navigate("/");
    } catch {
      // Toast handles error display
    } finally {
      setGuestLoading(false);
    }
  };

  const handleDevMockGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const mockPayload = {
        sub: "google_user_demo_101",
        email: "demo.google.user@gmail.com",
        name: "Demo Google User",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      };
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(mockPayload));
      const mockCredential = `${header}.${payload}.mock_signature`;

      await loginWithGoogle(mockCredential);
      navigate("/");
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
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center px-3 sm:px-4 py-6 sm:py-12">
      {/* Background gradient matching app theme */}
      <div className="fixed inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#171212_60%,rgba(30,184,84,0.4)_100%)]"></div>

      <div className="w-full max-w-md mx-auto">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center text-center mb-5 sm:mb-8">
          <img
            src={thinkboardLogo}
            alt="ThinkBoard"
            className="h-14 sm:h-20 w-auto mb-2.5 sm:mb-4 drop-shadow-md hover:scale-105 transition-transform duration-300"
          />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
            Welcome to ThinkBoard
          </h1>
          <p className="text-xs sm:text-sm text-base-content/70 mt-1 sm:mt-2">
            Organize your thoughts, private and accessible anywhere.
          </p>
        </div>

        {/* Auth Card */}
        <div className="card rounded-2xl sm:rounded-3xl border border-base-content/10 bg-base-200/90 backdrop-blur-xl shadow-2xl p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center font-semibold text-xs text-base-content/60 tracking-wider">
              SIGN IN OPTIONS
            </div>

            {/* Single Custom Google OAuth Login Button */}
            <div className="flex flex-col items-center justify-center space-y-3">
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
                      Sign in with Google
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-white/80 font-normal truncate">
                      Fast & secure single sign-on
                    </div>
                  </div>
                </div>

                {googleLoading ? (
                  <span className="loading loading-spinner loading-xs sm:loading-sm text-white shrink-0 ml-1"></span>
                ) : (
                  <ArrowRight size={16} className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-1" />
                )}
              </button>

              {!isGoogleConfigured && (
                <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-info/10 border border-info/20 text-info text-[11px] sm:text-xs leading-4 sm:leading-5 w-full">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Setup Note:</strong> Running in dev mode. Add <code>VITE_GOOGLE_CLIENT_ID</code> to <code>frontend/.env</code> to connect live Google Cloud credentials.
                  </span>
                </div>
              )}
            </div>

            <div className="divider text-[11px] sm:text-xs text-base-content/40 my-1 sm:my-2">OR</div>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              className="group relative w-full flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-base-100/60 hover:bg-base-100 border border-base-content/15 hover:border-accent/40 shadow-sm hover:shadow-lg transition-all duration-300 text-base-content font-semibold text-xs sm:text-sm disabled:opacity-60"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-xl bg-accent/10 text-accent shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <UserCheck size={17} />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-base-content group-hover:text-accent transition-colors text-xs sm:text-sm truncate">
                    Continue as Guest
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-base-content/50 font-normal truncate">
                    No account required &bull; Try instantly
                  </div>
                </div>
              </div>
              {guestLoading ? (
                <span className="loading loading-spinner loading-xs sm:loading-sm text-accent shrink-0 ml-1"></span>
              ) : (
                <ArrowRight size={16} className="text-base-content/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-1" />
              )}
            </button>

            {/* Guest Notice */}
            <p className="text-[11px] sm:text-xs text-center text-base-content/50 leading-4 sm:leading-5">
              Guest notes are temporary. You can switch to a Google account anytime
              and your guest notes will be saved automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 sm:mt-8 text-[11px] sm:text-xs text-base-content/40">
          ThinkBoard &copy; {new Date().getFullYear()} &bull; Secure MERN Notes App
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
