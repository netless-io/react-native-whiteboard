import { shift, useFloating } from '@floating-ui/react-native';
import { Slider } from '@miblanchard/react-native-slider';
import type { Appliance, ApplianceShape } from '@netless/whiteboard-bridge-types';
import React, { useState } from 'react';

import {
  StyleSheet,
  Image,
  View,
  ImageSourcePropType,
  PixelRatio,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useStore } from 'zustand';
import { imageSources } from './Images';
import type { WBStoreInstance } from './WBStore';
import { branColor, defaultColors, isShape } from './WhiteboardConfig';

let wbStore: WBStoreInstance

function ColorButton(props: { color: string }) {
return <TouchableOpacity
      onPress={()=>wbStore.getState().setColor(props.color)}
      style={{ 
        borderWidth: 1, 
        borderColor: (wbStore(s => s.color) === props.color) ? props.color : '#00000000', 
        borderRadius: 4, 
        aspectRatio: 1, 
        width: '25%', 
        padding: 2,
      }}>
      <View style={{ backgroundColor: props.color, width: '100%', height: '100%', borderRadius: 4}} />
    </TouchableOpacity>
}

function ExecutionButton(props: { image: ImageSourcePropType, tintColor: string, onClick: ()=>void}) {
  const [press, setPress] = useState(false);

  const color: string = press ? (props.tintColor + '50') : props.tintColor;
  return (<TouchableOpacity
    style={[styles.buttonContainer, {width: '100%'}]}
    onPressIn={()=>setPress(true)}
    onPressOut={()=>setPress(false)}
    onPress={props.onClick}
    key={props.image.toString()}
  >
    <Image
      source={props.image}
      style={{alignSelf: 'center', tintColor: color}}
    />
  </TouchableOpacity>)
}

function ImageSelectableButton(props: { image: ImageSourcePropType, selected: boolean, onClick: () => void, width: '25%' | '100%'}) {
  const textColor = props.selected ? branColor : '#5D5D5D';
  return (<TouchableOpacity
        style={[styles.buttonContainer, {width: props.width}]}
        onPress={props.onClick}
        key={props.image.toString()}
      >
        <Image
          source={props.image}
          style={{tintColor: textColor, alignSelf: 'center'}}
        />
      </TouchableOpacity>)
}

function StrokeSlider(props:{width: number}) {
  return <Slider
  minimumValue={1}
  maximumValue={20}
  value={props.width}
  containerStyle={{ width: '100%' }}
  thumbStyle={{ backgroundColor: 'white', shadowColor: 'black', shadowOpacity: 0.2, shadowOffset: { width: 4, height: 4 } }}
  minimumTrackTintColor={branColor.toString()}
  onSlidingComplete={v => {
    wbStore.getState().setStrokeWidth(v);
  }}
  />
}

function SubPanelSelectableApplianceButton(props: {
  appliance: Appliance,
  shape?: ApplianceShape
}) {
  const key = props.shape ? props.shape : props.appliance;
  const appliance = useStore(wbStore).appliance;
  const shape = useStore(wbStore).shape;
  let selected: boolean
  if (props.shape) {
    selected = shape === props.shape;
  } else {
    selected = appliance === props.appliance;
  }
  return ImageSelectableButton({
    image: imageSources[key],
    selected: selected,
    onClick: () => {
      if (props.shape) {
        wbStore.getState().setShape(props.shape);
      } else {
        wbStore.getState().setAppliance(props.appliance);
      }
    },
    width: '25%',
  })
}

function SingleSelectableApplianceButton(props: {appliance: Appliance, shape?: ApplianceShape }) {
  const appliance = wbStore(s => s.appliance);
  const shape = wbStore(s => s.shape);
  let selected: boolean
  if (props.shape) {
    selected = shape == props.shape
  } else {
    selected = appliance == props.appliance;
  }
  const key = props.shape ? props.shape : props.appliance;
  return ImageSelectableButton({
    image: imageSources[key],
    selected: selected,
    onClick: () => {
      if (props.shape) {
        wbStore.getState().setShape(props.shape);
      } else {
        wbStore.getState().setAppliance(props.appliance);
      }
    },
    width: '100%'
  })
}

