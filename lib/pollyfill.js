// Polyfill para geração de valores aleatórios em React Native
// `react-native-get-random-values` já adiciona `global.crypto.getRandomValues`.
import 'react-native-get-random-values';

// Garante que `global.crypto` exista (a importação acima normalmente já faz isso).
if (typeof global.crypto === 'undefined') {
  global.crypto = {};
}
