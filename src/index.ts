import { API_SCHEMA } from "./api/api";

import { sendRequest } from "./request";
import { RemoteCarStatusStorage } from "./storage/RemoteCarStatusStorage";
import { RemoteCarStorage } from "./storage/RemoteCarStorage";

import { GrayTrackBrickAutoRestartApp } from "./GrayTrackBrickAutoRestartApp";

const targetedRequestSender: typeof sendRequest = (args) =>
  sendRequest({ ...args, host: "http://localhost:3000" });

const carStorage = new RemoteCarStorage(API_SCHEMA, targetedRequestSender);

const carStatusStorage = new RemoteCarStatusStorage(
  API_SCHEMA,
  targetedRequestSender
);

const app = new GrayTrackBrickAutoRestartApp(carStorage, carStatusStorage);

const rootElement = document.body;
const { controls, track } = app.render();
rootElement.append(controls, track);
