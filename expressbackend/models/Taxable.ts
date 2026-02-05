export class Taxable {
  reference_number?: string;
  taxCategory?: string;
  noOfEmployee?: number;
  taxableAmount?: number;
  taxWithHold?: number;
  incometaxPoolAmount?: number;
  graduatetaxPool?: number;
  graduaTotBasSalary?: number;
  graduateTotaEmployee?: number;
  graduatetaxWithHold?: number;
  recieved_date?: Date | string;
  status?: number;
  maker_id?: number;
}