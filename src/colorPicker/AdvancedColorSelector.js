import React from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  PanResponder,
  Animated,
  Text,
  StyleSheet
} from 'react-native';
import tinycolor from 'tinycolor2';
import { HueSlider } from '../react-native-color';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

const Window = Dimensions.get('window');

export default class AdvancedColorSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: tinycolor(this.props.initialColor).toRgb(),
      colorPreview: tinycolor(this.props.initialColor).toRgbString(),
      text: `${tinycolor(this.props.initialColor).toHex()}`
    };

    this.pan = new Animated.ValueXY({ x: 0, y: 0 });
    this.offset = { x: 0, y: 0 };
    this.saturateAnim = new Animated.Value(0);
    this.saturate = this.saturateAnim.interpolate({
      inputRange: [0, Window.width],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });
    this.lightnessAnim = new Animated.Value(0);
    this.lightness = this.lightnessAnim.interpolate({
      inputRange: [0, this.props.height],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    this.loadPanResponder();
  }

  loadPanResponder() {
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        this.pan.setOffset(this.offset);
        this.pan.setValue({
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY
        });
        this.saturateAnim.setValue(e.nativeEvent.locationX);
        this.lightnessAnim.setValue(e.nativeEvent.locationY);
        const white = this.rgba2rgb(
          this.state.backgroundColor,
          {
            r: 255, g: 255, b: 255, a: this.saturate.__getValue()
          }
        );
        const black = this.rgba2rgb(
          white,
          {
            r: 0,
            g: 0,
            b: 0,
            a: this.lightness.__getValue()
          }
        );
        this.setState({
          colorPreview: `rgb(${black.r}, ${black.g}, ${black.b})`,
          text: `${tinycolor(black).toHex()}`
        });
        this.props.outputColor(
          `#${tinycolor(`rgb(${tinycolor(this.state.text).toRgb().r}, ${tinycolor(this.state.text).toRgb().g}, ${tinycolor(this.state.text).toRgb().b})`).toHex()}`
        );
      },
      onPanResponderMove: (e) => {
        if (e.nativeEvent.locationX > 0 &&
          e.nativeEvent.locationX < Window.width &&
          e.nativeEvent.locationY > 0 &&
          e.nativeEvent.locationY < this.props.height
        ) {
          this.pan.setValue(
            {
              x: e.nativeEvent.locationX,
              y: e.nativeEvent.locationY
            }
          );
          this.saturateAnim.setValue(e.nativeEvent.locationX);
          this.lightnessAnim.setValue(e.nativeEvent.locationY);
          const white = this.rgba2rgb(
            this.state.backgroundColor,
            {
              r: 255,
              g: 255,
              b: 255,
              a: this.saturate.__getValue()
            }
          );
          const black = this.rgba2rgb(
            white,
            {
              r: 0,
              g: 0,
              b: 0,
              a: this.lightness.__getValue()
            }
          );
          this.setState({
            colorPreview: `rgb(${black.r}, ${black.g}, ${black.b})`,
            text: `${tinycolor(black).toHex()}`
          });

          this.props.outputColor(
            `#${tinycolor(`rgb(${tinycolor(this.state.text).toRgb().r}, ${tinycolor(this.state.text).toRgb().g}, ${tinycolor(this.state.text).toRgb().b})`).toHex()}`
          );
        }
      },
      onPanResponderRelease: (e) => {
        if (e.nativeEvent.locationX > 0 &&
          e.nativeEvent.locationX < Window.width &&
          e.nativeEvent.locationY > 0 &&
          e.nativeEvent.locationY > this.props.height
        ) {
          this.offset = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY
          };
        }
      },
      onPanResponderTerminate: (e) => {
        if (e.nativeEvent.locationX > 0 &&
          e.nativeEvent.locationX < Window.width &&
          e.nativeEvent.locationY > 0 &&
          e.nativeEvent.locationY > this.props.height
        ) {
          this.offset = {
            x: e.nativeEvent.locationX,
            y: e.nativeEvent.locationY
          };
        }
      }
    });
  }

  rgba2rgb(rgbBackground, rgbaColor) {
    const alpha = rgbaColor.a;
    return {
      r: (1 - alpha) * rgbBackground.r + alpha * rgbaColor.r,
      g: (1 - alpha) * rgbBackground.g + alpha * rgbaColor.g,
      b: (1 - alpha) * rgbBackground.b + alpha * rgbaColor.b
    };
  }

  onChangeText = (text) => {
    this.setState({ text });
    if (tinycolor(text).isValid()) {
      this.setState({
        backgroundColor: tinycolor(text).toRgb()
      });
      this.props.outputColor(
        `#${tinycolor(`rgb(${tinycolor(text).toRgb().r}, ${tinycolor(text).toRgb().g}, ${tinycolor(text).toRgb().b})`).toHex()}`
      );
    }
  };

  render() {
    return (
      <LinearGradient colors={['white', 'white']}
        style={[styles.container, this.props.containerStyle]}
      >
        <View>
          <View
            {...this.panResponder.panHandlers}
            style={[
              {
                height: 150,
                width: Window.width,
                backgroundColor: `rgb(${this.state.backgroundColor.r},${this.state.backgroundColor.g},${this.state.backgroundColor.b})`
              },
              this.props.colorPadStyle,
              { height: this.props.height }
            ]}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={
                [
                  'rgba(255, 255, 255, 1)',
                  'rgba(255, 255, 255, 0)'
                ]
              } style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={
                [
                  'rgba(255, 255, 255, 0)',
                  'rgba(0,0,0,1)'
                ]}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View
            style={[styles.touch, {
              top: this.pan.y._value - 10,
              left: this.pan.x._value - 10
            }]}
          />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: '100%',
          height: 100,
          alignItems: 'center'
        }}>
          <HueSlider
            style={{ width: '70%' }}
            gradientSteps={Window.width}
            value={tinycolor(this.state.backgroundColor).toHsl().h}
            onValueChange={(hue) => {
              this.props.outputColor(
                `#${tinycolor(`rgb(${tinycolor(`hsl(${hue}, 100%, 50%)`).toRgb().r}, ${tinycolor(`hsl(${hue}, 100%, 50%)`).toRgb().g}, ${tinycolor(`hsl(${hue}, 100%, 50%)`).toRgb().b})`).toHex()}`
              );
              this.setState(
                {
                  backgroundColor: tinycolor(`hsl(${hue}, 100%, 50%)`).toRgb(),
                  colorPreview: tinycolor(`hsl(${hue}, 100%, 50%)`).toRgbString(),
                  text: `${tinycolor(`hsl(${hue}, 100%, 50%)`).toHex()}`
                }
              );
            }}
          />
          <TextInput
            style={{
              backgroundColor: tinycolor(this.state.text).isValid()
                ? `#${tinycolor(this.state.text).toHex()}`
                : 'red',
              width: '20%',
              height: 30,
              textAlign: 'center',
              color: tinycolor(this.state.text).isLight()
                ? 'black'
                : "white",
              fontWeight: 'bold'
            }}
            value={`#${this.state.text}`}
            onFocus={this.props.onTextFocus}
            onChangeText={(text) => this.onChangeText(text)}
            onEndEditing={this.props.onEndEditing}
            returnKeyType={'done'}
          />
        </View>
        {
          this.props.shouldShowDone && this.props.onPressDone
            ? <View style={{ width: '100%', alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={{ padding: 10 }}
                onPress={
                  () => {
                    this.props.onPressDone(`#${tinycolor(this.state.text).toHex()}`);
                  }
                }>
                <Text style={
                  {
                    marginRight: 20,
                    fontSize: 16,
                    color: 'grey'
                  }}>
                  {this.props.doneTitle}
                </Text>
              </TouchableOpacity>
            </View>
            : null
        }
      </LinearGradient>
    );
  }
}

AdvancedColorSelector.propTypes = {
  outputColor: PropTypes.func,
  initialColor: PropTypes.string,
  height: PropTypes.number,
  onPressDone: PropTypes.func,
  onTextFocus: PropTypes.func,
  onEndEditing: PropTypes.func,
  containerStyle: PropTypes.object,
  colorPadStyle: PropTypes.object,
  doneTitle: PropTypes.string,
  shouldShowDone: PropTypes.bool
};

AdvancedColorSelector.defaultProps = {
  initialColor: "#c80000",
  outputColor: () => { },
  onTextFocus: () => { },
  onEndEditing: () => { },
  height: 150,
  doneTitle: "Done",
  shouldShowDone: true
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  touch: {
    position: 'absolute',
    height: 20,
    width: 20,
    backgroundColor: 'white',
    borderWidth: 0,
    borderRadius: 10
  }

});
