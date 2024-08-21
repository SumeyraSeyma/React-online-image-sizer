import React,{useState,useEffect,useRef} from 'react'
import './Uploader.css'
import { MdCloudUpload,MdDelete } from 'react-icons/md'
import {AiFillFileImage} from 'react-icons/ai'

function Uploader() {
    const [image,setImage] = useState(null)
    const [fileName,setFileName] = useState('No selected file')
    const canvasRef = useRef(null); // Canvas referansı oluşturuldu

    // Resim yüklendiğinde canvas'a çizme işlemini gerçekleştiren useEffect
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;
            img.onload = () => {
                // Canvas boyutlarını ayarla
                canvas.width = img.width;
                canvas.height = img.height;
                // Resmi canvas'a çiz
                ctx.drawImage(img, 0, 0);
                // Canvas'a çizimin gerçekleştiğini kontrol et
                console.log("Resim canvas üzerine çizildi.");
            };
        }
    }, [image]);

  return (
    <main>
        <form
        onClick={()=>document.querySelector('.input-field').click()}
        >
        <input type='file'
        accept='image/*' 
        className='input-field' 
        hidden
        onChange={({target:{files}})=>{
            if (files && files[0]) {
                setFileName(files[0].name);
                setImage(URL.createObjectURL(files[0]));
            }
        }}
        />
        
        {image ?(
        <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} />
        ):(
        <>
        <MdCloudUpload color='#1475cf' size={60}/>
        <p>Browse Files to upload</p>
        </>
        )}

        </form>

        <section className='uploaded-row'>
            <AiFillFileImage color='#1475cf' size={30}/>
            <span className='upload-content'>
                {fileName}
                <MdDelete
                size={30}
                onClick={()=>{
                    setImage(null)
                    setFileName('No selected file');
                    // Canvas'ı temizlemek için
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }}
                />
            </span>
        </section>

    </main>
  );
}

export default Uploader