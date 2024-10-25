import mongoose, {Model} from "mongoose";

export interface Element{
    text: string;
    emoji: string;
    discovered: boolean;
}

export interface PlacedElements extends Element{
    id: number;
    x: number;
    y: number;
    isLoading?: boolean; 
}

const ElementSchema = new mongoose.Schema(
    {
        word1: {type: String, required: true},
        word2: {type: String, required: true},
        text: {type: String, required: true},
        emoji: {type: String, required: true},  
    },
    {
        timestamps: true,
    }
);

export const ElementModel: Model<Element> = mongoose.models.Element || mongoose.model<Element>("Element", ElementSchema);
