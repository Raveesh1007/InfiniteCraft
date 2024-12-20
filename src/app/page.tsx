"use client";
import { useEffect, useMemo, useState } from "react";
import { SideBar } from "../components/sidebar";
import { Element, PlacedElements } from "../schema/element";
import { defaultElement } from "../constants/default-elements";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { Playground } from "../components/playground";
import { v4 as uuid } from "uuid";
import { ElementCard } from "../components/elementcard";
import axios from "axios";

export default function Home() {
  const [elements, setElements] = useState<Element[]>([]);
  const [placedElements, setPlacedElementss] = useState<PlacedElements[]>([]);

  const [activeElement, setActiveElement] = useState<Element | null>(null);
  const [activePlacedElements, setActivePlacedElements] =
    useState<PlacedElements | null>(null);

  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      setMouseCoords({
        x: event.clientX,
        y: event.clientY,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  useEffect(() => {
    const items = localStorage.getItem("elements");
    if (!items) {
      setElements(defaultElement);
      return;
    }
    const parsedItems = JSON.parse(items);
    if (parsedItems.length === 0) {
      setElements(defaultElement);
      return;
    }
    setElements(parsedItems);
  }, []);

  useEffect(() => {
    if (elements.length === 0) return;
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current && active.data.current.type === "element") {
      if (event.active.data.current) {
        setActiveElement(event.active.data.current.element);
      }
    } else if (active.data.current && active.data.current.type === "placed-element") {
      if (event.active.data.current) {
        setActivePlacedElements(event.active.data.current.element);
      }
    }
  };

  const handleCombineElements = (
    e1: PlacedElements,
    e2: PlacedElements | Element
  ) => {
    if ("id" in e2) {
      setPlacedElementss((prev) =>
        prev
          .filter((v) => v.id !== e2.id)
          .map((v) =>
            v.id === e1.id
              ? {
                  ...v,
                  isLoading: true,
                }
              : v
          )
      );
    } else {
      setPlacedElementss((prev) =>
        prev.map((v) =>
          v.id === e1.id
            ? {
                ...v,
                isLoading: true,
              }
            : v
        )
      );
    }

    axios
      .get("/api/combine", {
        params: {
          word1: e1.text,
          word2: e2.text,
        },
      })
      .then(({ data }) => {
        setPlacedElementss((prev) =>
          prev.map((v) =>
            v.id === e1.id
              ? {
                  ...data.element,
                  id: uuid(),
                  x: v.x,
                  y: v.y,
                  isLoading: false,
                }
              : v
          )
        );
        if (elements.every((element) => element.text !== data.element.text)) {
          setElements((prev) => [...prev, data.element]);
        }
      })
      .catch((e) => {
        window.alert(
          "Something when wrong! Failed to combine elements" + e.toString()
        );
        setPlacedElementss((prev) =>
          prev.map((v) =>
            v.id === e1.id
              ? {
                  ...v,
                  isLoading: false,
                }
              : v
          )
        );
      });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log("active", active);
    console.log("over", over);

    if (
      active.data.current && active.data.current.type === "placed-element" &&
      over &&
      over && over.data.current && over.data.current.type === "sidebar"
    ) {
      const element = active.data.current.element;
      const newPlacedElementss = placedElements.filter(
        (v) => v.id !== element.id
      );
      setPlacedElementss(newPlacedElementss);
    } else if (
      active.data.current && active.data.current.type === "placed-element" &&
      over &&
      over?.data?.current?.type === "placed-element"
    ) {
      handleCombineElements(
        over.data.current.element,
        active.data.current.element
      );
    } else if (active.data.current && active.data.current.type === "placed-element") {
      const element = active.data.current.element;
      const newPlacedElementss = placedElements.map((v) =>
        v.id === element.id
          ? {
              ...element,
              x: element.x + event.delta.x,
              y: element.y + event.delta.y,
            }
          : v
      );
      setPlacedElementss(newPlacedElementss);
    }

    if (
      active.data.current && active.data.current.type === "element" &&
      over &&
      over?.data?.current?.type === "Playground"
    ) {
      const element = active.data.current.element;
      const placedElements = {
        ...element,
        id: uuid(),
        x: mouseCoords.x,
        y: mouseCoords.y,
      };
      setPlacedElementss((prev) => [...prev, placedElements]);
    } else if (
      active.data.current?.type === "element" &&
      over &&
      over?.data?.current?.type === "placed-element"
    ) {
      handleCombineElements(
        over.data.current.element,
        active.data.current.element
      );
    }

    setActiveElement(null);
    setActivePlacedElements(null);
  };

  const isLoading = useMemo(() => {
    return placedElements.some((v) => v.isLoading);
  }, [placedElements]);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main className="flex h-screen flex-col">
        <div className="grid grid-cols-12 h-full">
          <Playground
            setElements={setElements}
            setPlacedElements={setPlacedElementss}
            placedElements  ={placedElements}
            isLoading={isLoading}
          />
          <SideBar elements={elements} isLoading={isLoading} />
        </div>
      </main>
      <DragOverlay dropAnimation={null}>
        {activeElement && <ElementCard element={activeElement} />}
        {activePlacedElements && <ElementCard element={activePlacedElements} />}
      </DragOverlay>
    </DndContext>
  );
}