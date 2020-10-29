import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { AppThunk } from '..'

import { db, storage } from 'utils/firebase'

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
	const unsubscribe = db.collection('arts').onSnapshot(querySnapshot => {
		const arts: { [id: string]: Art } = {}

		querySnapshot.forEach(doc => {
			const art = doc.data() as Art
			arts[art.id] = art
		})

		dispatch(recieveArts(arts))
	})

	return unsubscribe
}

export const createArt = (
	title: string,
	text: string,
	photo: File,
	x: number,
	y: string
): AppThunk => async dispatch => {
	try {
		const ref = await db.collection('arts').doc()

		const image = await handleFireBaseUpload(`title/${title}-${ref.id}`, photo)

		const art = {
			title,
			text,
			image,
			x,
			y,
			id: ref.id
		}

		await ref.set(art)
	} catch (error) {
		debugger
	}
}

export const handleFireBaseUpload = async (path: string, photo: File) => {
	console.log('start of upload')
	if (photo === null)
		throw Error(`not an image, the image file is a ${typeof photo}`)
	const downloadURL = await storage
		.ref(path)
		.put(photo)
		.then(async () => {
			// gets the functions from storage refences the image storage in firebase by the children
			// gets the download url then sets the image from firebase as the value for the imgUrl key:
			return (await storage.ref(path).getDownloadURL()) as string
		})
		.catch(error => {
			const message = error.message
			console.log(message)
		})

	return downloadURL
}
