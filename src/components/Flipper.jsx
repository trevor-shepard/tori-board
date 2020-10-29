import React from 'react'
import styled from '@emotion/styled'
import { useSpring, animated as a } from 'react-spring'

function Card({ flip, text, image }) {
	const { transform, opacity } = useSpring({
		opacity: flip ? 1 : 0,
		transform: `perspective(600px) rotateX(${flip ? 180 : 0}deg)`,
		config: { mass: 5, tension: 500, friction: 80 },
		position: flip ? 'absolute' : 'relative',
		right: flip ? '100px' : '0',
		top: flip ? '100px' : '0'
	})

	const printableText = text.split('*_*').map((value, index) => {
		return (
			<span key={index}>
				{value}
				<br />
			</span>
		)
	})

	return (
		<Container>
			<Front
				class="c back"
				style={{ opacity: opacity.interpolate(o => 1 - o), transform }}
				image={image}
			/>

			<Back
				class="c front"
				style={{
					opacity,
					transform: transform.interpolate(t => `${t} rotateX(180deg)`)
				}}
			>
				{printableText}
			</Back>
		</Container>
	)
}

const Container = styled.div`
	width: 100px;
	height: 100px;
`

const c = styled(a.div)`
	position: absolute;
	height: 100%;
	width: 100%;
	cursor: pointer;
	will-change: transform, opacity;
`

const Back = styled(c)`
	z-index: 20px;
	background-size: cover;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
const Front = styled(c)`
	max-width: 100%;
	max-height: 100%;
	background-size: cover;
	background-image: url(${({ image }) => image});
`

export default Card
