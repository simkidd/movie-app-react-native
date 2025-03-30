import { View, Text } from 'react-native';
import { StarIcon } from 'react-native-heroicons/solid';
import { StarIcon as StarOutlineIcon } from 'react-native-heroicons/outline';

export function Rating({ value, max = 5 }: { value: number; max?: number }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} size={20} color="#F59E0B" />
      ))}
      
      {hasHalfStar && (
        <StarOutlineIcon size={20} color="#F59E0B" />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <StarOutlineIcon key={`empty-${i}`} size={20} color="#F59E0B" />
      ))}
    </View>
  );
}