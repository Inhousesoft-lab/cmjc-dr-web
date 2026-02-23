import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseQueryResult,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

export type AppQueryKey = [string, ...unknown[]];

export function useAppQuery<TData, TError = unknown>(
  key: AppQueryKey,
  queryFn: () => Promise<TData>,
  options?: Omit<
    UseQueryOptions<TData, TError, TData>, // ← 제네릭 3개만
    "queryKey" | "queryFn"
  >
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData>({
    queryKey: key,
    queryFn,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5, // v5: cacheTime → gcTime
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
}

export function useAppMutation<TData, TVariables = void, TError = unknown>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
    // 공통 onSuccess 로직이 꼭 필요하면 여기서만 처리
    // 그리고 options?.onSuccess는 아예 호출하지 않거나,
    // 타입 맞춰서 네 인자 그대로 넘겨야 한다.
    // onSuccess: (data, variables, context, mutation) => {
    //   // 예: queryClient.invalidateQueries(...)
    //   options?.onSuccess?.(data, variables, context, mutation);
    // },
  });
}
