import React, { useEffect, useState } from "react";
import log from "@/lib/log";
import axios from "axios";
import { QueueDB } from "@/types/QueueDB";

export default function Queue() {
  const [queue, setQueue] = useState<QueueDB>();

  useEffect(() => {
    axios.get("/api/queue").then((newQueue) => {
      let newQueueData: QueueDB = newQueue.data;
      newQueueData.nurse = newQueueData.nurse.reverse();
      newQueueData.doctor = newQueueData.doctor.reverse();
      newQueueData.pharmacist = newQueueData.pharmacist.reverse();
      console.log(newQueueData);
      setQueue(newQueueData);
    });
    setInterval(async () => {
      const newQueue = await axios.get("/api/queue");
      let newQueueData: QueueDB = newQueue.data;
      newQueueData.nurse = newQueueData.nurse.reverse();
      newQueueData.doctor = newQueueData.doctor.reverse();
      newQueueData.pharmacist = newQueueData.pharmacist.reverse();
      console.log(newQueueData);
      setQueue(newQueueData);
    }, 3000);
  }, []);

  return (
    <main className="bg-primary h-screen flex flex-col items-center justify-center p-10 gap-3">
      <h1 className="font-bold text-3xl self-start">Queue</h1>
      <div className="rounded-3xl bg-white w-full py-3 px-4 flex justify-evenly gap-2 grow">
        <div className="w-32 self-center">
          <p className="text-center">Nurse Current Queue</p>
          <div className="border h-72 max-h-72 p-1 overflow-y-auto">
            {queue?.nurse.map((e, i) => {
              return (
                <p
                  key={i}
                  className="hover:bg-muted rounded text-center cursor-pointer"
                >
                  {e.idNumber}
                </p>
              );
            })}
          </div>
          <p className="text-center">
            Now Serving:{" "}
            {queue?.nurse.length !== 0 ? queue?.nurse[0].idNumber : "Pending..."}
          </p>
        </div>

        <div className="w-32 self-center">
          <p className="text-center">Doctor Current Queue</p>
          <div className="border h-72 max-h-72 p-1 overflow-y-auto">
            {queue?.doctor.map((e, i) => {
              return (
                <p
                  key={i}
                  className="hover:bg-muted rounded text-center cursor-pointer"
                >
                  {e.idNumber}
                </p>
              );
            })}
          </div>
          <p className="text-center">
            Now Serving:{" "}
            {queue?.doctor.length !== 0 ? queue?.doctor[0].idNumber : "Pending..."}
          </p>
        </div>

        <div className="w-32 self-center">
          <p className="text-center">Pharmacist Current Queue</p>
          <div className="border h-72 max-h-72 p-1 overflow-y-auto">
            {queue?.pharmacist.map((e, i) => {
              return (
                <p
                  key={i}
                  className="hover:bg-muted rounded text-center cursor-pointer"
                >
                  {e.idNumber}
                </p>
              );
            })}
          </div>
          <p className="text-center">
            Now Serving:{" "}
            {queue?.pharmacist.length !== 0 ? queue?.pharmacist[0].idNumber : "Pending..."}
          </p>
        </div>
      </div>
    </main>
  );
}
