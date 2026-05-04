import instance from "@/utils/axios.utils";

const chat = {
  getHistory: (params?: { page?: number; page_size?: number }) =>
    instance().get("chat/history/", { params }),

  sendMessage: (data: { message: string }) =>
    instance().post("chat/send/", data),
};

export default chat;
