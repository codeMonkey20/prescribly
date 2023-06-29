import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { QrScanner } from "@yudiel/react-qr-scanner";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import log from "@/lib/log";
import { QueueDB } from "@/types/QueueDB";

export async function getServerSideProps({
  req,
  res,
}: GetServerSidePropsContext) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: `/login`,
        permanent: false,
      },
    };
  } else if (!session.user.usertypeID && session.user.usertype !== "Admin") {
    return {
      redirect: {
        destination: `/register?id=${session.user._id}`,
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

export default function PrescribePage() {
  const session = useSession();
  const router = useRouter();

  const [idNumber, setIdNumber] = useState("");
  const [name, setName] = useState("");
  const [buttonLoad, setButtonLoad] = useState(false);
  const [queue, setQueue] = useState<QueueDB>();
  const intervalId = useRef<NodeJS.Timer>();

  // useEffect(() => {
  //   axios.get(`/api/patient?idNumber=${idNumber}`).then(({ data }) => {
  //     if (data.length === 0) {
  //       setName("");
  //       return;
  //     }
  //     const user = data[0];
  //     setName(`${user.lastName}, ${user.firstName}`);
  //   });
  // }, [idNumber]);

  useEffect(() => {
    axios.get("/api/queue").then(({ data }) => {
      let newQueueData: QueueDB = data;
      newQueueData.nurse = newQueueData.nurse.reverse();
      newQueueData.doctor = newQueueData.doctor.reverse();
      newQueueData.pharmacist = newQueueData.pharmacist.reverse();
      console.log(newQueueData);
      setQueue(newQueueData);
    });
    intervalId.current = setInterval(() => {
      axios.get("/api/queue").then(({ data }) => {
        let newQueueData: QueueDB = data;
        newQueueData.nurse = newQueueData.nurse.reverse();
        newQueueData.doctor = newQueueData.doctor.reverse();
        newQueueData.pharmacist = newQueueData.pharmacist.reverse();
        console.log(newQueueData);
        setQueue(newQueueData);
      });
    }, 5000);
  }, []);

  if (session.status === "authenticated")
    return (
      <main className="flex justify-center items-center h-screen">
        <div className="w-11/12 h-5/6 border-4 border-primary bg-primary rounded-3xl flex">
          <div className="w-64 min-h-fit bg-white rounded-l-3xl flex flex-col">
            <Header />
          </div>
          <div className="flex flex-col grow px-8 py-5">
            <h1 className="text-4xl font-bold my-8 ml-3">Prescribe</h1>
            <div className="bg-white flex flex-col gap-2 items-center justify-center grow rounded-3xl px-4 py-2">
              <div className="w-32 self-center">
                <p className="text-center">Current Queue</p>
                <div className="border h-72 max-h-72 p-1 overflow-y-auto">
                  {queue?.doctor.map((e, i) => {
                    return (
                      <p
                        key={i}
                        className="hover:bg-muted rounded text-center cursor-pointer"
                        onClick={() => {
                          clearInterval(intervalId.current);
                          router.push(
                            `/prescribe/${
                              queue?.doctor[i]?.idNumber
                            }`
                          );
                        }}
                      >
                        {e.idNumber}
                      </p>
                    );
                  })}
                </div>
                <Button
                  onClick={() => {
                    clearInterval(intervalId.current);
                    router.push(
                      `/prescribe/${
                        queue?.doctor[0]?.idNumber
                      }`
                    );
                  }}
                  className="w-full mt-2"
                  disabled={
                    queue?.doctor.length === 0 ||
                    queue?.doctor.length === undefined
                  }
                >
                  Prescribe {queue?.doctor[0]?.idNumber}
                </Button>
              </div>
              {/* <h2 className="self-start font-semibold text-lg">Patient Identification</h2>
              <p>Place the QR Code within the frame</p>
              <div className="w-52">
                <QrScanner
                  onDecode={(result) => {
                    setIdNumber(result);
                    setButtonLoad(true);
                    router.push(`/prescribe/${result}`);
                  }}
                  scanDelay={2000}
                  onError={(error) => log(error?.message)}
                />
              </div>
              <p>or enter ID number to proceed</p>
              <Input className="w-32" placeholder="0000-0000" onChange={(e) => setIdNumber(e.target.value)} />
              <p className="font-bold text-xl">{name}</p>
              <Button
                onClick={() => {
                  setButtonLoad(true);
                  router.push(`/prescribe/${idNumber}`);
                }}
                disabled={name === "" || buttonLoad}
              >
                {buttonLoad ? <Loader2 className="animate-spin mr-1" /> : ""}
                Proceed
              </Button> */}
            </div>
          </div>
        </div>
      </main>
    );
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center gap-3">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="w-auto animate-pulse"
          priority
        />
      </div>
    </main>
  );
}
