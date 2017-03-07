import React, { Component } from 'react';
import {
  InteractionManager,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  title?: string;
  containerStyle?: any;
  style?: any;
  textStyle?: any;
  allowFontScaling?: bool;
  onSwipe: () => mixed;
};

const runAfterInteractions = func => {
  setTimeout(() => InteractionManager.runAfterInteractions(func()), 1);
}

export default class SwipeButton extends Component {
  constructor() {
    super();

    const { containerStyle } = this.props;
    const marginLeft = containerStyle.marginHorizontal || containerStyle.marginLeft || 0;
    const marginRight = containerStyle.marginHorizontal || containerStyle.marginRight || 0;
    const buttonWidth = (containerStyle.width || Dimensions.get('window').width) - marginLeft - marginRight;

    this.state = { buttonWidth }
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.resetSwipePosition();
    } else if (Platform.OS === 'android') {
      runAfterInteractions(() => this.resetSwipePosition());
    }
  }

  resetSwipePosition() {
    if (this.scrollView) {
      this.scrollView.scrollTo({ x: this.state.buttonWidth, animated: false });
    }
  }

  onSwipe(offset) {
    const position = offset.nativeEvent.contentOffset.x;
    if (position === 0 || position === (this.state.buttonWidth * 2)) {
      this.props.onSwipe();

      if (Platform.OS === 'ios') {
        this.resetSwipePosition();
      } else if (Platform.OS === 'android') {
        runAfterInteractions(() => {
          this.resetSwipePosition();
          setTimeout(() => this.resetSwipePosition(), 500); // Strangely, this is necessary on Android
        });
      }
    }
  }

  props: Props

  render() {
    const { title, containerStyle, style, textStyle, allowFontScaling, onSwipe } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <ScrollView
          ref={input => { this.scrollView = input; }}
          style={[styles.buttonStyle, style]}
          contentContainerStyle={[styles.scrollView, { width: this.state.buttonWidth * 3 }]}
          horizontal
          scrollEnabled
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={offset => onSwipe(offset)}>
          <Text
            style={[styles.buttonTitle, textStyle]}
            allowFontScaling={allowFontScaling}>
            {title}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 50,
    borderTopWidth: 0.5,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
  },
});
