import React, { Component } from 'react';
import {
	AppRegistry,
	Platform,
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
	KeyboardAvoidingView,
	Animated,
	Easing,
	StatusBar,
	AsyncStorage,
	Button,
	PermissionsAndroid,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-easy-toast'
export default class home extends Component {
	state = {
		data: {
			latitude: 0,
			longitude: 0,
		},
		auth: {
			token: '',
			uid: '',
		},
	};


		componentWillUnmount(){
			AsyncStorage.getItem('accessToken');
			AsyncStorage.getItem('uid');
			this.setState(prevState => {
				return {
					...prevState.data,
					auth: {
						token: null,
						uid: null,
					},
				};
			});
		}
	constructor(props) {
		super(props);
		this._retrieveInfo();
	}

	UNSAFE_componentWillMount() {
		this._retrieveInfo();
		this.animatedValue = new Animated.Value(0);
	}

	componentDidMount() {
		this._startAnimation();
		this._locationRequest();
		
	}

	render() {
		const interpolateColor = this.animatedValue.interpolate({
			inputRange: [0, 150],
			outputRange: ['rgba(0, 0, 0,0)', 'rgba(0,0,0,0)'],
		});
		const animatedStyle = {
			backgroundColor: interpolateColor,
			transform: [{ translateY: this.animatedValue }],
		};

		return (
			<View style={styles.container}>
				<StatusBar hidden={true} />
				<View style={styles.statusBar} />
				<ImageBackground source={require('../../imgs/main-bg.jpg')} style={styles.backgroundImage}>
					<View style={styles.mainHeaderContainer}>
						<Text style={styles.topTitle}>SOS</Text>
						<Button style={styles.btn} title="Logout" onPress={this._logout} />
					</View>

					<View style={styles.content}>
						<View style={styles.heyTitleContainer}>
							<Text style={styles.heytite}>HEY</Text>
						</View>

						<View style={styles.textContainer}>
							<Text style={styles.simtext}>
								Please tap to the button below if you are in danger
							</Text>
						</View>
						<View style={styles.arrowContainer}>
							<Animated.View style={[animatedStyle]}>
								<Image source={require('../../imgs/arrow.png')} style={[styles.arrow]} />
							</Animated.View>
						</View>
					</View>
					<Toast 
					ref="toast"/>
					<View style={styles.btnContainer}>
						<TouchableOpacity onPress={this._sosCall} activeOpacity={0.8}>
							<View style={styles.redbox}>
								<Image source={require('../../imgs/sos-btn.png')} style={styles.sostxt} />
							</View>
						</TouchableOpacity>
						
					</View>
				</ImageBackground>
			</View>
		);
	}

	_startAnimation() {
		this._retrieveInfo()
		this.animatedValue.setValue(0);
		Animated.timing(this.animatedValue, {
			toValue: 100,
			duration: 1000,
		}).start(() => {
			this._startAnimation();
		});
	}

	_locationRequest = () => {
		Geolocation.getCurrentPosition(
			res => {
				this.setState(prevState => {
					return {
						...prevState.auth,
						data: {
							latitude: res.coords.latitude,
							longitude: res.coords.longitude,
						},
					};
				});
			},
			err => {
				this.refs.toast.show(err.message);
			},
			{
				enableHighAccuracy: true,
			}
		);
	};

	_logout = () => {
		AsyncStorage.removeItem('accessToken');
		AsyncStorage.removeItem('uid');
		this.setState(prevState => {
			return {
				...prevState.data,
				auth: {
					token: null,
					uid: null,
				},
			};
		});
		console.log(this.state);
		this.props.navigator.resetTo({
				screen: 'sos.LoginScreen',
				navigatorStyle: {
					navBarHidden: true},
		});
	};

	_sosCall = async () => {
		
		
		baseURL = 'http://dev20.onlinetestingserver.com/sos-new/request-';
		let url = baseURL + 'sos-call';
		console.log(url);
		let body = JSON.stringify({
			userid: this.state.auth.uid,
			latitude: this.state.data.latitude,
			longitude: this.state.data.longitude,
		});
		let header = new Headers({
			'Content-Type': 'application/json',
			Authorization: this.state.auth.token,
		});

		console.log(body);
		console.log(header);

		if (this.state.data.latitude != 0) {
			fetch(url, {
				method: 'POST',
				headers: header,
				body: body,
			}, err => {this.refs.toast.show(err)})
				.then(res => res.json())
				.then(resp => this.refs.toast.show(JSON.stringify(resp)))
				.catch(e => this.refs.toast.show(e));
		} else {
			this.refs.toast.show('Please Wait while the setup is getting ready');
			this._locationRequest();
		}

	};

	_retrieveInfo = async () => {
		await AsyncStorage.getItem('accessToken')
			.then(res => {
				this.setState(prevState => {
					return {
						...prevState.data,
						auth: {
							...prevState.auth,
							token: res,
						},
					};
				});
			})
			.then(
				await AsyncStorage.getItem('uid')
					.then(res => {
						this.setState(prevState => {
							return {
								...prevState.data,
								auth: {
									...prevState.auth,
									uid: res,
								},
							};
						});
					})
					.catch(err => this.refs.toast.show(err))
			)
			.catch(err => {
				this.refs.toast.show(err.message);
			});
		
	};
}

const animatedStyle = { opacity: this.animatedValue };
const styles = StyleSheet.create({
	mainHeaderContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		backgroundColor: '#064f9a',
		alignSelf: 'stretch',
		padding: 15,
	},

	heyTitleContainer: {
		flex: 0.3,
	},
	textContainer: { flex: 1 },
	arrowContainer: { flex: 1.7 },

	statusBar: {
		backgroundColor: '#064f9a',
	},
	container: {
		flex: 1,
		// flexDirection:row
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
	btnContainer: {
		flex: 1,
		alignItems: 'center',
	},
	topTitle: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
		paddingRight: 20,
	},
	heytite: {
		color: '#333333',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	simtext: {
		color: '#666666',
		fontSize: 16,
		padding: 15,
		textAlign: 'center',
	},
	arrow: {
		opacity: 1,
		width: 33,
		height: 79,
	},
	redbox: {
		width: 200,
		height: 200,
		borderRadius: 200,
		backgroundColor: '#df1e36',
		justifyContent: 'center',
		alignItems: 'center',

		opacity: 1,
	},
	sostxt: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	btn: {
		alignSelf: 'flex-end',
	},
});
