import mongoose from "mongoose";

export interface element{
    text: string;
    emoji: string;
    discovered: boolean;
}

export interface PlacedElements extends element{
    id: number;
    x: number;
    y: number;
    isLoading?: boolean; 
}

const ElementSchema = new mongoose.Schema(
    {
        word1: String,
        word2: String,
        text: String,
        emoji: String,
    },
    {
        timestamps: true,
    }
);

export const ElementModel = mongoose.model('Element', ElementSchema);