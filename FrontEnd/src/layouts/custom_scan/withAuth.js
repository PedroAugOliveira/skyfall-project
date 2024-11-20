import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function withAuth(Component) {
  function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/check-auth", {
            method: "GET",
            credentials: "include"
          });
          const data = await response.json();
          if (data.status === "success") {
            setIsLoading(false);
          } else {
            navigate("/signin");
          }
        } catch (error) {
          console.error("Error:", error);
          navigate("/signin");
        }
      };

      checkAuth();
    }, [navigate]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  }

  return AuthenticatedComponent;
}

export default withAuth;
