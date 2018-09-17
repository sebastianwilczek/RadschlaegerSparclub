import * as React from 'react';
import { AsyncStorage, StyleSheet, Alert, FlatList, TouchableOpacity, TextInput, View, TouchableHighlight, Modal } from 'react-native';
import { SparenModal } from './SparenModal';
import { FAB, Portal, Button, Text, Card, Title, Paragraph, Surface, Snackbar } from 'react-native-paper';

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
                            AsyncStorage.setItem("records", JSON.stringify([]));
                            this.setState({records: []});
                            this.setState({totalMoney: 0.0});
                            }}>Clear Storage</Button>
                    </View>
                );
        }
    }
}