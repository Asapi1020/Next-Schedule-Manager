import { NextApiRequest } from "next";

export default interface AuthenticatedNextApiRequest extends NextApiRequest {
	accountId: string;
}
