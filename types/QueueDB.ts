type idnumber = {
  idNumber: string;
};

export type QueueDB = {
  queue: any;
  nurse: idnumber[] | [];
  doctor: idnumber[]  | [];
  pharmacist: idnumber[]  | [];
};
