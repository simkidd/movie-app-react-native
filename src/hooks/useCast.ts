import { ICastMember } from "@/interfaces/movie.interface";
import { getCastDetails } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

interface ICastDetails extends ICastMember {
  biography?: string;
  birthday?: string;
  place_of_birth?: string;
}

export const useCastDetails = (castId: string) => {
  return useQuery({
    queryKey: ["castDetails", castId],
    queryFn: async () => getCastDetails(castId),
    select: (data) => data as ICastDetails,
  });
};
