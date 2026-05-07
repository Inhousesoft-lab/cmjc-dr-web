import * as React from "react";

type DragOffset = {
  x: number;
  y: number;
};

type DragStart = DragOffset & {
  originX: number;
  originY: number;
};

export default function useDraggableDialog() {
  const [dragOffset, setDragOffset] = React.useState<DragOffset>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef<DragStart | null>(null);

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragStartRef.current) return;

      const { x, y, originX, originY } = dragStartRef.current;
      setDragOffset({
        x: originX + (event.clientX - x),
        y: originY + (event.clientY - y),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        originX: dragOffset.x,
        originY: dragOffset.y,
      };
      setIsDragging(true);
    },
    [dragOffset.x, dragOffset.y],
  );

  const handleDragControlMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
    },
    [],
  );

  return {
    paperSx: {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
    },
    handleDragStart,
    handleDragControlMouseDown,
  };
}
