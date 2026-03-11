import { useQuery } from "@tanstack/react-query";
import supabase from "../core/supabase";

export function useUpdate(path) {
  const fetch = async () => {
    console.log("Fetching data from path:", path);

    const { data, error } = await supabase
      .from(path)
      .select("*")
      .order(`${path === "/chess_articles" ? "createdAt" : "id"}`, { ascending: false });

    if (error) {
      console.error("Error fetching data:", error);
      throw new Error(error.message);
    }
    console.log("Response: ", data);
    return data;
  };

  const { data, error, isLoading, refetch, isSuccess } = useQuery({
    queryKey: [path],
    queryFn: fetch,
    enabled: false,
  });

  return { data, error, isLoading, refetch, isSuccess };
}
