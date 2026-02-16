import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ContentPackage, Lead, UserProfile, LeadStatus, VideoAsset } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetNextContentPackageId() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['nextContentPackageId'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getNextContentPackageId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateContentPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentPackage: ContentPackage) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createContentPackage(contentPackage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contentPackages'] });
      queryClient.invalidateQueries({ queryKey: ['nextContentPackageId'] });
    },
  });
}

export function useGetAllContentPackages() {
  const { actor, isFetching } = useActor();

  return useQuery<ContentPackage[]>({
    queryKey: ['contentPackages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContentPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContentPackage(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ContentPackage | null>({
    queryKey: ['contentPackage', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContentPackage(BigInt(id));
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useUpdateContentPackage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contentPackage }: { id: bigint; contentPackage: ContentPackage }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateExternalContentPackage(id, contentPackage);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contentPackage', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['contentPackages'] });
    },
  });
}

export function useSaveVideoAsset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentPackageId, video }: { contentPackageId: bigint; video: VideoAsset }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveVideoAsset(contentPackageId, video);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contentPackage', variables.contentPackageId.toString()] });
    },
  });
}

export function useGetNextLeadId() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['nextLeadId'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getNextLeadId();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLead(lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['nextLeadId'] });
    },
  });
}

export function useGetAllLeads() {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: LeadStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLeadStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useAddLeadNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note }: { id: bigint; note: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLeadNote(id, note);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
