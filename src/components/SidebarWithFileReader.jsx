import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'

const SidebarWithFileReader = (props) => {
    let [details, setDetails] = useState({
        title: '',
        description: '',
        image: '',
        video: ''
    })

    let token = useSelector((state) => state.user.token)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setDetails({
            title: '',
            description: '',
            image: '',
            video: ''
        })
        setIsModalOpen(false);
    };



    let inputChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    let fileChange = async(e) => {
        let file = e.target.files[0]
        //method 1 using filereader
        // let reader = new FileReader()
        // reader.readAsDataURL(file)

        // reader.onload = () => {
        //     setDetails({ ...details, [e.target.name]: reader.result })
        //     console.log(reader.result)
        // }
        // reader.onerror = (error) => {
        //     console.log('error in reading file')
        // }

        //method 2 using formdata and cloudinary
        let formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
        let res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, formData)
        console.log(res.data)
        setDetails({ ...details, [e.target.name]: res.data.secure_url })
    }

    let handleSubmit = async (e) => {
        e.preventDefault()

        let res = await axios.post('http://localhost:3000/posts/create', details, {
            headers: {
                'Authorization': token
            }
        })
        let data = res.data
        console.log(data)
        setIsModalOpen(false);
        props.getAll()
    }
    return (
        <div className='bg-red-400 h-screen p-4'>
            <Button type="primary" onClick={showModal}>
                Create Post
            </Button>
            <Modal title="Create Post" open={isModalOpen} onOk={handleOk} cancelButtonProps={{style:{display:'none'}}} okButtonProps={{style:{display:'none'}}} onCancel={handleCancel}>
                <form action="POST" className='flex flex-col'>
                    <label htmlFor="title" className='my-2'>Title</label>
                    <input type="text" name="title" id="title" className='py-2 px-4 border rounded' onChange={inputChange} />
                    <label htmlFor='description' className='my-2'>Description</label>
                    <textarea name="description" id="description" className='py-2 px-4 border rounded resize-none overflow-visible' onChange={inputChange}></textarea>
                    <div className='my-4 flex justify-around'>
                        <label htmlFor="image" name="image" className='my-2 p-2 w-40 text-center border cursor-pointer rounded bg-black text-white'>Upload Image</label>
                        <input type="file" name='image' id='image' hidden onChange={fileChange} />
                        <label htmlFor="video" className='my-2 p-2 w-40 text-center border cursor-pointer rounded bg-black text-white'>Upload Video</label>
                        <input type="file" name='video' id='video' hidden onChange={fileChange} />
                    </div>
                    <div className='flex gap-4 justify-center'>
                        {details.image && <img src={details.image} alt="" className='h-40 w-40 rounded border' />}
                        {details.video && <video src={details.video} controls autoPlay className='h-40 w-40 rounded border'></video>}
                    </div>
                    <button className='bg-black text-white py-2 w-40 ms-auto rounded' onClick={handleSubmit}>Submit</button>
                </form>
            </Modal>
        </div>
    )
}

export default SidebarWithFileReader