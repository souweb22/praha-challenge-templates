/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
jest.mock("axios");
import axios from "axios";
import { NameApiService } from "../nameApiService";

describe("NameApiService", () => {
  describe("getFirstName", () => {
    test("firstNameを取得する", async () => {
      const NameApiServiceInstance = new NameApiService();
      (axios.get as jest.Mock).mockReturnValueOnce({
        data: {
          first_name: "名前",
        },
      });
      expect(await NameApiServiceInstance.getFirstName()).toBe("名前");
    });

    test("５文字以上はエラー発生", async () => {
      const data = new NameApiService();
      (axios.get as jest.Mock).mockReturnValueOnce({
        data: {
          first_name: "５文字です",
        },
      });
      expect(data.getFirstName()).rejects.toThrow(
        new Error("firstName is too long!")
      );
    });
  });
});
