import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { AppThunk } from '..'

import { db } from 'utils/firebase'

import { Art, ArtState } from 'types'
const initialState: ArtState = {}

const art = createSlice({
	name: 'art',
	initialState,
	reducers: {
		recieveArt(state, action: PayloadAction<Art>) {
			const art = action.payload
			return {
				[art.id]: art
			}
		},
		recieveArts(state, action: PayloadAction<ArtState>) {
			const arts = action.payload
			return {
				...state,
				...arts
			}
		},

		clear() {
			return {}
		}
	}
})

export const { recieveArt, recieveArts } = art.actions

export default art.reducer

export const fetchArt = (): AppThunk => async dispatch => {
	await db
		.collection('arst')
		.get()
		.then(querySnapshot => {
			try {
				const arts: ArtState = {}
				querySnapshot.forEach(doc => {
					const art = doc.data() as Art
					arts[art.id] = art
					dispatch(recieveArt(art))
				})

				return arts
			} catch (e) {}
		})
}

export const subscribeToArts = (dispatch: Dispatch<any>) => {
	const unsubscribe = db
		.collection('arts')
		.onSnapshot(querySnapshot => {
			const arts: { [id: string]: Art } = {}
			
			querySnapshot.forEach(doc => {
				const art = doc.data() as Art
				arts[art.id] = art
			})
			
			dispatch(recieveArts(arts))
		})

	return unsubscribe
}
