import { API_SCHEMA } from "./api/api";

import { sendRequest } from "./request";
import { RemoteCarStatusStorage } from "./storage/RemoteCarStatusStorage";
import { RemoteCarStorage } from "./storage/RemoteCarStorage";

import { App } from "./App";

const targetedRequestSender: typeof sendRequest = (args) =>
  sendRequest({ ...args, host: "http://localhost:3000" });

const carStorage = new RemoteCarStorage(API_SCHEMA, targetedRequestSender);

const carStatusStorage = new RemoteCarStatusStorage(
  API_SCHEMA,
  targetedRequestSender
);

const app = new App(carStorage, carStatusStorage);

const rootElement = document.body;
rootElement.append(app.render());

// @ts-ignore
window.startRace = async () => {
  await app.init();
  app.render()
  app.startRace();
};
