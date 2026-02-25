import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import pic from '../assets/images/clg_pic.png'
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = "service_b8y1ajg";
const TEMPLATE_ID = "template_sz8ixvg";
const PUBLIC_KEY = "IgalII-2YfQlg5L72";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store the generated OTP
  const [otpSent, setOtpSent] = useState(false);
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP

  const navigate = useNavigate();

  const handlePasswordLogin = async () => {
    if (!email && !password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Step 1: Authenticate with Firebase Password
      await signInWithEmailAndPassword(auth, email, password);

      // If successful, trigger OTP send (Mock)
      await handleSendOtp();

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      // Generate OTP
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);

      const templateParams = {
        to_email: email, // ensure the EmailJS template uses {{to_email}} in the "To Email" field
        passcode: mockOtp,
        time: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        email: email,
        passcode: mockOtp,
        time: new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }, PUBLIC_KEY);

      setOtpSent(true);
      setStep(2); // Move to OTP step

      alert(`OTP sent to ${email}`);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP via EmailJS");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Verify OTP locally
      if (otp !== generatedOtp) {
        throw new Error("Invalid OTP");
      }

      // If OTP matches, get the current user's token
      // We are already signed in from Step 1
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user found");

      const idToken = await currentUser.getIdToken();

      

      localStorage.setItem("cecgrid-token", idToken);
      localStorage.setItem("cecgrid-uid", currentUser.uid);
      localStorage.setItem("cecgrid-email", currentUser.email);
      localStorage.setItem("cecgrid-name",currentUser.displayName);
       

      navigate("/app/seating-arrangements", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center px-20">

        <div className="w-full max-w-md">
          <h1 className="block text-[#4F46E5] font-semibold text-3xl mb-11">Welcome Back</h1>

          {/* Step 1: Email & Password */}
          {step === 1 && (
            <>
              <div className="mb-6">
                <label className="block text-[#4F46E5] font-semibold mb-2 text-lg">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="cecgrid@ceconline.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-[#4F46E5] rounded-xl"
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="block text-[#4F46E5] font-semibold mb-2 text-lg">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-[#4F46E5] rounded-xl pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full bg-[#4F46E5] text-white py-4 rounded-full font-semibold cursor-pointer hover:bg-[#4338ca] transition-colors"
              >
                {loading ? "Verifying Credentials..." : "Login"}
              </button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Please enter the OTP sent to <strong>{email}</strong>
                </p>
                <label className="block text-[#4F46E5] font-semibold mb-2 text-lg">
                  Enter OTP
                </label>
                <input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-5 py-4 border-2 border-[#4F46E5] rounded-xl text-center tracking-widest text-xl"
                  maxLength={6}
                  disabled={loading}
                />
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#4F46E5] text-white py-4 rounded-full font-semibold cursor-pointer hover:bg-[#4338ca] transition-colors"
              >
                {loading ? "Verifying OTP..." : "Verify & Login"}
              </button>

              <button
                onClick={() => { setStep(1); setOtp(""); setError(""); }}
                className="w-full mt-4 text-[#4F46E5] underline cursor-pointer hover:text-[#4338ca] transition-colors"
              >
                Back to Login
              </button>
            </>
          )}

        </div>
      </div>

      {/* RIGHT */}
      <div className="w-1/2 p-10">
        <img
          src={pic}
          className="w-full h-full object-cover rounded-[40px]"
          alt="College"
        />
      </div>
    </div>
  );
}
