import * as React from 'react';
import {  Button, StyleSheet, View } from 'react-native';
import { WhiteRoom } from './components/Room';
import { WhitePlayer } from './components/Player';
import { MAX_SPLICE_SIZE } from 'mobx/dist/internal';

export default function App() {
  const [showRoom, setShowRoom] = React.useState<Boolean>(false);
  const [showPlayer, setShowPlayer] = React.useState<Boolean>(false);

  return (
    <View style={styles.whiteboardContainer}>
      {(!showRoom && !showPlayer) &&
        <View style={styles.buttonContainer}>
          <Button title='Live Room' onPress={() => setShowRoom(!showRoom)}></Button>
          <Button title='Player' onPress={() => setShowPlayer(!showPlayer)}></Button>
        </View>
      }
            
      { showPlayer && <WhitePlayer leaveHandler={()=>setShowPlayer(false)}/>}
      {showRoom && <WhiteRoom/>}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteboardContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    // justifyContent: 'center',
    // alignItems: 'flex-end',
    paddingVertical: '5%'
  },
});

