import {Search, Telescope} from "lucide-react"
import {useMemo, useState } from "react";
import {Sort, SortButton} from "./sortbutton";
import {Element} from "../schema/element"
import { ElementCardSideBarWrapper } from "./elementcard";
import { useDraggable } from "@dnd-kit/core";

export const sidebar = ({
    elements,
    isLoading,
}:{
    elements: Element[];
    isLoading: boolean;
}) =>{
    const [sort, setSort] = useState(Sort.Time);
    const [discoveries, setIsDiscoveries] = useState(false);
    const[word, setWord] = useState("");

    const onRotateSort = () => {
        switch(sort){
            case Sort.Time:
                setSort(Sort.Name);
                break;
            case Sort.Name:
                setSort(Sort.Emoji);
                break;
            case Sort.Emoji:
                setSort(Sort.Time);
                break;
        }
    };

    const sortedElement = useMemo(() =>{
        const sortedElements = [...elements];
        switch(sort){
            case Sort.Time:
                return sortedElement;
            case Sort.Name:
                return sortedElement.sort((a,b) => a.text.localeCompare(b.text));
            case Sort.Emoji:
                return sortedElement.sort((a,b) => a.emoji.localCompare(b.emoji));
        }
    })
}
})