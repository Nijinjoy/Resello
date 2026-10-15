import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from './RootNavigator';

// Opens the placeholder screen for features that aren't built yet.
export function useComingSoon() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (title: string) => navigation.navigate('ComingSoon', { title });
}
