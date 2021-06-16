import { API_SCHEMA, EntityBody } from "./api/api";

import { sendRequest } from "./request";
// import { RemoteCarStatusStorage } from "./storage/RemoteCarStatusStorage";
import { RemoteCarStorage } from "./storage/RemoteCarStorage";

// import { GrayTrackBrickAutoRestartApp } from "./GrayTrackBrickAutoRestartApp";
import { Car, Winner } from "./api/types";
import { RemoveWinnerStorage } from "./storage/RemoveWinnerStorage";
import { WinnersTable } from "./winners-table/WinnersTable";

const targetedRequestSender: typeof sendRequest = (args) =>
  sendRequest({ ...args, host: "http://localhost:3000" });

const carStorage = new RemoteCarStorage(API_SCHEMA, targetedRequestSender);

const winnerStorage = new RemoveWinnerStorage(
  API_SCHEMA,
  targetedRequestSender
);

// const carStatusStorage = new RemoteCarStatusStorage(
//   API_SCHEMA,
//   targetedRequestSender
// );

// const app = new GrayTrackBrickAutoRestartApp(carStorage, carStatusStorage);

const rootElement = document.body;
// const { controls, track } = app.render();
// rootElement.append(controls, track);

async function initTable() {
  const cars: EntityBody<Car>[] = Array.from({ length: 105 }, (_, index) => {
    return {
      name: `name_${Math.ceil(Math.random() * 10000)}`,
      color: "red",
    };
  });

  const carsWithId = await Promise.all(
    cars.map((car) => carStorage.create(car))
  );

  const winners: Winner[] = carsWithId.map((car) => ({
    id: car.id,
    wins: Math.ceil(Math.random() * 10000),
    time: Math.ceil(Math.random() * 10000),
  }));

  await Promise.all(winners.map((winner) => winnerStorage.create(winner)));

  const table = new WinnersTable(winnerStorage, 10);
  rootElement.append(table.render());
}

initTable();
