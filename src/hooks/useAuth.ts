import { listenToAuthChanges } from "@/services/auth_service";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = listenToAuthChanges(setUser, setLoading, setError);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    error,
  };
}
