import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { UserCheck, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import thinkboardLogo from "../assets/thinkboard-logo.png";
import { useState } from "react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { loginAsGuest, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [guestLoading, setGuestLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured =
    Boolean(googleClientId) &&
    googleClientId.includes(".apps.googleusercontent.com") &&
    !googleClientId.startsWith("your_");

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
    toast.error(
      "Google Sign-In failed (invalid Client ID). Please configure VITE_GOOGLE_CLIENT_ID in frontend/.env",
      { duration: 6000 }
    );
  };

  // Demo/dev Google sign-in helper when live client ID is not yet configured
  const handleDevMockGoogleLogin = async () => {
    try {
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

            {/* Google OAuth Login Section */}
            <div className="flex flex-col items-center justify-center space-y-3">
              {isGoogleConfigured ? (
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
              ) : (
                <div className="w-full space-y-3">
                  <button
                    type="button"
                    onClick={handleDevMockGoogleLogin}
                    className="btn btn-primary w-full rounded-full gap-2 shadow-lg hover:shadow-primary/20"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                    Sign in with Google (Dev Mode)
                  </button>

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-info/10 border border-info/20 text-info text-xs leading-5">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>
                      <strong>Setup Note:</strong> To enable live Google OAuth popup, add your Google OAuth Client ID to <code>frontend/.env</code> as <code>VITE_GOOGLE_CLIENT_ID</code>.
                    </span>
                  </div>
                </div>
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
