import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './RootNavigator';

// Opens a listing's details screen from anywhere, including the tabs.
export function useOpenListing() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (listingId: string) =>
    navigation.navigate('ListingDetails', { listingId });
}
