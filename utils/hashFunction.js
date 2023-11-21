import bcrypt from "bcryptjs";
// console.log(bcrypt);
// import { hashSync } from "bcryptjs"; // error

export const hashFunction = ({
  payload = "",
  saltRounds = +process.env.SALT_ROUNDS,
}) => {
  if (payload == "") {
    return false;
  }
  const hashedPayload = bcrypt.hashSync(payload, saltRounds);
  return hashedPayload;
};

export const compareFunction = ({ payload = "", referenceData = "" }) => {
  if (payload == "" && referenceData == "") {
    return false;
  }
  const match = bcrypt.compareSync(payload, referenceData);
  return match;
};
