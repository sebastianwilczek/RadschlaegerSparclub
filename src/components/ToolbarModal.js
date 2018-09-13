import * as React from 'react';
import { Toolbar, ToolbarContent, ToolbarBackAction } from 'react-native-paper';

export class ToolbarModal extends React.Component {
    
    constructor(props) {
        super(props);
        this.closeHandler = this.closeHandler.bind(this);
    }
     
    closeHandler(){
        this.props.closeHandler();
    }

    render() {
        return (
            <Toolbar>
                <ToolbarBackAction
                    onPress={this.closeHandler}
                />
                <ToolbarContent
                    title="Sparen"
                />
                {/* <ToolbarAction icon="close" onPress={this.closeHandler} /> */}
            </Toolbar>
        );
    }
}