import React, { useRef } from 'react'
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd'
import { XYCoord } from 'dnd-core'
import './dnd.css';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';


export interface DragSourceProps {
  id: any
  index: number
  itemType: string
  moveCard: (dragIndex: number, hoverIndex: number) => void
  updateOrder: () => void
}

interface DragItem {
  index: number
  id: string
  type: string
}

export const DragSource = (props) => {
  const { id, index, itemType, moveCard, updateOrder, option = false, onActive } = props;
  const ref = useRef<HTMLDivElement>(null)
  
  const [{ handlerId }, drop] = useDrop({
    accept: itemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const hoverfullY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top);

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      /***********************************
      */

      //console.log("hoverBoundingRect = ", hoverBoundingRect.top);
      //console.log("window.scrollY = ", window.scrollY);

      //if (clientOffset.y < 200) {
      //  window.scrollBy(0, -2);
      //}
      //else if (clientOffset.y > 400) {
      //  window.scrollBy(
      //    {
      //      top: 30,
      //      left: 0,
      //      behavior: 'smooth'
      //    });
      //}

      //if (hoverBoundingRect.top < 50 || clientOffset.y < 120) {
      //    window.scrollBy(0, -2);
      //}

      /*************************************
      */

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      //if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      //  return // Middle / half
      //}
      if (dragIndex > hoverIndex && hoverClientY > 20) {
        return
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: itemType,
    item: () => {
      return { id, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !onActive || option,
    end(item, monitor) {
      updateOrder();
    }
  })

  const opacity = isDragging ? 0 : 1;
  const maxHeight = isDragging ? 50 : undefined;

 
  preview(drop(ref))

  return (
    <section className="outerDrag bg-white" ref={ref} style={{ opacity, maxHeight }} data-handler-id={handlerId}>
      {option ? (
        <div className="innerDrag innerVerDrag">
          <div ref={drag} className="handleBar handleVerBar">
            <MdDragIndicator className="handleIcon" />
          </div>
          {props.children}
        </div>
      ) : (
          <div className="innerDrag innerHorDrag">
            <div ref={drag} className={`handleBar handleHorBar ${onActive ? 'disabled' : ''}`}>
              <MdDragHandle className="handleIcon d-block" />
            </div> 
          {props.children}
        </div>
      )}
    </section>
  )
}
