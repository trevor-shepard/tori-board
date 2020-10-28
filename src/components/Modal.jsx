import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSpring, animated as a } from 'react-spring'
import { Add } from 'assets/icons'
import { useDispatch } from 'react-redux'
import { useWindowDimensions } from 'utils/windowUtils'
import { createArt } from 'store/slices/artSlice'
import Input from 'components/Input'

const Modal = () => {
	// state
	const [show, setshow] = useState(false)
	const [title, settitle] = useState('')
	const [text, settext] = useState('')
	const [error, setError] = useState('')
	const [imageAsFile, setImageAsFile] = useState(null)
	const [fileAsImage, setFileAsImage] = useState(null)
	

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
	const handleImageAsFile = event => {
		const target = event.target
		const files = target.files
		if (files === null) return setError('no image found')
		const file = files[0]
		const image = URL.createObjectURL(file)
		setImageAsFile(file)
		setFileAsImage(image)
	}

	const handleSubmit = async () => {
		await dispatch(createArt(title, text, imageAsFile, Math.floor(Math.random() * windowWidth - 400), Math.floor(Math.random() * windowHeight - 400)))
	}


	return (
		<div>
			<Front
				onClick={() => setshow(true)}
				style={{ opacity: opacity.interpolate(o => 1 - o), transform }}
			>
				<img src={Add} />
			</Front>

			<Back
				show={show}
				style={{
					opacity,
					transform: transform.interpolate(t => `${t} rotateX(180deg)`)
				}}
				left={windowWidth - (windowWidth / 100) * 80}
				top={windowHeight - (windowHeight / 100) * 80}
			>
				<Input
					label={'title'}
					handleInput={e => settitle(e.target.value)}
					value={title}
				/>
				<TextArea
					placeholder={'text'}
					onChange={e => settext(e.target.value)}
					value={text}
				/>
				{fileAsImage && (
					<ImgContainer>
						<Image src={fileAsImage} />
					</ImgContainer>
				)}
				<FileInput id="upload" type="file" onChange={handleImageAsFile} />
				{error}
				<SubmitButton onClick={handleSubmit}>submit</SubmitButton>
			</Back>
		</div>
	)
}

const c = styled(a.div)`
	position: absolute;
	cursor: pointer;
	will-change: transform, opacity;
	left: 10px;
	top: 10px;
`
const Back = styled(c)`
	background-size: cover;
	background-color: #ffffff;
	display: ${({show}) =>  show ? 'flex' : 'none'};
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	left: ${({ left }) => left}px;
	top: ${({ top }) => top}px;
	height: 60%;
	width: 40%;
	z-index: 10;
	background-color: #ffffff;
	border: 4px solid black;
	padding-bottom: 10px;
`
const FileInput = styled.input``

const ImgContainer = styled.div`
	margin-top: 10%;
	width: 100%;
	overflow: hidden;
	border-radius: 100px;
`

const Image = styled.img`
	height: 178px;
	width: 178px;
	border-radius: 100px;
	object-fit: cover;
`

const Front = styled(c)`
	background-size: cover;
`

const SubmitButton = styled.button`
	font-family: Amsi Pro Narw;
	border-radius: 2px;
	border: 1px solid black;
	min-width: 200px;
	padding: 10px;
	background-color: #ffffff;
`




const TextArea = styled.textarea`
	font-family: AmsiPro-Ultra;
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
	text-transform: uppercase;
	background-color: #ffffff;
	height: 60%;

	/* &:focus ~ .floating-label{
        top: 8px;
        bottom: 10px;
        left: 20px;
        font-size: 11px;
        opacity: 1;
    } */
`

export default Modal
