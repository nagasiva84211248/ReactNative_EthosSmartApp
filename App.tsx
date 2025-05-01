import AppNavigation from './src/navigation/appNavigation';
import { ToastProvider } from 'react-native-toast-notifications'

const App = () =>{
  return (
    <ToastProvider>
      <AppNavigation />
    </ToastProvider>
  );
}

export default App;
