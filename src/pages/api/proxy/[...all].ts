import { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const isDevelopment = process.env.NODE_ENV !== "production";

const postRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  isDevelopment
    ? await httpProxyMiddleware(req, res, {
        target: process.env.API_URL,
        changeOrigin: true,
        pathRewrite: [
          {
            patternStr: "^/api/proxy/delete",
            replaceStr: "/ik_request/api/delete.php",
          },
          {
            patternStr: "^/api/proxy/cellarToFrontPatch",
            replaceStr: "/ik_request/api/cellarToFront.php",
          },
          {
            patternStr: "^/api/proxy/frontToCellarPatch",
            replaceStr: "/ik_request/api/frontToCellar.php",
          },
          {
            patternStr: "^/api/proxy/emptyBottlePatch",
            replaceStr: "/ik_request/api/onEmptyBottle.php",
          },
          {
            patternStr: "^/api/proxy/onOrderPatch",
            replaceStr: "/ik_request/api/onOrder.php",
          },
          {
            patternStr: "^/api/proxy/offOrderPatch",
            replaceStr: "/ik_request/api/offOrder.php",
          },
        ],
      })
    : // 後にproductionの方を実装
      res.status(404).send(null);
};
export default postRequest;
