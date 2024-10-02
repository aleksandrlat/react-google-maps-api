import {
  memo,
  useMemo,
  Children,
  useState,
  useEffect,
  useContext,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react'

import { unregisterEvents, applyUpdatersToPropsAndRegisterEvents } from '../../utils/helper'

import MapContext from '../../map-context'
import type { HasMarkerAnchor } from '../../types'

const eventMap = {
  onClick: 'click',
  onDblClick: 'dblclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragStart: 'dragstart',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseUp: 'mouseup',
  onRightClick: 'rightclick',
  onPositionChanged: 'position_changed',
  onZindexChanged: 'zindex_changed',
}

export interface AdvancedMarkerProps {
  // required
  /** Marker position. */
  position: google.maps.LatLng | google.maps.LatLngLiteral

  children?: ReactNode | undefined
  options?: google.maps.marker.AdvancedMarkerElementOptions | undefined
  /** If true, the marker can be dragged. Default value is false. */
  draggable?: boolean | undefined
  /** If true, the marker is visible */
  visible?: boolean | undefined
  /** All markers are displayed on the map in order of their zIndex, with higher values displaying in front of markers with lower values. By default, markers are displayed according to their vertical position on screen, with lower markers appearing in front of markers further up the screen. */
  zIndex?: number | undefined
  /** This event is fired when the marker icon was clicked. */
  onClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker icon was double clicked. */
  onDblClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is repeatedly fired while the user drags the marker. */
  onDrag?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user stops dragging the marker. */
  onDragEnd?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the user starts dragging the marker. */
  onDragStart?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a mousedown on the marker. */
  onMouseDown?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse leaves the area of the marker icon. */
  onMouseOut?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the mouse enters the area of the marker icon. */
  onMouseOver?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a mouseup on the marker. */
  onMouseUp?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired for a rightclick on the marker. */
  onRightClick?: ((e: google.maps.MapMouseEvent) => void) | undefined
  /** This event is fired when the marker position property changes. */
  onPositionChanged?: (() => void) | undefined
  /** This event is fired when the marker's zIndex property changes. */
  onZindexChanged?: (() => void) | undefined
  /** This callback is called when the marker instance has loaded. It is called with the marker instance. */
  onLoad?: ((marker: google.maps.marker.AdvancedMarkerElement) => void) | undefined
  /** This callback is called when the component unmounts. It is called with the marker instance. */
  onUnmount?: ((marker: google.maps.marker.AdvancedMarkerElement) => void) | undefined
}

const defaultOptions = {}

function AdvancedMarker({
  position,
  options,
  children,
  draggable,
  visible,
  zIndex,
  onClick,
  onDblClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onMouseOut,
  onMouseOver,
  onMouseUp,
  onMouseDown,
  onRightClick,
  onPositionChanged,
  onZindexChanged,
  onLoad,
  onUnmount
}: AdvancedMarkerProps): JSX.Element | null {
  const map = useContext<google.maps.Map | null>(MapContext)

  const [instance, setInstance] = useState<google.maps.marker.AdvancedMarkerElement | null>(null)

  const [dblclickListener, setDblclickListener] = useState<google.maps.MapsEventListener | null>(null)
  const [dragendListener, setDragendListener] = useState<google.maps.MapsEventListener | null>(null)
  const [dragstartListener, setDragstartListener] = useState<google.maps.MapsEventListener | null>(null)
  const [mousedownListener, setMousedownListener] = useState<google.maps.MapsEventListener | null>(null)
  const [mouseoutListener, setMouseoutListener] = useState<google.maps.MapsEventListener | null>(null)
  const [mouseoverListener, setMouseoverListener] = useState<google.maps.MapsEventListener | null>(null)
  const [mouseupListener, setMouseupListener] = useState<google.maps.MapsEventListener | null>(null)
  const [rightclickListener, setRightclickListener] = useState<google.maps.MapsEventListener | null>(null)
  const [clickListener, setClickListener] = useState<google.maps.MapsEventListener | null>(null)
  const [dragListener, setDragListener] = useState<google.maps.MapsEventListener | null>(null)
  const [positionChangedListener, setPositionChangedListener] = useState<google.maps.MapsEventListener | null>(null)
  const [zIndexChangedListener, setZindexChangedListener] = useState<google.maps.MapsEventListener | null>(null)

  // Order does matter
  useEffect(() => {
    if (instance !== null) {
      instance.map = map
    }
  }, [map])

  useEffect(() => {
    if (typeof options !== 'undefined' && instance !== null) {
      if (options.position) {
        instance.position = options.position
      }
      if (options.zIndex) {
        instance.zIndex = options.zIndex
      }
      if (options.draggable) {
        instance.draggable = options.draggable
      }
      if (options.visible) {
        instance.visible = options.visible
      }
    }
  }, [instance, options])

  useEffect(() => {
    if (typeof draggable !== 'undefined' && instance !== null) {
      instance.draggable = draggable
    }
  }, [instance, draggable])

  useEffect(() => {
    if (position && instance !== null) {
      instance.position = position
    }
  }, [instance, position])

  useEffect(() => {
    if (typeof visible !== 'undefined' && instance !== null) {
      instance.visible = visible
    }
  }, [instance, visible])

  useEffect(() => {
    if (instance && onDblClick) {
      if (dblclickListener !== null) {
        google.maps.event.removeListener(dblclickListener)
      }

      setDblclickListener(
        google.maps.event.addListener(instance, 'dblclick', onDblClick)
      )
    }
  }, [onDblClick])

  useEffect(() => {
    if (instance && onDragEnd) {
      if (dragendListener !== null) {
        google.maps.event.removeListener(dragendListener)
      }

      setDragendListener(
        google.maps.event.addListener(instance, 'dragend', onDragEnd)
      )
    }
  }, [onDragEnd])

  useEffect(() => {
    if (instance && onDragStart) {
      if (dragstartListener !== null) {
        google.maps.event.removeListener(dragstartListener)
      }

      setDragstartListener(
        google.maps.event.addListener(instance, 'dragstart', onDragStart)
      )
    }
  }, [onDragStart])

  useEffect(() => {
    if (instance && onMouseDown) {
      if (mousedownListener !== null) {
        google.maps.event.removeListener(mousedownListener)
      }

      setMousedownListener(
        google.maps.event.addListener(instance, 'mousedown', onMouseDown)
      )
    }
  }, [onMouseDown])

  useEffect(() => {
    if (instance && onMouseOut) {
      if (mouseoutListener !== null) {
        google.maps.event.removeListener(mouseoutListener)
      }

      setMouseoutListener(
        google.maps.event.addListener(instance, 'mouseout', onMouseOut)
      )
    }
  }, [onMouseOut])

  useEffect(() => {
    if (instance && onMouseOver) {
      if (mouseoverListener !== null) {
        google.maps.event.removeListener(mouseoverListener)
      }

      setMouseoverListener(
        google.maps.event.addListener(instance, 'mouseover', onMouseOver)
      )
    }
  }, [onMouseOver])

  useEffect(() => {
    if (instance && onMouseUp) {
      if (mouseupListener !== null) {
        google.maps.event.removeListener(mouseupListener)
      }

      setMouseupListener(
        google.maps.event.addListener(instance, 'mouseup', onMouseUp)
      )
    }
  }, [onMouseUp])

  useEffect(() => {
    if (instance && onRightClick) {
      if (rightclickListener !== null) {
        google.maps.event.removeListener(rightclickListener)
      }

      setRightclickListener(
        google.maps.event.addListener(instance, 'rightclick', onRightClick)
      )
    }
  }, [onRightClick])

  useEffect(() => {
    if (instance && onClick) {
      if (clickListener !== null) {
        google.maps.event.removeListener(clickListener)
      }

      setClickListener(
        google.maps.event.addListener(instance, 'click', onClick)
      )
    }
  }, [onClick])

  useEffect(() => {
    if (instance && onDrag) {
      if (dragListener !== null) {
        google.maps.event.removeListener(dragListener)
      }

      setDragListener(
        google.maps.event.addListener(instance, 'drag', onDrag)
      )
    }
  }, [onDrag])

  useEffect(() => {
    if (instance && onPositionChanged) {
      if (positionChangedListener !== null) {
        google.maps.event.removeListener(positionChangedListener)
      }

      setPositionChangedListener(
        google.maps.event.addListener(instance, 'position_changed', onPositionChanged)
      )
    }
  }, [onPositionChanged])

  useEffect(() => {
    if (instance && onZindexChanged) {
      if (zIndexChangedListener !== null) {
        google.maps.event.removeListener(zIndexChangedListener)
      }

      setZindexChangedListener(
        google.maps.event.addListener(instance, 'zindex_changed', onZindexChanged)
      )
    }
  }, [onZindexChanged])

  useEffect(() => {
    const markerOptions = {
      ...(options || defaultOptions),
      map,
      position,
    }

    const marker = new google.maps.marker.AdvancedMarkerElement(markerOptions)

    if (position) {
      marker.position = position
    }

    if (typeof visible !== 'undefined') {
      marker.visible = visible
    }

    if (typeof draggable !== 'undefined') {
      marker.draggable = draggable
    }

    if (typeof zIndex === 'number') {
      marker.zIndex = zIndex
    }

    if (onDblClick) {
      setDblclickListener(
        google.maps.event.addListener(marker, 'dblclick', onDblClick)
      )
    }

    if (onDragEnd) {
      setDragendListener(
        google.maps.event.addListener(marker, 'dragend', onDragEnd)
      )
    }

    if (onDragStart) {
      setDragstartListener(
        google.maps.event.addListener(marker, 'dragstart', onDragStart)
      )
    }

    if (onMouseDown) {
      setMousedownListener(
        google.maps.event.addListener(marker, 'mousedown', onMouseDown)
      )
    }

    if (onMouseOut) {
      setMouseoutListener(
        google.maps.event.addListener(marker, 'mouseout', onMouseOut)
      )
    }

    if (onMouseOver) {
      setMouseoverListener(
        google.maps.event.addListener(marker, 'mouseover', onMouseOver)
      )
    }

    if (onMouseUp) {
      setMouseupListener(
        google.maps.event.addListener(marker, 'mouseup', onMouseUp)
      )
    }

    if (onRightClick) {
      setRightclickListener(
        google.maps.event.addListener(marker, 'rightclick', onRightClick)
      )
    }

    if (onClick) {
      setClickListener(
        google.maps.event.addListener(marker, 'click', onClick)
      )
    }

    if (onDrag) {
      setDragListener(
        google.maps.event.addListener(marker, 'drag', onDrag)
      )
    }

    if (onPositionChanged) {
      setPositionChangedListener(
        google.maps.event.addListener(marker, 'position_changed', onPositionChanged)
      )
    }

    if (onZindexChanged) {
      setZindexChangedListener(
        google.maps.event.addListener(marker, 'zindex_changed', onZindexChanged)
      )
    }

    setInstance(marker)

    if (onLoad) {
      onLoad(marker)
    }

    return () => {
      if (dblclickListener !== null) {
        google.maps.event.removeListener(dblclickListener)
      }

      if (dragendListener !== null) {
        google.maps.event.removeListener(dragendListener)
      }

      if (dragstartListener !== null) {
        google.maps.event.removeListener(dragstartListener)
      }

      if (mousedownListener !== null) {
        google.maps.event.removeListener(mousedownListener)
      }

      if (mouseoutListener !== null) {
        google.maps.event.removeListener(mouseoutListener)
      }

      if (mouseoverListener !== null) {
        google.maps.event.removeListener(mouseoverListener)
      }

      if (mouseupListener !== null) {
        google.maps.event.removeListener(mouseupListener)
      }

      if (rightclickListener !== null) {
        google.maps.event.removeListener(rightclickListener)
      }

      if (clickListener !== null) {
        google.maps.event.removeListener(clickListener)
      }

      if (dragListener !== null) {
        google.maps.event.removeListener(dragListener)
      }

      if (positionChangedListener !== null) {
        google.maps.event.removeListener(positionChangedListener)
      }

      if (zIndexChangedListener !== null) {
        google.maps.event.removeListener(zIndexChangedListener)
      }

      if (onUnmount) {
        onUnmount(marker)
      }

      marker.setMap(null)
    }
  }, [])

  const chx = useMemo<ReactNode | null>(() => {
    return children
    ?  Children.map(children, child => {
      if (!isValidElement<HasMarkerAnchor>(child)) {
        return child
      }

      const elementChild: ReactElement<HasMarkerAnchor> = child

      return cloneElement(elementChild, { anchor: instance })
    })
    : null
  }, [children, instance])

  return <>{chx}</> || null
}

export default memo(AdvancedMarker)
