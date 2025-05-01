import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const breakpoints = {
  small: 360, 
  medium: 768,
  large: 1024,
};

const fontSize = {
  small: 12, 
  medium: 16, 
  large: 18, 
};

const getFontSize = () => {
  if (width < breakpoints.small) {
    return fontSize.small;
  } else if (width < breakpoints.medium) {
    return fontSize.medium;
  } else {
    return fontSize.large;
  }
};

const mediaQueries = {
  breakpoints,
  fontSize: {
    small: fontSize.small,
    medium: getFontSize(), 
    large: fontSize.large,
  },
};

export { mediaQueries };
