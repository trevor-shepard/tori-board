import React, { FunctionComponent, useEffect } from 'react'
import styled from '@emotion/styled'
import Art from 'components/Art'
import Modal from 'components/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { subscribeToArts } from 'store/slices/artSlice'
const Board: FunctionComponent = () => {
	const arts = useSelector((state: RootState) => state.art)
	const dispatch = useDispatch()
	useEffect(() => {
		const unsubscribe = subscribeToArts(dispatch)
		return () => {
			unsubscribe()
		}
	}, [dispatch])

	const Cards = Object.values(arts).map(
		({ x, y, text, image, title, id, size }, i) => {
			let height, width
			switch (size) {
				case 'large':
					height = 150
					width = 150
					break
				case 'medium':
					height = 100
					width = 100
					break
				case 'small':
					height = 75
					width = 75
					break
				default:
					height = 75
					width = 75
					break
			}
			return (
				<Art
					key={`${i}-art-card`}
					text={text}
					image={image}
					start={[x, y]}
					height={height}
					width={width}
					title={title}
					id={id}
				/>
			)
		}
	)

	return (
		<Container>
			<Modal />
			{Cards}
		</Container>
	)
}

const Container = styled.div`
	height: 100vh;
	width: 100vw;
	position: relative;
	overflow: scroll;
`
export default Board
