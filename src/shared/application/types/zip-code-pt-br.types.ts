export interface IAddressByZipCodePtBrViaCepAPI {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface IAddressByZipCodePtBr {
  zip_code: string;
  street: string;
  complement: string;
  district: string;
  city: string;
  uf: string;
  ddd: string;
  country: string;
}
