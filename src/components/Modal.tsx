import React, { useState, FormEvent } from 'react'
import styled from '@emotion/styled'
import { useSpring, animated as a } from 'react-spring'
import { Add, Close } from 'assets/icons'
import { useDispatch } from 'react-redux'
import { useWindowDimensions } from 'utils/windowUtils'
import { createArt } from 'store/slices/artSlice'
import Input from 'components/Input'
import { AddImage } from 'assets/icons'

const Modal = () => {
	// state
	const [show, setshow] = useState(false)
	const [title, settitle] = useState('')
	const [text, settext] = useState('')
	const [size, setSize] = useState<'small' | 'medium' | 'large' >('medium')
	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState<null | File> (null)
	const [fileAsImage, setFileAsImage] = useState<null | string>(null)
	const [loading, setLoading] = useState(false)

	// hooks/springs
	const dispatch = useDispatch()
	const { windowWidth, windowHeight } = useWindowDimensions()
	const { transform, opacity } = useSpring({
		opacity: show ? 1 : 0,
		transform: `perspective(600px) rotateX(${show ? 180 : 0}deg)`,
		config: { mass: 5, tension: 500, friction: 80 },
		position: show ? 'absolute' : 'relative',
		right: show ? '100px' : '0',
		top: show ? '100px' : '0'
	})

	// methods
	const handleImageAsFile = (event: FormEvent) => {
		const target = event.target  as HTMLInputElement
		const files = target.files
		if (files === null) return setError('no image found')
		const file = files[0]
		const image = URL.createObjectURL(file)
		setImageAsFile(file)
		setFileAsImage(image)
	}

	const handleSubmit = async () => {
		try {
			setLoading(true)
			if (!imageAsFile) return setError('please provide a picture')
			await dispatch(
				createArt(
					title,
					text,
					imageAsFile,
					Math.abs(Math.floor(Math.random() * windowWidth)),
					Math.abs(Math.floor(Math.random() * windowHeight)),
					size
				)
			)
			setshow(false)
			settext('')
			settitle('')
			setError('')
			setImageAsFile(null)
			setFileAsImage(null)
		} catch (error) {
			setError('whoops try again')
			setLoading(false)
		}
	}

	return (
		<>
			<Front
				onClick={() => setshow(true)}
				// @ts-ignore
				style={{ opacity: opacity.to(o => 1 - o), transform }}
			>
				<AddIcon alt="add" src={Add} />
			</Front>

			<Back
				show={show}
				// @ts-ignore
				style={{
					opacity,
					transform: transform.to(t => `${t} rotateX(180deg)`)
				}}
				left={windowWidth - (windowWidth / 100) * 80}
				top={windowHeight - (windowHeight / 100) * 80}
			>
				{loading ? (
					<div>loading</div>
				) : (
					<>
						{' '}
						<TitleBar>
							<CloseComp src={Close} onClick={() => setshow(false)} />
						</TitleBar>
						<Input
							label={'title'}
							handleInput={e => settitle(e.target.value)}
							value={title}
						/>
						<ImgContainer size={size}>
							{fileAsImage? (
								<Image src={fileAsImage}  />
							) : (
								<FileInputLabel>
									<Image src={AddImage} />
									<FileInput
										id="upload"
										type="file"
										onChange={handleImageAsFile}
									/>
								</FileInputLabel>
							)}
						</ImgContainer>
						{fileAsImage && <SizeToggle>
							<SizeOption onClick={() => setSize('small') } selected={size === 'small'}>small</SizeOption>
							<SizeOption onClick={() => setSize('medium') } selected={size === 'medium'}>medium</SizeOption>
							<SizeOption onClick={() => setSize('large') } selected={size === 'large'}>large</SizeOption>
							</SizeToggle>}
						<TextArea
							placeholder={'text'}
							onChange={e => settext(e.target.value)}
							value={text}
						/>
						
						<FileInput id="upload" type="file" onChange={handleImageAsFile} />
						{error}
						<SubmitButton onClick={handleSubmit}>submit</SubmitButton>{' '}
					</>
				)}
			</Back>
		</>
	)
}

const TitleBar = styled.div`
	font-family: Poppins;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`

const CloseComp = styled.img`
	height: 20px;
	width: 20px;
	margin: 5px;
`

const c = styled(a.div)`
	position: absolute;
	cursor: pointer;
	will-change: transform, opacity;
	left: 10px;
	top: 10px;
`
const Back = styled(c)<{show: boolean, left: number, top: number}>`
	background-size: cover;
	background-color: #ffffff;
	display: ${({ show }) => (show ? 'flex' : 'none')};
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	left: ${({ left }) => left}px;
	top: ${({ top }) => top}px;
	max-height: 80%;
	width: 40%;
	z-index: 10;
	background-color: #ffffff;
	border: 4px solid black;
	padding-bottom: 10px;
`

const FileInput = styled.input`
	display: none;
	font-size: 16 px;
`
const FileInputLabel = styled.label``

const ImgContainer = styled.div<{size: 'small' | 'medium' | 'large'}>`
	width: 100%;
	overflow: hidden;
	height: ${({size}) => {switch (size) {
		case 'small':
			return 75
		case 'medium':
			return 100
		case 'large':
			return 150

		default:
			return 100
	}}}px;
	width: auto;
`

const Image = styled.img`
	height: 100%;
	width: auto;
	
`

const Front = styled(c)``
const AddIcon = styled.img`
	height: 20px;
	width: 20px;
`

const SubmitButton = styled.button`
	font-family: Poppins;
	border-radius: 2px;
	border: 1px solid black;
	min-width: 200px;
	padding: 10px;
	background-color: #ffffff;
`

const TextArea = styled.textarea`
	font-family: Amari;
	width: 90%;
	padding: 12px;
	margin: 6px 0 4px;
	border: 1px solid #ccc;
	background: #fafafa;
	color: #000;
	font-family: sans-serif;
	font-size: 12px;
	line-height: normal;
	box-sizing: border-box;
	border-radius: 2px;
	padding: 5px;
	border: none;
	border-bottom: 6px solid #271600;
	background-color: #ffffff;
	height: 250px;
`

const SizeToggle = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`

const SizeOption = styled.div<{selected: boolean}>`
	font-family: Poppins;
	cursor: pointer;
	${({selected}) => selected && 'font-weight: bold;'}

`

export default Modal
