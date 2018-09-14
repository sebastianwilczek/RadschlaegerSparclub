import * as React from 'react';
import { Appbar } from 'react-native-paper';

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
            <Appbar.Header>
                <Appbar.BackAction
                    onPress={this.closeHandler}
                />
                <Appbar.Content
                    title="Sparen"
                />
                {/* <ToolbarAction icon="close" onPress={this.closeHandler} /> */}
            </Appbar.Header>
        );
    }
}