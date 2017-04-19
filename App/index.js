
/* @flow */

import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    StatusBar,
    View
} from 'react-native';
import Camera from 'react-native-camera';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a4a4a4',
        flexDirection: 'column',
    },
    preview: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100,
    },
    resultCol: {
        borderTopWidth: 1,
        borderColor: '#ffb300',
        padding: 12,
        flex: 1,
    },
    resultContainer: {
        height: 100,
        backgroundColor: '#494949',
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
    resultHeader: {
        color: '#a4a4a4',
        fontSize: 14,
        fontFamily: 'System',
    },
    resultText: {
        color: '#a4a4a4',
        fontSize: 18,
        fontFamily: 'System',
        padding: 6,
    },
});

type Props = {
    label: string;
    val: string | number;
}

class DisplayResults extends Component {
    props: Props;

    render() {
        const { label, val } = this.props;

        return (
            <View style={ styles.resultCol }>
                <Text style={ styles.resultHeader }>{ label }</Text>
                <Text style={ styles.resultText }>{ val }</Text>
            </View>
        );
    }
}


export default class BarCodeExplorer extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this._onBarCodeRead = this._onBarCodeRead.bind(this);

        this.state = {
            barCodeType: 'n/a',
            barCodeData: 'n/a'
        };
    }

    _onBarCodeRead(data, bounds) {
        /*
        * The Camera module returns a structure like this:
        *
            {
                type: 'org.gs1.EAN-13',
                data: '0302994805006',
                bounds: {
                    origin: {
                        x: '202.594635',
                        y: '260.403686'
                    },
                    size: {
                        width: '29.873206',
                        height: '163.196039'
                    }
                }
            }
        */
        const { type, data: value } = data;

        this.setState({
            barCodeType: type,
            barCodeData: value
        });
    }

    render() {
        const { barCodeType, barCodeData } = this.state;

        return (
            <View style={styles.container}>
                <StatusBar animated hidden />
                <Camera
                    ref={(cam) => { this.camera = cam; }}
                    style={ styles.preview }
                    aspect={ Camera.constants.Aspect.fill }
                    onBarCodeRead={ this._onBarCodeRead }
                    captureTarget={ Camera.constants.CaptureTarget.temp }
                    type={ Camera.constants.Type.back }
                    flashMode={ Camera.constants.FlashMode.off }
                    defaultTouchToFocus
                    mirrorImage={ false }
                />
                <View style={styles.resultContainer}>
                    <DisplayResults label='Barcode Type' val={ barCodeType } />
                    <DisplayResults label='Barcode Value' val={ barCodeData } />
                </View>
            </View>
        );
    }
}

