import * as React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Button, Chip, Divider, Switch, Text, TextInput } from 'react-native-paper';
import { ToolbarModal } from './ToolbarModal';
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Keyboard } from 'react-native'
import * as AddCalendarEvent from 'react-native-add-calendar-event';

export class SparenModal extends React.Component {

    state = {
        saved: '',
        notSaved: false,
        date: new Date(),
        isDateTimePickerVisible: false,
        errorText: ''
    };
    
    constructor(props) {
        super(props);
        this.closeHandler = this.closeHandler.bind(this);
    }

    _showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
        Keyboard.dismiss();
    }

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ date: date });
        this._hideDateTimePicker();
    };

    _handleSaveClicked = () => {
        if(this.evaluateMoney()){

            //Add to calendar manually
            /* var eventConfig = {
                title: 'Title',
                //startDate: this.state.date.toUTCString(),
                //endDate: this.state.date.toUTCString(),
                allDay: true,
                notes: 'Gespart'
            };

            AddCalendarEvent.presentEventCreatingDialog(eventConfig)
                .then((eventInfo) => {
                    // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
                    // These are two different identifiers on iOS.
                    // On Android, where they are both equal and represent the event id, also strings.
                    // when { action: 'CANCELLED' } is returned, the dialog was dismissed
                    console.warn(JSON.stringify(eventInfo));
                })
                .catch((error) => {
                    // handle error such as when user rejected permissions
                    console.warn(error);
                }); */
        }

        
    };

    evaluateMoney = () => {
        var moneyRegex = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
        var isMoneyExpression = moneyRegex.test(this.state.saved);
        
        if(isMoneyExpression || this.state.notSaved){
            return true;
        }else{
            alert('Es wurde kein richtiger Betrag angegeben (Beispiel: 20.50).');
            return false;
        }
    }
     
    closeHandler(){
        this.props.closeHandler();
    }

    render() {
        return (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.modalVisible}
                onRequestClose={() => {
                    this.closeHandler();
                }}>
                <ToolbarModal closeHandler={this.closeHandler}/>
                <View>
                    {this.state.notSaved ? <View /> : 
                    <View>
                        <TextInput
                            label='Gespart (in Euro)'
                            value={this.state.saved}
                            placeholder='26.32'
                            keyboardType = 'numeric'
                            disabled={this.state.notSaved}
                            onChangeText={saved => this.setState({ saved })}
                            style={{
                                margin: 10,
                                marginTop: -15,
                                marginBottom: 0
                            }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'stretch',
                                margin: 10
                            }}
                        >
                            <Chip style={{flex: 1}} onPress={() => {this.setState({ saved: '2.00' })}}>€2</Chip>
                            <Chip style={{flex: 1}} onPress={() => {this.setState({ saved: '5.00' })}}>€5</Chip>
                            <Chip style={{flex: 1}} onPress={() => {this.setState({ saved: '10.00' })}}>€10</Chip>
                            <Chip style={{flex: 1}} onPress={() => {this.setState({ saved: '20.00' })}}>€20</Chip>
                            <Chip style={{flex: 1}} onPress={() => {this.setState({ saved: '50.00' })}}>€50</Chip>
                        </View>
                    </View>
                    }

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            margin: 10,
                            marginTop: this.state.notSaved ? 15 : 0,
                            marginBottom: 0
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                flex: 1
                            }}>Nicht gespart?</Text>
                        <Switch
                            value={this.state.notSaved}
                            onValueChange={() => {
                                this.setState({ notSaved: !this.state.notSaved });
                            }}
                            style={{
                                alignSelf: 'flex-end'
                            }}
                        />

                    </View>

                    <TextInput
                        label='Datum'
                        value={this.state.date.toDateString()}
                        keyboardType = 'numeric'
                        style={{
                            margin: 10,
                            marginTop: 0
                        }}
                        onFocus={this._showDateTimePicker}
                    />

                    <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                    />

                    <Button
                        raised
                        primary
                        style={{
                            margin: 10,
                            marginTop: 0
                        }}
                        onPress={() => this._handleSaveClicked()}
                    >
                        Sparen
                    </Button>
                </View>
            </Modal>
        );
    }
}