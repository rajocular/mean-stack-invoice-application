import {Area} from "./area.model";

export interface Client {
  _id: string;
  area: Area;
  name: string;
  address: string;
  contact: number;
  pincode: string;
  gstnumber: string;
  type: string;
}
