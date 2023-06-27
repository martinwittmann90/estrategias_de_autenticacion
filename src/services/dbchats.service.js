import MessageModel from "../DAO/models/message.model.js"

class MongoDBChats {
  async getChat() {
    try {
      const allChat = await MessageModel.find({});
      return allChat;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getOneChat(id) {
    try {
      const oneChat = await MessageModel.findById(id);
      return oneChat;
    } catch (err) {
      throw new Error(err);
    }
  }
  async createChat(doc) {
    try {
      const newChat = await MessageModel.create(doc);
      return newChat;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateChat(id, doc) {
    try {
      await MessageModel.findByIdAndUpdate(id, doc);
      const chatUpdated = await MessageModel.findById(id);
      return chatUpdated;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteChat(id) {
    try {
      const deletedChat = await MessageModel.findByIdAndDelete(id);
      return deletedChat;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default MongoDBChats;
