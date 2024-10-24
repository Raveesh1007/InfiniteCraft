import { AlarmClock, ArrowDownAZ, Smile } from "lucide-react";

export enum Sort{
    Time,
    Emoji,
    Name,
}

export const SortButton = ({sort, onClick}: {sort: Sort, onClick: () => void}) =>{
    if(sort === Sort.Time){
        return(
            <button onClick={onClick} className="flex flex-1 border gap-2 justify-center items-center">
                <AlarmClock /> Sort By Time
            </button>
        );
    } else if (sort === Sort.Emoji){
        return (
            <button onClick = {onClick} className="flex flex-1 border gap-2 justify-center items-center">
                <Smile /> Sort By Emoji
            </button>
        );
    }else if(sort === Sort.Name){
        return(
            <button onClick={onClick} className="flex flex-1 border gap-2 justify-center items-center">
                <ArrowDownAZ /> Sort by Name
            </button>
        );
    }
};
