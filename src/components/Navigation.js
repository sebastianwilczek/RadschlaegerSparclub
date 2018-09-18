import * as React from 'react';
import { AsyncStorage, StyleSheet, Alert, FlatList, TouchableOpacity, TextInput, View, TouchableHighlight, Modal } from 'react-native';
import { SparenModal } from './SparenModal';
import { FAB, Portal, Button, Text, Card, Title, Paragraph, Surface, Snackbar } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';

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

function formatDate(dateString) {
    var date = new Date(dateString);

    var monthNames = [
        "Januar", "Februar", "März",
        "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober",
        "November", "Dezember"
    ];
    

    return ('0' + date.getDate()).slice(-2) + '. ' + monthNames[date.getMonth()] + ' ' +  date.getFullYear();
}

export class Navigation extends React.Component {

    
    state = {
        modalVisible: false,
        open: false,
        records: [],
        totalMoney: 0.0,
        snackVisible: false
    };

    constructor(props){
        _onNotification = (notif) => {
            //Alert.alert(notif.title, notif.message);
            if(notif.tag === "reminder"){
                this._showModal();
            }
        }

        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: _onNotification, //this._onNotification
      
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true
        });
        super();
    }
    _showModal = () => {
        this.setState({ modalVisible: true });
        this.setState({ open: false });
    }
    _hideModal = () => {
        //alert('Modal has been closed.');   
        this.setState({ modalVisible: false });
        this.setState({ open: false });
    }
    _save = (money, date) => {
        //alert('Modal has been closed.');   
        this.setState({ modalVisible: false });
        this.setState({ open: false });
        this.setState({snackVisible: true});
        var record = {money: money, date: date.toString()};
        this.state.records.unshift(record);
        this.state.records.sort(function(a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a > b ? -1 : a < b ? 1 : 0;
        });
        this._recomputeSavedMoney();
        this._storeRecords();
    }
    _deleteRecord = (index) => {

        this.state.records.splice(index, 1);
        this._recomputeSavedMoney();
        this._storeRecords();
    }
    _storeRecords = async () => {
        try {
            await AsyncStorage.setItem("records", JSON.stringify(this.state.records));
        } catch (error) {
            alert("Beträge konnten nicht gespeichert werden." + error)
        }
    }
    _retrieveRecords = async () => {
        try {
            const value = await AsyncStorage.getItem('records');
            if (value !== null) {
                this.setState({records: JSON.parse(value)}, () => {this._recomputeSavedMoney()});
            }
        } catch (error) {
            this.setState({records: []});
        }
    }
    _recomputeSavedMoney = () => {
        var total = 0.0;
        for (var i = 0; i < this.state.records.length; i++) {
            total += this.state.records[i].money;
        }
        this.setState({totalMoney: total});
    }

    componentDidMount() {
        this._retrieveRecords();
    }

    

    renderFlatListItem(item, index){
        return (
            <Surface style={{elevation: 12, padding: 8}}>
                <Card>
                    <Card.Content>
                        <Title>{"€" + (item.money).toFixed(2)}</Title>
                        <Paragraph>{formatDate(item.date)}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            style={{
                                alignSelf: 'flex-end'
                                }}
                            onPress={() => this._deleteRecord(index)}>Löschen</Button>
                    </Card.Actions>
                </Card>
            </Surface>
        )
    }

    keyExtractor = (item, index) => item.date;

    render() {
        switch (this.props.screen) {
            case 'main':
                return (
                    <View>
                        <Portal>
                            <FAB.Group
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

                            <Snackbar
                                visible={this.state.snackVisible}
                                onDismiss={() => this.setState({ snackVisible: false })}
                                >
                                Betrag wurde gespart!
                            </Snackbar>
                        </Portal>
                        
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: 10
                            }}>
                            <Text style={{fontSize: 40}}>Total: €{this.state.totalMoney.toFixed(2)}</Text>
                        </View>
                        {/* <Text>{JSON.stringify(this.state.records)}</Text> */}

                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'stretch',
                                margin: 10
                            }}>
                            <FlatList
                                contentContainerStyle={{ paddingBottom: 220}}
                                data={this.state.records}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({item, index}) => this.renderFlatListItem(item, index)}
                            />
                        </View>

                        <SparenModal modalVisible={this.state.modalVisible} closeHandler={this._hideModal} saveHandler={this._save}/>
                    </View>
                );
            default:
                return (
                    <View>
                        <Text>Hier werden die Einstellungen angezeigt.</Text>
                        <Button onPress={() => {
                            var date = new Date(Date.now());
                            var dateNextFriday = new Date(+date+(7-(date.getDay()+4)%7)*86400000); //2 for Friday, 4 for Wednesday
                            PushNotification.localNotificationSchedule({
                                /* Android Only Properties */
                                autoCancel: true, // (optional) default: true
                                largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                                smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                                //bigText: "Big Text", // (optional) default: "message" prop
                                //subText: "SubText", // (optional) default: none
                                color: "green", // (optional) default: system default
                                vibrate: true, // (optional) default: true
                                vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                                tag: 'reminder', // (optional) add tag to message
                                group: "sparclub", // (optional) add group to message
                          
                                /* iOS and Android properties */
                                title: "Denk ans Sparen!", // (optional)
                                message: "Du wolltest daran errinnert werden zu sparen.", // (required)
                                //actions: '["Jetzt Sparen"]',  // (Android only) See the doc for notification actions to know more
                                date: new Date(dateNextFriday.getFullYear(), dateNextFriday.getMonth(), dateNextFriday.getDate(), 17, 0, 0),
                                repeatType: "day"
                              });
                              Alert.alert(dateNextFriday.getFullYear() + " " + dateNextFriday.getMonth() + " " + dateNextFriday.getDate() + " " + 17 + " " + 0 + " " + 0);
                            }}
                        >Send Push Reminder</Button>
                        <Button onPress={() => {
                            PushNotification.localNotification({
                                /* Android Only Properties */
                                autoCancel: true, // (optional) default: true
                                largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
                                smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
                                //bigText: "Big Text", // (optional) default: "message" prop
                                //subText: "SubText", // (optional) default: none
                                color: "green", // (optional) default: system default
                                vibrate: true, // (optional) default: true
                                vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                                tag: 'forgotten', // (optional) add tag to message
                                group: "sparclub", // (optional) add group to message
                          
                                /* iOS and Android properties */
                                title: "Du hast das Sparen vergessen!", // (optional)
                                message: "Ich habe eingetragen, dass du vergessen hast zu sparen.", // (required)
                                //actions: '["Ansehen"]',  // (Android only) See the doc for notification actions to know more
                              });
                            }}
                        >Send Push Forgotten</Button>
                    </View>
                );
        }
    }
}