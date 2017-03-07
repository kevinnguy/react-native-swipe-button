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

    const marginLeft = this.props.style.marginHorizontal || this.props.style.marginLeft || 0;
    const marginRight = this.props.style.marginHorizontal || this.props.style.marginRight || 0;
    const buttonWidth = (this.props.style.width || Dimensions.get('window').width) - marginLeft - marginRight;

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
    return (
      <View style={[this.props.style, styles.container]}>
        <ScrollView
          ref={input => { this.scrollView = input; }}
          style={[styles.button, this.props.style]}
          contentContainerStyle={[styles.scrollView, { width: this.state.buttonWidth * 3 }]}
          horizontal
          scrollEnabled
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={offset => this.onSwipe(offset)}>
          <Text
            style={[styles.buttonTitle, this.props.textStyle]}
            allowFontScaling={this.props.allowFontScaling}>
            {this.props.title}
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
