import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIncoming, deleteIncoming, getIncomingByReference } from "@/app/services/incomings/incomings";

export function useIncomings(reference?: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['incomings'],
    queryFn: () => getIncomingByReference(reference!),
    enabled: !!reference,
  });

  const { mutate: createMutation, isPending: isCreating } = useMutation({
    mutationFn: createIncoming,
    mutationKey: ['create-incoming'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomings'] });
    },
  });

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteIncoming,
    mutationKey: ['delete-incoming'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomings'] });
    },
  });

  return {
    data,
    isLoading,
    deleteMutation: mutate,
    createMutation,
    isCreating,
    isDeleting,
  };
}