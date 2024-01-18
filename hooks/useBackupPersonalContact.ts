import useSWR from "swr";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import { authFetcher } from "./fetcher";

export function useBackupPersonalContact(userId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `${getEndpointUrl(ENDPOINTS.backupPersonalContact(userId))}`,
    authFetcher,
  );
  return { data, error, isLoading, mutate };
}
