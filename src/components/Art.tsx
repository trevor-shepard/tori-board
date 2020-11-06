import React, { useState, useEffect, FunctionComponent } from 'react'
import { useSpring, animated } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import Poem from './Poem'
import styled from '@emotion/styled'
import moment, { Moment } from 'moment'
import { updatePosition } from 'store/slices/artSlice'
import { useWindowDimensions } from 'utils/windowUtils'
document.addEventListener('gesturestart', e => e.preventDefault())
document.addEventListener('gesturechange', e => e.preventDefault())

interface Props {
	start: [number, number]
	height: number
	width: number
	text: string
	image: string
	title: string
	id: string
}

const Card: FunctionComponent<Props> = ({
	start,
	height,
	width,
	text,
	image,
	title,
	id
}) => {
	// state
	const domTarget = React.useRef(null)
	const [mouseDown, setMouseDown] = useState<boolean | Moment>(false)
	const [show, setShow] = useState(false)
	const [dragging, setDragging] = useState(false)
	const [hovering, setHovering] = useState(false)
	// hooks
	const { windowWidth, windowHeight } = useWindowDimensions()
	const [{ x, y, scale }, set] = useSpring(() => ({
		scale: 1,
		x: start[0],
		y: start[1],
		opacity: 1,
		config: { mass: 5, tension: 350, friction: 40 }
	}))

	const titleProps = useSpring({
		reverse: !hovering,
		from: { scale: 0, opacity: 0, transform: 'scale(0)' },
		to: { scale: 1, opacity: 1, transform: 'scale(1)' }
	})

	const bind = useGesture(
		{
			onDrag: ({
				offset: [xDelta, yDelta],
				lastOffset: [lastXDelta, lastYDelta]
			}) => {
				if (xDelta === 0 && yDelta === 0) return
				if (show) return

				if (!show) {
					if (xDelta === 0 && yDelta === 0) return

					const setx = xDelta + start[0] - lastXDelta
					const sety = yDelta + start[1] - lastYDelta

					set({
						x: setx,
						y: sety,
						scale: 1
					})
				}
			},
			onMove: ({ dragging }) => {
				if (show) return
				setMouseDown(false)
				!dragging && set({ scale: 1.1 })
			},
			onHover: ({ hovering }) => {
				if (show) return
				!hovering && set({ scale: show ? 1 : 1 })
			}
		},
		{ domTarget, eventOptions: { passive: false } }
	)

	// @ts-ignore
	useEffect(bind, [bind])

	useEffect(() => {
		if (show) {
			set({ scale: 0 })
		} else {
			set({ scale: 1 })
		}
	}, [set, show])

	useEffect(() => {
		if (!dragging && (x.get() !== start[0] || y.get() !== start[1]))
			updatePosition(id, x.get(), y.get())
	}, [dragging])

	// methods
	const handleDoubleClick = () => {
		console.log('mouseup')
		setDragging(false)
		if (!mouseDown) return setMouseDown(moment())
		const duration = moment().diff(mouseDown as Moment, 'seconds')

		if (duration < 1) {
			setShow(!show)
			setMouseDown(false)
		} else {
			setMouseDown(moment())
		}
	}

	console.log('height, width', height, width)
	return (
		<>
			{<Poem show={show} text={text} title={title} hide={handleDoubleClick} />}
			<AnimatedContainer
				height={!show ? height : (windowHeight / 100) * 30}
				width={!show ? width : (windowWidth / 100) * 30}
				ref={domTarget}
				style={{ x, y, scale }}
				onMouseUp={handleDoubleClick}
				onMouseDown={() => setDragging(true)}
				onMouseEnter={() => setHovering(true)}
				onMouseLeave={() => setHovering(false)}
				dragging={dragging}
			>
				<Image image={image} />

				{hovering && (
					<Title
						// @ts-ignore
						style={{
							scale: titleProps.scale,
							opacity: titleProps.opacity,
							transform: titleProps.transform
						}}
					>
						{title}
					</Title>
				)}
			</AnimatedContainer>
		</>
	)
}

const AnimatedContainer = styled(animated.div)<{
	height: number
	width: number
	dragging: boolean
}>`
	height: ${({ height }) => height}px;
	width: ${({ width }) => width}px;
	background: grey;
	border-radius: 5px;
	will-change: transform;
	background-color: #ffffff;
	cursor: ${({ dragging }) => (dragging ? 'grabbing' : 'grab')};
	touch-action: none;
	position: relative;
`

const Image = styled.div<{ image: string }>`
	background-size: cover;
	background-image: url(${({ image }) => image});
	width: 100%;
	height: 100%;
`
const Title = styled(animated.div)`
	position: absolute;
	font-family: Amari;
	margin-top: 20px;
	margin-bottom: 20px;
`

export default Card
