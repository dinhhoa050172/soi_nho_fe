export type Province = {
  code: number | string;
  name: string;
  districts?: District[];
};

export type District = {
  code: number | string;
  name: string;
  wards?: Ward[];
};

export type Ward = {
  code: number | string;
  name: string;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
};
