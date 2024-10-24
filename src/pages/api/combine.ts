import { Element, ElementModel } from "../../schema/element";
import connectDb from "../../libs/connect-db";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

type ResponseData = {
  message: string;
  element?: Element;
  discovered?: boolean;
  output?: string;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const w1 = req.query.word1 as string;
  const w2 = req.query.word2 as string;

  if (!w1 || !w2) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }

  await connectDb();

  const word1 = (w1 > w2 ? w1 : w2).toLowerCase();
  const word2 = (w1 > w2 ? w2 : w1).toLowerCase();

  const existingElement = await ElementModel.findOne({ word1, word2 });
  if (existingElement) {
    return res.status(200).json({
      message: "element already exists",
      element: {
        emoji: existingElement.emoji ?? "",
        text: existingElement.text ?? "",
        discovered: false,
      },
    });
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
        You are the best linguist in the world. 
        You should give a word that represents or relates to the two given words.

        Try to answer with a new word that has an actual meaning. 
        ONLY answer in the following format: [emoji],[text in the same language as the 2 words]`,
        },
        { role: "user", content: `"${word1}" and "${word2} ="` },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 512,
    });

    console.log("OpenAI chat completion response:", chatCompletion);

    // Ensure the response contains the required data
    if (!chatCompletion?.choices?.[0]?.message?.content) {
      return res.status(500).json({ message: "Invalid response from OpenAI" });
    }

    const output = chatCompletion.choices[0].message.content.trim();
    const splitOutput = output.split(",");
    if (splitOutput.length < 2) {
      return res
        .status(500)
        .json({ message: "Invalid response format", output });
    }

    const result = {
      emoji: splitOutput[0].trim(),
      text: splitOutput[1].trim(),
    };

    const existingElement2 = await ElementModel.findOne({
      text: result.text.toLowerCase(),
    });

    if (existingElement2) {
      result.emoji = existingElement2.emoji ?? "";
    }

    const newElement = new ElementModel({
      word1,
      word2,
      emoji: result.emoji,
      text: result.text.toLowerCase(),
    });
    await newElement.save();

    return res.status(200).json({
      message: "new element created",
      element: {
        emoji: result.emoji,
        text: result.text,
        discovered: true,
      },
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ message: "Error with OpenAI API", error });
  }
}
