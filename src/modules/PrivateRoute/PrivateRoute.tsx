/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setLoading] = useState(true);
  const checkTokenValidity = async () => {};
  useEffect(() => {
    void checkTokenValidity();
    const intervalId = setInterval(checkTokenValidity, 60000);
    return () => clearInterval(intervalId);
  }, []);
  if (isLoading) return <div>Loading...</div>;
  return <Outlet />;
}
