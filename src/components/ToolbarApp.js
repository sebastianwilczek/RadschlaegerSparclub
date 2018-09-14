import * as React from 'react';
import { Appbar } from 'react-native-paper';
import App from '../../App';

export class ToolbarApp extends React.Component {
    
    constructor(props) {
        super(props);
        this.drawerHandler = this.drawerHandler.bind(this);
    }
     
    drawerHandler(){
        this.props.drawerHandler();
    }

  render() {
    return (
        <Appbar.Header>
            <Appbar.Action icon="menu" onPress={this.drawerHandler} />
            <Appbar.Content
                title="Radschläger Sparclub"
            />
        </Appbar.Header>
    );
  }
}