import axios from "axios";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { CHECK_TOKEN_VALIDITY_API } from "@/constant/API/API";
import { getCookie } from "@/utils/getCookie";

export default function PrivateRoute() {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const checkTokenValidity = async () => {
    const cookie = getCookie("token");
    if (cookie) {
      try {
        const res = await axios.post(CHECK_TOKEN_VALIDITY_API, {
          token: cookie,
        });

        setLoading(false);
        if (!res.data.valid) {
          navigate("/");
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      } catch (err) {
        navigate("/");
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    void checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000);
    return () => clearInterval(intervalId);
  }, []);
  if (isLoading) return <div></div>;
  return <Outlet />;
}
