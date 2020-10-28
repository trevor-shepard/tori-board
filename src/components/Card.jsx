import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import Flipper from './Flipper'
import styled from '@emotion/styled'
import moment from 'moment'
import { useWindowDimensions } from 'utils/windowUtils'
document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())

const Card = ({ start, height, width, text, image }) => {
	const domTarget = React.useRef(null)
	const [mouseDown, setMouseDown] = useState(false)
	const [flip, setFlipped] = React.useState(false)
	const [prevCoordinates, setPrevCoordinates] = useState(start)

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
					
					const setx =  xDelta + start[0]
					const sety =  yDelta + start[1]

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

	useEffect(() => {
		if (flip) {
			// set({
			// 	x: windowWidth - width - 100,
			// 	y: 100 ,
			// 	scale: 1
			// })
		} else {
			set({ x: prevCoordinates[0], y: prevCoordinates[1], scale: 1 })
		}
	}, [flip])

	React.useEffect(bind, [bind])

	return (
		<AnimatedContainer
			height={!flip ? height : (windowHeight / 100) * 80}
			width={!flip ? width : (windowWidth / 100) * 40}
			ref={domTarget}
			style={{ x, y, scale }}
			onMouseUp={() => {
				if (!mouseDown) return setMouseDown(moment())
				const duration = moment().diff(mouseDown, 'seconds')

				if (duration < 1) {
					setFlipped(!flip)
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
	box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
	transition: box-shadow 0.5s, opacity 0.5s;
	will-change: transform;
	background-color: #ffffff;
	cursor: grab;
	overflow: hidden;
	touch-action: none;
	position: absolute;
	${({flip}) => flip && 'top: 10px;'}
	${({flip}) => flip && 'left: 10px;'}
`

export default Card
