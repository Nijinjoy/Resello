/**
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <RootNavigator />
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

export default App;
