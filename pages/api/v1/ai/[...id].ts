/* eslint-disable no-underscore-dangle */
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import axios from "axios";
import {
  Options,
  createProxyMiddleware,
  responseInterceptor,
} from "http-proxy-middleware";
import { Request, Response } from "http-proxy-middleware/dist/types";
import type * as http from "http";
import { writeFile } from "fs";
import { parse, stringify, toJSON, fromJSON } from "flatted";
import supabase from "../../supabase-server.component";

// Function to construct the OpenAI URL by replacing the domain
const constructOpenAIUrl = (req: NextApiRequest): string => {
  const baseUrl = "https://api.openai.com/v1/";
  const path = req.url?.replace("/api/v1/ai/", ""); // Adjust based on your API routing
  return `${baseUrl}${path}`;
};

const processInterceptedResponse = async () => {};

/** @type {import('http-proxy-middleware/dist/types').Options} */
const APIProxyOptions: Options = {
  target: "https://api.openai.com/v1/",
  changeOrigin: true,
  pathRewrite: {
    "/api/v1/ai": "", // this will remove '/api' from the request path
  },
  onProxyReq: (proxyReq: any, req: Request, res: Response) => {
    // console.log("oi ini gw send ya", proxyReq)
  },
  onError: (err: Error, req: Request, res: Response) => {
    res.status(500).json({ message: "Something went wrong.", error: err });
  },
  selfHandleResponse: true,
  onProxyRes: responseInterceptor(
    async (responseBuffer, proxyRes, req, res) => {
      const response = responseBuffer.toString("utf8"); // convert buffer to string
      console.log(
        "%cpages/api/v1/ai/[...ID].ts:40 response",
        "color: #007acc;",
        response
      );
      return response;
    }
  ),
  secure: false,
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxyMiddleware: any = createProxyMiddleware(APIProxyOptions as Options);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return proxyMiddleware(req, res);
}
