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
		);
	  }) 

	return (
		<div>
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
				{ printableText }
			</Back>
		</div>
	)
}

const c = styled(a.div)`
	position: absolute;
	height: 100%;
	width: 100%;
	cursor: pointer;
	will-change: transform, opacity;
`

const Back = styled(c)`
	background-size: cover;
	background-color: #ffffff;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`
const Front = styled(c)`
	background-size: cover;
	background-image: url(${({image}) => image});
`

export default Card
