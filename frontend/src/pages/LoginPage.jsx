import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { UserCheck, ShieldCheck, Sparkles } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginAsGuest, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [guestLoading, setGuestLoading] = useState(false);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    navigate("/");
  }

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await loginWithGoogle(credentialResponse.credential);
        navigate("/");
      }
    } catch {
      // Toast handles error display
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign in was cancelled or failed.");
  };

  // Fallback demo/dev Google sign-in for testing environments
  const handleDevMockGoogleLogin = async () => {
    try {
      // Generate a valid mock JWT token structure for dev testing when Client ID isn't configured
      const mockPayload = {
        sub: "google_dev_123456789",
        email: "demo.user@gmail.com",
        name: "Demo Google User",
        picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      };
      // Simple base64 encode for mock ID token structure header.payload.signature
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(mockPayload));
      const mockCredential = `${header}.${payload}.mock_signature`;

      await loginWithGoogle(mockCredential);
      navigate("/");
    } catch {
      // Error handled by AuthContext toast
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center px-4 py-12">
      {/* Background gradient matching app theme */}
      <div className="fixed inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#171212_60%,rgba(30,184,84,0.4)_100%)]"></div>

      <div className="w-full max-w-md">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={thinkboardLogo}
            alt="ThinkBoard"
            className="h-20 w-auto mb-4 drop-shadow-md"
          />
          <h1 className="text-3xl font-extrabold text-base-content tracking-tight">
            Welcome to ThinkBoard
          </h1>
          <p className="text-sm text-base-content/70 mt-2">
            Organize your thoughts, private and accessible anywhere.
          </p>
        </div>

        {/* Auth Card */}
        <div className="card rounded-3xl border border-base-content/10 bg-base-200/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          <div className="space-y-6">
            {/* Features summary badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-base-content/70">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100/60 border border-base-content/5">
                <ShieldCheck size={16} className="text-primary shrink-0" />
                <span>Private & Isolated</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-base-100/60 border border-base-content/5">
                <Sparkles size={16} className="text-warning shrink-0" />
                <span>Seamless Guest Merge</span>
              </div>
            </div>

            <div className="divider text-xs text-base-content/50 my-2">
              SIGN IN OPTIONS
            </div>

            {/* Google OAuth Login */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_blue"
                  shape="pill"
                  size="large"
                  text="signin_with"
                  width="100%"
                />
              </div>

              {/* Dev environment quick Google login helper */}
              {import.meta.env.MODE === "development" && (
                <button
                  type="button"
                  onClick={handleDevMockGoogleLogin}
                  className="text-xs text-primary/80 hover:text-primary hover:underline transition-colors pt-1"
                >
                  (Dev Mode) Test Google Sign-In
                </button>
              )}
            </div>

            <div className="divider text-xs text-base-content/40 my-2">OR</div>

            {/* Guest Login */}
            <button
              onClick={handleGuestLogin}
              disabled={guestLoading}
              className="btn btn-outline w-full rounded-full border-base-content/20 gap-2 hover:bg-base-100 text-base-content font-medium py-3"
            >
              {guestLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <UserCheck size={18} className="text-accent" />
                  Continue as Guest
                </>
              )}
            </button>

            {/* Guest Notice */}
            <p className="text-xs text-center text-base-content/50 leading-5">
              Guest notes are temporary. You can upgrade to a Google account anytime
              and your guest notes will be saved automatically.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-base-content/40">
          ThinkBoard &copy; {new Date().getFullYear()} &bull; Secure MERN Notes App
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
