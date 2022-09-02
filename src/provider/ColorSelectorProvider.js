import React from 'react';
import PropTypes from 'prop-types';
import ColorSelector from '../colorPicker/ColorSelector';

export const ColorSelectorContext = React.createContext({
    outputColor: () => { },
    onPressColor: () => { }
});

export default function ColorSelectorProvider(props) {
    const [
        shouldShowColorPicker,
        setShouldShowColorPicker
    ] = React.useState(false);
    const [
        colorPickerState,
        setColorPickerState
    ] = React.useState(null);

    const setShowColorPicker = (value) => {
        setShouldShowColorPicker(true);
        setColorPickerState(value);
    };

    const onPressColor = (hexColor) => {
        if (colorPickerState &&  colorPickerState.onPressColor) {
            colorPickerState.onPressColor(hexColor);
        }
        setShouldShowColorPicker(false);
    };

    return (
        <ColorSelectorContext.Provider
            value={setShowColorPicker}
        >
            {props.children}
            {
                shouldShowColorPicker
                    ? <ColorSelector
                        containerStyle={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: 50
                        }}
                        onPressCancel={
                            () => setShouldShowColorPicker(false)
                        }
                        onSelectColor={(color) => {
                            onPressColor(color);
                        }}
                        outputColor={(color) => {
                            if (colorPickerState && colorPickerState.outputColor) {
                                colorPickerState.outputColor(color);
                            }
                        }}
                    />
                    : null
            }
        </ColorSelectorContext.Provider>
    );
}

export const useColorSelector = (props) => {
    const colorSelector = React.useContext(ColorSelectorContext);
    return colorSelector;
};

ColorSelectorProvider.propTypes = {

};
