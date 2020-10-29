import React, { FunctionComponent, useEffect } from 'react'
import styled from '@emotion/styled'
import Card from 'components/Card'
import Modal from 'components/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { subscribeToArts, clear } from 'store/slices/artSlice'
const Board: FunctionComponent = () => {
	const arts = useSelector((state: RootState) => state.art)
	const dispatch = useDispatch()
	useEffect(() => {
		const unsubscribe = subscribeToArts(dispatch)
		return () => {
			unsubscribe()
		}
	}, [dispatch])

	const Cards = Object.values(arts).map(({ x, y, text, image }, i) => {
		return (
			<Card
				key={`${i}-art-card`}
				text={text}
				image={image}
				start={[x, y]}
				height={100}
				width={100}
			/>
		)
	})

	return (
		<Container>
			{/* <div onClick={()=> dispatch(clear())}>clear this board</div> */}
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
