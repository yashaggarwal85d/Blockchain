import React, {Component} from 'react';
import {
  Header,
  Title,
  Button,
  Right,
  Body,
  Left,
} from 'native-base';

import { Feather } from '@expo/vector-icons';
import { Image,View } from 'react-native';
import { LightTheme } from '../appStyles';

export default class LightHeaderComponent extends Component {

    render(){
        return(
        <>
            <Header style={LightTheme.headerBackgroundColor}>
                <Left>
                    <View style={LightTheme.Headercontainer}>
                        <Image
                            source={require("../assets/omega.jpg")}
                            resizeMode="stretch"
                            style={LightTheme.image}
                        ></Image>
                    </View>
                </Left>
                <Body>
                    <Title style={LightTheme.appTitle}> Hi, Yash</Title>
                </Body>
                <Right>
                    <Button icon transparent>
                        <Feather name='search' style={LightTheme.HeaderIcon} />
                    </Button>
            
                    <Button icon transparent>
                        <Feather name='edit-2' style={LightTheme.HeaderIcon} />
                    </Button>
                </Right>
            </Header>
        </>
        )
}
}