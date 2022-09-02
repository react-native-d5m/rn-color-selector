import React from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import PropTypes from 'prop-types';
import tinyColor from 'tinycolor2';
import AdvancedColorPicker from './AdvancedColorSelector';

const defaultColors = [
    'rainbow',
    'red',
    'orange',
    '#ffd600',
    '#89bc41',
    'blue',
    'purple',
    'brown',
    'magenta',
    'tan',
    'cyan',
    'olive',
    'maroon',
    'navy',
    'aquamarine',
    'turquoise',
    'silver',
    'lime',
    'indigo',
    'violet',
    'pink',
    'black',
    'grey',
    'white'
];

export default function ColorSelector(
    {
        containerStyle,
        colorsArray = defaultColors,
        initialColor,
        outputColor,
        shouldShowCancel,
        onPressCancel,
        title,
        titleStyle,
        onSelectColor,
        cancelTitle
    }
) {
    const [selectedColor, setSelectedColor] = React.useState('#c80000');
    const [
        shouldShowAdvancedColorPicker,
        setShouldShowAdvancedColorPicker
    ] = React.useState(false);

    const renderDefaultsCell = () => {
        if (shouldShowAdvancedColorPicker) {
            return (
                <AdvancedColorPicker
                    key={'advanced'}
                    initialColor={initialColor || selectedColor}
                    onPressDone={(hexColor) => {
                        setShouldShowAdvancedColorPicker(false);
                        setSelectedColor(hexColor);
                        outputColor(hexColor);
                        onSelectColor(hexColor);
                    }}
                    outputColor={(hexColor) => {
                        setSelectedColor(hexColor);
                        outputColor(hexColor);
                    }}
                />
            );
        }
        return (
            <View key={'defaults'} style={styles.colorSelectorContainer}>
                {
                    title
                        ? <Text style={[styles.title, titleStyle]}>
                            {title}
                        </Text>
                        : null}
                <View style={styles.body}>
                    {
                        colorsArray.map((color) => {
                            if (color === 'rainbow') {
                                return (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => {
                                            setShouldShowAdvancedColorPicker(true);
                                        }}
                                        style={[styles.button, { backgroundColor: color }]}>
                                        <Image
                                            source={require('../../assets/color-wheel.png')}
                                            resizeMode={'contain'}
                                            style={{ height: '100%', width: '100%' }}
                                        />
                                    </TouchableOpacity>
                                );
                            }
                            return (
                                <TouchableOpacity
                                    key={color}
                                    onPress={async () => {
                                        setSelectedColor(`#${tinyColor(color).toHex()}`);
                                        outputColor(`#${tinyColor(color).toHex()}`);
                                        onSelectColor(`#${tinyColor(color).toHex()}`);
                                    }}
                                    style={[
                                        styles.button,
                                        {
                                            backgroundColor: color,
                                            borderWidth: color === 'white' ? 1 : 0,
                                            borderColor: 'grey'
                                        }
                                    ]}
                                />
                            );
                        })
                    }
                </View>
                {
                    shouldShowCancel && onPressCancel
                        ? <View style={styles.cancel}>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    alignItems: 'center'
                                }}
                                onPress={() => onPressCancel()}>
                                <Text style={{
                                    fontSize: 16,
                                    color: 'grey'
                                }}>{cancelTitle}</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
        );
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <FlatList
                data={[{ key: 'defaults' }]}
                scrollEnabled={!shouldShowAdvancedColorPicker}
                renderItem={renderDefaultsCell}
                keyExtractor={item => item.key}
            />
        </View>
    );
}

ColorSelector.propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
    containerStyle: PropTypes.object,
    colorSelectorContainer: PropTypes.object,
    colorsArray: PropTypes.array,
    initialColor: PropTypes.string,
    outputColor: PropTypes.func,
    shouldShowCancel: PropTypes.bool,
    onPressCancel: PropTypes.func,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    onSelectColor: PropTypes.func,
    cancelTitle: PropTypes.string
};

ColorSelector.defaultProps = {
    shouldShowCancel: true,
    title: 'Defaults',
    outputColor: () => { },
    onSelectColor: () => { },
    cancelTitle: 'Cancel'
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    colorSelectorContainer: {
        width: '100%',
        backgroundColor: 'transparent'
    },
    title: {
        width: '100%',
        color: 'grey',
        padding: 5,
        marginTop: 10,
        paddingLeft: 10
    },
    body: {
        flexDirection: 'row',
        width: '100%',
        padding: 10,
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    button: {
        height: 40,
        width: 40,
        borderRadius: 5,
        margin: 5
    },
    cancel: {
        width: '100%',
        alignItems: 'flex-end'
    }

});
