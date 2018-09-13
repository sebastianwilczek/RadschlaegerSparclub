import * as React from 'react';
import { StyleSheet, Alert, AsyncStorage, TouchableOpacity, Text, TextInput, View, TouchableHighlight, Modal } from 'react-native';
import { SparenModal } from './SparenModal';
import { FABGroup } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

export class Navigation extends React.Component {

    
    state = {
        modalVisible: false,
        open: false
    };
    
    _showModal = () => {
        this.setState({ modalVisible: true });
        this.setState({ open: false });
    }
    _hideModal = () => {
        //alert('Modal has been closed.');   
        this.setState({ modalVisible: false });
        this.setState({ open: false });
    }

    render() {
        const { modalVisible } = this.state;

        switch (this.props.screen) {
            case 'main':
                return (
                    <View>
                        <FABGroup
                            open={this.state.open}
                            icon={'add'}
                            actions={[
                                // { icon: 'notifications', label: 'Remind', onPress: () => {} },
                            ]}
                            onStateChange={({ open }) => this.setState({ open })}
                            onPress={() => {
                                //if (this.state.open) {
                                    this._showModal();
                                //}
                            }}
                        />
                        
                        <Text>Hier wird eingetragen, was bisher gespart wurde.</Text>

                        <SparenModal modalVisible={this.state.modalVisible} closeHandler={this._hideModal}/>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text>Hier werden die Einstellungen angezeigt.</Text>
                    </View>
                );
        }
    }
}