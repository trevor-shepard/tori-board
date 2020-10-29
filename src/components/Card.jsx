import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import Flipper from './Flipper'
import styled from '@emotion/styled'
import moment from 'moment'
import { useWindowDimensions } from 'utils/windowUtils'
document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())

const Card = ({ start, height, width, text, image }) => {
	// state
	const domTarget = React.useRef(null)
	const [mouseDown, setMouseDown] = useState(false)
	const [flip, setFlipped] = React.useState(false)

	// hooks
	const { windowWidth, windowHeight } = useWindowDimensions()

	const [{ x, y, scale }, set] = useSpring(() => ({
		scale: 1,
		x: start[0],
		y: start[1],
		config: { mass: 5, tension: 350, friction: 40 }
	}))

	const bind = useGesture(
		{
			onDrag: ({ offset: [xDelta, yDelta], initial: [initialx, initialy] }) => {
				if (!flip) {
					if (xDelta === 0 && yDelta === 0) return

					const setx = xDelta + start[0]
					const sety = yDelta + start[1]

					set({
						x: setx,
						y: sety,
						scale: 1
					})
				}
			},

			onMove: ({ dragging }) => {
				setMouseDown(false)
				!dragging && set({ scale: 1.1 })
			},
			onHover: ({ hovering }) => !hovering && set({ scale: flip ? 1 : 1 })
		},
		{ domTarget, eventOptions: { passive: false } }
	)

	React.useEffect(bind, [bind])

	return (
		<AnimatedContainer
			height={!flip ? height : (windowHeight / 100) * 80}
			width={!flip ? width : (windowWidth / 100) * 40}
			ref={domTarget}
			style={{ x, y, scale }}
			flip={flip}
			onMouseUp={() => {
				if (!mouseDown) return setMouseDown(moment())
				const duration = moment().diff(mouseDown, 'seconds')

				if (duration < 1) {
					setFlipped(!flip)
					setMouseDown(false)
				} else {
					setMouseDown(moment())
				}
			}}
		>
			<Flipper text={text} image={image} flip={flip} />
		</AnimatedContainer>
	)
}

const AnimatedContainer = styled(animated.div)`
	width: ${({ width }) => `${width}px`};
	height: ${({ height }) => `${height}px`};
	background: grey;
	border-radius: 5px;
	will-change: transform;
	background-color: #ffffff;
	cursor: grab;
	overflow: hidden;
	touch-action: none;
	position: ${({ flip }) => (flip ? 'fixed' : 'absolute')};
	${({ flip }) => flip && 'border: 10px solid grey;'}
	${({ flip }) => flip && 'z-index: 20;'}
`

export default Card
