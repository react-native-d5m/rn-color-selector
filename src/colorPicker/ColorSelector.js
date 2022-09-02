import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    SectionList
} from 'react-native';
import PropTypes from 'prop-types';
import tinyColor from 'tinycolor2';
import AdvancedColorPicker from './AdvancedColorSelector';

const defaultColors = [
    {
        title: 'Defaults',
        data: [{
            colors: [
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
            ]
        }
        ]
    }
];

export default function ColorSelector(
    {
        containerStyle,
        colorsArray = defaultColors,
        initialColor,
        outputColor,
        shouldShowCancel,
        onPressCancel,
        titleStyle,
        onSelectColor,
        cancelTitle,
        useDefaultColors
    }
) {
    const [selectedColor, setSelectedColor] = React.useState('#c80000');
    const [
        shouldShowAdvancedColorPicker,
        setShouldShowAdvancedColorPicker
    ] = React.useState(false);

    const renderDefaultsCell = ({ item }) => {
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
                <View style={styles.body}>
                    {
                        item.colors.map((color) => {
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
            </View>
        );
    };

    const renderSectionHeader = (title) => {
        return (
            <Text style={[styles.title, titleStyle]}>
                {title}
            </Text>
        )
    }

    return (
        <View style={[styles.container, containerStyle]}>
            <SectionList
                style={{ width: '100%' }}
                sections={useDefaultColors && colorsArray !== defaultColors ? defaultColors.concat(colorsArray) : (useDefaultColors ? defaultColors : colorsArray)}
                scrollEnabled={!shouldShowAdvancedColorPicker}
                renderItem={renderDefaultsCell}
                keyExtractor={item => item.title}
                renderSectionHeader={({ section: { title } }) => renderSectionHeader(title)}
            />
            {
                shouldShowCancel && onPressCancel
                    ? <View style={styles.cancel}>
                        <TouchableOpacity
                            style={{
                                padding: 10,
                                paddingRight: 20,
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
    cancelTitle: PropTypes.string,
    useDefaultColors: PropTypes.bool
};

ColorSelector.defaultProps = {
    shouldShowCancel: true,
    title: 'Defaults',
    outputColor: () => { },
    onSelectColor: () => { },
    cancelTitle: 'Cancel',
    useDefaultColors: true
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
