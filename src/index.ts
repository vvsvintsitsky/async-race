import { API_SCHEMA } from "./api/api";
import { App } from "./App";
import { AutoRestartRaceController } from "./race/AutoRestartRaceController";
import { RaceView } from "./race/types";
import { sendRequest } from "./request";
import { RemoteCarStatusStorage } from "./storage/RemoteCarStatusStorage";
import { RemoteCarStorage } from "./storage/RemoteCarStorage";

document.querySelector("body")?.appendChild(new App().render());

const targetedRequestSender: typeof sendRequest = (args) =>
  sendRequest({ ...args, host: "http://localhost:3000" });

class StubRaceView implements RaceView {
  startRace(): void {
    console.log("race started");
  }
  stopRace(progress: number): void {
    console.log(`race stopped at ${progress}%`);
  }
  dispose(): void {
    console.log("view dispose");
  }
}

(async () => {
  const carStorage = new RemoteCarStorage(API_SCHEMA, targetedRequestSender);

  const car = await carStorage.create({ color: "red", name: "name" });
  const raceController = new AutoRestartRaceController(
    car.id,
    new RemoteCarStatusStorage(API_SCHEMA, targetedRequestSender),
    new StubRaceView(),
    (id) => console.log(`car id=${id} stopped`),
    (id) => {
      console.log(`car id=${id} won`);
      raceController.dispose();
    }
  );
  raceController.startRace();
})();
