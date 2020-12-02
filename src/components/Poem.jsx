import React from 'react'
import styled from '@emotion/styled'
import { useSpring, animated } from 'react-spring'

function Poem({ text, hide, title, show }) {
	const { scale, transform, opacity } = useSpring({
		reverse: !show,
		from: { scale: 0, opacity: 0, transform: 'scale(0)' },
		to: { scale: 1, opacity: 1, transform: 'scale(1)' },
		config: { duration: 500 }
	})

	const printableText = text.split('*').map((value, index) => {
		return (
			<Line key={index}>
				{value}
				<br />
			</Line>
		)
	})

	return (
		<Container onClick={hide} style={{ transform, opacity, scale }} show={show}>
			<Title>{title}</Title>
			{printableText}
		</Container>
	)
}

const Container = styled(animated.div)`
	position: fixed;
	right: 1%;
	top: 10%;
	max-height: 80%;
	width: 45%;
	border: 1px solid grey;
	border-radius: 2%;
	padding-bottom: 30px;
	overflow: scroll;
	cursor: pointer;
	${({ show }) => !show && 'display: none;'}
`
const Title = styled.div`
	font-family: Amiri;
	margin-top: 20px;
	margin-bottom: 20px;
`
const Line = styled.div`
	font-family: Amiri;
	width: 100%;
	display: flex;
	padding-left: 4%;
	padding-bottom: 1%;
`

export default Poem
