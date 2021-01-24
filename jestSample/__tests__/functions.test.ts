/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  sumOfArray,
  asyncSumOfArray,
  asyncSumOfArraySometimesZero,
  getFirstNameThrowIfLong,
} from "../functions";
import { DatabaseMock } from "../util/index";
import { NameApiService } from "../nameApiService";

jest.mock("../util/index"); // 「モックとして使います」という宣言
jest.mock("../nameApiService");

describe("sumOfArray", () => {
  test("1+2=3", () => {
    expect(sumOfArray([1, 2])).toBe(3);
  });
});

describe("asyncSumOfArray", () => {
  test("非同期な1+2=3", async () => {
    expect(await asyncSumOfArray([1, 2])).toBe(3);
  });
});

describe("asyncSumOfArraySometimesZero", () => {
  test("1+2=3", async () => {
    const MockedDatabaseMock = new DatabaseMock(); // 上記でモックの宣言をしたので、既にモック化されたインスタンスができる
    MockedDatabaseMock.save = () => {};
    expect(await asyncSumOfArraySometimesZero([1, 2], MockedDatabaseMock)).toBe(
      3
    );
  });

  test("たまに０になる", async () => {
    const MockedDatabaseMock = new DatabaseMock();
    MockedDatabaseMock.save = () => {
      throw new Error("fail!");
    };
    expect(await asyncSumOfArraySometimesZero([1, 2], MockedDatabaseMock)).toBe(
      0
    );
  });
});

describe("getFirstNameThrowIfLong", () => {
  test("正常に名前が取得される", () => {
    const MockedNameApiService = new NameApiService();
    MockedNameApiService.getFirstName = () => {
      return Promise.resolve("５文字です");
    };
    expect(getFirstNameThrowIfLong(6, MockedNameApiService)).resolves.toBe(
      "５文字です"
    );
  });

  test("async/await確認", async () => {
    const MockedNameApiService = new NameApiService();
    MockedNameApiService.getFirstName = () => {
      return Promise.resolve("５文字です");
    };
    expect(await getFirstNameThrowIfLong(6, MockedNameApiService)).toBe(
      "５文字です"
    );
    // async/awaitを追加するとPromiseで返ってこないでstringで返ってくる（→resolvesがいらない）
    // Promise<string>...Promiseを待った結果、stringで返ってくるという意味？
  });

  test("名前が長いとエラー", () => {
    const MockedNameApiService = new NameApiService();
    MockedNameApiService.getFirstName = () => {
      return Promise.resolve("５文字です");
    };
    expect(getFirstNameThrowIfLong(4, MockedNameApiService)).rejects.toThrow(
      new Error("first_name too long")
    );
  });

  test("NameApiServiceがエラー...名前が長い", () => {
    const MockedNameApiService = new NameApiService();
    MockedNameApiService.getFirstName = () => {
      throw new Error("firstName is too long!");
    };
    expect(getFirstNameThrowIfLong(4, MockedNameApiService)).rejects.toThrow(
      new Error("firstName is too long!")
    );
  });
});
