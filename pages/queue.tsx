import React, { useEffect, useState } from "react";
import log from "@/lib/log";
import axios from "axios";
import { QueueDB } from "@/types/QueueDB";
import Header from "@/components/Header";
import { Separator } from "@/components/ui/separator";

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
    <main className="flex justify-center items-center h-screen">
      <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
        <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
          <Header />
        </div>
        <div className="flex flex-col grow gap-4 justify-evenly px-8 py-5">
          <h1 className="text-4xl font-bold ml-3">Queues</h1>
          <div className="rounded-3xl bg-white w-full py-3 px-4 flex justify-evenly gap-2 grow">
            <div className="grow self-center h-full flex flex-col gap-4">
              <p>Nurse</p>
              <div className="text-center">
                <p className="text-3xl italic font-bold">Now Serving</p>
                <p className="text-3xl underline font-bold">
                  {queue?.nurse.length !== 0
                    ? queue?.nurse[0].idNumber
                    : "Pending..."}
                </p>
              </div>
              <p>On Queue</p>
              <div className="border p-1 overflow-y-auto grow">
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
            </div>
            <Separator orientation="vertical" />
            <div className="grow self-center h-full flex flex-col gap-4">
              <p>Doctor</p>
              <div className="text-center">
                <p className="text-3xl italic font-bold">Now Serving</p>
                <p className="text-3xl underline font-bold">
                  {queue?.doctor.length !== 0
                    ? queue?.doctor[0].idNumber
                    : "Pending..."}
                </p>
              </div>
              <p>On Queue</p>
              <div className="border p-1 overflow-y-auto grow">
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
            </div>
            <Separator orientation="vertical" />
            <div className="grow self-center h-full flex flex-col gap-4">
              <p>Pharmacist</p>
              <div className="text-center">
                <p className="text-3xl italic font-bold">Now Serving</p>
                <p className="text-3xl underline font-bold">
                  {queue?.pharmacist.length !== 0
                    ? queue?.pharmacist[0].idNumber
                    : "Pending..."}
                </p>
              </div>
              <p>On Queue</p>
              <div className="border p-1 overflow-y-auto grow">
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
