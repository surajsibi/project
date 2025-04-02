import { nanoid } from "nanoid";
import AsyncHandler from "../utils/AsyncHandler.js";
import { Url } from "../models/url.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const shortenUrl = AsyncHandler(async (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    throw new ApiError(400, "original url is required");
  }
  const shortUrl = nanoid(6);
  const url = await Url.create({
    originalUrl,
    shortUrl,
    createdBy: req.user._id,
  });
  res.status(201).json(new ApiResponse({ url: url }));
});

export const redirectUrl = AsyncHandler(async (req, res) => {
  const { shortId } = req.params
  
  // console.log(req.params);
  console.log(shortId,"this is short param");
  const urlData = await Url.findOne({ shortUrl:shortId });
  if (!urlData) throw new ApiError(404, "Short URL not found");

  // Increment visit count
  urlData.vistCount += 1;
  await urlData.save();
  res.redirect(urlData.originalUrl);
});
