import * as React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Button, Chip, Divider, Switch, Text, TextInput, Portal, HelperText } from 'react-native-paper';
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
        errorVisible: false,
        savedMoney: 0.0
    };
    
    constructor(props) {
        super(props);
        this.closeHandler = this.closeHandler.bind(this);
        this.saveHandler = this.saveHandler.bind(this);
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
        var money = this.state.saved;

        if(this.state.notSaved){
            this.setState({ saved: '-0.50' });
            money = '-0.50'
        }

        var moneyRegex = /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/;
        var isMoneyExpression = moneyRegex.test(money);
        
        if(isMoneyExpression || this.state.notSaved){
            var moneyValue = +(money);

            //alert("Betrag: €" + moneyValue.toFixed(2) + "\nDatum: " + this.state.date);
            this.saveHandler(moneyValue, this.state.date);
        }else{
            //alert('Es wurde kein richtiger Betrag angegeben (Beispiel: 20.50).');
            this.setState({errorVisible: true});
            return;
        }

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
    };
     
    closeHandler(){
        this.setState({errorVisible: true});
        this.props.closeHandler();
    }
     
    saveHandler(money, date){
        this.setState({errorVisible: false});
        this.props.saveHandler(money, date);
    }

    render() {
        return (
            <Portal>
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
                                    margin: 10
                                }}
                            />
                            {this.state.errorVisible ?
                                <HelperText
                                    type="error"
                                    visible={this.state.errorVisible}
                                >Es wurde kein richtiger Betrag angegeben (Beispiel: 20.50).</HelperText>
                            : <View /> }

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'stretch',
                                    margin: 5
                                }}
                            >
                                <Chip icon='euro-symbol' style={{flex: 1, margin: 5}} onPress={() => {this.setState({ saved: '2.00' })}}>2</Chip>
                                <Chip icon='euro-symbol' style={{flex: 1, margin: 5}} onPress={() => {this.setState({ saved: '5.00' })}}>5</Chip>
                                <Chip icon='euro-symbol' style={{flex: 1, margin: 5}} onPress={() => {this.setState({ saved: '10.00' })}}>10</Chip>
                                <Chip icon='euro-symbol' style={{flex: 1, margin: 5}} onPress={() => {this.setState({ saved: '20.00' })}}>20</Chip>
                                <Chip icon='euro-symbol' style={{flex: 1, margin: 5}} onPress={() => {this.setState({ saved: '50.00' })}}>50</Chip>
                            </View>
                        </View>
                        }

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 10,
                                marginTop: this.state.notSaved ? 15 : 0
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
                                    var newState = !this.state.notSaved
                                    this.setState({ notSaved: newState });
                                    if(!newState){
                                        this.setState({ saved: ''});
                                    }
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
                            mode="contained"
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
            </Portal>
            
        );
    }
}