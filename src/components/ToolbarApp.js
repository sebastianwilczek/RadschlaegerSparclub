import * as React from 'react';
import { Toolbar, ToolbarContent, ToolbarAction } from 'react-native-paper';

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
        <Toolbar>
            <ToolbarAction icon="menu" onPress={this.drawerHandler} />
            <ToolbarContent
                title="Radschläger Sparclub"
            />
        </Toolbar>
    );
  }
}