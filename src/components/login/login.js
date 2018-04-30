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
	StatusBar,
	ScrollView,
	AsyncStorage,
	ActivityIndicator
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import validate from '../../utility/validation';
import Toast from 'react-native-easy-toast'
export default class login extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			fNameIsValid: true,
			lNameIsValid: true,
			memIsValid: true,
			formData: {
				fname: '',
				laname: '',
				memNo: '',
			},
			token: '',
			isLoading:false
		};
	}

	_changeTextHandlerFName = val => {
		let isValid = validate(val, 'isName');
		if(val === ''){
			isValid = true
		}
		this.setState(prevState => {
				return {
					...prevState,
					formData: {
						...prevState.formData,
						fname: val,
					}
				};
			});

		if(isValid){
				this.setState(prevState => {
					return{
						...prevState,
					fNameIsValid:true
					}
				})
			}else{
				this.setState(prevState => {
					return{
						...prevState,
					fNameIsValid:false
					}
				})
			}
	};

	_changeTextHandlerLName = val => {
		let isValid = validate(val, 'isName');
		if(val === ''){
			isValid = true
		}
			this.setState(prevState => {
				return {
					...prevState,
					formData: {
						...prevState.formData,
						lname: val,
					}
				};
			});

			if(isValid){
				this.setState(prevState => {
					return{
						...prevState,
					lNameIsValid:true
					}
				})
			}else{
				this.setState(prevState => {
					return{
						...prevState,
					lNameIsValid:false
					}
				})
			}
	
	};

	_changeTextHandlerNumber = val => {
		let isValid = validate(val, 'isNumber');
		if(val === ''){
			isValid = true
		}
	this.setState(prevState => {
				return {
					...prevState,
					formData: {
					...prevState.formData,
						memNo: val,
					}
				};
			});
			if(isValid){
				this.setState(prevState => {
					return{
						...prevState,
						memIsValid:true
					}
				})
			}else{
				this.setState(prevState => {
					return{
						...prevState,
						memIsValid:false
					}
				})
			}

			console.log(JSON.stringify(this.state))
		}

	

	render() {
		let fNameIsValid = this.state.fNameIsValid;
		fNameIsValid ? (inValidInputf = {}) : (inValidInputf = { backgroundColor: 'red'});

		let lNameIsValid = this.state.lNameIsValid;
		lNameIsValid ? (inValidInputl = {}) : (inValidInputl = { backgroundColor: 'red'});

		let memIsValid = this.state.memIsValid;
		memIsValid ? (inValidInputn = {}) : (inValidInputn = { backgroundColor: 'red'});

		let isLoading = this.state.isLoading

		if(isLoading){
			return(
				<ImageBackground  source={require('../../imgs/bac.png')}  style={styles.backgroundImage}>
				<ActivityIndicator size="large" color="black"   style={styles.loader}/>
				</ImageBackground>
			);
		}else{
		return (
			<View style={styles.container}>	
				<ImageBackground source={require('../../imgs/bac.png')} style={styles.backgroundImage}>
					<ScrollView ref={ref => listView = ref} style={styles.scrl}>
						<KeyboardAvoidingView behavior="padding">
							<View style={styles.content}>
								<Image source={require('../../imgs/logo.png')} style={styles.logo} />
								<View style={styles.inpContainer}>
									<TextInput
										autoFocus={false}
										underlineColorAndroid="transparent"
										style={[styles.input, inValidInputf]}
										placeholder="First Name"
										keyboardType="default"
										onChangeText={fname => this._changeTextHandlerFName(fname)}
										value={this.state.fname}
										ref={ref => (this._fNameDataInput = ref)}
									/>
									<TextInput
										autoFocus={false}
										underlineColorAndroid="transparent"
										style={[styles.input, inValidInputl]}
										placeholder="Last Name"
										keyboardType="default"
										onChangeText={lname => this._changeTextHandlerLName(lname)}
										value={this.state.lname}
										ref={ ref => (this._lNameDataInput = ref)}
									/>

									<TextInput
										autoFocus={false}
										underlineColorAndroid="transparent"
										style={[styles.input, inValidInputn]}
										placeholder="Member Number"
										onChangeText={memNo => this._changeTextHandlerNumber(memNo)}
										value={this.state.memNo}
										ref={ component => (this._textInput = component)}
									/>
									<TouchableOpacity
										onPress={this._loginHandler}
										isDisabled={true}
										style={styles.buttonContainer}>
										<Text style={styles.buttonText}>LOGIN</Text>
									</TouchableOpacity>
								</View>
							</View>
						</KeyboardAvoidingView>
					</ScrollView>
					<Toast 
					ref="toast"
					position="bottom"/>
				</ImageBackground>
			</View>
		);}
	}

	_loginHandler = () => {
		console.log(JSON.stringify(this.state))	
			
		if(	this.state.formData.memNo != '' ||
			this.state.formData.fname != '' ||
			this.state.formData.lname != ''){
			if(!this.state.fNameIsValid || !this.state.lNameIsValid || !this.state.memIsValid){
				this.refs.toast.show('Please provide valid inputs')
				this.setState({
					fNameIsValid: true,
					lNameIsValid: true,
					memIsValid: true,
					formData: {
						fname: '',
						laname: '',
						memNo: '',
					},
					token: '',
				})
				this._textInput.setNativeProps({ text: '' });
				this._fNameDataInput.setNativeProps({ text: '' });
				this._lNameDataInput.setNativeProps({ text: '' });
				return
			}else{
			let number = this.state.formData.memNo;
			console.log(number);
			baseURL = 'http://dev20.onlinetestingserver.com/sos-new/request-';
			let url = baseURL + 'member-search';
			body = JSON.stringify({ member_no: number });
			console.log(url);
			console.log(body);
			let token = null;
			this.setState(prevState=>{
				return{
					...prevState,
					isLoading:true
				}
			})
			fetch(url, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			})
				.then(resp => resp.json())
				.then(res => {
					if (res.agentAccessToken != null) {
						AsyncStorage.setItem('accessToken', res.agentAccessToken);
						AsyncStorage.setItem('uid', res.u_id);
						this.props.navigator.resetTo({
							screen: 'sos.HomeScreen',
							navigatorStyle: { navBarHidden: true },
						});
					} else {
						this.setState(prevState=>{
							return{
								...prevState,
								isLoading:false
							}
						})
						this.refs.toast.show(number + 'is not a valid member number');
						this._textInput.setNativeProps({ text: '' });
						this._fNameDataInput.setNativeProps({ text: '' });
						this._lNameDataInput.setNativeProps({ text: '' });
					}
				})
				.catch(err => this.refs.toast.show(err.message));
		}
	}else{
			this.refs.toast.show('Please fill out any empty fields');	
			return
	}
	};

}

const styles = StyleSheet.create({
	
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loader:{
		
	},
	backgroundImage: {
		flex: 1,
		alignSelf: 'stretch',
		width: null,
		justifyContent: 'center',
	},
	content: {
		flex: 1,
		padding: 30,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logoContainer: {
		flex: 1,
	},
	logo: {
		width: 300,
		height: 200,
		resizeMode: Image.resizeMode.contain,
		marginBottom: 20,
		marginTop: 0,
	},
	input: {
		fontSize: 20,
		padding: 15,
		marginBottom: 15,
		backgroundColor: 'rgba(255,255,255,0.3)',
		alignSelf: 'stretch',
		borderRadius: 5,
	},
	buttonContainer: {
		backgroundColor: '#df1e36',
		alignSelf: 'stretch',
		padding: 20,
		borderRadius: 5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	forText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'right',
		marginTop: 10,
	},
	kbd: {
		marginBottom: 10,
	},
	inpContainer: {
		flex: 1,
		alignSelf: 'stretch',
		marginTop: 20,
	},
	scrl: {
		flex:1,
		marginTop: 0,
	},
});
