import React,{useState,useEffect,useRef} from 'react'
import './Uploader.css'
import { MdCloudUpload,MdDelete } from 'react-icons/md'
import {AiFillFileImage} from 'react-icons/ai'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { encode, decode } from 'data-compression'


function Uploader() {
    const [image,setImage] = useState(null)
    const [fileName,setFileName] = useState('No selected file')
    const [isDisabled,setIsDisabled] = useState(false)

    const canvasRef = useRef(null); // Canvas referansı oluşturuldu


    // Resim yüklendiğinde canvas'a çizme işlemini gerçekleştiren useEffect
    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            if (canvas) {
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = image;
            img.onload = () => {

               // Orijinal resim boyutları
            const originalWidth = img.width;
            const originalHeight = img.height;

            // Küçültülmüş boyutları belirleme (örneğin, %50 küçültme)
            const scaleFactor = 0.5; // %50 küçültme
            const newWidth = originalWidth * scaleFactor;
            const newHeight = originalHeight * scaleFactor;

            // Canvas boyutlarını ayarla
            canvas.width = newWidth;
            canvas.height = newHeight;

            // Resmi canvas'a çiz
            ctx.drawImage(img, 0, 0, newWidth, newHeight) ;

            const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
            const imageObject ={
                data:Array.from(imageData.data),
                width:imageData.width,
                height:imageData.height
            };

             // Resmi sıkıştırma ve kodlama işlemleri
    const { encodedData, compression_ratio, binaryEnocded } = encode(imageData.data);

    // Kodlanmış veriyi sakla
    try {
        localStorage.setItem('encodedData', JSON.stringify(encodedData));
        localStorage.setItem('compression_ratio', JSON.stringify(compression_ratio));
        localStorage.setItem('binaryEnocded', JSON.stringify(binaryEnocded));
        console.log('Veri başarıyla kodlandı ve saklandı.');
    } catch (e) {
        if (e.code === 22) {
            console.error('Veri boyutu depolama sınırını aştı. Veriyi kaydedemedim.');
        } else {
            console.error('Beklenmedik bir hata oluştu:', e);
        }
    }

    // Decode data
const decodedData = decode(encodedData);

console.log('Compression Ratio', compression_ratio)
console.log('Binary Encoded Data', binaryEnocded)
console.log('Original Data:', dataToEncode);
console.log('Encoded Data:', encodedData);
console.log('Decoded Data:', decodedData);


            };
        }
    }
        
    }, [image]);
    
   
    

    const handleDelete = () => {
        if (image) {
            setImage(null);
            setFileName('No selected file');
            setIsDisabled(false);

            // Canvas'ı temizlemek için
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        } else {
            setIsDisabled(true);
            toast.error('No file selected to delete', {
                position: 'bottom-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

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
                setIsDisabled(false);
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
                style={{cursor: !isDisabled ? 'not-allowed' : 'pointer',}}
                onClick={()=>handleDelete()}
                    
                />
            </span>
        </section>

    </main>
  );
}

export default Uploader