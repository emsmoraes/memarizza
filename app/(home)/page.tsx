"use client";
import React, { useState } from "react";
import RichText from "../_components/form/RichText";
import PageHeader from "../_components/PageHeader";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";

export default function Home() {
  const [content, setContent] = useState<string>("");

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const [items, setItems] = useState([
    { id: "1", content: "Item 1" },
    { id: "2", content: "Item 2" },
    { id: "3", content: "Item 3" },
  ]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedItems = Array.from(items);
    const [movedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, movedItem);

    setItems(updatedItems);
  };

  return (
    <>
      <PageHeader />
      <RichText content={content} onChange={handleContentChange} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-queue">
          {(provided: DroppableProvided) => (
            <div
              className="mt-3"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {(items ?? []).map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided: DraggableProvided) => (
                    <div
                      className="mb-[1rem] rounded-[.9rem] bg-white px-[1rem] py-[.8rem] shadow-md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="w-full bg-red-600 py-3"></div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
