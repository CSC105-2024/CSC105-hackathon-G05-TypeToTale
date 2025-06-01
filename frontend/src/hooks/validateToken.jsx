import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useTokenValidation() {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:3000/user/api/token-validation",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const data = await response.json();
        if (!data.status) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate]);
}
