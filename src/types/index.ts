export interface Art {
	title: string
	text: string
	image: string
	x: number
	y: number
	id: string
}

export interface ArtState {
	[id: string]: Art
}
