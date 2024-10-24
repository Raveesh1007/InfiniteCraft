"use client"
import { Element, PlacedElements } from "../schema/element";
import { defaultElement } from "../constants/default-elements";
import { ElementCardDraggableWrapper } from "./elementcard";
import { RotateCcw, Trash } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import ChangeThemeButton from "./changetheme";
import Image from "next/image";

export const Playground = ({
    placedElements,
    setPlacedElements,
    setElements,
    isLoading,
}: {
    placedElements: PlacedElements[];
    setPlacedElements: (v: PlacedElements[]) => void;
    setElements: (v: Element[]) => void;
    isLoading: boolean;
}) => {
    const onClearPlacedElements = () => {
        setPlacedElements([]);
    };

    const onClearElements = () => {
        const userConfirmed = window.confirm(
            "Are you sure you want to clear the progress? You won't recover your progress."
        );
        if (userConfirmed) {
            onClearPlacedElements();
            setElements(defaultElement);
        }
    };

    const { setNodeRef } = useDroppable({
        id: "Playground", // This must match the ID checked in handleDragEnd
        data: {
            type: "Playground",
        },
        disabled: isLoading,
    });

    return (
        <div className="col-span-9 h-full w-full relative" ref={setNodeRef}>
            {placedElements.map((element, index) => (
                <ElementCardDraggableWrapper
                    key={index}
                    element={element}
                    isLoading={isLoading}
                />
            ))}
            <div
                className="absolute top-0 right-0 p-4 cursor-pointer hover:text-red-400"
                onClick={onClearElements}
            >
                <Trash />
            </div>
            <div
                className="absolute bottom-0 left-0 p-4 cursor-pointer hover:text-red-400"
                onClick={onClearElements}
            >
                <RotateCcw />
            </div>
            <div className="absolute top-0 left-0 p-4 cursor-pointer">
                <ChangeThemeButton />
            </div>
            <a href="https://github.com/Raveesh1007/InfiniteCraft" target="_blank">
                <div className="absolute flex items-center bottom-0 right-0 p-4 gap-2">
                    <Image
                        src="github-mark.svg"
                        className="block dark:hidden"
                        alt="github logo"
                        width={25}
                        height={25}
                        loading="lazy"
                    />
                    <Image
                        src="./github-mark-white.svg"
                        className="hidden dark:block"
                        alt="github logo"
                        width={25}
                        height={25}
                        loading="lazy"
                    />
                    <p>Infinite Craft Next.Js by Raveesh</p>
                </div>
            </a>
        </div>
    );
};
