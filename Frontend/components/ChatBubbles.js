import React, { Component } from "react";
import { Text, View, Left, Header, Button, Body } from "native-base";
import { FlatList, Image, TouchableOpacity, Modal } from "react-native";
import moment from "moment";
import { socket } from "../store/reducers/Socket";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";

class ChatBubble extends Component {
  constructor(props) {
    super(props);
    this.messages = null;
    this.state = {
      sent: false,
      visible: false,
    };
  }

  componentDidMount() {
    socket.on("disconnect", () => {
      this.setState({ sent: false });
    });
    socket.on("confirmSend", async (message, roomId) => {
      this.setState({ sent: true });
    });
  }

  renderGridItem = (itemData) => {
    if (itemData.item.isPrompt) {
      return (
        <View style={this.props.appStyles.PromptMessageView}>
          <Text style={this.props.appStyles.PromptMessage}>
            {itemData.item.message_body}
          </Text>
        </View>
      );
    } else {
      const time = moment(itemData.item.timestamp).format("h:mm");
      if (itemData.item.sender_id === this.props.userId) {
        var icon = "clock-outline";
        var message_body = (
          <Text style={this.props.appStyles.ChatBubbleText}>
            {itemData.item.message_body}
          </Text>
        );
        if (itemData.item.isImage) {
          message_body = (
            <TouchableOpacity onPress={() => this.setState({ visible: true })}>
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri: itemData.item.message_body,
                }}
              />
            </TouchableOpacity>
          );
        }

        if (itemData.item._id) {
          icon = "check-all";
        } else if (this.state.sent) {
          icon = "check-all";
          itemData.item._id = true;
          this.setState({ sent: false });
        }
        return (
          <View style={this.props.appStyles.ChatBubbleView}>
            {message_body}
            <Text style={this.props.appStyles.ChatBubbleNote}>{time}</Text>
            <MaterialCommunityIcons
              name={icon}
              style={this.props.appStyles.ChatBubbleNoteIcon}
            />
          </View>
        );
      } else {
        var message_body = (
          <Text style={this.props.appStyles.ChatBubbleLeftText}>
            {itemData.item.message_body}
          </Text>
        );
        if (itemData.item.isImage) {
          message_body = (
            <TouchableOpacity onPress={() => this.setState({ visible: true })}>
              <Image
                style={{ width: 200, height: 200 }}
                source={{
                  uri: itemData.item.message_body,
                }}
              />
            </TouchableOpacity>
          );
        }

        if (
          (!this.messages[itemData.index + 1] ||
            this.messages[itemData.index + 1].sender_id !==
              itemData.item.sender_id ||
            this.messages[itemData.index + 1].isPrompt) &&
          this.props.isGroup
        ) {
          var name;
          const memIndex = this.props.members.findIndex(
            (mem) =>
              mem.id === itemData.item.sender_id ||
              mem.details._id === itemData.item.sender_id
          );
          name = this.props.members[memIndex].details.name;
          return (
            <View style={this.props.appStyles.ChatBubbleLeftView}>
              <Text style={this.props.appStyles.ChatBubbleLeftViewName}>
                {name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {message_body}
                <Text style={this.props.appStyles.ChatBubbleLeftNote}>
                  {time}
                </Text>
              </View>
            </View>
          );
        } else {
          return (
            <View style={this.props.appStyles.ChatBubbleLeftView}>
              <View style={{ flexDirection: "row" }}>
                {message_body}
                <Text style={this.props.appStyles.ChatBubbleLeftNote}>
                  {time}
                </Text>
              </View>
            </View>
          );
        }
      }
    }
  };
  render() {
    this.messages = this.props.messages.slice().reverse();
    const imagesObj = this.props.messages.filter((msg) => {
      return msg.isImage;
    });
    const indexInit = imagesObj.length - 1;
    const images = [];
    for (const img of imagesObj) {
      images.push({ url: img.message_body });
    }
    return (
      <>
        <FlatList
          inverted
          keyExtractor={(item, index) => "key" + index}
          data={this.messages}
          renderItem={this.renderGridItem}
          numColumns={1}
          style={this.props.appStyles.ChatBubblesList}
        />
        <Modal visible={this.state.visible} transparent={true}>
          <Header
            style={{
              backgroundColor: "black",
            }}
          >
            <Left>
              <Button
                icon
                transparent
                onPress={() => {
                  this.setState({ visible: false });
                }}
              >
                <MaterialIcons color='white' name='arrow-back' size={22} />
              </Button>
            </Left>
            <Body />
          </Header>
          <ImageViewer
            useNativeDriver={true}
            index={indexInit}
            imageUrls={images}
          />
        </Modal>
      </>
    );
  }
}

export default ChatBubble;
