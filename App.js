import React, {Component} from 'react';
//import { DrawerLayoutAndroid, View } from 'react-native';
//import DrawerItem, { Divider, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { DrawerLayoutAndroid, StatusBar, View } from 'react-native';
import { DefaultTheme, Divider, Drawer, Provider as PaperProvider } from 'react-native-paper';
import { Navigation } from './src/components/Navigation';
import { ToolbarApp } from './src/components/ToolbarApp';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#009733',
    accent: '#009733',
  },
};

export default class App extends Component {

  state = {
    screen: 'main'
  };

  _openDrawer = () => this.refs['DRAWER_REF'].openDrawer();

  render() {
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Drawer.Item label="Sparen" active={this.state.screen=='main'} onPress={() => {this.setState({ screen: 'main' }); this.refs['DRAWER_REF'].closeDrawer();}}/>
        <Divider />
        <Drawer.Item label="Einstellungen" active={this.state.screen=='settings'}  onPress={() => {this.setState({ screen: 'settings' }); this.refs['DRAWER_REF'].closeDrawer();}}/>
      </View>
    );


    return (
      <PaperProvider theme={theme}>
        <StatusBar
          backgroundColor="#007a29"
          barStyle="light-content"
        />

        <DrawerLayoutAndroid
          drawerWidth={250}
          drawerPosition={DrawerLayoutAndroid.positions.Left}
          ref={'DRAWER_REF'}
          renderNavigationView={() => navigationView}>

          <ToolbarApp drawerHandler={this._openDrawer} />

          <Navigation
            screen={this.state.screen}
            drawerHandler={this._openDrawer} />
            
        </DrawerLayoutAndroid>

            {/* <FABGroup
              open={this.state.open}
              icon={this.state.open ? 'today' : 'add'}
              actions={[
                { icon: 'add', onPress: () => {} },
                { icon: 'star', label: 'Star', onPress: () => {} },
                { icon: 'email', label: 'Email', onPress: () => {} },
                { icon: 'notifications', label: 'Remind', onPress: () => {} },
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
            />

        <Dialog
           visible={dialogVisible}
           onDismiss={this._hideDialog}
        >
          <Dialog.Title>Alert</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This feature has not yet been implemented.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={this._hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>  */}

      </PaperProvider>
    );
  }
}
