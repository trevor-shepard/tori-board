export interface Art {
	title: string
	text: string
	image: string
	x: number
	y: number
	id: string
	size: 'small' | 'medium' | 'large'
}

export interface ArtState {
	[id: string]: Art
}
