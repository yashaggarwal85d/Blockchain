import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  updateEmail,
  updatePassword,
  login,
  updateAlert,
} from "./actions/LoginActions";
import { fillData } from "./actions/RoomActions";
import {
  AuthMainNavigator,
  ChatMainNavigator,
} from "../navigation/chatsNavigation";
import React, { Component } from "react";
import { View, Image } from "react-native";
import { Container } from "native-base";
import { StatusBar } from "react-native";

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      Authstate: AuthMainNavigator,
    };
  }

  async loginUser() {
    await this.props.login();
    if (this.props.user.token) {
      await this.props.fillData();
      this.setState({ loaded: true, Authstate: ChatMainNavigator });
    } else this.setState({ loaded: true, Authstate: AuthMainNavigator });
  }

  async filldatafunc() {
    await this.props.fillData();
  }

  componentDidMount = async () => {
    if (
      !this.props.user ||
      !this.props.user.password ||
      !this.props.user.email
    ) {
      this.setState({ loaded: true, Authstate: AuthMainNavigator });
    } else if (this.props.user.token) {
      await this.props.fillData();
      this.setState({ loaded: true, Authstate: ChatMainNavigator });
    } else {
      this.loginUser();
    }
  };
  render() {
    if (this.state.loaded == false) {
      var image = <></>;
      if (this.props.user.mode === "light") {
        image = (
          <Container
            style={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Image
              source={require(`../assets/lightLoader.gif`)}
              style={{
                height: "60%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Container>
        );
      } else {
        var image = (
          <Container
            style={{
              backgroundColor: "black",
              alignItems: "center",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Image
              source={require(`../assets/darkLoader.gif`)}
              style={{
                height: "60%",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          </Container>
        );
      }
      return (
        <>
          <StatusBar hidden />
          {image}
        </>
      );
    } else return <this.state.Authstate />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { updateEmail, updatePassword, login, updateAlert, fillData },
    dispatch
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
