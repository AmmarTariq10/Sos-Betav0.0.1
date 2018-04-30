import React, { Component } from 'react';
import { View, StyleSheet, Text, ImageBackground, StatusBar } from 'react-native';
import { Navigation } from 'react-native-navigation';
export default class Message extends Component {

	render() {
		StatusBar.setBackgroundColor('#04366a', false);
		return (
			<View style={styles.container}>
				<StatusBar backgroundColor="#04366a" barStyle="light-content" />
				<ImageBackground source={require('../imgs/main-bg.jpg')} style={styles.backgroundImage}>
					<View style={styles.content}>
						<Text style={styles.msg}> Help is on the way </Text>
					</View>
				</ImageBackground>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	backgroundImage: {
		flex: 1,
		alignSelf: 'stretch',
		width: null,
	},
	content: {
		flex: 1,
		paddingTop: 10,
		paddingBottom: 0,
		paddingLeft: 0,
		paddingRight: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},

	msg: {
		color: '#333333',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
