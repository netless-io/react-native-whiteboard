import { Slider } from '@miblanchard/react-native-slider';
import React, { useState } from 'react';

import {
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { branColor } from './WhiteboardConfig';

export function ColorButton(props: { color: string, selected: boolean, onPress: () => void}) {
  return <TouchableOpacity
    onPress={props.onPress}
    style={{
      borderWidth: 1,
      borderColor: props.selected ? props.color : '#00000000',
      borderRadius: 4,
      aspectRatio: 1,
      width: '25%',
      padding: 2,
    }}>
    <View style={{ backgroundColor: props.color, width: '100%', height: '100%', borderRadius: 4 }} />
  </TouchableOpacity>
}

export function ExecutionButton(props: { image: ImageSourcePropType, onPress: () => void, tintColor?: string, disabled?: boolean, width?: string | number}) {
  const [press, setPress] = useState(false);

  const disabled = props.disabled || false;
  const tintColor = props.tintColor || '#000000';
  const color: string = (press || disabled) ? (tintColor + '50') : tintColor;
  const width = props.width ?? styles.buttonContainer.width;
  return (<TouchableOpacity
    style={{...styles.buttonContainer, width}}
    onPressIn={() => !disabled && setPress(true)}
    onPressOut={() => !disabled && setPress(false)}
    onPress={() => !disabled && props.onPress()}
    key={props.image.toString()}
  >
    <Image
      source={props.image}
      style={{ alignSelf: 'center', tintColor: color }}
    />
  </TouchableOpacity>)
}

declare interface ImageSelectableProps {
  image: ImageSourcePropType,
  selected: boolean,
  onPress: () => void,
  width: '25%' | '100%',
  key?: string
}

export function ImageSelectableButton(props: ImageSelectableProps) {
    const { image, selected, onPress, width } = props;
    const textColor = selected ? branColor : '#5D5D5D';
    return (<TouchableOpacity
      style={[styles.buttonContainer, { width }]}
      onPress={onPress}
    >
      <Image
        source={image}
        style={{ tintColor: textColor, alignSelf: 'center' }}
      />
    </TouchableOpacity>)
}

export function StrokeSlider(props: { width: number, onSlidingComplete: (width: number) => void }) {
  return <Slider
    minimumValue={1}
    maximumValue={20}
    value={props.width}
    containerStyle={{ width: '100%' }}
    thumbStyle={{ backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.2, shadowOffset: { width: 4, height: 4 } }}
    minimumTrackTintColor={branColor.toString()}
    onSlidingComplete={r => {
      if (typeof r == 'number') {
        props.onSlidingComplete(r);
      } else {
        if (r.length > 0) {
          props.onSlidingComplete(r[0]);
        }
      }
    }}
  />
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 44,
    width: 44,
    justifyContent: 'center',
  },
});