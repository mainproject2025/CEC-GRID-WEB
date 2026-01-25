import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import pic from '../assets/images/clg_pic.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await cred.user.getIdToken();
      console.log(idToken);
      
  
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

  
      localStorage.setItem("cecgrid-token", idToken);
      localStorage.setItem("cecgrid-role", data.user.role);
      localStorage.setItem("cecgrid-uid", data.user.uid);
      localStorage.setItem("cecgrid-email", data.user.email);

      navigate("/app/seating-arrangements", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* LEFT */}
      <div className="w-1/2 flex items-center justify-center px-20">
      
        <div className="w-full max-w-md">
        <h1 className="block text-[#4F46E5] font-semibold mb-2 text-3xl mb-11">Welcome Back</h1>
          {/* Email */}
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
            />
          </div>

          {/* Password */}
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
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#4F46E5] text-white py-4 rounded-full font-semibold cursor-pointer" 
          >
            {loading ? "Logging in..." : "Login"}
          </button>
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