function PencilButton() {
  const pencilStr = 'pencil';
  const selected = wbStore(s => s.appliance) == pencilStr;
  return <View style={{ width: '100%' }}>
    {ImageSelectableButton({
      image: imageSources[pencilStr],
      selected: selected,
      onClick: () => {
        wbStore.getState().setAppliance(pencilStr);
      },
      width: '100%'
    })}
    <View
      style={[styles.subPanel, { display: useStore(wbStore).showPencilPanel ? 'flex' : 'none', }]}
    >
      <StrokeSlider width={wbStore(s=>s.strokeWidth)}/>
      {defaultColors.map(c => <ColorButton color={c} key={c.toString()} />)}
    </View>
  </View>
}

function ShapesButton() {
  const shapes: {
    appliance: Appliance,
    shape?: ApplianceShape
  }[] = [
    {appliance: 'rectangle'},
    {appliance: 'ellipse'},
    {appliance: 'straight'},
    {appliance: 'arrow'},
    {appliance: 'shape', shape: 'pentagram'},
    {appliance: 'shape', shape: 'rhombus'},
    {appliance: 'shape', shape: 'speechBalloon'},
    {appliance: 'shape', shape: 'triangle'}
  ]
  const current = wbStore(s => s.appliance);
  const currenShape = wbStore(s => s.shape);
  let display: {appliance: Appliance, shape?: ApplianceShape}
  if (isShape(current)) {
    display = {appliance: current, shape: currenShape}
  } else {
    display = {appliance: 'rectangle'}
  }
  return <View style={{ width: '100%' }}>
    <SingleSelectableApplianceButton appliance={display.appliance} shape={display.shape} />
    <View
      style={[styles.subPanel, { display: useStore(wbStore).showShapePanel ? 'flex' : 'none', }]}
    >
      {shapes.map(s => SubPanelSelectableApplianceButton(s))}
      <StrokeSlider width={wbStore(s=>s.strokeWidth)}/>
      {defaultColors.map(c => <ColorButton color={c} key={c.toString()}/>)}
    </View>
  </View>
}

export function Panel(props: {style: StyleProp<ViewStyle>, store: WBStoreInstance}) {
    wbStore = props.store;
    const floating = useFloating({
        placement: 'top',
        middleware: [shift()],
      });
                  {/* <View style={{backgroundColor: 'red'}}}> */}
            // ref={floating.floating} style=
            {/* <DeleteButton ></DeleteButton> */}
            // </View>

      // <TouchableOpacity onPressIn={()=>wbStore.getState().hideAllSubPanel()} style={{width: '100%', height: '100%'}}>
      //   </TouchableOpacity>
      return (
          <View style={props.style}>
              <View 
              ref={floating.floating} 
              style={{...styles.controlBar, width: '100%', top: floating.y - 10, left: floating.x, position: 'absolute', display: wbStore(s=>s.showDelete) ? 'flex' : 'none'}
              }>
                <ExecutionButton tintColor={'#ff0000'} image={imageSources.delete} onClick={() => wbStore.getState().delete()}></ExecutionButton>
              </View>
              <View ref={floating.reference} style={styles.controlBar}>
                <SingleSelectableApplianceButton appliance={'clicker'} />
                <SingleSelectableApplianceButton appliance={'selector'} />
                <PencilButton/>
                <SingleSelectableApplianceButton appliance={'text'} />
                <SingleSelectableApplianceButton appliance={'eraser'} />
                <ShapesButton />
                <ExecutionButton tintColor={'#5D5D5D'} image={imageSources.clean} onClick={()=>wbStore.getState().clean()}/>
              </View>
          </View>
      );
}

const styles = StyleSheet.create({
    addOnControlBar: {
      alignItems: 'center',
      backgroundColor: '#000',
      borderWidth: 1 / PixelRatio.get(),
      borderColor: '#ccc',
      borderRadius: 4,
    },
    controlBar: {
      alignItems: 'center',
      borderWidth: 1 / PixelRatio.get(),
      borderColor: '#ccc',
      borderRadius: 4,
      backgroundColor: 'white',
    },
    buttonContainer: {
      height: 44,
      justifyContent: 'center',
    },
    subPanel: {
      borderWidth: 1 / PixelRatio.get(),
      borderColor: '#ccc',
      borderRadius: 4,
      backgroundColor: '#eee', width: 144,
      position: 'absolute', top: 0, left: 54,
      padding: 6,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 4, height: 4 },
    },
  });